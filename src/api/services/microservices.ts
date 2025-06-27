import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/redux/store';
import { logout, updateAccessToken } from '@/redux/slices/authSlice';
import { MICROSERVICES_CONFIG, ServiceConfig, ServiceName } from '../config';

// Service instances storage
const serviceInstances = new Map<ServiceName, AxiosInstance>();

// Circuit breaker implementation
class CircuitBreaker {
  private failures = 0;
  private nextAttempt = Date.now();
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.nextAttempt <= Date.now()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

const circuitBreakers = new Map<ServiceName, CircuitBreaker>();

// Create axios instance for each service
function createServiceInstance(serviceName: ServiceName, config: ServiceConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
      'X-Service-Source': 'hms-frontend',
      'X-Service-Version': 'v1',
      ...config.headers
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const state = store.getState();
      const { accessToken } = state.auth;
      
      // Add auth token for all services except auth service login
      if (accessToken && !(serviceName === 'AUTH_SERVICE' && config.url?.includes('/login'))) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Add correlation ID for request tracing
      config.headers['X-Correlation-ID'] = `${serviceName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Add service-specific headers
      config.headers['X-Target-Service'] = serviceName;
      config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log(`🚀 [${serviceName}] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      });

      return config;
    },
    (error) => {
      console.error(`❌ [${serviceName}] Request Error:`, error);
      return Promise.reject(error);
    }
  );

  // Response interceptor with retry logic
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ [${serviceName}] ${response.status} ${response.config.url}`, {
        data: response.data,
        headers: response.headers
      });
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { 
        _retry?: boolean;
        _retryCount?: number;
      };

      console.error(`❌ [${serviceName}] ${error.response?.status || 'Network'} Error:`, {
        url: error.config?.url,
        message: error.message,
        response: error.response?.data
      });

      // Handle token refresh for 401 errors (except auth service)
      if (error.response?.status === 401 && serviceName !== 'AUTH_SERVICE' && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const state = store.getState();
          const { refreshToken } = state.auth;

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Use auth service to refresh token
          const authInstance = getServiceInstance('AUTH_SERVICE');
          const response = await authInstance.post('/auth/refresh', {
            refreshToken,
          });

          const { accessToken: newAccessToken } = response.data.data;
          store.dispatch(updateAccessToken(newAccessToken));

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);

        } catch (refreshError) {
          console.error(`❌ [${serviceName}] Token refresh failed:`, refreshError);
          store.dispatch(logout());
          
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        }
      }

      // Retry logic for network errors
      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }

      const maxRetries = MICROSERVICES_CONFIG[serviceName].retries || 2;
      
      if (
        originalRequest._retryCount < maxRetries &&
        (!error.response || error.response.status >= 500)
      ) {
        originalRequest._retryCount++;
        
        // Exponential backoff
        const delay = Math.pow(2, originalRequest._retryCount) * 1000;
        console.log(`🔄 [${serviceName}] Retrying request (${originalRequest._retryCount}/${maxRetries}) after ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return instance(originalRequest);
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

// Initialize all service instances
Object.entries(MICROSERVICES_CONFIG).forEach(([serviceName, config]) => {
  const instance = createServiceInstance(serviceName as ServiceName, config);
  serviceInstances.set(serviceName as ServiceName, instance);
  circuitBreakers.set(serviceName as ServiceName, new CircuitBreaker());
});

// Get service instance
export function getServiceInstance(serviceName: ServiceName): AxiosInstance {
  const instance = serviceInstances.get(serviceName);
  if (!instance) {
    throw new Error(`Service instance not found: ${serviceName}`);
  }
  return instance;
}

// Make request with circuit breaker
export async function makeServiceRequest<T>(
  serviceName: ServiceName,
  requestFn: (instance: AxiosInstance) => Promise<T>
): Promise<T> {
  const circuitBreaker = circuitBreakers.get(serviceName);
  const instance = getServiceInstance(serviceName);

  if (!circuitBreaker) {
    throw new Error(`Circuit breaker not found: ${serviceName}`);
  }

  return circuitBreaker.call(() => requestFn(instance));
}

export type { ServiceName };

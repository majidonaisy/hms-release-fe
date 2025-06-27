export interface ServiceConfig {
  baseURL: string;
  name: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export const MICROSERVICES_CONFIG: Record<string, ServiceConfig> = {
  AUTH_SERVICE: {
    name: 'Authentication Service',
    baseURL: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001',
    timeout: 10000,
    retries: 3,
    headers: {
      'Service-Name': 'auth-service'
    }
  },
  USER_SERVICE: {
    name: 'User Management Service',
    baseURL: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:3002',
    timeout: 8000,
    retries: 2,
    headers: {
      'Service-Name': 'user-service'
    }
  },
  ROOM_SERVICE: {
    name: 'Room Management Service',
    baseURL: import.meta.env.VITE_ROOM_SERVICE_URL || 'http://localhost:3003',
    timeout: 8000,
    retries: 2,
    headers: {
      'Service-Name': 'room-service'
    }
  },
  GUEST_SERVICE: {
    name: 'Guest Management Service',
    baseURL: import.meta.env.VITE_GUEST_SERVICE_URL || 'http://localhost:3004',
    timeout: 8000,
    retries: 2,
    headers: {
      'Service-Name': 'guest-service'
    }
  },
  RESERVATION_SERVICE: {
    name: 'Reservation Service',
    baseURL: import.meta.env.VITE_RESERVATION_SERVICE_URL || 'http://localhost:3005',
    timeout: 12000,
    retries: 3,
    headers: {
      'Service-Name': 'reservation-service'
    }
  },
  BILLING_SERVICE: {
    name: 'Billing & Payment Service',
    baseURL: import.meta.env.VITE_BILLING_SERVICE_URL || 'http://localhost:3006',
    timeout: 15000,
    retries: 3,
    headers: {
      'Service-Name': 'billing-service'
    }
  },
  NOTIFICATION_SERVICE: {
    name: 'Notification Service',
    baseURL: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:3007',
    timeout: 5000,
    retries: 1,
    headers: {
      'Service-Name': 'notification-service'
    }
  },
  ANALYTICS_SERVICE: {
    name: 'Analytics & Reporting Service',
    baseURL: import.meta.env.VITE_ANALYTICS_SERVICE_URL || 'http://localhost:3008',
    timeout: 20000,
    retries: 2,
    headers: {
      'Service-Name': 'analytics-service'
    }
  }
};

export type ServiceName = keyof typeof MICROSERVICES_CONFIG;

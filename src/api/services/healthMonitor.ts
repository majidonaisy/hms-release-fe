import { getServiceInstance, ServiceName } from "./microservices";
import { MICROSERVICES_CONFIG } from "../serviceConfig";

interface ServiceHealth {
  name: ServiceName;
  status: "healthy" | "unhealthy" | "unknown";
  responseTime?: number;
  lastChecked: Date;
  error?: string;
}

class HealthMonitor {
  private healthStatus = new Map<ServiceName, ServiceHealth>();
  private checkInterval: NodeJS.Timeout | null = null;

  async checkServiceHealth(serviceName: ServiceName): Promise<ServiceHealth> {
    const startTime = Date.now();

    try {
      const instance = getServiceInstance(serviceName);
      await instance.get("/health"); // Assume all services have /health endpoint

      const responseTime = Date.now() - startTime;
      const health: ServiceHealth = {
        name: serviceName,
        status: "healthy",
        responseTime,
        lastChecked: new Date(),
      };

      this.healthStatus.set(serviceName, health);
      return health;
    } catch (error: any) {
      const health: ServiceHealth = {
        name: serviceName,
        status: "unhealthy",
        lastChecked: new Date(),
        error: error.message,
      };

      this.healthStatus.set(serviceName, health);
      return health;
    }
  }

  async checkAllServices(): Promise<Map<ServiceName, ServiceHealth>> {
    const promises = Object.keys(MICROSERVICES_CONFIG).map((serviceName) => this.checkServiceHealth(serviceName as ServiceName));

    await Promise.allSettled(promises);
    return this.healthStatus;
  }

  startMonitoring(intervalMs: number = 30000) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkAllServices();
    }, intervalMs);
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  getServiceHealth(serviceName: ServiceName): ServiceHealth | undefined {
    return this.healthStatus.get(serviceName);
  }

  getAllServicesHealth(): Map<ServiceName, ServiceHealth> {
    return this.healthStatus;
  }
}

export const healthMonitor = new HealthMonitor();

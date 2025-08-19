// Config Service - replaces environment variables with config file data

interface AppConfig {
  email: string;
  authServiceUrl: string;
  customerServiceUrl: string;
  frontdeskServiceUrl: string;
  setupDate: string;
}

interface CachedUrls {
  authServiceUrl: string;
  customerServiceUrl: string;
  frontdeskServiceUrl: string;
}

class ConfigService {
  private config: AppConfig | null = null;
  private cachedUrls: CachedUrls | null = null;

  async getConfig(): Promise<AppConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      // Get config from main process
      this.config = await (window as any).ipcRenderer.invoke('get-config');
      
      if (!this.config) {
        throw new Error('Configuration not found. Please restart the application.');
      }

      return this.config;
    } catch (error) {
      console.error('Failed to load config:', error);
      throw new Error('Failed to load application configuration');
    }
  }

  // Initialize and cache all URLs at once
  async initializeUrls(): Promise<CachedUrls> {
    if (this.cachedUrls) {
      return this.cachedUrls;
    }

    const config = await this.getConfig();
    this.cachedUrls = {
      authServiceUrl: config.authServiceUrl,
      customerServiceUrl: config.customerServiceUrl,
      frontdeskServiceUrl: config.frontdeskServiceUrl
    };

    return this.cachedUrls;
  }

  async getAuthServiceUrl(): Promise<string> {
    const urls = await this.initializeUrls();
    return urls.authServiceUrl;
  }

  async getCustomerServiceUrl(): Promise<string> {
    const urls = await this.initializeUrls();
    return urls.customerServiceUrl;
  }

  async getFrontdeskServiceUrl(): Promise<string> {
    const urls = await this.initializeUrls();
    return urls.frontdeskServiceUrl;
  }

  async getUserEmail(): Promise<string> {
    const config = await this.getConfig();
    return config.email;
  }

  // Get all URLs at once (useful for bulk operations)
  async getAllUrls(): Promise<CachedUrls> {
    return await this.initializeUrls();
  }

  // Clear config cache (useful for testing or if config changes)
  clearCache() {
    this.config = null;
    this.cachedUrls = null;
  }
}

// Export singleton instance
export const configService = new ConfigService();

// Individual URL getters (cached after first call)
let authServiceUrl: string | null = null;
let customerServiceUrl: string | null = null;
let frontdeskServiceUrl: string | null = null;

export const getAuthServiceUrl = async (): Promise<string> => {
  if (!authServiceUrl) {
    authServiceUrl = await configService.getAuthServiceUrl();
  }
  return authServiceUrl;
};

export const getCustomerServiceUrl = async (): Promise<string> => {
  if (!customerServiceUrl) {
    customerServiceUrl = await configService.getCustomerServiceUrl();
  }
  return customerServiceUrl;
};

export const getFrontdeskServiceUrl = async (): Promise<string> => {
  if (!frontdeskServiceUrl) {
    frontdeskServiceUrl = await configService.getFrontdeskServiceUrl();
  }
  return frontdeskServiceUrl;
};

// Get all URLs at once (cached after first call)
let allUrls: CachedUrls | null = null;

export const getAllServiceUrls = async (): Promise<CachedUrls> => {
  if (!allUrls) {
    allUrls = await configService.getAllUrls();
  }
  return allUrls;
};

// Helper function to get user email
export const getUserEmail = () => configService.getUserEmail();

// Clear all cached URLs (useful when config changes)
export const clearUrlCache = () => {
  authServiceUrl = null;
  customerServiceUrl = null;
  frontdeskServiceUrl = null;
  allUrls = null;
  configService.clearCache();
};

export default configService;
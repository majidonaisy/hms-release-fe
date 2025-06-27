export const SERVICE_BASE_URLS: Record<string, string> = {
  AUTH: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001',
  ROOM: import.meta.env.VITE_ROOM_SERVICE_URL || 'http://localhost:3002',
  GUEST: import.meta.env.VITE_GUEST_SERVICE_URL || 'http://localhost:3003',
  RESERVATION: import.meta.env.VITE_RESERVATION_SERVICE_URL || 'http://localhost:3004',
  BILLING: import.meta.env.VITE_BILLING_SERVICE_URL || 'http://localhost:3005',
};

// Service endpoint patterns for auto-detection
export const SERVICE_PATTERNS: Record<string, RegExp> = {
  AUTH: /^auth\//,
  ROOM: /^room(type)?\//,
  GUEST: /^guest\//,
  RESERVATION: /^reservation\//,
  BILLING: /^(billing|payment)\//,
};

// Get service based on endpoint
export function getServiceForEndpoint(endpoint: string): string {
  for (const [service, pattern] of Object.entries(SERVICE_PATTERNS)) {
    if (pattern.test(endpoint)) {
      return service;
    }
  }
  return 'AUTH'; // Default fallback
}
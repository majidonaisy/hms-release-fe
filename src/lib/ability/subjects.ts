export const SUBJECTS = {
  // General
  ALL: 'all',
  
  // Core HMS entities
  DASHBOARD: 'Dashboard',
  ROOM: 'Room',
  GUEST: 'Guest', 
  RESERVATION: 'Reservation',
  BILLING: 'Billing',
  PAYMENT: 'Payment',
  
  // Reports and Analytics
  REPORT: 'Report',
  ANALYTICS: 'Analytics',
  
  // System Management
  USER: 'User',
  ROLE: 'Role',
  SETTING: 'Setting',
  BACKUP: 'Backup',
  
  // Specific room types
  STANDARD_ROOM: 'StandardRoom',
  DELUXE_ROOM: 'DeluxeRoom',
  SUITE: 'Suite',
} as const;

export type Subject = typeof SUBJECTS[keyof typeof SUBJECTS];
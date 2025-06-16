export const ACTIONS = {
  // CRUD operations
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  
  // HMS specific actions
  CHECK_IN: 'check_in',
  CHECK_OUT: 'check_out',
  ASSIGN_ROOM: 'assign_room',
  PROCESS_PAYMENT: 'process_payment',
  GENERATE_REPORT: 'generate_report',
  BACKUP_DATA: 'backup_data',
  CONFIGURE_SYSTEM: 'configure_system',
} as const;

export type Action = typeof ACTIONS[keyof typeof ACTIONS];
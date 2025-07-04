import { useRole } from '../context/CASLContext';

export const usePermissions = () => {
  const {
    can,
    cannot,
    isAdmin,
    isAuthenticated,
    permissions,
    ability,
    logout
  } = useRole();

  // Helper functions for common permission checks
  const canManage = (subject: string): boolean => {
    return can('manage', subject) || can('manage', 'all');
  };

  const canRead = (subject: string): boolean => {
    return can('read', subject) || canManage(subject);
  };

  const canCreate = (subject: string): boolean => {
    return can('create', subject) || canManage(subject);
  };

  const canUpdate = (subject: string): boolean => {
    return can('update', subject) || canManage(subject);
  };

  const canDelete = (subject: string): boolean => {
    return can('delete', subject) || canManage(subject);
  };

  return {
    // Core permission methods
    can,
    cannot,

    // Helper methods
    canManage,
    canRead,
    canCreate,
    canUpdate,
    canDelete,

    // Status
    isAdmin,
    isAuthenticated,
    permissions,

    // Actions
    logout,

    // Advanced
    ability,
  };
};
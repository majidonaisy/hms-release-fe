import { useCallback, useMemo } from 'react';
import { useRole } from '../context/CASLContext';
import type { Role } from '../context/CASLContext';

interface UsePermissionsReturn {
  // Permission checks
  can: (action: string, subject: string) => boolean;
  cannot: (action: string, subject: string) => boolean;

  // Role information
  currentRole: Role;
  isAuthenticated: boolean;

  // Role checks (convenience methods)
  isAdmin: boolean;
  isManager: boolean;
  isReceptionist: boolean;
  isGuest: boolean;

  // Actions
  setRole: (role: Role) => void;
  logout: () => void;

  // Raw ability for advanced usage
  ability: import('../lib/ability/ability').AppAbility;
}

export const usePermissions = (): UsePermissionsReturn => {
  const { ability, currentRole, isAuthenticated, setRole, logout } = useRole();

  // Memoize permission check functions to prevent unnecessary re-renders
  const can = useCallback((action: string, subject: string): boolean => {
    return ability.can(action, subject);
  }, [ability]);

  const cannot = useCallback((action: string, subject: string): boolean => {
    return ability.cannot(action, subject);
  }, [ability]);

  // Memoize role checks
  const roleChecks = useMemo(() => ({
    isAdmin: currentRole === 'admin',
    isManager: currentRole === 'manager',
    isReceptionist: currentRole === 'receptionist',
    isGuest: currentRole === 'guest',
  }), [currentRole]);

  return {
    // Permission methods
    can,
    cannot,

    // Role info
    currentRole,
    isAuthenticated,
    ...roleChecks,

    // Actions
    setRole,
    logout,

    // Advanced
    ability,
  };
};
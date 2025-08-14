import React, { createContext, useContext, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout as logoutAction } from '@/redux/slices/authSlice';
import { createAbility, AppAbility } from '../lib/ability/ability';

interface Permission {
  subject: string;
  action: string;
}

interface PermissionGroup {
  type: 'AND' | 'OR';
  permissions: Permission[];
}

interface RoleContextType {
  ability: AppAbility;
  permissions: Permission[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  can: (action: string, subject: string) => boolean;
  cannot: (action: string, subject: string) => boolean;
  logout: () => void;
  filterRoutesByPermissions: (routes: any[]) => any[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);
export const AbilityContext = createContext<AppAbility>(createAbility([]));

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { permissions, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const ability = createAbility(permissions);

  const can = (action: string, subject: string): boolean => {
    return ability.can(action, subject);
  };

  const cannot = (action: string, subject: string): boolean => {
    return ability.cannot(action, subject);
  };

  const isAdmin = permissions.some(
    (permission) => permission.action === 'manage' && permission.subject === 'all'
  );

  // Helper function to check if user has required permissions with support for OR logic
  const hasRequiredPermissions = (requiredPermissions: Permission[] | PermissionGroup[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Check if it's the old format (array of permissions) - assume AND logic
    if (Array.isArray(requiredPermissions) && requiredPermissions.length > 0 && 'action' in requiredPermissions[0]) {
      const permissions = requiredPermissions as Permission[];
      return permissions.every(permission => can(permission.action, permission.subject));
    }

    // New format with permission groups
    const permissionGroups = requiredPermissions as PermissionGroup[];
    return permissionGroups.every(group => {
      if (group.type === 'AND') {
        return group.permissions.every(permission => can(permission.action, permission.subject));
      } else if (group.type === 'OR') {
        return group.permissions.some(permission => can(permission.action, permission.subject));
      }
      return false;
    });
  };

  const filterRoutesByPermissions = (routes: any[]): any[] => {
    return routes.filter(route => {
      // If user is admin (has manage all), show everything
      if (isAdmin) {
        return true;
      }

      // If route doesn't require permissions, show it
      if (!route.requiredPermissions || route.requiredPermissions.length === 0) {
        return true;
      }

      // Check if user has required permissions
      const hasPermissions = hasRequiredPermissions(route.requiredPermissions);

      // If route has subroutes, filter them too
      if (route.subRoutes && hasPermissions) {
        route.subRoutes = filterRoutesByPermissions(route.subRoutes);
      }

      return hasPermissions;
    });
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const contextValue: RoleContextType = {
    ability,
    permissions,
    isAuthenticated,
    isAdmin,
    can,
    cannot,
    logout,
    filterRoutesByPermissions
  };

  return (
    <RoleContext.Provider value={contextValue}>
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface CanProps {
  action?: string;
  subject?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const Can: React.FC<CanProps> = ({
  action,
  subject,
  children,
  fallback = null
}) => {
  const { can, isAuthenticated } = useRole();

  // If no action or subject provided, check if user is authenticated
  if (!action && !subject) {
    return isAuthenticated ? <>{children}</> : <>{fallback}</>;
  }

  // If action or subject is missing, don't render
  if (!action || !subject) {
    return <>{fallback}</>;
  }

  // Check permission
  const hasPermission = can(action, subject);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

interface MultiPermissionProps {
  permissions: Array<{ action: string; subject: string }>;
  children: ReactNode;
  fallback?: ReactNode;
}

export const CanAny: React.FC<MultiPermissionProps> = ({
  permissions,
  children,
  fallback = null
}) => {
  const { can } = useRole();

  const hasAnyPermission = permissions.some(perm =>
    can(perm.action, perm.subject)
  );

  return hasAnyPermission ? <>{children}</> : <>{fallback}</>;
};

// User needs ALL permissions (AND logic)
export const CanAll: React.FC<MultiPermissionProps> = ({
  permissions,
  children,
  fallback = null
}) => {
  const { can } = useRole();

  const hasAllPermissions = permissions.every(perm =>
    can(perm.action, perm.subject)
  );

  return hasAllPermissions ? <>{children}</> : <>{fallback}</>;
};

// Cannot component for inverse conditional rendering
interface CannotProps {
  action?: string;
  subject?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const Cannot: React.FC<CannotProps> = ({
  action,
  subject,
  children,
  fallback = null
}) => {
  const { cannot, isAuthenticated } = useRole();

  // If no action or subject provided, check if user is not authenticated
  if (!action && !subject) {
    return !isAuthenticated ? <>{children}</> : <>{fallback}</>;
  }

  // If action or subject is missing, don't render
  if (!action || !subject) {
    return <>{fallback}</>;
  }

  // Check permission (inverse)
  const hasNoPermission = cannot(action, subject);

  return hasNoPermission ? <>{children}</> : <>{fallback}</>;
};
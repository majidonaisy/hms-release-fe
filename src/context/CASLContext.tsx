import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout as logoutAction } from '@/redux/slices/authSlice';
import { createAbility, AppAbility } from '../lib/ability/ability';

interface Permission {
  subject: string;
  action: string;
}

interface RoleContextType {
  ability: AppAbility;
  permissions: Permission[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  can: (action: string, subject: string) => boolean;
  cannot: (action: string, subject: string) => boolean;
  logout: () => void;
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
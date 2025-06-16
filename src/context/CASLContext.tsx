import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { createAbility, AppAbility } from '../lib/ability/ability';

export type Role = 'admin' | 'manager' | 'receptionist' | 'guest';

interface RoleState {
  currentRole: Role;
  ability: AppAbility;
  isAuthenticated: boolean;
}

type RoleAction = 
  | { type: 'SET_ROLE'; payload: Role }
  | { type: 'LOGOUT' };

const initialState: RoleState = {
  currentRole: 'guest',
  ability: createAbility('guest'),
  isAuthenticated: false,
};

const roleReducer = (state: RoleState, action: RoleAction): RoleState => {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        ...state,
        currentRole: action.payload,
        ability: createAbility(action.payload),
        isAuthenticated: action.payload !== 'guest',
      };
    case 'LOGOUT':
      return {
        ...state,
        currentRole: 'guest',
        ability: createAbility('guest'),
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

interface RoleContextType extends RoleState {
  setRole: (role: Role) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const AbilityContext = createContext<AppAbility>(createAbility('guest'));

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(roleReducer, initialState);

  const setRole = (role: Role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as Role;
    if (savedRole && ['admin', 'manager', 'receptionist', 'guest'].includes(savedRole)) {
      setRole(savedRole);
    }
  }, []);

  // Save role to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('userRole', state.currentRole);
  }, [state.currentRole]);

  const contextValue: RoleContextType = {
    ...state,
    setRole,
    logout,
  };

  return (
    <RoleContext.Provider value={contextValue}>
      <AbilityContext.Provider value={state.ability}>
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
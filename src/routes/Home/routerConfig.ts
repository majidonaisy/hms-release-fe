export interface Permission {
  action: string;
  subject: string;
}

export interface PermissionGroup {
  type: 'AND' | 'OR';
  permissions: Permission[];
}

export interface HomeRouteConfig {
  path: string;
  title?: string;
  component: React.ComponentType;
  isShown: boolean;
  icon?: React.ReactNode;
  isAuthenticated?: boolean;
  subRoutes?: HomeRouteConfig[];
  requiredPermissions?: Permission[] | PermissionGroup[];
}

const createHomeRoute = (
  path: string,
  title: string,
  component: React.ComponentType,
  isShown: boolean,
  icon: React.ReactNode,
  isAuthenticated?: boolean,
  requiredPermissions?: Permission[] | PermissionGroup[],
  subRoutes: HomeRouteConfig[] = []
): HomeRouteConfig => {
  return {
    path,
    title,
    component,
    isShown,
    icon,
    isAuthenticated,
    requiredPermissions,
    subRoutes,
  };
};

export default createHomeRoute;
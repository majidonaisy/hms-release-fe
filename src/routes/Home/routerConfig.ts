export interface HomeRouteConfig {
  path: string;
  title?: string;
  component: React.ComponentType;
  isShown: boolean;
  icon?: React.ReactNode;
  isAuthenticated?: boolean;
  subRoutes?: HomeRouteConfig[];
  requiredPermissions?: {
    action: string;
    subject: string;
  };
}

const createHomeRoute = (path: string,title:string,
   component: React.ComponentType,
    isShown: boolean,
    icon: React.ReactNode,
    isAuthenticated?: boolean,
    requiredPermissions?: {
      action: string;
      subject: string;
    },
    subRoutes: HomeRouteConfig[] = []): HomeRouteConfig => {
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

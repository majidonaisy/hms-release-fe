export interface HomeRouteConfig {
  path: string;
  title?: string;
  component: React.ComponentType;
  isShown: boolean;
  icon?: React.ReactNode;
  isAuthenticated?: boolean;
  subRoutes?: HomeRouteConfig[];
}

const createHomeRoute = (path: string,title:string, component: React.ComponentType, isShown: boolean, icon: React.ReactNode, isAuthenticated?: boolean, subRoutes: HomeRouteConfig[] = []): HomeRouteConfig => {
  return {
    path,
    title,
    component,
    isShown,
    icon,
    isAuthenticated,
    subRoutes,
  };
};

export default createHomeRoute;

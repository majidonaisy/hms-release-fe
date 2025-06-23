import { Dashboard, HotelReservationCalendar, Newroom, Rooms } from "@/pages";
import { Home, Calendar, DoorOpen, Plus, Settings } from "lucide-react";

export interface RouteItem {
  path: string;
  title: string;
  icon: React.ComponentType<any>;
  component?: React.ComponentType<any>;
  children?: RouteItem[];
  showInSidebar?: boolean;
  requiresAuth?: boolean;
  roles?: string[];
  description?: string;
  isIndex?: boolean; 
  redirectTo?: string; 
}

export const routes: RouteItem[] = [
  {
    path: "/",
    title: "Dashboard",
    icon: Home,
    component: Dashboard,
    showInSidebar: true,
    requiresAuth: true,
  },
  {
    path: "/rooms",
    title: "Rooms",
    icon: DoorOpen,
    component: Rooms,
    showInSidebar: true,
    requiresAuth: true,
    children: [
      {
        path: "", 
        title: "Rooms List",
        icon: DoorOpen,
        component: Rooms,
        isIndex: true,
        showInSidebar: false, 
      },
      {
        path: "newroom",
        title: "New Room",
        icon: Plus,
        component: Newroom,
        showInSidebar: false,
        requiresAuth: true,
      },
      {
        path: "edit/:id",
        title: "Edit Room",
        icon: Settings,
        component: Newroom, 
        showInSidebar: false,
        requiresAuth: true,
      }
    ]
  },
  {
    path: "/reservations",
    title: "Reservations",
    icon: Calendar,
    component: HotelReservationCalendar,
    showInSidebar: true,
    requiresAuth: true,
  },
  {
    path: "/settings",
    title: "Settings",
    icon: Settings,
    component: Dashboard, 
    showInSidebar: false, 
    requiresAuth: true,
  }
];

export const getSidebarRoutes = (): RouteItem[] => {
  return routes.filter(route => {
    if (!route.showInSidebar) return false;
    return true;
  });
};

export const getAllRoutes = (): RouteItem[] => {
  const allRoutes: RouteItem[] = [];
  
  const flattenRoutes = (routeList: RouteItem[], parentPath = '') => {
    routeList.forEach(route => {
      const fullPath = parentPath + route.path;
      allRoutes.push({ ...route, path: fullPath });
      
      if (route.children) {
        flattenRoutes(route.children, fullPath + '/');
      }
    });
  };
  
  flattenRoutes(routes);
  return allRoutes;
};

export const findRouteByPath = (path: string): RouteItem | null => {
  const allRoutes = getAllRoutes();
  return allRoutes.find(route => route.path === path) || null;
};
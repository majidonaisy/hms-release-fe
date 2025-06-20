import Dashboard from "@/pages/Dashboard";
import HotelReservationCalendar from "@/pages/HotelScheduler";
import { Home, Calendar } from "lucide-react";

export interface RouteItem {
  path: string;
  title: string;
  icon: React.ComponentType<any>;
  component?: React.ComponentType<any>;
}

export const routes: RouteItem[] = [
  {
    path: "/",
    title: "Dashboard",
    icon: Home,
    component: Dashboard,
  },
  {
    path: "/calendar",
    title: "Calendar",
    icon: Calendar,
    component: HotelReservationCalendar,
  },
];

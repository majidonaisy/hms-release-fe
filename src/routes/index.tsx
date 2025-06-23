
import { Dashboard, HotelReservationCalendar, Rooms } from "@/pages";
import NewRoom from "@/pages/Newroom";
import { Home, Calendar, DoorOpen } from "lucide-react";

export interface RouteItem {
  path: string;
  title: string;
  icon: React.ComponentType<any>;
  component?: React.ComponentType<any>;
  children?: RouteItem[];
}

export const routes: RouteItem[] = [
  {
    path: "/",
    title: "Dashboard",
    icon: Home,
    component: Dashboard,
  },
  {
    path: "/rooms",
    title: "Rooms",
    icon: DoorOpen,
    component: Rooms,
    children: [
      {
        path: "/rooms/newroom",
        title: "New Room",
        icon: DoorOpen,
        component: NewRoom,
      }]
  },
  {
    path: "/reservations",
    title: "Reservations",
    icon: Calendar,
    component: HotelReservationCalendar,
  },
];

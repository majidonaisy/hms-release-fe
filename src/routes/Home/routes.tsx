import { Dashboard, HotelReservationCalendar, Newroom, Rooms } from "@/pages";
import { Calendar, DoorOpen, Home, Plus } from "lucide-react";
import createHomeRoute, { HomeRouteConfig } from "./routerConfig";

const RoutesList = () => {

    const homeRoutesList: HomeRouteConfig[] = [
        {
            path: "/home",
            title: "Dashboard",
            icon: <Home className="size-5" />,
            component: Dashboard,
            isAuthenticated: true,
            isShown: true,
        },
        {
            path: "/rooms",
            title: "Rooms",
            icon: <DoorOpen className="size-5" />,
            component: Rooms,
            isAuthenticated: true,
            isShown: true,
            subRoutes: [
                {
                    path: "/rooms/new", // Full path instead of relative
                    title: "New Room",
                    icon: <Plus />,
                    component: Newroom,
                    isAuthenticated: true,
                    isShown: false,
                },
            ]
        },

        {
            path: '/calendar',
            title: "Calendar",
            icon: <Calendar className="size-5"/>,
            component: HotelReservationCalendar,
            isShown: true
        },
    ].map((route) =>
        createHomeRoute(route.path, route.title, route.component, route.isShown, route.icon, route.isAuthenticated, route.subRoutes
        )
    );

    return homeRoutesList;
};

export default RoutesList;
import { Dashboard, HotelReservationCalendar, Newroom, Rooms, NewTeamMember, TeamMembers, TeamMemberProfile, Roles } from "@/pages";
import { Calendar, ChartColumnBig, DoorOpen, Home, Plus, User, Users } from "lucide-react";
import createHomeRoute, { HomeRouteConfig } from "./routerConfig";
import CurrentGuestList from "@/pages/Guests/CurrentGuestList";

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
            path: '/current-guests',
            title: "Current Guests",
            icon: <Users className="size-5" />,
            component: CurrentGuestList,
            isShown: true
        },
        {
            path: '/calendar',
            title: "Calendar",
            icon: <Calendar className="size-5" />,
            component: HotelReservationCalendar,
            isShown: true
        },
        {
            path: '/team-members',
            title: "Team Members",
            icon: <Users className="size-5" />,
            component: TeamMembers,
            isShown: true,
            subRoutes: [
                {
                    path: "/team-members/new",
                    title: "New Team Member",
                    icon: <Plus />,
                    component: NewTeamMember,
                    isAuthenticated: true,
                    isShown: false,
                },
                {
                    path: "/team-members/profile/:id",
                    title: "Team Member Profile",
                    icon: <User />,
                    component: TeamMemberProfile,
                    isAuthenticated: true,
                    isShown: false,
                },
            ]
        },
        {
            path: '/roles-permissions',
            title: "Roles",
            icon: <ChartColumnBig className="size-5" />,
            component: Roles,
            isShown: true
        },
    ].map((route) =>
        createHomeRoute(route.path, route.title, route.component, route.isShown, route.icon, route.isAuthenticated, route.subRoutes
        )
    );

    return homeRoutesList;
};

export default RoutesList;
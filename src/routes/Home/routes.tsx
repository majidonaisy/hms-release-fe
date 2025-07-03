import { Dashboard, HotelReservationCalendar, Rooms, NewTeamMember, TeamMembers, TeamMemberProfile, Roles, Room } from "@/pages";
import { Calendar, ChartColumnBig, DoorOpen, Eye, Home, Plus, User, Users } from "lucide-react";
import createHomeRoute, { HomeRouteConfig } from "./routerConfig";
import CurrentGuestList from "@/pages/Guests/CurrentGuestList";
import GuestProfile from "@/pages/Guests/GuestProfile";
import NewGuest from "@/pages/Guests/NewGuest";
import GuestProfileView from "@/pages/Guests/GuestExpanded";
import NewReservation from "@/pages/Reservations/NewReservation";

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
                    path: "/rooms/:id",
                    title: "Room Form",
                    icon: <Plus />,
                    component: Room,
                    isAuthenticated: true,
                    isShown: false,
                }
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
            path: '/guests-profile',
            title: "Guests Profile",
            icon: <Users className="size-5" />,
            component: GuestProfile,
            isShown: true,
            subRoutes: [
                {
                    path: "/guests-profile/new",
                    title: "New Guest",
                    icon: <Plus />,
                    component: NewGuest,
                    isAuthenticated: true,
                    isShown: false,
                },
                {
                    path: "/guests-profile/:id",
                    title: "Edit Guest",
                    icon: <User />,
                    component: NewGuest,
                    isAuthenticated: true,
                    isShown: false,
                },
                {
                    path: "/guests-profile/:id/view",
                    title: "View Guest Profile",
                    icon: <Eye />,
                    component: GuestProfileView,
                    isAuthenticated: true,
                    isShown: false,
                }

            ]
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
        {
            path: '/new-reservation',
            title: "Reservations",
            icon: <Plus className="size-5" />,
            component: NewReservation,
            isShown: true
        }
    ].map((route) =>
        createHomeRoute(route.path, route.title, route.component, route.isShown, route.icon, route.isAuthenticated, route.subRoutes
        )
    );

    return homeRoutesList;
};

export default RoutesList;
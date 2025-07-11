import { Dashboard, HotelReservationCalendar, Rooms, NewTeamMember, TeamMembers, TeamMemberProfile, Roles, Room, Maintenance, Housekeeping, AdminDashboard, Amenities, RatePlans, RoomTypes } from "@/pages";
import { Calendar, ChartColumnBig, DoorOpen, Eye, Home, Plus, User, Users, Wrench, Sparkles, LayoutDashboard, Coffee, DollarSign } from "lucide-react";
import createHomeRoute, { HomeRouteConfig } from "./routerConfig";
import CurrentGuestList from "@/pages/Guests/CurrentGuestList";
import GuestProfile from "@/pages/Guests/GuestProfile";
import NewGuest from "@/pages/Guests/NewGuest";
import GuestProfileView from "@/pages/Guests/GuestExpanded";
import NewReservation from "@/pages/Reservations/NewReservation";
import NewIndividualReservation from "@/pages/Reservations/NewIndividualReservation";
import NewGroupProfile from "@/pages/Guests/NewGroupProfile";

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
                    path: "/guests-profile/new-individual",
                    title: "New Guest",
                    icon: <Plus />,
                    component: NewGuest,
                    isAuthenticated: true,
                    isShown: false,
                },
                {
                    path: "/guests-profile/new-group",
                    title: "New Group Profile",
                    icon: <Plus />,
                    component: NewGroupProfile,
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
            path: '/maintenance',
            title: "Maintenance",
            icon: <Wrench className="size-5" />,
            component: Maintenance,
            isShown: true
        },
        {
            path: '/housekeeping',
            title: "Housekeeping",
            icon: <Sparkles className="size-5" />,
            component: Housekeeping,
            isShown: true
        },

        {
            path: '/new-reservation',
            title: "Reservations",
            icon: <Plus className="size-5" />,
            component: NewReservation,
            isShown: false
        },
        {
            path: '/new-individual-reservation',
            title: "Reservations",
            icon: <Plus className="size-5" />,
            component: NewIndividualReservation,
            isShown: false
        },
        {
            path: '/dashboard',
            title: "Admin Dashboard",
            icon: <LayoutDashboard className="size-5" />,
            component: AdminDashboard,
            isShown: true,
            subRoutes: [
                {
                    path: '/roles-permissions',
                    title: "Roles",
                    icon: <ChartColumnBig className="size-5" />,
                    component: Roles,
                    isAuthenticated: true,
                    isShown: false
                },
                {
                    path: '/amenities',
                    title: "Amenities",
                    icon: <Coffee className="size-5" />,
                    component: Amenities,
                    isShown: false
                },
                {
                    path: '/rate-plans',
                    title: "Rate Plans",
                    icon: <DollarSign className="size-5" />,
                    component: RatePlans,
                    isAuthenticated: true,
                    isShown: false
                },
                {
                    path: '/roomTypes',
                    title: "Room Types",
                    component: RoomTypes,
                    isAuthenticated: true,
                    isShown: false
                },
            ]
        }
    ].map((route) =>
        createHomeRoute(route.path, route.title, route.component, route.isShown, route.icon, route.isAuthenticated, route.subRoutes
        )
    );

    return homeRoutesList;
};

export default RoutesList;
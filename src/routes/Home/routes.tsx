import { HotelReservationCalendar, Rooms, NewTeamMember, TeamMembers, TeamMemberProfile, Roles, Room, AdminDashboard, Amenities, RatePlans, RoomTypes } from "@/pages";
import { Calendar, ChartColumnBig, DoorOpen, Eye, Plus, User, Users, Wrench, Sparkles, LayoutDashboard, Coffee, DollarSign, Settings } from "lucide-react";
import createHomeRoute, { HomeRouteConfig } from "./routerConfig";
import CurrentGuestList from "@/pages/Guests/CurrentGuestList";
import GuestProfile from "@/pages/Guests/GuestProfile";
import NewGuest from "@/pages/Guests/NewGuest";
import GuestProfileView from "@/pages/Guests/GuestExpanded";
import NewIndividualReservation from "@/pages/Reservations/NewIndividualReservation";
import NewGroupProfile from "@/pages/Guests/NewGroupProfile";
import HousekeepingPage from "@/pages/Housekeeping/Housekeeping";
import MaintenancePage from "@/pages/Maintenance/Maintenance";
import NewGroupReservation from "@/pages/Reservations/NewGroupReservation";
import GroupProfileExpanded from "@/pages/Guests/GroupProfileExpanded";
import HotelSettingsPage from "@/pages/management/HotelSettings";
import ExchangeRates from "@/pages/dashboard/ExchangeRates/ExchangeRates";
import Departments from "@/pages/dashboard/Departments/Departments";

const RoutesList = () => {

    const homeRoutesList: HomeRouteConfig[] = [

        {
            path: "/rooms",
            title: "Rooms",
            icon: <DoorOpen className=" " />,
            component: Rooms,
            isAuthenticated: true,
            isShown: true,
            requiredPermissions: [{
                action: "read",
                subject: "Room"
            }],
            subRoutes: [
                {
                    path: "/rooms/:id",
                    title: "Room Form",
                    icon: <Plus />,
                    component: Room,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "update",
                        subject: "Room"
                    }]
                }
            ]
        },
        {
            path: '/current-guests',
            title: "Current Guests",
            icon: <Users className=" " />,
            component: CurrentGuestList,
            isShown: true,
            requiredPermissions: [{
                action: "read",
                subject: "Guest"
            },
            {
                action: "read",
                subject: "Reservation"
            },
            {
                action: "read",
                subject: "RoomType"
            },
            {
                action: "read",
                subject: "Room"
            },
            ]
        },
        {
            path: '/guests-profile',
            title: "Guests Profile",
            icon: <Users className=" " />,
            component: GuestProfile,
            isShown: true,
            requiredPermissions: [{
                action: "read",
                subject: "Guest"
            }],
            isAuthenticated: true,
            subRoutes: [
                {
                    path: "/guests-profile/new-individual",
                    title: "New Guest",
                    icon: <Plus />,
                    component: NewGuest,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "create",
                        subject: "Guest"
                    }]
                },
                {
                    path: "/guests-profile/new-group",
                    title: "New Group Profile",
                    icon: <Plus />,
                    component: NewGroupProfile,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "create",
                        subject: "Guest"
                    }]
                },
                {
                    path: "/guests-profile/:id",
                    title: "Edit Guest",
                    icon: <User />,
                    component: NewGuest,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "update",
                        subject: "Guest"
                    }]
                },
                {
                    path: "/guests-profile/:id/view",
                    title: "View Guest Profile",
                    icon: <Eye />,
                    component: GuestProfileView,
                    isAuthenticated: true,
                    isShown: false,
                },
                {
                    path: "/group-profile/:id/view",
                    title: "View Guest Profile",
                    icon: <Eye />,
                    component: GroupProfileExpanded,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "read",
                        subject: "Guest"
                    }]
                },
                {
                    path: "/group-profile/:id",
                    title: "Edit Guest Profile",
                    icon: <Eye />,
                    component: NewGroupProfile,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "read",
                        subject: "Guest"
                    }]
                }

            ]
        },
        {
            path: '/calendar',
            title: "Calendar",
            icon: <Calendar className=" " />,
            component: HotelReservationCalendar,
            isShown: true,
            requiredPermissions: [{
                action: "read",
                subject: "Reservation"
            }]
        },
        {
            path: '/team-members',
            title: "Team Members",
            icon: <Users className=" " />,
            component: TeamMembers,
            isShown: true,
            requiredPermissions: [{
                action: "read",
                subject: "User"
            }],
            subRoutes: [
                {
                    path: "/team-members/new",
                    title: "New Team Member",
                    icon: <Plus />,
                    component: NewTeamMember,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "create",
                        subject: "TeamMembers"
                    }],
                },
                {
                    path: "/team-members/profile/:id",
                    title: "Team Member Profile",
                    icon: <User />,
                    component: TeamMemberProfile,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "read",
                        subject: "TeamMembers"
                    }],
                },
                {
                    path: "/team-members/update/:id",
                    title: "Edit Team Member",
                    icon: <User />,
                    component: NewTeamMember,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "update",
                        subject: "TeamMembers"
                    }],
                },
            ]
        },

        {
            path: '/maintenance',
            title: "Maintenance",
            icon: <Wrench className=" " />,
            component: MaintenancePage,
            isShown: true,
            requiredPermissions: [{
                action: "read",
                subject: "Maintenance"
            }]
        },
        {
            path: '/housekeeping',
            title: "Housekeeping",
            icon: <Sparkles className=" " />,
            component: HousekeepingPage,
            isShown: true,
            requiredPermissions: [{
                action: "read",
                subject: "HouseKeeping"
            }]
        },
        {

            path: "/new-reservation/new-group-reservation",
            title: "New Group Reservation",
            icon: <Plus />,
            component: NewGroupReservation,
            isAuthenticated: true,
            isShown: false,
            requiredPermissions: [
                { action: "read", subject: "RatePlan" },
                { action: "create", subject: "Reservation" },
                { action: "read", subject: "GroupProfile" },
                { action: "read", subject: "RoomType" },
                { action: "read", subject: "Room" },
            ]
        },
        {
            path: '/new-reservation/new-individual-reservation',
            title: "Reservations",
            icon: <Plus className=" " />,
            component: NewIndividualReservation,
            isShown: false,
            requiredPermissions: [
                { action: "read", subject: "RatePlan" },
                { action: "create", subject: "Reservation" },
                { action: "read", subject: "Guest" },
                { action: "read", subject: "RoomType" },
                { action: "read", subject: "Room" },
            ]
        },
        {
            path: '/dashboard',
            title: "Admin Dashboard",
            icon: <LayoutDashboard className=" " />,
            component: AdminDashboard,
            isShown: true,
            isAuthenticated: true,
            requiredPermissions: [{
                action: "manage",
                subject: "all"
            }],
            subRoutes: [
                {
                    path: '/roles-permissions',
                    title: "Roles",
                    icon: <ChartColumnBig className=" " />,
                    component: Roles,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "read",
                        subject: "Roles"
                    }]
                },
                {
                    path: '/amenities',
                    title: "Amenities",
                    icon: <Coffee className=" " />,
                    component: Amenities,
                    isShown: false,
                    requiredPermissions: [{
                        action: "read",
                        subject: "Amenity"
                    }]
                },
                {
                    path: '/rate-plans',
                    title: "Rate Plans",
                    icon: <DollarSign className=" " />,
                    component: RatePlans,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "read",
                        subject: "RatePlans"
                    }]
                },
                {
                    path: '/roomTypes',
                    title: "Room Types",
                    component: RoomTypes,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "read",
                        subject: "RoomTypes"
                    }]
                },
                {
                    path: '/hotel-settings',
                    title: "Hotel Settings",
                    icon: <Settings className=" " />,
                    component: HotelSettingsPage,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "manage",
                        subject: "Hotel"
                    }]
                },
                {
                    path: '/exchangeRates',
                    title: "Exchange Rates",
                    icon: <Settings className=" " />,
                    component: ExchangeRates,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "read",
                        subject: "ExchangeRate"
                    }]
                },
                {
                    path: '/departments',
                    title: "Departments",
                    icon: <Settings className=" " />,
                    component: Departments,
                    isAuthenticated: true,
                    isShown: false,
                    requiredPermissions: [{
                        action: "manage",
                        subject: "Departments"
                    }]
                },
            ]
        }
    ].map((route) =>
        createHomeRoute(route.path, route.title, route.component, route.isShown, route.icon, route.isAuthenticated, route.requiredPermissions, route.subRoutes
        )
    );

    return homeRoutesList;
};

export default RoutesList;
// Core pages
export { default as Dashboard } from "./Dashboard";
export { default as HotelReservationCalendar } from "./HotelScheduler";
export { default as NotFound } from "./NotFound";

// Room management
export { default as Rooms } from "./Room/Rooms";
export { default as Room } from "./Room/Room";

// Team management
export { default as TeamMembers } from "./TeamMembers/TeamMembers";
export { default as NewTeamMember } from "./TeamMembers/NewTeamMember";
export { default as TeamMemberProfile } from "./TeamMembers/TeamMemberProfile";

// Guest management
export { default as CurrentGuestList } from "./Guests/CurrentGuestList";
export { default as GuestProfile } from "./Guests/GuestProfile";
export { default as NewGuest } from "./Guests/NewGuest";
export { default as GuestProfileView } from "./Guests/GuestExpanded";

// Service management
export { default as Maintenance } from "./Maintenance/Maintenance";
// ts-ignore
export { default as Housekeeping } from "./Housekeeping/Housekeeping";

// Reservations
export { default as NewReservation } from "./Reservations/NewReservation";

// Dashboard and related features
export { default as AdminDashboard } from "./dashboard/Dashboard";
export { default as RoomTypes } from "./dashboard/RoomTypes/RoomTypes";
export { default as Amenities } from "./dashboard/Amenities/ViewAmenitiesDialog";
export { default as RatePlans } from "./dashboard/RatePlans/RatePlans";
export { default as Roles } from "./dashboard/RolesPermissions/Roles";
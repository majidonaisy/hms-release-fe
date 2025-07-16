import { Delete } from "lucide-react";

export const ENDPOINTS = {
  Auth: {
    Login: "auth/login",
    AddUser: "auth/add-user",
    RefreshToken: "auth/refresh",
  },
  RoomType: {
    Add: "roomtype/add",
    GetAll: "roomtype/get",
    GetById: "roomtype/get",
    Update: "roomtype/update",
    Delete: "roomtype/delete",
  },
  Room: {
    Add: "room/add",
    GetAll: "room/get",
    GetById: "room/get",
    Update: "room/update",
    Delete: "room/delete",
    GetByStatus: "room/get-rooms-by-status",
    GetByType: "room/get-by-room-type",
  },
  Guest: {
    Add: "guest/add",
    GetAll: "guest/get",
    GetById: "guest/get",
    Update: "guest/update",
    Delete: "guest/delete",
  },
  GroupProfile: {
    AddGroupProfile: "group-profile/add",
    LinkGuestsToGroup: "group-profile/link",
    GetGroupProfiles: "group-profile/get",
    GetGroupProfileById: "group-profile/get",
    DeleteGroupProfile: "group-profile/delete",
    UpdateGroupProfile: "group-profile/update",
  },
  RatePlan: {
    Add: "ratePlan/add",
    GetAll: "ratePlan/get",
    GetById: "ratePlan/get",
    Update: "ratePlan/update",
    Delete: "ratePlan/delete",
  },
  Reservations: {
    Add: "reservation/add",
    Update: "reservation/update",
    CheckIn: "reservation/check-in",
    CheckOut: "reservation/check-out",
    Get: "reservation/get-reservation",
    AddGroupReservation: "reservation/create",
    GetNightPrice: "reservation/get-night-price"
  },
  Maintenance: {
    Add: "maintenance/add",
    Start: "maintenance/start",
    Complete: "maintenance/complete",
    GetAll: "maintenance/get",
    GetById: "maintenance/get",
    Update: "maintenance/update",
    Delete: "maintenance/delete",
  },
  Housekeeping: {
    Add: "housekeeping/add",
    Start: "housekeeping/start",
    Complete: "housekeeping/complete",
    GetAll: "housekeeping/get",
    GetById: "housekeeping/get",
    Update: "housekeeping/update",
    Delete: "housekeeping/delete",
  },
  Amenities: {
    GetAllAmenities: "amenity/get",
    Add: "amenity/add",
    GetById: "amenity/get",
    Update: "amenity/update",
    Delete: "amenity/delete",
  },
  Employees: {
    GetAll: "auth/employees",
    GetEmployeeById: "auth/get-user",
  },
  Role: {
    Add: "role/add",
    GetAll: "role/get",
    GetById: "role/get",
    Update: "role/update",
    Delete: "role/delete",
    GetPermissions: "role/get-permissions",
  },
  Currency: {
    GetAll: "exchange/currencies/",
  },
  Folio: {
    AddCharge: "folio-item/add-charge",
    UnsettledCharges: "folio-item//unsettled-charges",

  },
};

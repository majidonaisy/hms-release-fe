export const ENDPOINTS = {
  Auth: {
    Login: "auth/login",
    AddUser: "auth/add-user",
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
  RatePlan: {
    Add: "ratePlan/add",
    GetAll: "ratePlan/get",
    GetById: "ratePlan/get",
    Update: "ratePlan/update",
    Delete: "ratePlan/delete",
  },
  Reservations: {
    Add: "reservation/add",
    Update: "reservation/update/{id}",
    CheckIn: "reservation/check-in/{id}",
    Get: "reservation/get-reservation"
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
  Amenities: {
    GetAllAmenities: "amenity/get",
  },
  Employees: {
    GetAll: "auth/employees",
    GetEmployeeById: "auth/get-user"
  },
  Role: {
    Get: "role/get"
  }
}

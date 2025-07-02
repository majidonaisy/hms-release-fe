export const ENDPOINTS = {
  Auth: {
    Login: "auth/login",
    AddUser: "auth/add-user",
  },
  RoomType: {
    Add: "roomtype",
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
  },
  Guest: {
    Add: "guest/add",
    GetAll: "guest/get",
    GetById: "guest/get",
    Update: "guest/update",
    Delete: "guest/delete",
  },
  Amenities:{
    GetAllAmenities: "amenity/get",
  }
};

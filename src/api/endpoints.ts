export const ENDPOINTS = {
  Auth: {
    Login: "auth/login",
    AddUser: "auth/add-user",
  },
  RoomType: {
    Add: "roomtype",
    GetAll: "roomtype/get",
    GetById: "roomtype/get/{id}",
    Update: "roomtype/update/{id}",
    Delete: "roomtype/delete/{id}",
  },
  Room: {
    Add: "room/add",
    GetAll: "room/get",
    GetById: "room/get/{id}",
    Update: "room/update/{id}",
    Delete: "room/delete/{id}",
    GetByStatus: "room/get-rooms-by-status/{status}",
  },
  Guest: {
    Add: "guest/add",
    GetAll: "guest/get",
    GetById: "guest/get",
    Update: "guest/update",
    Delete: "guest/delete",
  },
  RatePlan: {
    Add: 'ratePlan/add',
    GetAll: "ratePlan/get",
    GetById: "ratePlan/get",
    Update: "ratePlan/update",
    Delete: "ratePlan/delete",
  },
  Reservations: {
    Add: "reservation/add",
    Update: "reservation/update/{id}",
    CheckIn: "reservation/check-in/{id}",
  }
};

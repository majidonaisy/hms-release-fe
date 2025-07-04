import { z } from "zod";

// Common Room shape
// Update the Room shape to match the actual API response
export const RoomShape = z.object({
  id: z.string(),
  roomNumber: z.string(),
  status: z.string(),
  floor: z.number(),
  description: z.string(),
  roomTypeId: z.string(),
  photos: z.array(z.any()).optional(),
  hotelId: z.string(),
  roomType: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    baseRate: z.string(),
    hotelId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    maxOccupancy: z.number(),
    adultOccupancy: z.number(),
    childOccupancy: z.number(),
  }),
  Amenities: z.array(z.any()).optional(),
  connectedRooms: z.array(z.object({
    id: z.string(),
    roomNumber: z.string(),
  })).optional(),
});

export const AddRoomRequestSchema = z.object({
  roomNumber: z.string(),
  roomTypeId: z.string(),
  hotelId: z.string().optional(),
  floor: z.number(),
  amenities: z.array(z.string()),
  connectedRoomIds: z.array(z.string()),
  description: z.string(),
  photos: z.array(z.any()).optional(),
});

export const AddRoomResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: RoomShape,
});

// Get Rooms
export const GetRoomsResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: z.array(RoomShape),
});

export const GetRoomByIdResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: RoomShape,
});

// Update Room - Updated with proper validation
export const UpdateRoomRequestSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required").optional(),
  status: z.string().min(1, "Status is required").optional(),
  roomTypeId: z.string().min(1, "Room type is required").optional(),
  floor: z.number().min(0, "Floor must be a positive number").optional(),
  adultOccupancy: z.number().min(0, "Adult occupancy must be positive").optional(),
  childOccupancy: z.number().min(0, "Child occupancy must be positive").optional(),
  maxOccupancy: z.number().min(1, "Max occupancy must be at least 1").optional(),
  baseRate: z.number().min(0, "Base rate must be positive").optional(),
  bedType: z.string().optional(),
  singleBeds: z.number().min(0).optional(),
  doubleBeds: z.number().min(0).optional(),
  isConnecting: z.boolean().optional(),
  connectingRoom: z.string().optional(),
  description: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  photos: z.array(z.any()).optional(),
});

export const UpdateRoomResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: RoomShape,
});

export const GetRoomsByRoomTypeSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: z.array(z.object({
    id: z.string(),
    roomNumber: z.string(),
    status: z.string(),
    floor: z.number(),
    description: z.string(),
    roomTypeId: z.string(),
    photos: z.array(z.any()).optional(),
    hotelId: z.string(),
  }))
})

export type Room = z.infer<typeof RoomShape>;
export type AddRoomRequest = z.infer<typeof AddRoomRequestSchema>;
export type AddRoomResponse = z.infer<typeof AddRoomResponseSchema>;
export type GetRoomsResponse = z.infer<typeof GetRoomsResponseSchema>;
export type UpdateRoomRequest = z.infer<typeof UpdateRoomRequestSchema>;
export type UpdateRoomResponse = z.infer<typeof UpdateRoomResponseSchema>;
export type GetRoomsByRoomType = z.infer<typeof GetRoomsByRoomTypeSchema>;
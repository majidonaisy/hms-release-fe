import { z } from "zod";
import { RoomTypeShape } from "./RoomType";

// Common Room shape
export const RoomShape = z.object({
  id: z.string(),
  roomNumber: z.string(),
  status: z.string(),
  roomTypeId: z.string(),
  roomType: RoomTypeShape,
  floor: z.number().int(),
  adultOccupancy: z.number().int(),
  childOccupancy: z.number().int(),
  maxOccupancy: z.number().int(),
  description: z.string().optional().nullable(),
  hotelId: z.string(),
  photos: z.array(z.any()).optional(),
});

// Add Room - Updated with required fields and proper error messages
export const AddRoomRequestSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  roomTypeId: z.string().min(1, "Room type is required"),
  floor: z.number().min(0, "Floor is required"),
  status: z.string().min(1, "Status is required").optional(),
  adultOccupancy: z.number().min(0, "Adult occupancy is required"),
  childOccupancy: z.number().min(0, "Child occupancy is required"),
  maxOccupancy: z.number().min(1, "Max occupancy is required"),
  baseRate: z.number().min(0, "Base rate must be positive"),
  bedType: z.string().optional(),
  singleBeds: z.number().min(0).optional(),
  doubleBeds: z.number().min(0).optional(),
  isConnecting: z.boolean().optional(),
  connectingRoom: z.string().optional(),
  description: z.string().optional(),
  facilities: z.array(z.string()).optional(),
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

export type Room = z.infer<typeof RoomShape>;
export type AddRoomRequest = z.infer<typeof AddRoomRequestSchema>;
export type AddRoomResponse = z.infer<typeof AddRoomResponseSchema>;
export type GetRoomsResponse = z.infer<typeof GetRoomsResponseSchema>;
export type UpdateRoomRequest = z.infer<typeof UpdateRoomRequestSchema>;
export type UpdateRoomResponse = z.infer<typeof UpdateRoomResponseSchema>;

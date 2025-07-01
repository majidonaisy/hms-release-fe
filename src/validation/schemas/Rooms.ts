import { z } from "zod";
import { RoomTypeShape } from "./RoomType";



// Common Room shape
export const RoomShape = z.object({
  id: z.string(),
  roomNumber: z.string(),
  status: z.string(),
  roomTypeId: z.string(),
  roomType: RoomTypeShape,
});

// Add Room
export const AddRoomRequestSchema = z.object({
  roomNumber: z.string(),
  roomTypeId: z.string(),
});

export const AddRoomResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: RoomShape,
});

// Get Rooms
export const GetRoomsResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: z.array(RoomShape),
});

// Update Room
export const UpdateRoomRequestSchema = z.object({
  roomNumber: z.string().optional(),
  status: z.string().optional(),
  roomTypeId: z.string().optional(),
});

export const UpdateRoomResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: RoomShape,
});

export type AddRoomRequest = z.infer<typeof AddRoomRequestSchema>;
export type AddRoomResponse = z.infer<typeof AddRoomResponseSchema>;
export type GetRoomsResponse = z.infer<typeof GetRoomsResponseSchema>;
export type UpdateRoomRequest = z.infer<typeof UpdateRoomRequestSchema>;
export type UpdateRoomResponse = z.infer<typeof UpdateRoomResponseSchema>;

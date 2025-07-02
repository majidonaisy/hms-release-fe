import { z } from "zod";

// Common RoomType shape
// Update RoomType shape to match API response
export const RoomTypeShape = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  baseRate: z.string(), // Change from number to string to match API
  capacity: z.number().int().positive().optional(),
  hotelId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Add RoomType
export const AddRoomTypeRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  baseRate: z.number().positive().min(1, "Base rate must be positive"),
  capacity: z.number().int().positive().min(1, "Capacity must be at least 1"),
});

export const AddRoomTypeResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: RoomTypeShape,
});

// Get RoomTypes
export const GetRoomTypesResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: z.array(RoomTypeShape),
});

// Update RoomType
export const UpdateRoomTypeRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  baseRate: z.number().positive().optional(),
  capacity: z.number().int().positive().optional(),
});

export const UpdateRoomTypeResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: RoomTypeShape,
});

export type RoomType = z.infer<typeof RoomTypeShape>;
export type AddRoomTypeRequest = z.infer<typeof AddRoomTypeRequestSchema>;
export type AddRoomTypeResponse = z.infer<typeof AddRoomTypeResponseSchema>;
export type GetRoomTypesResponse = z.infer<typeof GetRoomTypesResponseSchema>;
export type UpdateRoomTypeRequest = z.infer<typeof UpdateRoomTypeRequestSchema>;
export type UpdateRoomTypeResponse = z.infer<
  typeof UpdateRoomTypeResponseSchema
>;

import { z } from "zod";

// Common RoomType shape
// Update RoomType shape to match API response
export const RoomTypeShape = z.object({

  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  maxOccupancy: z.number().int().min(1, "Max occupancy must be at least 1"),
  adultOccupancy: z.number().int().min(0, "Adult occupancy must be at least 0"),
  childOccupancy: z.number().int().min(0, "Child occupancy must be at least 0"),
  baseRate: z.string(),
  hotelId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()

});

// Add RoomType
export const AddRoomTypeRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  baseRate: z.number().positive().min(1, "Base rate must be positive"),
  maxOccupancy: z.number().min(1, "Max occupancy must be at least 1"),
  childOccupancy: z.number().min(0, "Child occupancy must be at least 0"),
  adultOccupancy: z.number().min(0, "Adult occupancy must be at least 0"),
});

export const AddRoomTypeResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: RoomTypeShape,
});

// Get RoomTypes
export const GetRoomTypesResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: z.array(RoomTypeShape),
  pagination: z.object({
    totalItems: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    pageSize: z.number(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
    nextPage: z.number().nullable(),
    previousPage: z.number().nullable()
  }),
});

// Update RoomType
export const UpdateRoomTypeRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  baseRate: z.number().positive().optional(),
  maxOccupancy: z.number(),
  childOccupancy: z.number(),
  adultOccupancy: z.number(),
});

export const UpdateRoomTypeResponseSchema = z.object({
  status: z.number(),
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

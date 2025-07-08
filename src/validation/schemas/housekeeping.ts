import { z } from "zod";
import { RoomShape } from "./Rooms";

// Define User shape for housekeeping (new type specific to housekeeping)
const HousekeepingUserShape = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

// Common Housekeeping shape based on Prisma enums
const HousekeepingShape = z.object({
  id: z.string(),
  roomId: z.string(),
  room: RoomShape, // Using existing Room shape
  userId: z.string(),
  user: HousekeepingUserShape,
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"]),
  description: z.string().optional().nullable(),
  actualDuration: z.number().optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  startedAt: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  hotelId: z.string(),
});

// Form data type for HousekeepingDialog
export const HousekeepingFormDataSchema = z.object({
  roomId: z.string().min(1, "Room is required"),
  userId: z.string().min(1, "Employee is required"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"]).default("PENDING"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

// Add Housekeeping Request
export const AddHousekeepingRequestSchema = z.object({
  roomId: z.string().min(1, "Room is required"),
  userId: z.string().min(1, "Employee is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

export const AddHousekeepingResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: HousekeepingShape,
});

// Get Housekeeping
export const GetHousekeepingResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(HousekeepingShape),
});

export const GetHousekeepingByIdResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: HousekeepingShape,
});

// Update Housekeeping Request
export const UpdateHousekeepingRequestSchema = z.object({
  roomId: z.string().optional(),
  userId: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"]).optional(),
  description: z.string().optional(),
  actualDuration: z.number().min(1).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  startedAt: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
});

export const UpdateHousekeepingResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: HousekeepingShape,
});

// Start Housekeeping Request
export const StartHousekeepingResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: HousekeepingShape,
});

// Complete Housekeeping Request
export const CompleteHousekeepingResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: HousekeepingShape,
});

// Delete Housekeeping Response
export const DeleteHousekeepingResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
});

// Type exports
export type Housekeeping = z.infer<typeof HousekeepingShape>;
export type HousekeepingUser = z.infer<typeof HousekeepingUserShape>;
export type HousekeepingFormData = z.infer<typeof HousekeepingFormDataSchema>;
export type AddHousekeepingRequest = z.infer<typeof AddHousekeepingRequestSchema>;
export type AddHousekeepingResponse = z.infer<typeof AddHousekeepingResponseSchema>;
export type GetHousekeepingResponse = z.infer<typeof GetHousekeepingResponseSchema>;
export type GetHousekeepingByIdResponse = z.infer<typeof GetHousekeepingByIdResponseSchema>;
export type UpdateHousekeepingRequest = z.infer<typeof UpdateHousekeepingRequestSchema>;
export type UpdateHousekeepingResponse = z.infer<typeof UpdateHousekeepingResponseSchema>;
export type StartHousekeepingResponse = z.infer<typeof StartHousekeepingResponseSchema>;
export type CompleteHousekeepingResponse = z.infer<typeof CompleteHousekeepingResponseSchema>;
export type DeleteHousekeepingResponse = z.infer<typeof DeleteHousekeepingResponseSchema>;
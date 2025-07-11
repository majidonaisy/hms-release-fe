import { z } from "zod/v4";
import { PaginationSchema } from "./common";

// Define a simplified Room shape that matches your API response
const MaintenanceRoomShape = z.object({
  id: z.string(),
  roomNumber: z.string(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "DIRTY", "CLEANING", "RESERVED", "OUT_OF_SERVICE"]),
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
    createdAt: z.string(),
    updatedAt: z.string(),
    maxOccupancy: z.number(),
    adultOccupancy: z.number(),
    childOccupancy: z.number(),
  }),
  Amenities: z.array(z.any()).optional(),
  connectedRooms: z
    .array(
      z.object({
        id: z.string(),
        roomNumber: z.string(),
      })
    )
    .optional(),
});

// Common Maintenance shape based on Prisma enums
const MaintenanceShape = z.object({
  id: z.string(),
  description: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]), // Updated to match Prisma Priority enum
  roomId: z.string(),
  room: MaintenanceRoomShape,
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"]), // Updated to match Prisma maintenanceStatus enum
  startedAt: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  hotelId: z.string(),
  assignedTo: z.string().optional().nullable(),
  requestedBy: z.string().optional().nullable(),
  type: z.string().optional(), // Keep as string since it's not in your Prisma enums
  title: z.string().optional().nullable(),
  estimatedDuration: z.number().optional().nullable(),
  scheduledDate: z.string().optional().nullable(),
  requestDate: z.string().optional(),
  photos: z.array(z.any()).optional(),
  notes: z.string().optional().nullable(),
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

// Add Maintenance Request
export const AddMaintenanceRequestSchema = z.object({
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]), // Updated to match Prisma
  roomId: z.string().min(1, "Room ID is required"),
  assignedTo: z.string().optional(),
  requestedBy: z.string().optional(),
  type: z.string().optional(), // Keep as string
  title: z.string().optional(),
  estimatedDuration: z.number().min(1).optional(),
  scheduledDate: z.string().optional(),
  photos: z.array(z.any()).optional(),
  notes: z.string().optional(),
});

export const AddMaintenanceResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: MaintenanceShape,
});



// Get Maintenances
export const GetMaintenancesResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(MaintenanceShape),
  pagination: PaginationSchema.optional(),
});

export const GetMaintenanceByIdResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: MaintenanceShape,
});

// Update Maintenance Request
export const UpdateMaintenanceRequestSchema = z.object({
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(), // Updated to match Prisma
  roomId: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELED"]).optional(), // Updated to match Prisma
  startedAt: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
  assignedTo: z.string().optional(),
  requestedBy: z.string().optional(),
  type: z.string().optional(),
  title: z.string().optional(),
  estimatedDuration: z.number().min(1).optional(),
  scheduledDate: z.string().optional(),
  photos: z.array(z.any()).optional(),
  notes: z.string().optional(),
});

export const UpdateMaintenanceResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: MaintenanceShape,
});

// Start Maintenance Request
export const StartMaintenanceResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: MaintenanceShape,
});

// Complete Maintenance Request
export const CompleteMaintenanceResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: MaintenanceShape,
});

// Delete Maintenance Response
export const DeleteMaintenanceResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
});

// Type exports
export type Maintenance = z.infer<typeof MaintenanceShape>;
export type AddMaintenanceRequest = z.infer<typeof AddMaintenanceRequestSchema>;
export type AddMaintenanceResponse = z.infer<typeof AddMaintenanceResponseSchema>;
export type GetMaintenancesResponse = z.infer<typeof GetMaintenancesResponseSchema>;
export type GetMaintenanceByIdResponse = z.infer<typeof GetMaintenanceByIdResponseSchema>;
export type UpdateMaintenanceRequest = z.infer<typeof UpdateMaintenanceRequestSchema>;
export type UpdateMaintenanceResponse = z.infer<typeof UpdateMaintenanceResponseSchema>;
export type StartMaintenanceResponse = z.infer<typeof StartMaintenanceResponseSchema>;
export type CompleteMaintenanceResponse = z.infer<typeof CompleteMaintenanceResponseSchema>;
export type DeleteMaintenanceResponse = z.infer<typeof DeleteMaintenanceResponseSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;

// Form data type for your NewMaintenanceDialog
export const MaintenanceFormDataSchema = z.object({
  areaType: z.string().min(1, "Area type is required"),
  areaNameOrNumber: z.string().min(1, "Area name or number is required"),
  issueDescription: z.string().min(1, "Issue description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"), // Updated to match Prisma
  assignedTo: z.string().min(1, "Assignment is required"),
  photos: z.array(z.any()).default([]),
  repeatMaintenance: z.boolean().default(false),
  frequency: z.string().optional(),
  requestedBy: z.string().optional(),
  type: z.string().default("REPAIR"),
  estimatedDuration: z.number().min(1).optional(),
  scheduledDate: z.string().optional(),
  notes: z.string().optional(),
});

export type MaintenanceFormData = z.infer<typeof MaintenanceFormDataSchema>;

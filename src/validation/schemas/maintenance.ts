import { z } from "zod/v4";

// Define a simplified Room shape that matches your API response
const MaintenanceRoomShape = z.object({
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
    createdAt: z.string(), // Changed from z.date() to z.string()
    updatedAt: z.string(), // Changed from z.date() to z.string()
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

// Common Maintenance shape based on CSV structure
const MaintenanceShape = z.object({
  id: z.string(),
  description: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  roomId: z.string(),
  room: MaintenanceRoomShape, // Use the properly defined room shape
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  startedAt: z.string().optional().nullable(), // Changed from z.date() to z.string()
  completedAt: z.string().optional().nullable(), // Changed from z.date() to z.string()
  createdAt: z.string(), // Changed from z.date() to z.string()
  updatedAt: z.string(), // Changed from z.date() to z.string()
  hotelId: z.string(),
  // Additional fields that might be needed based on your frontend
  assignedTo: z.string().optional().nullable(),
  requestedBy: z.string().optional().nullable(),
  type: z.enum(["ROUTINE", "REPAIR", "URGENT", "CLEANING"]).optional(),
  title: z.string().optional().nullable(),
  estimatedDuration: z.number().optional().nullable(),
  scheduledDate: z.string().optional().nullable(), // Changed from z.date() to z.string()
  requestDate: z.string().optional(), // Changed from z.date() to z.string()
  photos: z.array(z.any()).optional(),
  notes: z.string().optional().nullable(),
});

// Add Maintenance Request
export const AddMaintenanceRequestSchema = z.object({
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  roomId: z.string().min(1, "Room ID is required"),
  assignedTo: z.string().optional(),
  requestedBy: z.string().optional(),
  type: z.enum(["ROUTINE", "REPAIR", "URGENT", "CLEANING"]).optional(),
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
});

export const GetMaintenanceByIdResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: MaintenanceShape,
});

// Update Maintenance Request
export const UpdateMaintenanceRequestSchema = z.object({
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  roomId: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  startedAt: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
  assignedTo: z.string().optional(),
  requestedBy: z.string().optional(),
  type: z.enum(["ROUTINE", "REPAIR", "URGENT", "CLEANING"]).optional(),
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

// Form data type for your NewMaintenanceDialog
export const MaintenanceFormDataSchema = z.object({
  areaType: z.string().min(1, "Area type is required"),
  areaNameOrNumber: z.string().min(1, "Area name or number is required"),
  issueDescription: z.string().min(1, "Issue description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  assignedTo: z.string().min(1, "Assignment is required"),
  photos: z.array(z.any()).default([]),
  repeatMaintenance: z.boolean().default(false),
  frequency: z.string().optional(),
  requestedBy: z.string().optional(),
  type: z.enum(["ROUTINE", "REPAIR", "URGENT", "CLEANING"]).default("REPAIR"),
  estimatedDuration: z.number().min(1).optional(),
  scheduledDate: z.string().optional(),
  notes: z.string().optional(),
});

export type MaintenanceFormData = z.infer<typeof MaintenanceFormDataSchema>;
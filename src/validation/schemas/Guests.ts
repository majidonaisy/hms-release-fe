import { z } from "zod/v4";

// Common Guest shape
const GuestShape = z.object({
  id: z.string(),
  gid: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  identification: z.object({
    type: z.string(),
    number: z.string(),
  }),
  nationality: z.string(),
  preferences: z.object({
    roomType: z.string(),
    smoking: z.boolean(),
  }),
  dob: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  hotelId: z.string(),
});

// Add Guest
export const AddGuestRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  identification: z.object({
    type: z.string(),
    number: z.string(),
  }),
  nationality: z.string(),
  preferences: z.object({
    roomType: z.string(),
    smoking: z.boolean(),
  }),
  dob: z.date(),
});

export const AddGuestResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: GuestShape,
});

// Get Guests
export const GetGuestsResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: z.array(GuestShape),
});

// Update Guest
export const UpdateGuestRequestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
});

export const UpdateGuestResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: GuestShape,
});

export type AddGuestRequest = z.infer<typeof AddGuestRequestSchema>;
export type AddGuestResponse = z.infer<typeof AddGuestResponseSchema>;
export type GetGuestsResponse = z.infer<typeof GetGuestsResponseSchema>;
export type UpdateGuestRequest = z.infer<typeof UpdateGuestRequestSchema>;
export type UpdateGuestResponse = z.infer<typeof UpdateGuestResponseSchema>;

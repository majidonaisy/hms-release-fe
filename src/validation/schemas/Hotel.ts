import { z } from "zod";

export enum LateFeeType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export const HotelSettingsSchema = z.object({
  id: z.string().optional(),
  baseCurrency: z.string().min(1, "Base currency is required"),
  checkInTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Check-in time must be in HH:MM format")
    .nullable(),
  checkOutTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Check-out time must be in HH:MM format")
    .nullable(),
  lateFeeType: z.nativeEnum(LateFeeType).nullable(),
  lateFeeAmount: z.number().min(0, "Late fee amount must be positive").nullable(),
  housekeepingRole: z.object({
    id: z.string(),
    name: z.string()
  }).nullable(),
})

export const UpdateHotelSettingsSchema = z.object({
  baseCurrency: z.string().min(1, "Base currency is required"),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Check-in time must be in HH:MM format"),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Check-out time must be in HH:MM format"),
  lateFeeType: z.nativeEnum(LateFeeType),
  lateFeeAmount: z.number().min(0, "Late fee amount must be positive"),
  housekeepingRoleId: z.string().nullable()
});

export const HousekeepingUserSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    data: z.array(z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      username: z.string()
    })),
    pagination: z.object({
      totalItems: z.number(),
      totalPages: z.number(),
      currentPage: z.number(),
      pageSize: z.number(),
      hasNext: z.boolean(),
      hasPrevious: z.boolean(),
      nextPage: z.string().nullable(),
      previousPage: z.string().nullable()
    })
  })
})

export type HotelSettings = z.infer<typeof HotelSettingsSchema>;
export type UpdateHotelSettingsRequest = z.infer<typeof UpdateHotelSettingsSchema>;
export type HousekeepingUsers = z.infer<typeof HousekeepingUserSchema>;

export interface HotelSettingsResponse {
  status: number;
  data: HotelSettings;
  message?: string;
}

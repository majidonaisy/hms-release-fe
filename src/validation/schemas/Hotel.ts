import { z } from "zod";

export enum LateFeeType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export const HotelSettingsSchema = z.object({
  id: z.string().optional(),
  baseCurrency: z.string().min(1, "Base currency is required"),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Check-in time must be in HH:MM format").nullable(),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Check-out time must be in HH:MM format").nullable(),
  lateFeeType: z.nativeEnum(LateFeeType).nullable(),
  lateFeeAmount: z.number().min(0, "Late fee amount must be positive").nullable(),
});

export const UpdateHotelSettingsSchema = z.object({
  baseCurrency: z.string().min(1, "Base currency is required"),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Check-in time must be in HH:MM format"),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Check-out time must be in HH:MM format"),
  lateFeeType: z.nativeEnum(LateFeeType),
  lateFeeAmount: z.number().min(0, "Late fee amount must be positive"),
});

export type HotelSettings = z.infer<typeof HotelSettingsSchema>;
export type UpdateHotelSettingsRequest = z.infer<typeof UpdateHotelSettingsSchema>;

export interface HotelSettingsResponse {
  status: number;
  data: HotelSettings;
  message?: string;
}

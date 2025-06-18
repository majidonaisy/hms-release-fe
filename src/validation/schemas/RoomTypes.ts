import { z } from "zod";

export const roomTypeDataSchema = z.object({
    name: z.string(),
    description: z.string(),
    baseRate: z.number()
});

export type RoomTypeFormData = z.infer<typeof roomTypeDataSchema>;
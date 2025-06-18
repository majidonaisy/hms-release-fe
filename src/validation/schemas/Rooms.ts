import { z } from "zod";

export const roomDataSchema = z.object({
    roomNumber: z.string(),
    roomTypeId: z.string()
});

export type RoomFormData = z.infer<typeof roomDataSchema>;

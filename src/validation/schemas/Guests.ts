import { z } from "zod";

export const guestDataSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phoneNumber: z.string()
});

export type AddGuestFormData = z.infer<typeof guestDataSchema>;

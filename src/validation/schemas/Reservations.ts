import { z } from "zod/v4";

export const ReservationShape = z.object({
    id: z.string(),
});

export const AddReservationRequestSchema = z.object({
    guestId: z.string(),
    roomId: z.string(),
    checkInDate: z.date(),
    checkOutDate: z.date(),
    numberOfGuests: z.number(),
    specialRequests: z.string(),
    ratePlanId: z.string(),
});

export const ReservationResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: ReservationShape,
});

export const UpdateReservationRequestSchema = z.object({
    checkInDate: z.date(),
    checkOutDate: z.date(),
    numberOfGuests: z.number(),
    specialRequests: z.string()
});

export const CheckInRequest = z.object({})

export type AddReservationRequest = z.infer<typeof AddReservationRequestSchema>;
export type ReservationResponse = z.infer<typeof ReservationResponseSchema>;
export type UpdateReservationRequest = z.infer<typeof UpdateReservationRequestSchema>;
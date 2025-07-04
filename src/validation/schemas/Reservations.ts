import { z } from "zod/v4";

export const ReservationShape = z.object({
    id: z.string(),
});

export const AddReservationRequestSchema = z.object({
    guestId: z.string(),
    roomIds: z.array(z.string()),
    checkIn: z.date(),
    checkOut: z.date(),
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

export const CheckInRequest = z.object({
    // actualCheckInTime: z.string().transform((val) => new Date(val)),
    actualCheckInTime: z.date(),
    notes: z.string()
});

export const CheckInResponse = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({})
});

export const CheckOutRequest = z.object({
    // actualCheckInTime: z.string().transform((val) => new Date(val)),
    actualCheckInTime: z.date(),
    notes: z.string()
});

export const CheckOutResponse = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({})
});

export type AddReservationRequest = z.infer<typeof AddReservationRequestSchema>;
export type ReservationResponse = z.infer<typeof ReservationResponseSchema>;
export type UpdateReservationRequest = z.infer<typeof UpdateReservationRequestSchema>;
export type CheckInRequest = z.infer<typeof CheckInRequest>;
export type CheckInResponse = z.infer<typeof CheckInResponse>;
export type CheckOutRequest = z.infer<typeof CheckOutRequest>;
export type CheckOutResponse = z.infer<typeof CheckOutResponse>;
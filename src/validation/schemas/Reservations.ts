import { z } from "zod/v4";

export const ReservationResponseShape = z.object({
    startDate: z.date(),
    endDate: z.date(),
    reservations: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        maxOccupancy: z.number(),
        adultOccupancy: z.number(),
        childOccupancy: z.number(),
        baseRate: z.string(),
        hotelId: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        Room: z.array(z.object({
            id: z.string(),
            roomNumber: z.string(),
            status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "DIRTY", "CLEANING", "RESERVED", "OUT_OF_SERVICE"]),
            floor: z.number(),
            description: z.string(),
            roomTypeId: z.string(),
            photos: z.array(z.any()),
            hotelId: z.string(),
            reservations: z.array(z.object({
                id: z.string(),
                checkIn: z.date(),
                checkOut: z.date(),
                status: z.enum(["CHECKED_IN", "CHECKED_OUT", "DRAFT", "CONFIRMED", "CANCELLED", "NO_SHOW", "HELD"]),
                guestId: z.string(),
                hotelId: z.string(),
                ratePlanId: z.string(),
                price: z.string(),
                groupBookingId: z.string(),
                chargeRouting: z.enum(["OWN_FOLIO", "MASTER_FOLIO", "SPLIT"]),
                createdAt: z.date(),
                updatedAt: z.date()
            }))
        }))
    }))
});

export const AddReservationRequestSchema = z.object({
    guestId: z.string(),
    roomIds: z.array(z.string()),
    checkIn: z.date(),
    checkOut: z.date(),
    ratePlanId: z.string(),
});

export const AddGroupReservationRequestSchema = z.object({
    checkIn: z.date(),
    checkOut: z.date(),
    guestsAndRooms: z.record(
        z.string().min(1),
        z.array(z.string().min(1)).min(1)
    ),
    groupProfileId: z.string,
    ratePlanId: z.string
})

export const ReservationResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: ReservationResponseShape,
});

export const UpdateReservationRequestSchema = z.object({
    checkIn: z.date(),
    checkOut: z.date(),
    roomIds: z.array(z.string()),
    ratePlanId: z.string(),
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

export const GetNightPriceResponseSchema = z.object({
    message: z.string(),
    data: z.string(),
})

export type Reservation = z.infer<typeof ReservationResponseShape>
export type AddReservationRequest = z.infer<typeof AddReservationRequestSchema>;
export type AddGroupReservationRequest = z.infer<typeof AddGroupReservationRequestSchema>;
export type ReservationResponse = z.infer<typeof ReservationResponseSchema>;
export type UpdateReservationRequest = z.infer<typeof UpdateReservationRequestSchema>;
export type CheckInRequest = z.infer<typeof CheckInRequest>;
export type CheckInResponse = z.infer<typeof CheckInResponse>;
export type CheckOutRequest = z.infer<typeof CheckOutRequest>;
export type CheckOutResponse = z.infer<typeof CheckOutResponse>;
export type GetNightPriceResponse = z.infer<typeof GetNightPriceResponseSchema>
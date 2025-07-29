import { z } from "zod";

// Guest shape for single reservation (based on actual API response)
export const SingleReservationGuestShape = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

// Room shape for single reservation (based on actual API response)
export const SingleReservationRoomShape = z.object({
  roomNumber: z.string(),
});

// Single Reservation shape (based on actual API response)
export const SingleReservationShape = z.object({
  id: z.string(),
  checkIn: z.string(), // ISO date string
  checkOut: z.string(), // ISO date string
  status: z.enum(["CHECKED_IN", "CHECKED_OUT", "DRAFT", "CONFIRMED", "CANCELLED", "NO_SHOW", "HELD"]),
  guestId: z.string(),
  hotelId: z.string(),
  ratePlanId: z.string(),
  price: z.string(),
  groupBookingId: z.string().nullable(),
  chargeRouting: z.enum(["OWN_FOLIO", "MASTER_FOLIO", "SPLIT"]),
  createdAt: z.string(), // ISO date string
  updatedAt: z.string(), // ISO date string
  rooms: z.array(SingleReservationRoomShape),
  receiptId: z.string(),
  guest: SingleReservationGuestShape,
});

// Get Single Reservation Response (API can return data directly or wrapped)
export const GetSingleReservationResponseSchema = z
  .object({
    status: z.number().optional(),
    message: z.string().optional(),
    data: SingleReservationShape.optional(),
  })
  .or(SingleReservationShape);

// Export types
export type SingleReservationGuest = z.infer<typeof SingleReservationGuestShape>;
export type SingleReservationRoom = z.infer<typeof SingleReservationRoomShape>;
export type SingleReservation = z.infer<typeof SingleReservationShape>;
export type GetSingleReservationResponse = z.infer<typeof GetSingleReservationResponseSchema>;

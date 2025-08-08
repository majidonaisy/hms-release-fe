import { z } from "zod/v4";

export const ReservationResponseShape = z.object({
  startDate: z.date(),
  endDate: z.date(),
  reservations: z.array(
    z.object({
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
      Room: z.array(
        z.object({
          id: z.string(),
          roomNumber: z.string(),
          status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "DIRTY", "CLEANING", "RESERVED", "OUT_OF_SERVICE"]),
          floor: z.number(),
          description: z.string(),
          roomTypeId: z.string(),
          photos: z.array(z.any()),
          hotelId: z.string(),
          reservations: z.array(
            z.object({
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
              updatedAt: z.date(),
              checkInTime: z.date(),
              createdBy: z.string(),
              updatedBy: z.string().nullable(),
              createdByUser: z.object({
                id: z.string(),
                firstName: z.string(),
                lastName: z.string(),
                email: z.string(),
              }),
              updatedByUser: z.object({
                id: z.string(),
                firstName: z.string(),
                lastName: z.string(),
                email: z.string(),
              }).nullable()
            })
          ),
        })
      ),
    })
  ),
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
  guestsAndRooms: z.record(z.string().min(1), z.array(z.string().min(1)).min(1)),
  groupProfileId: z.string,
  ratePlanId: z.string,
});

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

export const CheckInResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({}),
});

export const CheckOutResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({}),
});

export const GetNightPriceResponseSchema = z.object({
  message: z.string(),
  data: z.string(),
});

export const GetReservationByGuestIdSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(
    z.object({
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
      updatedAt: z.date(),
      rooms: z.array(
        z.object({
          id: z.string(),
          roomNumber: z.string(),
          status: z.enum(["CHECKED_IN", "CHECKED_OUT", "DRAFT", "CONFIRMED", "CANCELLED", "NO_SHOW", "HELD"]),
          floor: z.number(),
          description: z.string(),
          roomTypeId: z.string(),
          photos: z.array(z.any()),
          hotelId: z.string(),
        })
      ),
      ratePlan: z.object({
        id: z.string(),
        hotelId: z.string(),
        code: z.string(),
        name: z.string(),
        baseAdjType: z.enum(["PERCENT", "FIXED"], {
          message: "Adjustment type must be either PERCENT or FIXED",
        }),
        baseAdjVal: z.string(),
        currencyId: z.string(),
        isActive: z.boolean(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    })
  ),
});

const ReservationByIdShape = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    checkIn: z.date(),
    checkOut: z.date(),
    status: z.string(),
    guestId: z.string(),
    hotelId: z.string(),
    ratePlanId: z.string(),
    price: z.string(),
    groupBookingId: z.string(),
    chargeRouting: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    rooms: z.array(
      z.object({
        roomNumber: z.string(),
      })
    ),
    guest: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    }),
    checkInTime: z.date(),
    createdBy: z.string(),
    updatedBy: z.string().nullable(),
    createdByUser: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
    }),
    updatedByUser: z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
    }).nullable()
  }),
});

export const CheckedInReservationsSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      checkIn: z.string(),
      checkOut: z.string(),
      status: z.string(),
      guestId: z.string(),
      hotelId: z.string(),
      ratePlanId: z.string(),
      price: z.string(),
      groupBookingId: z.string().nullable(),
      chargeRouting: z.string(),
      identification: z.object({
        relativePath: z.string(),
      }),
      checkInTime: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
      createdBy: z.string(),
      updatedBy: z.string().nullable(),
      rooms: z.array(
        z.object({
          id: z.string(),
          roomNumber: z.string(),
          status: z.string(),
          floor: z.number(),
          description: z.string(),
          roomTypeId: z.string(),
          photos: z.array(z.any()),
          hotelId: z.string(),
          createdBy: z.string().nullable(),
          updatedBy: z.string().nullable(),
        })
      ),
    })
  ),
});

export type Reservation = z.infer<typeof ReservationResponseShape>;
export type AddReservationRequest = z.infer<typeof AddReservationRequestSchema>;
export type AddGroupReservationRequest = z.infer<typeof AddGroupReservationRequestSchema>;
export type ReservationResponse = z.infer<typeof ReservationResponseSchema>;
export type UpdateReservationRequest = z.infer<typeof UpdateReservationRequestSchema>;
export type CheckInResponse = z.infer<typeof CheckInResponseSchema>;
export type CheckOutResponse = z.infer<typeof CheckOutResponseSchema>;
export type GetNightPriceResponse = z.infer<typeof GetNightPriceResponseSchema>;
export type GetReservationByGuestId = z.infer<typeof GetReservationByGuestIdSchema>;
export type GetReservationById = z.infer<typeof ReservationByIdShape>;
export type CheckInReservations = z.infer<typeof CheckedInReservationsSchema>
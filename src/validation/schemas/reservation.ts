import { z } from "zod/v4";

// Basic reservation schema
export const reservationSchema = z.object({
  guestName: z
    .string()
    .min(2, { message: "Guest name must be at least 2 characters" }),
  bookingId: z.string().min(3, { message: "Booking ID is required" }),
  checkIn: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid check-in date",
  }),
  checkOut: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid check-out date",
  }),
  rate: z.number().positive({ message: "Rate must be a positive number" }),
  specialRequests: z.string().optional(),
  guestEmail: z.string().email({ message: "Invalid email address" }).optional(),
  guestPhone: z.string().optional(),
});

// Add a refinement to ensure checkout is after checkin
export const newReservationSchema = reservationSchema.refine(
  (data) => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkOut > checkIn;
  },
  {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"], // This will make the error appear on the checkOut field
  }
);

// Type inference
export type NewReservationInput = z.infer<typeof newReservationSchema>;

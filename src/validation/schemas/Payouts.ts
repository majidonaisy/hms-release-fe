import { z } from "zod";

// Information schema for GUEST_PAYMENT
const GuestPaymentInformationSchema = z.object({
    itemType: z.string(),
    guestName: z.string(),
    roomNumbers: z.string(),
    reservationId: z.string(),
});

// Information schema for LATE_PAYMENT (example, can extend)
const LatePaymentInformationSchema = z.object({
    reason: z.string(),
    dueDate: z.string(), // ISO string
    guestName: z.string(),
    reservationId: z.string(),
});

// Payment item schema with discriminated union
const PaymentItemSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("GUEST_PAYMENT"),
        id: z.string(),
        amount: z.number(),
        hotelId: z.string(),
        currencyId: z.string(),
        source: z.enum(["GUEST"]),
        method: z.enum(["CREDIT_CARD", "CASH", "BANK_TRANSFER"]),
        status: z.enum(["COMPLETED", "VOIDED"]),
        information: GuestPaymentInformationSchema.nullable(),
        reference: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        guestId: z.string(),
        itemId: z.string(),
    }),
    z.object({
        type: z.literal("LATE_PAYMENT"),
        id: z.string(),
        amount: z.number(),
        hotelId: z.string(),
        currencyId: z.string(),
        source: z.enum(["GUEST"]),
        method: z.enum(["CREDIT_CARD", "CASH", "BANK_TRANSFER"]),
        status: z.enum(["COMPLETED", "VOIDED"]),
        information: LatePaymentInformationSchema.nullable(),
        reference: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        guestId: z.string(),
        itemId: z.string(),
    }),
]);

// Pagination schema
const PaginationSchema = z.object({
    totalItems: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    pageSize: z.number(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
    nextPage: z.number().nullable(),
    previousPage: z.number().nullable(),
});

// Full response schema
export const PaymentsResponseSchema = z.object({
    status: z.number(),
    data: z.array(PaymentItemSchema),
    pagination: PaginationSchema,
});

// Type inference
export type PaymentsResponse = z.infer<typeof PaymentsResponseSchema>;

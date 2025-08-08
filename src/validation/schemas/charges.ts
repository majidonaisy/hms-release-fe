import { z } from "zod";

// Charge Item Shape
export const ChargeItemShape = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  selected: z.boolean().default(false),
});

// Add Charge Request
export const AddChargeRequestSchema = z.object({
  reservationId: z.string().min(1, "Reservation ID is required"),
  quantity: z.number().min(0.01, "Total quantity must be greater than 0"),
  unitPrice: z.number().min(0.01, "Unit price must be greater than 0"),
  itemType: z.string().min(1, "Payment method is required"),
  description: z.string().optional(),
  receiptId: z.string()
});

// Add Charge Response
export const AddChargeResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    reservationId: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    itemType: z.string(),
    description: z.string().optional(),
    createdAt: z.string(),
  }),
});

// Get Charges Response (Updated to match actual API response)
export const GetChargesResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    id: z.string(),
    status: z.string(),
    balance: z.string(),
    deposit: z.string(),
    hotelId: z.string(),
    reservationId: z.string(),
    groupBookingId: z.string().nullable(),
    parentFolioId: z.string().nullable(),
    folioType: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    folioItems: z.array(
      z.object({
        id: z.string(),
        folioId: z.string(),
        itemType: z.string(),
        amount: z.string(),
        quantity: z.number(),
        unitPrice: z.string(),
        status: z.string(),
        voidReason: z.string().nullable(),
        voidedAt: z.string().nullable(),
        voidedBy: z.string().nullable(),
      })
    ),
  }),
});

// Get Available Charge Items Response
export const GetAvailableChargeItemsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(ChargeItemShape),
});

// Payment Confirmation Request
export const PaymentConfirmationRequestSchema = z.object({
  reservationId: z.string().min(1, "Reservation ID is required"),
  chargeIds: z.array(z.string()).min(1, "At least one charge is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  description: z.string().optional(),
});

// Add Payment Request (Updated structure)
export const AddPaymentRequestSchema = z.object({
  folioItemIds: z.array(z.string()).min(1, "At least one folio item is required"),
  currencyId: z.string().min(1, "Currency is required"),
  method: z.string().min(1, "Payment method is required"),
  description: z.string().optional(),
});

export const TransferChargesRequestSchema = z.object({
  fromReservation: z.string(),
  toReservation: z.string(),
  items: z.array(z.string())
})

export const TransferItemsSchema = z.object({
  id: z.string(),
  folioId: z.string(),
  itemType: z.string(),
  amount: z.string(),
  quantity: z.number(),
  unitPrice: z.string(),
  status: z.string(),
  voidReason: z.string().nullable(),
  voidedAt: z.string().nullable(),
  voidedBy: z.string().nullable(),
  receiptId: z.string().nullable(),
  createdBy: z.string(),
  updatedBy: z.string().nullable(),
})

export const TransferItemsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(TransferItemsSchema)
})

// Type exports
export type ChargeItem = z.infer<typeof ChargeItemShape>;
export type AddChargeRequest = z.infer<typeof AddChargeRequestSchema>;
export type AddChargeResponse = z.infer<typeof AddChargeResponseSchema>;
export type GetChargesResponse = z.infer<typeof GetChargesResponseSchema>;
export type GetAvailableChargeItemsResponse = z.infer<typeof GetAvailableChargeItemsResponseSchema>;
export type PaymentConfirmationRequest = z.infer<typeof PaymentConfirmationRequestSchema>;
export type AddPaymentRequest = z.infer<typeof AddPaymentRequestSchema>;
export type TransferChargesRequest = z.infer<typeof TransferChargesRequestSchema>
export type TransferItemsResponse = z.infer<typeof TransferItemsResponseSchema>
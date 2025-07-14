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

// Get Charges Response
export const GetChargesResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      reservationId: z.string(),
      itemName: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      itemType: z.string(),
      description: z.string().optional(),
      createdAt: z.string(),
    })
  ),
  pagination: z
    .object({
      totalItems: z.number(),
      totalPages: z.number(),
      currentPage: z.number(),
      pageSize: z.number(),
      hasNext: z.boolean(),
      hasPrevious: z.boolean(),
    })
    .optional(),
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
  itemType: z.string().min(1, "Payment method is required"),
  quantity: z.number().min(0.01, "Total quantity must be greater than 0"),
  unitPrice: z.number().min(0.01, "Unit price must be greater than 0"),
  description: z.string().optional(),
});

// Type exports
export type ChargeItem = z.infer<typeof ChargeItemShape>;
export type AddChargeRequest = z.infer<typeof AddChargeRequestSchema>;
export type AddChargeResponse = z.infer<typeof AddChargeResponseSchema>;
export type GetChargesResponse = z.infer<typeof GetChargesResponseSchema>;
export type GetAvailableChargeItemsResponse = z.infer<typeof GetAvailableChargeItemsResponseSchema>;
export type PaymentConfirmationRequest = z.infer<typeof PaymentConfirmationRequestSchema>;

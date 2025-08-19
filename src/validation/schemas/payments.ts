import { z } from "zod";

// Enums for better type safety
export const ItemTypeEnum = z.enum([
  "PARKING",
  "FOOD_BEVERAGE",
  "WIFI",
  "ROOM_CHARGE",
  "SERVICE_CHARGE",
  "CITY_TAX",
  "INCIDENTAL",
  "PAYMENT_CASH",
  "PAYMENT_CARD",
  "PAYMENT_TRANSFER",
  "DEPOSIT",
  "REFUND",
  "LATE_CHECKOUT_FEE",
  "EARLY_CHECKIN_FEE",
  "CLEANING_FEE",
  "DAMAGE_FEE",
  "MINIBAR",
  "LAUNDRY",
  "SPA_SERVICES",
  "RESTAURANT",
  "OTHER",
]);

export const PaymentMethodEnum = z.enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "MOBILE_PAYMENT", "CHECK", "ONLINE", "UNKNOWN"]);

export const PaymentStatusEnum = z.enum(["PAID", "PENDING", "FAILED", "CANCELLED", "VOIDED", "COMPLETED", "PROCESSING"]);

export const PaymentTypeEnum = z.enum(["DEPOSIT", "PAYMENT", "REFUND", "CHARGE"]);

// Folio Item shape based on your API response
export const FolioItemShape = z.object({
  id: z.string(),
  folioId: z.string(),
  itemType: z.string(), // Keep as string since API might have values not in enum
  amount: z.string(),
  quantity: z.number(),
  unitPrice: z.string(),
  status: z.string(), // Keep as string since API might have values not in enum
  voidReason: z.string().nullable(),
  voidedAt: z.string().nullable(),
  voidedBy: z.string().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  description: z.string().optional(),
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
  }).nullable(),
  voidedByUser: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
  }).nullable(),
  receiptId: z.string().nullable()
});

// Payment interface for UI display
export const PaymentShape = z.object({
  id: z.string(),
  amount: z.number(),
  paymentMethod: PaymentMethodEnum,
  paymentDate: z.string(),
  status: PaymentStatusEnum,
  description: z.string().optional(),
  transactionId: z.string().optional(),
  paymentType: PaymentTypeEnum,
  itemType: z.string().optional(),
  quantity: z.number().optional(),
  unitPrice: z.number().optional(),
  folioId: z.string().optional(),
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
  }).nullable(),
  voidedByUser: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
  }).nullable(),
  receiptId: z.string().nullable()
});

// API Response schemas
export const GetPaymentsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(FolioItemShape),
});

// Folio summary response
export const FolioSummaryResponseSchema = z.object({
  status: z.number(),
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
    folioItems: z.array(FolioItemShape),
  }),
});

// Payment summary for calculations
export const PaymentSummaryShape = z.object({
  totalCharges: z.number(),
  totalPayments: z.number(),
  totalPending: z.number(),
  totalRefunds: z.number(),
  balance: z.number(),
  itemCount: z.number(),
});

// Export Payment Request
export const ExportPaymentRequestSchema = z.object({
  reservationId: z.string().min(1, "Reservation ID is required"),
  format: z.enum(["PDF", "CSV", "EXCEL"]).default("PDF"),
  dateRange: z
    .object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .optional(),
});

// Void Payments Request
export const VoidPaymentsRequestSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "At least one payment ID is required"),
  voidReason: z.string().min(1, "Void reason is required"),
});

// Void Payments Response
export const VoidPaymentsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    voidedCount: z.number(),
    voidedPayments: z.array(z.string()),
  }),
});

// Type exports
export type ItemType = z.infer<typeof ItemTypeEnum>;
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
export type PaymentType = z.infer<typeof PaymentTypeEnum>;
export type FolioItem = z.infer<typeof FolioItemShape>;
export type Payment = z.infer<typeof PaymentShape>;
export type GetPaymentsResponse = z.infer<typeof GetPaymentsResponseSchema>;
export type FolioSummaryResponse = z.infer<typeof FolioSummaryResponseSchema>;
export type PaymentSummary = z.infer<typeof PaymentSummaryShape>;
export type ExportPaymentRequest = z.infer<typeof ExportPaymentRequestSchema>;
export type VoidPaymentsRequest = z.infer<typeof VoidPaymentsRequestSchema>;
export type VoidPaymentsResponse = z.infer<typeof VoidPaymentsResponseSchema>;

// Helper functions for transforming data
export const transformFolioItemToPayment = (item: FolioItem): Payment => {
  return {
    id: item.id,
    amount: parseFloat(item.amount),
    paymentMethod: determinePaymentMethod(item.itemType),
    paymentDate: item.createdAt || new Date().toISOString(),
    status: normalizePaymentStatus(item.status),
    description: formatDescription(item.itemType, item.quantity),
    transactionId: item.id,
    paymentType: determinePaymentType(item.itemType),
    itemType: item.itemType,
    quantity: item.quantity,
    unitPrice: parseFloat(item.unitPrice),
    folioId: item.folioId,
    createdByUser: item.createdByUser,
    updatedByUser: item.updatedByUser,
    voidedByUser: item.voidedByUser,
    receiptId: item.receiptId
  };
};

export const determinePaymentMethod = (itemType: string): PaymentMethod => {
  const typeMap: Record<string, PaymentMethod> = {
    PAYMENT_CASH: "CASH",
    PAYMENT_CARD: "CREDIT_CARD",
    PAYMENT_TRANSFER: "BANK_TRANSFER",
    PARKING: "CASH",
    FOOD_BEVERAGE: "CREDIT_CARD",
    WIFI: "CREDIT_CARD",
    ROOM_CHARGE: "CREDIT_CARD",
    SERVICE_CHARGE: "CREDIT_CARD",
    CITY_TAX: "CASH",
    INCIDENTAL: "CREDIT_CARD",
  };

  return typeMap[itemType] || "UNKNOWN";
};

export const determinePaymentType = (itemType: string): PaymentType => {
  const lowerItemType = itemType.toLowerCase();

  if (lowerItemType.includes("payment")) {
    return "PAYMENT";
  } else if (lowerItemType.includes("deposit") || lowerItemType.includes("advance")) {
    return "DEPOSIT";
  } else if (lowerItemType.includes("refund") || lowerItemType.includes("return")) {
    return "REFUND";
  } else {
    return "CHARGE";
  }
};

export const normalizePaymentStatus = (status: string): PaymentStatus => {
  const statusMap: Record<string, PaymentStatus> = {
    PAID: "COMPLETED",
    PENDING: "PENDING",
    FAILED: "FAILED",
    CANCELLED: "CANCELLED",
    VOIDED: "VOIDED",
    COMPLETED: "COMPLETED",
    PROCESSING: "PROCESSING",
  };

  return statusMap[status] || "PENDING";
};

export const formatDescription = (itemType: string, quantity: number): string => {
  const descriptions: Record<string, string> = {
    PARKING: "Parking fee",
    FOOD_BEVERAGE: "Food & Beverage",
    WIFI: "WiFi service",
    ROOM_CHARGE: "Room charge",
    SERVICE_CHARGE: "Service charge",
    CITY_TAX: "City tax",
    INCIDENTAL: "Incidental charge",
    PAYMENT_CASH: "Cash payment",
    PAYMENT_CARD: "Card payment",
    PAYMENT_TRANSFER: "Bank transfer payment",
    LATE_CHECKOUT_FEE: "Late checkout fee",
    EARLY_CHECKIN_FEE: "Early check-in fee",
    CLEANING_FEE: "Cleaning fee",
    DAMAGE_FEE: "Damage fee",
    MINIBAR: "Minibar charges",
    LAUNDRY: "Laundry service",
    SPA_SERVICES: "Spa services",
    RESTAURANT: "Restaurant charges",
  };

  const baseDescription = descriptions[itemType] || itemType.replace("_", " ").toLowerCase();
  return quantity > 1 ? `${baseDescription} (x${quantity})` : baseDescription;
};

export const calculatePaymentSummary = (payments: Payment[]): PaymentSummary => {
  const totalCharges = payments.filter((p) => p.paymentType === "CHARGE" && p.status === "COMPLETED").reduce((sum, p) => sum + p.amount, 0);

  const totalPayments = payments.filter((p) => ["PAYMENT", "DEPOSIT"].includes(p.paymentType) && p.status === "COMPLETED").reduce((sum, p) => sum + p.amount, 0);

  const totalRefunds = payments.filter((p) => p.paymentType === "REFUND" && p.status === "COMPLETED").reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments.filter((p) => p.status === "PENDING").reduce((sum, p) => sum + p.amount, 0);

  const balance = totalPayments - totalCharges - totalRefunds;

  return {
    totalCharges,
    totalPayments,
    totalRefunds,
    totalPending,
    balance,
    itemCount: payments.length,
  };
};

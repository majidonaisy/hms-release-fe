import { z } from "zod/v4";

const RatePlanShape = z.object({
  id: z.string(),
  hotelId: z.string(),
  code: z.string(),
  name: z.string(),
  baseAdjType: z.enum(["PERCENT", "AMOUNT"]),
  baseAdjVal: z.string(),
  currencyId: z.string(),
  isActive: z.boolean(),
  description: z.string().optional(),
  basePrice: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AddRatePlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  basePrice: z.number().min(0.01, "Base price must be greater than zero"),
  baseAdjType: z.enum(["PERCENT", "FIXED"], {
    message: "Adjustment type must be either PERCENT or FIXED",
  }),
  baseAdjVal: z.string().min(1, "Adjustment value is required"),
  currencyId: z.string().min(1, "Currency is required"),
  description: z.string().optional(),
});

export const GetRatePlansResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: z.array(RatePlanShape),
  pagination: z
    .object({
      totalItems: z.number(),
      itemCount: z.number(),
      itemsPerPage: z.number(),
      totalPages: z.number(),
      currentPage: z.number(),
    })
    .optional(),
});

export type RatePlan = z.infer<typeof RatePlanShape>;
export type AddRatePlanRequest = z.infer<typeof AddRatePlanSchema>;
export type GetRatePlansResponse = z.infer<typeof GetRatePlansResponseSchema>;

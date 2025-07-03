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
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const GetRatePlansResponseSchema = z.object({
    status: z.number(),
    message: z.string().optional(),
    data: z.array(RatePlanShape),
});

export type GetRatePlansResponse = z.infer<typeof GetRatePlansResponseSchema>;

import { z } from "zod";

export const ExchangeRateShape = z.object({
    id: z.string(),
    baseCurrency: z.string(),
    targetCurrency: z.string(),
    rate: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    hotelId: z.string(),
});

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

export const ExchangeRateRequestSchema = z.object({
    baseCurrency: z.string().min(1, "Base currency is required"),
    targetCurrency: z.string().min(1, "Target currency is required"),
    rate: z.number().positive("Rate must be positive"),
});

export const ExchangeRateResponseSchema = z.object({
    status: z.number(),
    message: z.string().optional(),
    data: ExchangeRateShape,
});

export const GetExchangeRatesResponseSchema = z.object({
    status: z.number(),
    message: z.string().optional(),
    data: z.array(ExchangeRateShape),
    pagination: PaginationSchema.optional(),
});

export const GetExchangeRateByIdResponse = z.object({
    status: z.number(),
    message: z.string().optional(),
    data: ExchangeRateShape,
});

export type ExchangeRate = z.infer<typeof ExchangeRateShape>;
export type ExchangeRateRequest = z.infer<typeof ExchangeRateRequestSchema>;
export type ExchangeRateResponse = z.infer<typeof ExchangeRateResponseSchema>;
export type GetExchangeRateResponse = z.infer<typeof GetExchangeRatesResponseSchema>;
export type GetExchangeRateByIdResponse = z.infer<typeof GetExchangeRateByIdResponse>;
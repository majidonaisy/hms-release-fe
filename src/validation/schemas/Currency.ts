import { z } from 'zod/v4';

// Base Currency schema
const CurrencyShape = {
  id: z.string(),
  code: z.string().min(1, 'Currency code is required'),
  name: z.string().min(1, 'Currency name is required'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
};

export const CurrencySchema = z.object(CurrencyShape);

// API Response schemas
export const GetCurrenciesResponseSchema = z.object({
  message: z.string(),
  data: z.array(CurrencySchema),
});

// Types
export type Currency = z.infer<typeof CurrencySchema>;
export type GetCurrenciesResponse = z.infer<typeof GetCurrenciesResponseSchema>;

// For creating/updating currencies (if needed)
export const AddCurrencySchema = z.object({
  code: z.string().min(1, 'Currency code is required').max(3, 'Currency code must be 3 characters'),
  name: z.string().min(1, 'Currency name is required'),
});

export const UpdateCurrencySchema = z.object({
  code: z.string().min(1, 'Currency code is required').max(3, 'Currency code must be 3 characters').optional(),
  name: z.string().min(1, 'Currency name is required').optional(),
});

export type AddCurrencyRequest = z.infer<typeof AddCurrencySchema>;
export type UpdateCurrencyRequest = z.infer<typeof UpdateCurrencySchema>;
import { z } from "zod/v4";

export const TokenPayloadSchema = z.object({
  userId: z.string(),
  tenantId: z.string(),
  hotelId: z.string(),
  permissions: z.array(
    z.object({
      resource: z.string(),
      actions: z.array(z.enum(["create", "read", "update", "delete"])),
    })
  ),
});

export const ErrorResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  error: z.object({
    code: z.string(),
    details: z.unknown().optional(),
  }),
});

export const PaginationSchema = z.object({
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  pageSize: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
  nextPage: z.number().nullable(),
  previousPage: z.number().nullable(),
});

export type Pagination = z.infer<typeof PaginationSchema>;
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

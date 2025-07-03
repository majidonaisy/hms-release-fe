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

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

import { z } from 'zod';

export const AmenitySchema = z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    hotelId: z.string(),
});

export const AmenityResponseSchema = z.object({
    status: z.number(),
    data: z.array(AmenitySchema),
});

export type Amenity = z.infer<typeof AmenitySchema>;
export type AmenityResponse = z.infer<typeof AmenityResponseSchema>;
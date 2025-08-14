import { z } from 'zod';

export const AreaSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const AreasSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.array(AreaSchema)
});

export const AddAreaResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        id: z.string(),
        name: z.string(),
        hotelId: z.string(),
        createdAt: z.date(),
        updatedAt: z.date()
    })
})

export type Area = z.infer<typeof AreaSchema>;
export type Areas = z.infer<typeof AreasSchema>;
export type AddAreaResponse = z.infer<typeof AddAreaResponseSchema>
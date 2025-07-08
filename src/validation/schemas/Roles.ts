import { z } from "zod/v4";

export const RoleShape = z.object({
    id: z.string(),
    name: z.string(),
    hotelId: z.string(),
    permissions: z.array(z.object({
        id: z.string(),
        subject: z.string(),
        action: z.string()
    }))
});

export const RoleResponseShape = z.object({
    status: z.number(),
    data: z.array(RoleShape)
})

export type Role = z.infer<typeof RoleShape>;
export type RoleResponse = z.infer<typeof RoleResponseShape>;
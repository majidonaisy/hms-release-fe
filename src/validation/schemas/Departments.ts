import { z } from 'zod';

export const DepartmentSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const DepartmentsSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.array(DepartmentSchema)
});

export const AddDepartmentResponseSchema = z.object({
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

export type Department = z.infer<typeof DepartmentSchema>;
export type Departments = z.infer<typeof DepartmentsSchema>;
export type AddDepartmentResponse = z.infer<typeof AddDepartmentResponseSchema>
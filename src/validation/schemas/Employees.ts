import { z } from "zod/v4";

const EmployeeShape = z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    isActive: z.boolean(),
    roleId: z.string(),
    role: z.object({
        id: z.string(),
        name: z.string(),
        hotelId: z.string()
    }),
    hotel: z.array(z.object({
        id: z.string(),
        name: z.string()
    }))
});

export const GetEmployeesResponseSchema = z.object({
    status: z.number(),
    message: z.string().optional(),
    data: z.array(EmployeeShape)
});

export const GetEmployeeByIdResponseSchema = z.object({
    status: z.number(),
    message: z.string().optional(),
    data: EmployeeShape
});


export type GetEmployeesResponse = z.infer<typeof GetEmployeesResponseSchema>;
export type GetEmployeeByIdResponse = z.infer<typeof GetEmployeeByIdResponseSchema>;

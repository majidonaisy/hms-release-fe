import { z } from "zod";

export const loginDataSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string()
});

export const loginResponseSchema = z.object({ //make sure of the type when confirmed
    user: z.object({
        email: z.string(),
    }),
    accessToken: z.string(),
    refreshToken: z.string(),
});

export const addUserSchema = z.object({
    email: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    roleId: z.string(),

});

export type LoginFormData = z.infer<typeof loginDataSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type AddUserFormData = z.infer<typeof addUserSchema>;

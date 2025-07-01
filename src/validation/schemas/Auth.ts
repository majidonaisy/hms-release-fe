import { z } from "zod/v4";

export const LoginRequestSchema = z.object({
  username: z.string("Please enter a valid username"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const LoginResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  accessToken: z.object({
    token: z.string(),
    permissions: z.array(z.string()),
  }),
  data: z.object({
    user: z.object({
      id: z.string(),
      email: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      roleId: z.string(),
    }),
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

export const AddUserRequestSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  roleId: z.string(),
});

export const AddUserResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: z.object({
    id: z.string(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    roleId: z.string(),
  }),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type AddUserRequest = z.infer<typeof AddUserRequestSchema>;
export type AddUserResponse = z.infer<typeof AddUserResponseSchema>;

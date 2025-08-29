import { z } from "zod/v4";

export const LoginRequestSchema = z.object({
  username: z.string("Please enter a valid username"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const PermissionsSchema = z.object({
  subject: z.string(),
  action: z.string(),
});

export const LoginResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: z.object({
    permissions: z.array(PermissionsSchema).optional(),
    accessToken: z.string(),
    refreshToken: z.string(),
    baseCurrency: z.string(),
    // user: z.object({
    //   id: z.string(),
    //   email: z.string(),
    //   firstName: z.string(),
    //   lastName: z.string(),
    //   roleId: z.string(),
    // }),
  }),
});

export const GetProfileResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: z.object({
    Session: z.array(z.object({
      createdAt: z.string(),
      hotelId: z.string(),
      id: z.string(),
      isActive: z.boolean(),
      lastActivity: z.string(),
      userId: z.string(),
    })),
    createdAt: z.date(),
    createdBy: z.string().nullable(),
    department: z.object({
      id: z.string(),
      name: z.string(),
    }),
    departmentId: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    roleId: z.string(),
    isActive: z.boolean(),
    isOnline: z.boolean(),
    updatedAt: z.date(),
    updatedBy: z.any(),
    username: z.string()
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
  status: z.number(),
  message: z.string().optional(),
  data: z.object({
    id: z.string(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    roleId: z.string(),
  }),
});

export type Permissions = z.infer<typeof PermissionsSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type AddUserRequest = z.infer<typeof AddUserRequestSchema>;
export type AddUserResponse = z.infer<typeof AddUserResponseSchema>;
export type GetProfileResponse = z.infer<typeof GetProfileResponseSchema>;
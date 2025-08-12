import { z } from "zod/v4";
import { PaginationSchema } from "./common";

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
});

export const RoleByIdResponseShape = z.object({
    status: z.number(),
    data: RoleShape
});

export const AddRoleRequestSchema = z.object({
    name: z.string({ error: "Role name is required" }).min(1, "Role name cannot be empty"),
    permissionIds: z.array(z.string()),
});

export const UpdateRoleRequestSchema = z.object({
    name: z.string().optional(),
    permissionIds: z.array(z.string()).optional(),
});

export const AddUpdateRoleResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: {
        id: z.string(),
        name: z.string(),
        hotelId: z.string(),
        permissions: z.array(z.string()),
        createdAt: z.date(),
        updatedAt: z.date()
    }
});

export const PermissionShape = z.object({
    id: z.string(),
    subject: z.string(),
    action: z.string()
});

export const PermissionsResponseShape = z.object({
    status: z.number(),
    message: z.string,
    data: z.array(PermissionShape),
    pagination: PaginationSchema
});

export const DeleteResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    deletedId: z.string()
})

export type Role = z.infer<typeof RoleShape>;
export type RoleResponse = z.infer<typeof RoleResponseShape>;
export type RoleByIdResponse = z.infer<typeof RoleByIdResponseShape>;
export type AddRoleRequest = z.infer<typeof AddRoleRequestSchema>;
export type UpdateRoleRequest = z.infer<typeof UpdateRoleRequestSchema>;
export type AddUpdateRoleResponse = z.infer<typeof AddUpdateRoleResponseSchema>;
export type Permissions = z.infer<typeof PermissionShape>;
export type PermissionsResponse = z.infer<typeof PermissionsResponseShape>;
export type DeleteRoleResponse = z.infer<typeof DeleteResponseSchema>;
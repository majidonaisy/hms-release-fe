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
    hotelId: z.string(),
  }),
  hotel: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  online: z.boolean(),
  department: z.object({
    id: z.string(),
    name: z.string()
  })
});

export const PaginationSchema = z.object({
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  pageSize: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
  nextPage: z.number().nullable(),
  previousPage: z.number().nullable(),
});

export const GetEmployeesResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: z.array(EmployeeShape),
  pagination: PaginationSchema.optional(),
});

export const GetEmployeeByIdResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    isActive: z.boolean(),
    roleId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdBy: z.string().nullable(),
    updatedBy: z.string().nullable(),
    Session: z.array(z.object({
      id: z.string(),
      hotelId: z.string(),
      userId: z.string(),
      isActive: z.boolean(),
      lastActivity: z.date(),
      createdAt: z.date()
    })),
    department: z.object({
      id: z.string(),
      name: z.string()
    })
  }),
});

export const AddEmployeeRequestSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string().min(6, "Password must contain at least 6 characters"),
  firstName: z.string(),
  lastName: z.string(),
  roleId: z.string(),
  departmentId: z.string().optional(),
})

export const AddTeamMemberResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: EmployeeShape
})

export const UpdateTeamMemberRequestSchema = z.object({
  email: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  roleId: z.string(),
  departmentId: z.string().optional()
})

export type Employee = z.infer<typeof EmployeeShape>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type GetEmployeesResponse = z.infer<typeof GetEmployeesResponseSchema>;
export type GetEmployeeByIdResponse = z.infer<typeof GetEmployeeByIdResponseSchema>;
export type AddEmployeeRequest = z.infer<typeof AddEmployeeRequestSchema>
export type AddTeamMemberResponse = z.infer<typeof AddTeamMemberResponseSchema>
export type UpdateTeamMemberRequest = z.infer<typeof UpdateTeamMemberRequestSchema>
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
  data: EmployeeShape,
});

export const AddEmployeeRequestSchema = z.object({
  email: z.string,
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  roleId: z.string()
})

export const AddTeamMemberResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: EmployeeShape
})

export type Employee = z.infer<typeof EmployeeShape>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type GetEmployeesResponse = z.infer<typeof GetEmployeesResponseSchema>;
export type GetEmployeeByIdResponse = z.infer<typeof GetEmployeeByIdResponseSchema>;
export type AddEmployeeRequest = z.infer<typeof AddEmployeeRequestSchema>
export type AddTeamMemberResponse = z.infer<typeof AddTeamMemberResponseSchema>
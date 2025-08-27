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
    password: z.string(),
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
    }),
    isOnline: z.boolean()
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

const BaseActivityShape = z.object({
  id: z.string(),
  userId: z.string(),
  hotelId: z.string(),
  service: z.string(),
  resourceType: z.string(),
  resourceId: z.string().nullable(),
  status: z.string(),
  errorMessage: z.string().nullable(),
  timestamp: z.string(), // ISO string
});

// Create Group Booking activity
const CreateGroupBookingActivity = BaseActivityShape.extend({
  action: z.literal("Create Group Booking"),
  requestData: z.object({
    checkIn: z.string(),
    checkOut: z.string(),
    ratePlanId: z.string(),
    groupProfileId: z.string(),
    guestsAndRooms: z.record(z.string(), z.array(z.string())),
  }),
  responseData: z.null(),
  metadata: z.object({
    ip: z.string(),
    path: z.string(),
    method: z.string(),
    userAgent: z.string(),
    guestCount: z.number(),
    ratePlanId: z.string(),
    statusCode: z.number(),
    totalRooms: z.number(),
    checkInDate: z.date(),
    checkOutDate: z.date(),
    groupProfileId: z.string(),
    uniqueRoomCount: z.number(),
    groupProfileName: z.string(),
    reservationCount: z.number(),
    groupProfileEmail: z.string(),
    groupProfilePhone: z.string(),
    groupProfileStatus: z.string(),
    groupProfileLegalName: z.string(),
    groupProfileBusinessType: z.string(),
  }),
});

// Create Reservation activity
const CreateReservationActivity = BaseActivityShape.extend({
  action: z.literal("Create Reservation"),
  requestData: z.object({
    guestId: z.string(),
    ratePlanId: z.string(),
  }),
  responseData: z.object({
    status: z.number(),
  }).nullable(),
  metadata: z.object({
    ip: z.string(),
    path: z.string(),
    method: z.string(),
    guestId: z.string(),
    guestGid: z.string().optional(),
    guestName: z.string().optional(),
    roomCount: z.number(),
    userAgent: z.string(),
    guestCount: z.number(),
    statusCode: z.number(),
    checkInDate: z.date(),
    roomNumbers: z.array(z.string()).optional(),
    checkOutDate: z.date(),
    guestLastName: z.string().optional(),
    guestFirstName: z.string().optional(),
    reservationPrice: z.string().optional(),
  }),
});

// Add Charge activity
const AddChargeActivity = BaseActivityShape.extend({
  action: z.literal("Add Charge"),
  requestData: z.null(),
  responseData: z.object({
    status: z.number(),
  }),
  metadata: z.object({
    ip: z.string(),
    path: z.string(),
    rooms: z.array(z.string()).optional(),
    method: z.string(),
    folioId: z.string().optional(),
    userAgent: z.string(),
    chargeType: z.string().optional(),
    itemStatus: z.string().optional(),
    statusCode: z.number(),
    chargeAmount: z.string().optional(),
    operationType: z.string().optional(),
    currencyCode: z.string().optional()
  }),
});

const CheckInReservationActivity = BaseActivityShape.extend({
  action: z.literal("Check In Reservation"),
  // requestData: z.null(),
  // responseData: z.object({
  //   status: z.number(),
  // }),
  metadata: z.object({
    // ip: z.string(),
    // path: z.string(),
    // rooms: z.array(z.string()).optional(),
    // method: z.string(),
    // folioId: z.string().optional(),
    // userAgent: z.string(),
    // chargeType: z.string().optional(),
    // itemStatus: z.string().optional(),
    // statusCode: z.number(),
    // chargeAmount: z.string().optional(),
    // operationType: z.string().optional(),
    roomNumbers: z.array(z.string()).optional(),
    depositAmount: z.number()
  }),
});

const CheckOutReservationActivity = BaseActivityShape.extend({
  action: z.literal("Check Out Reservation"),
  // requestData: z.null(),
  // responseData: z.object({
  //   status: z.number(),
  // }),
  metadata: z.object({
    // ip: z.string(),
    // path: z.string(),
    // rooms: z.array(z.string()).optional(),
    // method: z.string(),
    // folioId: z.string().optional(),
    // userAgent: z.string(),
    // chargeType: z.string().optional(),
    // itemStatus: z.string().optional(),
    // statusCode: z.number(),
    // chargeAmount: z.string().optional(),
    // operationType: z.string().optional(),
    roomNumbers: z.array(z.string()).optional(),
    checkOutTime: z.date()
  }),
});

const SettleFolioItemActivity = BaseActivityShape.extend({
  action: z.literal("Settle Folio Item"),
  metadata: z.object({
    ip: z.string(),
    path: z.string(),
    method: z.string(),
    batchId: z.string(),
    duration: z.number(),
    itemType: z.string(),
    itemIndex: z.number(),
    roomCount: z.number(),
    userAgent: z.string(),
    statusCode: z.number(),
    totalItems: z.number(),
    isConverted: z.boolean(),
    roomNumbers: z.array(z.string()).optional(),
    guestFullName: z.string(),
    operationType: z.string(),
    paymentMethod: z.string(),
    paymentCurrency: z.string(),
  }),
  responseData: z.object({
    amount: z.number()
  })
});

const VoidFolioItemActivity = BaseActivityShape.extend({
  action: z.literal("Void Folio Item"),
  metadata: z.object({
    rooms: z.array(z.string()).optional(),
    voidedAt: z.date(),
    nbOfItems: z.number()
  }),
  responseData: z.object({
    amount: z.number()
  })
});

// Full Activity Logs response
export const ActivityLogsSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(
    z.discriminatedUnion("action", [
      CreateGroupBookingActivity,
      CreateReservationActivity,
      AddChargeActivity,
      CheckInReservationActivity,
      CheckOutReservationActivity,
      SettleFolioItemActivity,
      VoidFolioItemActivity
    ])
  ),
});

// Pagination wrapper
export const PaginatedActivityLogsSchema = ActivityLogsSchema.extend({
  pagination: z.object({
    totalItems: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    pageSize: z.number(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
    nextPage: z.number().nullable(),
    previousPage: z.number().nullable(),
  }),
});

export type Employee = z.infer<typeof EmployeeShape>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type GetEmployeesResponse = z.infer<typeof GetEmployeesResponseSchema>;
export type GetEmployeeByIdResponse = z.infer<typeof GetEmployeeByIdResponseSchema>;
export type AddEmployeeRequest = z.infer<typeof AddEmployeeRequestSchema>
export type AddTeamMemberResponse = z.infer<typeof AddTeamMemberResponseSchema>
export type UpdateTeamMemberRequest = z.infer<typeof UpdateTeamMemberRequestSchema>
export type ActivityLogItem = z.infer<typeof CreateGroupBookingActivity>
  | z.infer<typeof CreateReservationActivity>
  | z.infer<typeof AddChargeActivity>
  | z.infer<typeof CheckInReservationActivity>
  | z.infer<typeof CheckOutReservationActivity>
  | z.infer<typeof SettleFolioItemActivity>
  | z.infer<typeof VoidFolioItemActivity>;
export type PaginatedActivityLogs = z.infer<typeof PaginatedActivityLogsSchema>;
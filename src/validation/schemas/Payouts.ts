import { z } from "zod/v4";

const BasePayoutShape = z.object({
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
const CreateGroupBookingActivity = BasePayoutShape.extend({
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
const CreateReservationActivity = BasePayoutShape.extend({
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
const AddChargeActivity = BasePayoutShape.extend({
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

const CheckInReservationActivity = BasePayoutShape.extend({
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

const CheckOutReservationActivity = BasePayoutShape.extend({
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

export type ActivityLogItem = z.infer<typeof CreateGroupBookingActivity>
    | z.infer<typeof CreateReservationActivity>
    | z.infer<typeof AddChargeActivity>
    | z.infer<typeof CheckInReservationActivity>
    | z.infer<typeof CheckOutReservationActivity>;
export type PaginatedActivityLogs = z.infer<typeof PaginatedActivityLogsSchema>;
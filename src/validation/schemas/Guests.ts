import { z } from "zod/v4";

// Common Guest shape
const GuestShape = z.object({
  id: z.string(),
  gid: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  identification: z.object({
    type: z.string(),
    number: z.string(),
  }),
  nationality: z.string(),
  preferences: z.object({
    roomType: z.string(),
    smoking: z.boolean(),
  }),
  dob: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  hotelId: z.string(),
});

const GroupProfileShape = z.object({
  id: z.string(),
  name: z.string(),
  legalName: z.string(),
  email: z.string(),
  phone: z.string(),
  primaryContact: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string()
  }),
  address: z.object({
    city: z.string(),
    country: z.string()
  }),
  billingAddress: z.object({
    city: z.string(),
    country: z.string()
  }),
  businessType: z.enum(["CORPORATE", "TRAVEL_AGENCY", "EVENT_PLANNER", "GOVERNMENT", "OTHER"]),
  specialRequirements: z.string(),
  status: z.string(),
  isVip: z.boolean(),
  notes: z.string(),
  hotelId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Add LinkedGuests field
  LinkedGuests: z.array(GuestShape).optional(),
});

export const GroupProfileResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: GroupProfileShape
})

// Add Guest
export const AddGuestRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phoneNumber: z.string(),
  identification: z.object({
    type: z.string(),
    number: z.string(),
  }),
  nationality: z.string(),
  preferences: z.object({
    roomType: z.string(),
    smoking: z.boolean(),
  }),
  dob: z.date(),
});

export const AddGuestResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: GuestShape,
});

// Get Guests
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

export const SearchMetaSchema = z.object({
  query: z.string(),
  searchableFields: z.array(z.string()),
  executionTime: z.number(),
});

export const GetGuestsResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: z.array(GuestShape),
  pagination: PaginationSchema.optional(),
  searchMeta: SearchMetaSchema.optional(),
});

export const GetGuestByIdResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: GuestShape,
});

// Update Guest
export const UpdateGuestRequestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
});

export const UpdateGuestResponseSchema = z.object({
  status: z.number(),
  message: z.string().optional(),
  data: GuestShape,
});

export const AddGroupProfileRequestSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  email: z.string(),
  phone: z.string(),
  primaryContact: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  address: z.object({
    city: z.string(),
    country: z.string(),
  }),
  billingAddress: z.object({
    city: z.string(),
    country: z.string()
  }),
  businessType: z.enum(["CORPORATE", "TRAVEL_AGENCY", "EVENT_PLANNER", "GOVERNMENT", "OTHER"]),
  specialRequirements: z.string(),
  isVip: z.boolean(),
  notes: z.string(),
})

export const AddGroupProfileResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    name: z.string(),
    legalName: z.string(),
    email: z.string(),
    phone: z.string(),
    primaryContact: z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
    }),
    address: z.object({
      city: z.string(),
      country: z.string(),
    }),
    billingAddress: z.object({
      city: z.string(),
      country: z.string()
    }),
    businessType: z.enum(["CORPORATE", "TRAVEL_AGENCY", "EVENT_PLANNER", "GOVERNMENT", "OTHER"]),
    specialRequirements: z.string(),
    isVip: z.boolean(),
    notes: z.string(),
    hotelId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
});

export const LinkGuestsToGroupResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: GroupProfileShape
});

export const GetGroupProfilesResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(GroupProfileShape),
  pagination: PaginationSchema.optional(),
});

export const CurrentGuestShape = z.object({
  id: z.string(),
  gid: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  nationality: z.string(),
  identification: z.object({
    type: z.string(),
    number: z.string(),
  }),
  preferences: {
    smoking: z.boolean(),
    roomType: z.string(),
  },
  dob: z.date(),
  hotelId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  currentReservation: z.object({
    id: z.string(),
    checkIn: z.date(),
    checkOut: z.date(),
    price: z.string(),
    status: z.enum(["CHECKED_IN", "CHECKED_OUT", "DRAFT", "CONFIRMED", "CANCELLED", "NO_SHOW", "HELD"]),
    rooms: z.array(
      z.object({
        id: z.string(),
        roomNumber: z.string(),
        roomType: z.string()
      })
    )
  })
})

export const GetCurrentGuestsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(CurrentGuestShape),
});

export const GetCurrentGroupProfilesResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(GroupProfileShape),
});

export const UpdateGroupProfileRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  businessType: z.enum(["CORPORATE", "TRAVEL_AGENCY", "EVENT_PLANNER", "GOVERNMENT", "OTHER"]),
  isVip: z.boolean(),
  notes: z.string(),
  specialRequirements: z.string()
})

export type Guest = z.infer<typeof GuestShape>;
export type GroupProfile = z.infer<typeof GroupProfileShape>;
export type AddGuestRequest = z.infer<typeof AddGuestRequestSchema>;
export type AddGuestResponse = z.infer<typeof AddGuestResponseSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type SearchMeta = z.infer<typeof SearchMetaSchema>;
export type GetGuestsResponse = z.infer<typeof GetGuestsResponseSchema>;
export type GetGuestByIdResponse = z.infer<typeof GetGuestByIdResponseSchema>;
export type UpdateGuestRequest = z.infer<typeof UpdateGuestRequestSchema>;
export type UpdateGuestResponse = z.infer<typeof UpdateGuestResponseSchema>;
export type AddGroupProfileRequest = z.infer<typeof AddGroupProfileRequestSchema>
export type AddGroupProfileResponse = z.infer<typeof AddGroupProfileResponseSchema>
export type LinkGuestsToGroupResponse = z.infer<typeof LinkGuestsToGroupResponseSchema>
export type GetGroupProfilesResponse = z.infer<typeof GetGroupProfilesResponseSchema>
export type GroupProfileResponse = z.infer<typeof GroupProfileResponseSchema>
export type GetCurrentGuestsResponse = z.infer<typeof GetCurrentGuestsResponseSchema>;
export type GetCurrentGroupProfilesResponse = z.infer<typeof GetCurrentGroupProfilesResponseSchema>;
export type UpdateGroupProfileRequest = z.infer<typeof UpdateGroupProfileRequestSchema>
export type CurrentGuest = z.infer<typeof CurrentGuestShape>
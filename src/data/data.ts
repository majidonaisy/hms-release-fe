import { Room, Reservation } from '../types/reservation';

export const sampleRooms: Room[] = [
  {
    id: '101',
    name: 'Ocean View Standard 101',
    type: 'Standard',
    rate: 150,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC', 'Ocean View'],
    needsHousekeeping: false
  },
  {
    id: '102',
    name: 'Garden View Standard 102',
    type: 'Standard',
    rate: 130,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC', 'Garden View'],
    needsHousekeeping: true
  },
  {
    id: '201',
    name: 'Deluxe Suite 201',
    type: 'Deluxe',
    rate: 250,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Balcony', 'Ocean View'],
    needsHousekeeping: false
  },
  {
    id: '202',
    name: 'Deluxe Suite 202',
    type: 'Deluxe',
    rate: 250,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Balcony', 'Garden View'],
    needsHousekeeping: false
  },
  {
    id: '302',
    name: 'Executive Suite 302',
    type: 'Suite',
    rate: 380,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Living Room', 'Balcony', 'City View'],
    needsHousekeeping: true
  },
  {
    id: '303',
    name: 'Executive Suite 303',
    type: 'Suite',
    rate: 380,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Living Room', 'Balcony', 'City View'],
    needsHousekeeping: false
  },
  {
    id: '304',
    name: 'Executive Suite 304',
    type: 'Suite',
    rate: 380,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Living Room', 'Balcony', 'City View'],
    needsHousekeeping: false
  },
  {
    id: '305',
    name: 'Executive Suite 304',
    type: 'Suite',
    rate: 380,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Living Room', 'Balcony', 'City View'],
    needsHousekeeping: false
  },
  {
    id: '306',
    name: 'Executive Suite 304',
    type: 'Suite',
    rate: 380,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Living Room', 'Balcony', 'City View'],
    needsHousekeeping: true
  },
];

export const sampleReservations: Reservation[] = [
  // Current week reservations (Dec 16-22, 2025)
  {
    id: 'res-001',
    resourceId: '101',
    start: new Date(2025, 6, 14), // Dec 14, 2025 (Saturday)
    end: new Date(2025, 6, 18),   // Dec 18, 2025 (Wednesday)
    guestName: 'John Smith',
    bookingId: 'BK-2025-001',
    status: 'checked-in',
    rate: 150,
    guestEmail: 'john.smith@email.com',
    guestPhone: '+1-555-0123',
    specialRequests: 'Late checkout requested, ocean view preferred'
  },
  {
    id: 'res-002',
    resourceId: '102',
    start: new Date(2025, 6, 16), // Dec 16, 2025 (Monday)
    end: new Date(2025, 6, 20),   // Dec 20, 2025 (Friday)
    guestName: 'Sarah Johnson',
    bookingId: 'BK-2025-002',
    status: 'reserved',
    rate: 130,
    guestEmail: 'sarah.johnson@email.com',
    guestPhone: '+1-555-0456',
    specialRequests: 'Ground floor room, allergic to feather pillows'
  },
  {
    id: 'res-003',
    resourceId: '201',
    start: new Date(2025, 6, 15), // Dec 15, 2025 (Sunday)
    end: new Date(2025, 6, 19),   // Dec 19, 2025 (Thursday)
    guestName: 'Michael Brown',
    bookingId: 'BK-2025-003',
    status: 'reserved',
    rate: 250,
    guestEmail: 'michael.brown@email.com',
    guestPhone: '+1-555-0789',
    specialRequests: 'Extra pillows, quiet room away from elevator'
  },
  {
    id: 'res-004',
    resourceId: '202',
    start: new Date(2025, 6, 17), // Dec 17, 2025 (Tuesday)
    end: new Date(2025, 6, 21),   // Dec 21, 2025 (Saturday)
    guestName: 'Emily Davis',
    bookingId: 'BK-2025-004',
    status: 'blocked',
    rate: 250,
    guestEmail: 'emily.davis@email.com',
    guestPhone: '+1-555-0321',
    specialRequests: 'Honeymoon suite, champagne and flowers'
  },
  {
    id: 'res-005',
    resourceId: '302',
    start: new Date(2025, 6, 18), // Dec 18, 2025 (Wednesday)
    end: new Date(2025, 6, 22),   // Dec 22, 2025 (Sunday)
    guestName: 'Robert Wilson',
    bookingId: 'BK-2025-005',
    status: 'occupied',
    rate: 380,
    guestEmail: 'robert.wilson@email.com',
    guestPhone: '+1-555-0654',
    specialRequests: 'Business traveler, early check-in needed'
  },

  // Upcoming reservations (Dec 19-25, 2025)
  {
    id: 'res-006',
    resourceId: '101',
    start: new Date(2025, 6, 19), // Dec 19, 2025 (Thursday)
    end: new Date(2025, 6, 23),   // Dec 23, 2025 (Monday)
    guestName: 'Lisa Anderson',
    bookingId: 'BK-2025-006',
    status: 'reserved',
    rate: 150,
    guestEmail: 'lisa.anderson@email.com',
    guestPhone: '+1-555-0987',
    specialRequests: 'Traveling with pet, pet-friendly room needed'
  },
  {
    id: 'res-007',
    resourceId: '303',
    start: new Date(2025, 6, 20), // Dec 20, 2025 (Friday)
    end: new Date(2025, 6, 24),   // Dec 24, 2025 (Tuesday)
    guestName: 'David Martinez',
    bookingId: 'BK-2025-007',
    status: 'occupied',
    rate: 380,
    guestEmail: 'david.martinez@email.com',
    guestPhone: '+1-555-061',
    specialRequests: 'Family vacation, connecting rooms if available'
  },
  {
    id: 'res-008',
    resourceId: '304',
    start: new Date(2025, 6, 21), // Dec 21, 2025 (Saturday)
    end: new Date(2025, 6, 25),   // Dec 25, 2025 (Wednesday)
    guestName: 'Jennifer Taylor',
    bookingId: 'BK-2025-008',
    status: 'reserved',
    rate: 380,
    guestEmail: 'jennifer.taylor@email.com',
    guestPhone: '+1-555-0222',
    specialRequests: 'Christmas holiday stay, late checkout on Christmas'
  },

  // Past reservations (checked out)
  {
    id: 'res-009',
    resourceId: '102',
    start: new Date(2025, 6, 10), // Dec 10, 2025 (Tuesday)
    end: new Date(2025, 6, 14),   // Dec 14, 2025 (Saturday)
    guestName: 'Mark Thompson',
    bookingId: 'BK-2025-009',
    status: 'checked-out',
    rate: 130,
    guestEmail: 'mark.thompson@email.com',
    guestPhone: '+1-555-0333',
    specialRequests: 'Business trip, late arrival'
  },
  {
    id: 'res-010',
    resourceId: '201',
    start: new Date(2025, 6, 8),  // Dec 8, 2025 (Sunday)
    end: new Date(2025, 6, 12),   // Dec 12, 2025 (Thursday)
    guestName: 'Amanda White',
    bookingId: 'BK-2025-010',
    status: 'checked-out',
    rate: 250,
    guestEmail: 'amanda.white@email.com',
    guestPhone: '+1-555-0444',
    specialRequests: 'Anniversary celebration, room decoration'
  },

  // Weekend reservations
  {
    id: 'res-06',
    resourceId: '202',
    start: new Date(2025, 6, 22), // Dec 22, 2025 (Sunday)
    end: new Date(2025, 6, 26),   // Dec 26, 2025 (Thursday)
    guestName: 'Kevin Johnson',
    bookingId: 'BK-2025-06',
    status: 'blocked',
    rate: 250,
    guestEmail: 'kevin.johnson@email.com',
    guestPhone: '+1-555-0555',
    specialRequests: 'Post-Christmas relaxation, spa services'
  },
  {
    id: 'res-012',
    resourceId: '102',
    start: new Date(2025, 6, 23), // Dec 23, 2025 (Monday)
    end: new Date(2025, 6, 27),   // Dec 27, 2025 (Friday)
    guestName: 'Maria Rodriguez',
    bookingId: 'BK-2025-012',
    status: 'blocked',
    rate: 130,
    guestEmail: 'maria.rodriguez@email.com',
    guestPhone: '+1-555-0666',
    specialRequests: 'Extended holiday stay, weekly rate discount'
  },

  // Cancelled reservation
  {
    id: 'res-013',
    resourceId: '303',
    start: new Date(2025, 6, 16), // Dec 16, 2025 (Monday)
    end: new Date(2025, 6, 20),   // Dec 20, 2025 (Friday)
    guestName: 'Chris Lee',
    bookingId: 'BK-2025-013',
    status: 'occupied',
    rate: 380,
    guestEmail: 'chris.lee@email.com',
    guestPhone: '+1-555-0777',
    specialRequests: 'Cancelled due to emergency, refund processed'
  },

  // Short stay reservations
  {
    id: 'res-014',
    resourceId: '101',
    start: new Date(2025, 6, 24), // Dec 24, 2025 (Tuesday)
    end: new Date(2025, 6, 26),   // Dec 26, 2025 (Thursday)
    guestName: 'Anna Kim',
    bookingId: 'BK-2025-014',
    status: 'occupied',
    rate: 150,
    guestEmail: 'anna.kim@email.com',
    guestPhone: '+1-555-0888',
    specialRequests: 'Christmas Eve arrival, special dinner arrangement'
  },
  {
    id: 'res-015',
    resourceId: '304',
    start: new Date(2025, 6, 25), // Dec 25, 2025 (Wednesday)
    end: new Date(2025, 6, 28),   // Dec 28, 2025 (Saturday)
    guestName: 'Peter Clark',
    bookingId: 'BK-2025-015',
    status: 'reserved',
    rate: 380,
    guestEmail: 'peter.clark@email.com',
    guestPhone: '+1-555-0999',
    specialRequests: 'Christmas Day check-in, family gathering'
  },
  // New Year reservations
  {
    id: 'res-017',
    resourceId: '201',
    start: new Date(2025, 6, 29), // Dec 29, 2025 (Sunday)
    end: new Date(2025, 0, 2),     // Jan 2, 2025 (Thursday)
    guestName: 'Thomas Anderson',
    bookingId: 'BK-2025-017',
    status: 'blocked',
    rate: 250,
    guestEmail: 'thomas.anderson@email.com',
    guestPhone: '+1-555-66',
    specialRequests: 'New Year celebration, balcony view for fireworks'
  },
  {
    id: 'res-018',
    resourceId: '203',
    start: new Date(2025, 6, 30), // Dec 30, 2025 (Monday)
    end: new Date(2025, 0, 3),     // Jan 3, 2025 (Friday)
    guestName: 'Nancy Davis',
    bookingId: 'BK-2025-018',
    status: 'occupied',
    rate: 250,
    guestEmail: 'nancy.davis@email.com',
    guestPhone: '+1-555-1212',
    specialRequests: 'New Year party package, champagne service'
  }
];

export const teamMembersData = [
  {
    id: 1,
    name: "Olivia RHye",
    username: "@olivia",
    status: "Active",
    type: "Front Desk",
    floor: "Receptionist",
    occupancy: "Product Designer",
    logs: "olivia@untitledui.com",
    email: "olivia@untitledui.com",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Phoenix Baker",
    username: "@phoenix",
    status: "Inactive",
    type: "Housekeeping",
    floor: "Supervisor",
    occupancy: "Product Manager",
    logs: "phoenix@untitledui.com",
    email: "phoenix@untitledui.com",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Lana Steiner",
    username: "@lana",
    status: "Active",
    type: "IT",
    floor: "Frontend Developer",
    occupancy: "Frontend Developer",
    logs: "lana@untitledui.com",
    email: "lana@untitledui.com",
    imageUrl: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: 4,
    name: "Demi Wilkinson",
    username: "@demi",
    status: "Active",
    type: "Management",
    floor: "Backend Developer",
    occupancy: "Backend Developer",
    logs: "demi@untitledui.com",
    email: "demi@untitledui.com",
    imageUrl: "https://randomuser.me/api/portraits/women/47.jpg"
  },
  {
    id: 5,
    name: "Candice Wu",
    username: "@candice",
    status: "Pending",
    type: "Security",
    floor: "Fullstack Developer",
    occupancy: "Fullstack Developer",
    logs: "candice@untitledui.com",
    email: "candice@untitledui.com",
    imageUrl: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: 6,
    name: "Natali Craig",
    username: "@natali",
    status: "Active",
    type: "UX Designer",
    floor: "UX Designer",
    occupancy: "UX Designer",
    logs: "natali@untitledui.com",
    email: "natali@untitledui.com",
    imageUrl: "https://randomuser.me/api/portraits/women/56.jpg"
  },
  {
    id: 7,
    name: "Drew Cano",
    username: "@drew",
    status: "Inactive",
    type: "UX Copywriter",
    floor: "UX Copywriter",
    occupancy: "UX Copywriter",
    logs: "drew@untitledui.com",
    email: "drew@untitledui.com",
    imageUrl: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: 8,
    name: "Orlando Diggs",
    username: "@orlando",
    status: "Pending",
    type: "UI Designer",
    floor: "UI Designer",
    occupancy: "UI Designer",
    logs: "orlando@untitledui.com",
    email: "orlando@untitledui.com",
    imageUrl: "https://randomuser.me/api/portraits/men/48.jpg"
  },
  {
    id: 9,
    name: "Andi Lane",
    username: "@andi",
    status: "Active",
    type: "Product Manager",
    floor: "Product Manager",
    occupancy: "Product Manager",
    logs: "andi@untitledui.com",
    email: "andi@untitledui.com",
    imageUrl: "https://randomuser.me/api/portraits/women/62.jpg"
  },
  {
    id: 10,
    name: "Kate Morrison",
    username: "@kate",
    status: "Pending",
    type: "QA Engineer",
    floor: "QA Engineer",
    occupancy: "QA Engineer",
    logs: "kate@untitledui.com",
    email: "kate@untitledui.com",
    imageUrl: "https://randomuser.me/api/portraits/women/38.jpg"
  }
];

export const teamProfilesData = [
  {
    accountId: 1,
    phoneNumber: "+123 456 001",
    loginId: "olivia",
    password: "********",
    department: "Front Desk",
    assignedRole: "Receptionist",
    permissions: null,
    shift: "Morning shifts",
    supervisor: "None",
    dateJoined: "2023-08-15",
    performanceNotes: [
      "Consistently receives positive feedback from guests.",
      "Takes initiative in solving on-site problems."
    ],
    activityLogs: [
      { date: "2025-06-21", time: "09:15 am", description: "Checked in guest Room 101" },
      { date: "2025-06-21", time: "11:00 am", description: "Logged out" }
    ]
  },
  {
    accountId: 2,
    phoneNumber: "+123 456 002",
    loginId: "phoenix",
    password: "********",
    department: "Housekeeping",
    assignedRole: "Supervisor",
    permissions: "Staff overview",
    shift: "Evening shifts",
    supervisor: "None",
    dateJoined: "2022-01-10",
    performanceNotes: [
      "Improved team efficiency by 20% through scheduling changes.",
      "Excellent cleanliness audit scores."
    ],
    activityLogs: [
      { date: "2025-06-20", time: "5:15 pm", description: "Logged out" }
    ]
  },
  {
    accountId: 3,
    phoneNumber: "+123 456 789",
    loginId: "lana",
    password: "********",
    department: "IT Department",
    assignedRole: "Front desk agent",
    permissions: null,
    shift: "Morning shifts",
    supervisor: "Olivia RHye",
    dateJoined: "2024-03-01",
    performanceNotes: [
      "Promoted from trainee to full-time receptionist in March 2024.",
      "Handles VIP guest check-ins reliably.",
      "Recommended for future shift lead role."
    ],
    activityLogs: [
      { date: "2025-06-21", time: "8:30 am", description: "Checked in guest Room 204" },
      { date: "2025-06-21", time: "10:36 am", description: "Edited reservation #R3281" },
      { date: "2025-06-21", time: "4:56 pm", description: "Logged out" }
    ]
  },
  {
    accountId: 4,
    phoneNumber: "+123 456 004",
    loginId: "demi",
    password: "********",
    department: "Management",
    assignedRole: "Backend Developer",
    permissions: "Admin",
    shift: "Flexible",
    supervisor: "None",
    dateJoined: "2021-12-01",
    performanceNotes: [
      "Led backend migration to scalable infrastructure.",
      "High code quality and reliability."
    ],
    activityLogs: []
  },
  {
    accountId: 5,
    phoneNumber: "+123 456 005",
    loginId: "candice",
    password: "********",
    department: "Security",
    assignedRole: "Fullstack Developer",
    permissions: "System Monitor",
    shift: "Night",
    supervisor: "Demi Wilkinson",
    dateJoined: "2022-06-18",
    performanceNotes: [],
    activityLogs: []
  },
  {
    accountId: 6,
    phoneNumber: "+123 456 006",
    loginId: "natali",
    password: "********",
    department: "Design",
    assignedRole: "UX Designer",
    permissions: null,
    shift: "Day",
    supervisor: "Lana Steiner",
    dateJoined: "2023-03-22",
    performanceNotes: [
      "UX redesign led to 30% increase in booking conversions."
    ],
    activityLogs: []
  },
  {
    accountId: 7,
    phoneNumber: "+123 456 007",
    loginId: "drew",
    password: "********",
    department: "Design",
    assignedRole: "UX Copywriter",
    permissions: null,
    shift: "Day",
    supervisor: "Natali Craig",
    dateJoined: "2023-04-10",
    performanceNotes: [],
    activityLogs: []
  },
  {
    accountId: 8,
    phoneNumber: "+123 456 008",
    loginId: "orlando",
    password: "********",
    department: "Design",
    assignedRole: "UI Designer",
    permissions: null,
    shift: "Evening",
    supervisor: "Natali Craig",
    dateJoined: "2023-04-10",
    performanceNotes: [],
    activityLogs: []
  },
  {
    accountId: 9,
    phoneNumber: "+123 456 009",
    loginId: "andi",
    password: "********",
    department: "Product",
    assignedRole: "Product Manager",
    permissions: "Admin",
    shift: "Flexible",
    supervisor: "None",
    dateJoined: "2021-09-01",
    performanceNotes: [],
    activityLogs: []
  },
  {
    accountId: 10,
    phoneNumber: "+123 456 010",
    loginId: "kate",
    password: "********",
    department: "QA",
    assignedRole: "QA Engineer",
    permissions: "Test Access",
    shift: "Day",
    supervisor: "Andi Lane",
    dateJoined: "2022-05-30",
    performanceNotes: [],
    activityLogs: []
  }
];

export const rolesData = [
  {
    id: 1,
    name: "Hotel Manager",
    code: "HM001",
    status: "Active",
    department: "Management",
    level: "Executive",
    assignedCount: "2 users",
    permissions: "Full Access",
    description: "Oversees all hotel operations and staff management",
  },
  {
    id: 2,
    name: "Front Desk Agent",
    code: "FDA001",
    status: "Active",
    department: "Front Office",
    level: "Staff",
    assignedCount: "8 users",
    permissions: "Guest Management",
    description: "Handles guest check-in/out and front desk operations",
  },
  {
    id: 3,
    name: "Housekeeping Supervisor",
    code: "HKS001",
    status: "Active",
    department: "Housekeeping",
    level: "Supervisor",
    assignedCount: "3 users",
    permissions: "Staff Oversight",
    description: "Supervises housekeeping staff and room maintenance",
  },
  {
    id: 4,
    name: "IT Administrator",
    code: "ITA001",
    status: "Active",
    department: "IT",
    level: "Administrator",
    assignedCount: "2 users",
    permissions: "System Admin",
    description: "Manages hotel IT systems and technical support",
  },
  {
    id: 5,
    name: "Security Officer",
    code: "SO001",
    status: "Pending",
    department: "Security",
    level: "Officer",
    assignedCount: "4 users",
    permissions: "Security Access",
    description: "Ensures hotel security and safety protocols",
  },
  {
    id: 6,
    name: "Guest Services Representative",
    code: "GSR001",
    status: "Active",
    department: "Guest Services",
    level: "Staff",
    assignedCount: "6 users",
    permissions: "Guest Support",
    description: "Provides guest assistance and concierge services",
  },
  {
    id: 7,
    name: "Maintenance Technician",
    code: "MT001",
    status: "Inactive",
    department: "Maintenance",
    level: "Technician",
    assignedCount: "3 users",
    permissions: "Facility Access",
    description: "Handles hotel maintenance and repairs",
  },
  {
    id: 8,
    name: "Finance Manager",
    code: "FM001",
    status: "Pending",
    department: "Finance",
    level: "Manager",
    assignedCount: "2 users",
    permissions: "Financial Access",
    description: "Manages hotel finances and accounting",
  },
  {
    id: 9,
    name: "Food & Beverage Manager",
    code: "FBM001",
    status: "Active",
    department: "F&B",
    level: "Manager",
    assignedCount: "5 users",
    permissions: "F&B Operations",
    description: "Oversees restaurant and bar operations",
  },
  {
    id: 10,
    name: "Night Auditor",
    code: "NA001",
    status: "Pending",
    department: "Front Office",
    level: "Auditor",
    assignedCount: "2 users",
    permissions: "Audit Access",
    description: "Handles overnight operations and financial audits",
  }
];

export const roleProfilesData = [
  {
    roleId: 1,
    createdDate: "2021-01-15",
    lastModified: "2024-11-20",
    createdBy: "System Admin",
    modifiedBy: "John Smith",
    basePermissions: ["Full System Access", "Staff Management", "Financial Reports"],
    restrictions: ["Cannot delete system logs"],
    description: "Complete administrative control over hotel operations including staff management, financial oversight, and system configuration.",
    requirements: ["5+ years hotel management experience", "Bachelor's degree preferred"],
    reportingStructure: "Reports to: Hotel Owner/Board",
    delegationRights: "Can delegate all permissions except system administration",
    accessLevel: "Level 5 - Executive",
    workSchedule: "Flexible - On-call 24/7",
    certifications: ["Hotel Management Certification", "Leadership Training"],
    performanceMetrics: [
      "Guest satisfaction scores",
      "Revenue targets",
      "Staff retention rates"
    ]
  },
  {
    roleId: 2,
    createdDate: "2021-01-15",
    lastModified: "2024-08-15",
    createdBy: "System Admin",
    modifiedBy: "Jane Doe",
    basePermissions: ["Guest Check-in/out", "Room Assignment", "Payment Processing"],
    restrictions: ["Cannot access financial reports", "Cannot modify room rates"],
    description: "Primary point of contact for guests during check-in/out processes and general inquiries.",
    requirements: ["High school diploma", "Customer service experience"],
    reportingStructure: "Reports to: Front Office Manager",
    delegationRights: "Can delegate guest service tasks to trainees",
    accessLevel: "Level 2 - Staff",
    workSchedule: "8-hour shifts, rotating schedule",
    certifications: ["Customer Service Training", "PMS System Training"],
    performanceMetrics: [
      "Check-in efficiency",
      "Guest satisfaction scores",
      "Upselling success rate"
    ]
  },
  {
    roleId: 3,
    createdDate: "2021-02-01",
    lastModified: "2024-09-10",
    createdBy: "System Admin",
    modifiedBy: "Mary Johnson",
    basePermissions: ["Staff Scheduling", "Room Status Management", "Inventory Control"],
    restrictions: ["Cannot hire/fire staff", "Cannot access guest payment info"],
    description: "Supervises housekeeping operations and ensures room cleanliness standards.",
    requirements: ["2+ years housekeeping experience", "Supervisory experience"],
    reportingStructure: "Reports to: Hotel Manager",
    delegationRights: "Can assign tasks to housekeeping staff",
    accessLevel: "Level 3 - Supervisor",
    workSchedule: "Day shift, Monday-Friday",
    certifications: ["Housekeeping Management", "Safety Training"],
    performanceMetrics: [
      "Room cleanliness scores",
      "Staff productivity",
      "Supply cost management"
    ]
  },
  {
    roleId: 4,
    createdDate: "2021-03-01",
    lastModified: "2024-12-01",
    createdBy: "System Admin",
    modifiedBy: "Tech Team",
    basePermissions: ["System Administration", "User Management", "Database Access"],
    restrictions: ["Cannot access financial transactions", "Cannot modify guest data"],
    description: "Maintains and administers all hotel technology systems and provides technical support.",
    requirements: ["Bachelor's in IT/Computer Science", "3+ years system admin experience"],
    reportingStructure: "Reports to: Hotel Manager",
    delegationRights: "Can grant temporary system access to staff",
    accessLevel: "Level 4 - Administrator",
    workSchedule: "Monday-Friday, on-call weekends",
    certifications: ["Network Administration", "Cybersecurity Training"],
    performanceMetrics: [
      "System uptime",
      "Help desk response time",
      "Security incident prevention"
    ]
  },
  {
    roleId: 5,
    createdDate: "2021-04-01",
    lastModified: "2024-10-15",
    createdBy: "System Admin",
    modifiedBy: "Security Manager",
    basePermissions: ["Security System Access", "Incident Reporting", "Emergency Response"],
    restrictions: ["Cannot access guest personal data", "Cannot modify security protocols"],
    description: "Ensures hotel security and safety through monitoring and patrol duties.",
    requirements: ["Security license", "Background check clearance"],
    reportingStructure: "Reports to: Hotel Manager",
    delegationRights: "Can coordinate with local law enforcement",
    accessLevel: "Level 2 - Officer",
    workSchedule: "24/7 rotating shifts",
    certifications: ["Security License", "First Aid/CPR"],
    performanceMetrics: [
      "Incident response time",
      "Security breach prevention",
      "Guest safety satisfaction"
    ]
  },
  {
    roleId: 6,
    createdDate: "2021-05-01",
    lastModified: "2024-07-20",
    createdBy: "System Admin",
    modifiedBy: "Guest Services Manager",
    basePermissions: ["Guest Assistance", "Concierge Services", "Local Information Access"],
    restrictions: ["Cannot process payments", "Cannot access room keys"],
    description: "Provides enhanced guest services and local area assistance.",
    requirements: ["Customer service experience", "Local area knowledge"],
    reportingStructure: "Reports to: Front Office Manager",
    delegationRights: "Limited - can make service reservations for guests",
    accessLevel: "Level 2 - Staff",
    workSchedule: "Day shift, flexible hours",
    certifications: ["Concierge Training", "Local Area Certification"],
    performanceMetrics: [
      "Guest service ratings",
      "Recommendation accuracy",
      "Problem resolution rate"
    ]
  }
];

export const permissionsList = [
  "View room assignments & cleaning status",
  "View blocked rooms / maintenance list",
  "Access POS system",
  "Full access to reservations & guests",
  "View staff logs & activity",
  "Create/edit user accounts",
  "Manage room types or pricing",
  "View financial reports",
  "Access guest reservations"
];

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
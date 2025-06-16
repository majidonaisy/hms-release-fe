import { Room, Reservation } from '../types/reservation';

export const sampleRooms: Room[] = [
  {
    id: '101',
    name: 'Ocean View Standard 101',
    type: 'Standard',
    rate: 150,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC', 'Ocean View']
  },
  {
    id: '102',
    name: 'Garden View Standard 102',
    type: 'Standard',
    rate: 130,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC', 'Garden View']
  },
  {
    id: '201',
    name: 'Deluxe Suite 201',
    type: 'Deluxe',
    rate: 250,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Balcony', 'Ocean View']
  },
  {
    id: '202',
    name: 'Deluxe Suite 202',
    type: 'Deluxe',
    rate: 250,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Balcony', 'Garden View']
  },
  {
    id: '302',
    name: 'Executive Suite 302',
    type: 'Suite',
    rate: 380,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Living Room', 'Balcony', 'City View']
  },
  {
    id: '303',
    name: 'Executive Suite 303',
    type: 'Suite',
    rate: 380,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Living Room', 'Balcony', 'City View']
  },
  {
    id: '304',
    name: 'Executive Suite 304',
    type: 'Suite',
    rate: 380,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Living Room', 'Balcony', 'City View']
  },
  {
    id: '305',
    name: 'Executive Suite 304',
    type: 'Suite',
    rate: 380,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Living Room', 'Balcony', 'City View']
  },
  {
    id: '306',
    name: 'Executive Suite 304',
    type: 'Suite',
    rate: 380,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Kitchenette', 'Living Room', 'Balcony', 'City View']
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
    status: 'confirmed',
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
    status: 'confirmed',
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
    status: 'confirmed',
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
    status: 'confirmed',
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
    status: 'confirmed',
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
    status: 'confirmed',
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
    status: 'confirmed',
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
    status: 'confirmed',
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
    status: 'confirmed',
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
    status: 'cancelled',
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
    status: 'confirmed',
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
    status: 'confirmed',
    rate: 380,
    guestEmail: 'peter.clark@email.com',
    guestPhone: '+1-555-0999',
    specialRequests: 'Christmas Day check-in, family gathering'
  },
  
  // Extended stay
  {
    id: 'res-016',
    resourceId: '302',
    start: new Date(2025, 6, 12), // Dec 12, 2025 (Thursday)
    end: new Date(2025, 6, 26),   // Dec 26, 2025 (Thursday)
    guestName: 'Michelle Garcia',
    bookingId: 'BK-2025-016',
    status: 'checked-in',
    rate: 380,
    guestEmail: 'michelle.garcia@email.com',
    guestPhone: '+1-555-1010',
    specialRequests: 'Extended business stay, weekly housekeeping'
  },
  
  // New Year reservations
  {
    id: 'res-017',
    resourceId: '201',
    start: new Date(2025, 6, 29), // Dec 29, 2025 (Sunday)
    end: new Date(2025, 0, 2),     // Jan 2, 2025 (Thursday)
    guestName: 'Thomas Anderson',
    bookingId: 'BK-2025-017',
    status: 'confirmed',
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
    status: 'confirmed',
    rate: 250,
    guestEmail: 'nancy.davis@email.com',
    guestPhone: '+1-555-1212',
    specialRequests: 'New Year party package, champagne service'
  }
];
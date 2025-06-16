import { Room, Reservation } from '../types/reservation';
import { addDays, subDays } from 'date-fns';

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
  }
];

const today = new Date();

export const sampleReservations: Reservation[] = [
  {
    id: 'res-001',
    resourceId: '101',
    start: subDays(today, 2),
    end: addDays(today, 1),
    guestName: 'John Smith',
    bookingId: 'BK-001',
    status: 'checked-in',
    rate: 150,
    guestEmail: 'john.smith@email.com',
    guestPhone: '+1-555-0123',
    specialRequests: 'Late checkout requested'
  },
  {
    id: 'res-002',
    resourceId: '102',
    start: addDays(today, 3),
    end: addDays(today, 7),
    guestName: 'Sarah Johnson',
    bookingId: 'BK-002',
    status: 'confirmed',
    rate: 130,
    guestEmail: 'sarah.j@email.com',
    guestPhone: '+1-555-0456'
  },
  {
    id: 'res-003',
    resourceId: '201',
    start: subDays(today, 5),
    end: subDays(today, 1),
    guestName: 'Michael Brown',
    bookingId: 'BK-003',
    status: 'checked-out',
    rate: 250,
    guestEmail: 'mbrown@email.com',
    guestPhone: '+1-555-0789',
    specialRequests: 'Extra pillows, quiet room'
  },
  {
    id: 'res-004',
    resourceId: '202',
    start: addDays(today, 1),
    end: addDays(today, 4),
    guestName: 'Emily Davis',
    bookingId: 'BK-004',
    status: 'confirmed',
    rate: 250,
    guestEmail: 'emily.davis@email.com',
    guestPhone: '+1-555-0321'
  },
  {
    id: 'res-006',
    resourceId: '302',
    start: addDays(today, 2),
    end: addDays(today, 5),
    guestName: 'Lisa Anderson',
    bookingId: 'BK-006',
    status: 'confirmed',
    rate: 380,
    guestEmail: 'lisa.anderson@email.com',
    guestPhone: '+1-555-0987'
  },
  {
    id: 'res-007',
    resourceId: '101',
    start: addDays(today, 8),
    end: addDays(today, 12),
    guestName: 'David Martinez',
    bookingId: 'BK-007',
    status: 'confirmed',
    rate: 150,
    guestEmail: 'david.m@email.com',
    guestPhone: '+1-555-0111'
  },
  {
    id: 'res-008',
    resourceId: '102',
    start: addDays(today, 10),
    end: addDays(today, 14),
    guestName: 'Jennifer Taylor',
    bookingId: 'BK-008',
    status: 'confirmed',
    rate: 130,
    guestEmail: 'jen.taylor@email.com',
    guestPhone: '+1-555-0222'
  },
  {
    id: 'res-009',
    resourceId: '201',
    start: addDays(today, 6),
    end: addDays(today, 9),
    guestName: 'Mark Thompson',
    bookingId: 'BK-009',
    status: 'confirmed',
    rate: 250,
    guestEmail: 'mark.t@email.com',
    guestPhone: '+1-555-0333'
  },
  {
    id: 'res-010',
    resourceId: '202',
    start: addDays(today, 12),
    end: addDays(today, 16),
    guestName: 'Amanda White',
    bookingId: 'BK-010',
    status: 'confirmed',
    rate: 250,
    guestEmail: 'amanda.white@email.com',
    guestPhone: '+1-555-0444'
  },
  {
    id: 'res-012',
    resourceId: '302',
    start: addDays(today, 18),
    end: addDays(today, 22),
    guestName: 'Maria Rodriguez',
    bookingId: 'BK-012',
    status: 'confirmed',
    rate: 380,
    guestEmail: 'maria.r@email.com',
    guestPhone: '+1-555-0666'
  },
  {
    id: 'res-013',
    resourceId: '101',
    start: subDays(today, 10),
    end: subDays(today, 7),
    guestName: 'Chris Lee',
    bookingId: 'BK-013',
    status: 'checked-out',
    rate: 150,
    guestEmail: 'chris.lee@email.com',
    guestPhone: '+1-555-0777'
  },
  {
    id: 'res-014',
    resourceId: '102',
    start: subDays(today, 8),
    end: subDays(today, 4),
    guestName: 'Anna Kim',
    bookingId: 'BK-014',
    status: 'checked-out',
    rate: 130,
    guestEmail: 'anna.kim@email.com',
    guestPhone: '+1-555-0888'
  },
  {
    id: 'res-015',
    resourceId: '201',
    start: addDays(today, 25),
    end: addDays(today, 28),
    guestName: 'Peter Clark',
    bookingId: 'BK-015',
    status: 'cancelled',
    rate: 250,
    guestEmail: 'peter.clark@email.com',
    guestPhone: '+1-555-0999'
  }
];
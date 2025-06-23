export interface Room {
    id: string;
    name: string;
    type: 'Standard' | 'Deluxe' | 'Suite';
    rate: number;
    capacity: number;
    amenities: string[];
    needsHousekeeping: boolean
  }
  
  export interface Reservation {
    id: string;
    resourceId: string;
    guestName: string;
    bookingId: string;
    start: Date;
    end: Date;
    status: 'reserved' | 'checked-in' | 'checked-out' | 'blocked' | 'occupied';
    rate: number;
    specialRequests?: string;
    guestEmail?: string;
    guestPhone?: string;
  }
  
  export interface NewReservation {
    guestName: string;
    bookingId: string;
    checkIn: Date;
    checkOut: Date;
    rate: number;
    specialRequests?: string;
    guestEmail?: string;
    guestPhone?: string;
  }
  
  export interface CalendarEvent extends Reservation {
    left: number;
    width: number;
    top: number;
  }
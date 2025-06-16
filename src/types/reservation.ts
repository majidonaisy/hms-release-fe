export interface Room {
    id: string;
    name: string;
    type: 'Standard' | 'Deluxe' | 'Suite';
    rate: number;
    capacity: number;
    amenities: string[];
  }
  
  export interface Reservation {
    id: string;
    resourceId: string;
    guestName: string;
    bookingId: string;
    start: Date;
    end: Date;
    status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
    rate: number;
    specialRequests?: string;
    guestEmail?: string;
    guestPhone?: string;
  }
  
  export interface NewReservation {
    guestName: string;
    bookingId: string;
    checkIn: string;
    checkOut: string;
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
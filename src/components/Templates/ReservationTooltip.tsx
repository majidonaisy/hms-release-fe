import React from 'react';
import { Reservation, Room } from '@/types/reservation';
import { User, Calendar, DollarSign, Phone, Mail } from 'lucide-react';

interface ReservationTooltipProps {
    reservation: Reservation;
    room: Room;
    position: { x: number; y: number };
}

const ReservationTooltip: React.FC<ReservationTooltipProps> = ({
    reservation,
    room,
    position
}) => {
    const statusColors = {
        confirmed: 'bg-blue-100 text-blue-800',
        'checked-in': 'bg-green-100 text-green-800',
        'checked-out': 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const calculateNights = () => {
        const diffTime = Math.abs(reservation.end.getTime() - reservation.start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const totalAmount = calculateNights() * reservation.rate;

    return (
        <div
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm"
            style={{
                left: position.x + 10,
                top: position.y - 10,
                transform: 'translateY(-100%)'
            }}
        >
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{room.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-500" />
                        <span className="font-medium">{reservation.guestName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-500" />
                        <span>{formatDate(reservation.start)} - {formatDate(reservation.end)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Booking ID:</span>
                        <span className="font-mono text-blue-600">{reservation.bookingId}</span>
                    </div>

                    {reservation.guestEmail && (
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-500" />
                            <span className="text-blue-600">{reservation.guestEmail}</span>
                        </div>
                    )}

                    {reservation.guestPhone && (
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-500" />
                            <span>{reservation.guestPhone}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-gray-500" />
                        <span>${reservation.rate}/night × {calculateNights()} nights = ${totalAmount}</span>
                    </div>

                    {reservation.specialRequests && (
                        <div className="pt-2 border-t border-gray-100">
                            <span className="text-gray-500 text-xs">Special Requests:</span>
                            <p className="text-gray-700 text-xs mt-1">{reservation.specialRequests}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationTooltip;
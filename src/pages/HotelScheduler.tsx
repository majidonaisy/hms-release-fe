import React, { useState, useCallback, useMemo } from 'react';
import {
    format,
    addDays,
    startOfWeek,
    endOfWeek,
    differenceInDays,
    isToday,
} from 'date-fns';
import {
    Search,
    Filter,
    Download,
    Plus,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import { Room, Reservation, NewReservation, CalendarEvent } from '../types/reservation';
import { sampleRooms, sampleReservations } from '../data/data';
import ReservationModal from '../components/Templates/ReservationModal';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/molecules/Select';
import { Card, CardContent } from '../components/Organisms/Card';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../components/atoms/Tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/molecules/AlertDialog';

const CELL_HEIGHT = 60;
const CELL_WIDTH = 120;

const HotelReservationCalendar: React.FC = () => {
    const [rooms] = useState<Room[]>(sampleRooms);
    const [reservations, setReservations] = useState<Reservation[]>(sampleReservations);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();
    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(); const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | undefined>(); const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; reservationId?: string }>({ open: false });
    console.log('reservations', selectedReservation);
    // Get week dates
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDates = Array.from({ length: 10 }, (_, i) => addDays(weekStart, i));

    // Filter reservations
    const filteredReservations = useMemo(() => {
        return reservations.filter(reservation => {
            const matchesSearch = !searchTerm ||
                reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.bookingId.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [reservations, searchTerm, filterStatus]);

    // Convert reservations to positioned events
    const calendarEvents: CalendarEvent[] = useMemo(() => {
        return filteredReservations.map(reservation => {
            const startDate = reservation.start > weekStart ? reservation.start : weekStart;
            const endDate = reservation.end < weekEnd ? reservation.end : weekEnd;

            const startDayIndex = differenceInDays(startDate, weekStart);
            const duration = differenceInDays(endDate, startDate);

            const roomIndex = rooms.findIndex(room => room.id === reservation.resourceId);

            return {
                ...reservation,
                left: startDayIndex * CELL_WIDTH,
                width: Math.max(duration * CELL_WIDTH, CELL_WIDTH),
                top: roomIndex * CELL_HEIGHT
            };
        });
    }, [filteredReservations, rooms, weekStart, weekEnd]);

    const handleCellClick = useCallback((date: Date, room: Room) => {
        setSelectedRoom(room);
        setSelectedDateRange({ start: date, end: addDays(date, 1) });
        setSelectedReservation(undefined);
        setIsModalOpen(true);
    }, []);

    const handleReservationClick = useCallback((reservation: Reservation) => {
        const room = rooms.find(r => r.id === reservation.resourceId);
        if (room) {
            setSelectedReservation(reservation);
            setSelectedRoom(room);
            setSelectedDateRange(undefined);
            setIsModalOpen(true);

        }
    }, [rooms]);

    const handleSaveReservation = useCallback((newReservation: NewReservation) => {
        if (selectedReservation) {
            // Update existing reservation
            setReservations(prev => prev.map(res =>
                res.id === selectedReservation.id
                    ? {
                        ...res,
                        ...newReservation,
                        start: new Date(newReservation.checkIn),
                        end: new Date(newReservation.checkOut)
                    }
                    : res
            ));
        } else if (selectedRoom && selectedDateRange) {
            // Create new reservation
            const newRes: Reservation = {
                id: `res-${Date.now()}`,
                resourceId: selectedRoom.id,
                ...newReservation,
                start: new Date(newReservation.checkIn),
                end: new Date(newReservation.checkOut),
                status: 'confirmed'
            };
            setReservations(prev => [...prev, newRes]);
        }
    }, [selectedReservation, selectedRoom, selectedDateRange]);

    const handleDeleteReservation = useCallback((reservationId: string) => {
        setReservations(prev => prev.filter(res => res.id !== reservationId));
        setDeleteDialog({ open: false });
    }, []);

    const getStatusColor = (status: string) => {
        const colors = {
            confirmed: 'bg-blue-200 border-l-4 border-blue-600',
            'checked-in': 'bg-green-200 border-l-4 border-green-600',
            'checked-out': 'bg-gray-300 border-l-4 border-gray-600',
            cancelled: 'bg-red-300 border-l-4 border-red-600'
        };
        return colors[status as keyof typeof colors] || colors.confirmed;
    };

    return (
        <TooltipProvider>
            <div className="h-screen bg-gray-50 flex flex-col">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Hotel Reservation Calendar</h1>
                        <div className="flex items-center gap-3">
                            <Button onClick={() => {
                                setSelectedRoom(rooms[0]);
                                setSelectedDateRange({ start: new Date(), end: addDays(new Date(), 1) });
                                setSelectedReservation(undefined);
                                setIsModalOpen(true);
                            }}>
                                <Plus size={18} className="mr-2" />
                                New Reservation
                            </Button>
                            <Button variant="outline">
                                <Download size={18} className="mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Statistics */}


                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 flex-1">
                            <Search size={18} className="text-gray-500" />
                            <Input
                                placeholder="Search by guest name or booking ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-gray-500" />
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="checked-in">Checked In</SelectItem>
                                    <SelectItem value="checked-out">Checked Out</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentDate(prev => addDays(prev, -7))}
                            >
                                <ChevronLeft size={18} />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentDate(new Date())}
                            >
                                Today
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentDate(prev => addDays(prev, 7))}
                            >
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-6 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span>Confirmed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span>Checked In</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-500 rounded"></div>
                            <span>Checked Out</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded"></div>
                            <span>Cancelled</span>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className="flex-1 p-4">
                    <Card className="h-fit pb-0">
                        <CardContent className="p-0 h-full">
                            <div className="flex h-full">
                                {/* Room Column */}
                                <div className="w-[200px] border-r border-gray-200 ">
                                    <div className="h-12 border-b border-gray-200 flex items-center px-4 font-semibold">
                                        Rooms
                                    </div>
                                    {rooms.map((room) => (
                                        <div
                                            key={room.id}
                                            className={`h-[60px] border-b border-gray-200 p-3`}
                                        >
                                            <div className="font-semibold text-sm">{room.name}</div>
                                            {/* <div className="text-xs text-gray-600">{room.type}</div>
                                            <div className="text-xs text-green-600 font-medium">${room.rate}/night</div> */}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="flex-1 overflow-hidden">
                                    <div
                                        className="relative"
                                    >
                                        {/* Date Headers */}
                                        <div className="flex h-12 border-b border-gray-200 bg-white sticky top-0 z-10">
                                            {weekDates.map((date) => (
                                                <div
                                                    key={date.toISOString()}
                                                    className={`w-[14rem] border-r border-gray-200 flex flex-col items-center justify-center text-sm ${isToday(date) ? 'bg-blue-50 text-blue-700 font-semibold' : ''
                                                        }`}
                                                >
                                                    <div>{format(date, 'EEE')}</div>
                                                    <div>{format(date, 'MMM d')}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Grid Cells */}
                                        <div className="relative">
                                            {rooms.map((room) => (
                                                <div key={room.id} className="flex h-[60px] border-b border-gray-200">
                                                    {weekDates.map((date) => (<div
                                                        key={`${room.id}-${date.toISOString()}`}
                                                        className="w-full border-r border-gray-200 hover:bg-blue-50 cursor-pointer relative"
                                                        onClick={() => handleCellClick(date, room)}
                                                    >
                                                        {isToday(date) && (
                                                            <div className="absolute inset-0 bg-blue-100 opacity-30 pointer-events-none" />
                                                        )}
                                                    </div>
                                                    ))}
                                                </div>
                                            ))}

                                            {/* Reservations */}
                                            {calendarEvents.map((event) => (
                                                <Tooltip key={event.id}>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className={`absolute rounded px-2 py-1 text-slate-700 text-xs font-medium cursor-pointer transition-all hover:shadow-lg ${getStatusColor(event.status)}`}
                                                            style={{
                                                                left: event.left,
                                                                top: event.top + 4,
                                                                width: event.width - 4,
                                                                height: CELL_HEIGHT - 8,
                                                                zIndex: 20
                                                            }} onClick={() => handleReservationClick(event)}
                                                        >
                                                            <div className="truncate font-medium">{event.guestName}</div>
                                                            <div className="truncate text-xs opacity-90">{event.bookingId}</div>

                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="space-y-1">
                                                            <div className="font-medium">{event.guestName}</div>
                                                            <div className="text-sm">
                                                                {format(event.start, 'MMM d')} - {format(event.end, 'MMM d')}
                                                            </div>
                                                            <div className="text-sm">${event.rate}/night</div>
                                                            {event.specialRequests && (
                                                                <div className="text-sm text-gray-600">{event.specialRequests}</div>
                                                            )}
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Modals */}
                {selectedRoom && (
                    <ReservationModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveReservation}
                        reservation={selectedReservation}
                        room={selectedRoom}
                        selectedDateRange={selectedDateRange}
                    />
                )}

                <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Reservation</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this reservation? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteDialog.reservationId && handleDeleteReservation(deleteDialog.reservationId)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </TooltipProvider>
    );
};

export default HotelReservationCalendar;
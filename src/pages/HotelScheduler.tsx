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

import { Room, Reservation, NewReservation } from '../types/reservation';
import { sampleRooms, sampleReservations } from '../data/data';
import ReservationModal from '../components/Templates/ReservationModal';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/molecules/Select';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../components/atoms/Tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/molecules/AlertDialog';
import { ScrollArea } from '@/components/atoms/ScrollArea';

const HotelReservationCalendar: React.FC = () => {
    const [rooms] = useState<Room[]>(sampleRooms);
    const [reservations, setReservations] = useState<Reservation[]>(sampleReservations);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();
    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
    const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | undefined>();
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; reservationId?: string }>({ open: false });

    // Get week dates
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDates = Array.from({ length: 10 }, (_, i) => addDays(weekStart, i));

    // Filter reservations
    const filteredReservations = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        return reservations.filter(reservation => {
            // Existing filters
            const matchesSearch = !searchTerm ||
                reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.bookingId.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;

            // Date range filtering
            const overlapsWithWeek = reservation.start <= weekEnd && reservation.end >= weekStart;

            // Optional: Hide past reservations (uncomment if needed)
            // const isNotPast = reservation.end >= today;

            return matchesSearch && matchesStatus && overlapsWithWeek; // && isNotPast;
        });
    }, [reservations, searchTerm, filterStatus, weekStart, weekEnd]);

    // Convert reservations to grid-positioned events
    const gridEvents = useMemo(() => {
        return filteredReservations.map(reservation => {
            const startDate = reservation.start > weekStart ? reservation.start : weekStart;
            const endDate = reservation.end < weekEnd ? reservation.end : weekEnd;

            const startDayIndex = differenceInDays(startDate, weekStart);
            const duration = Math.max(differenceInDays(endDate, startDate), 1);
            const roomIndex = rooms.findIndex(room => room.id === reservation.resourceId);

            return {
                ...reservation,
                gridColumnStart: startDayIndex + 2, // +2 because first column is room names
                gridColumnEnd: startDayIndex + duration + 2,
                gridRowStart: roomIndex + 2, // +2 because first row is header
                gridRowEnd: roomIndex + 3,
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
            confirmed: 'bg-blue-100 border-l-4 border-blue-500 text-blue-800',
            'checked-in': 'bg-green-100 border-l-4 border-green-500 text-green-800',
            'checked-out': 'bg-gray-100 border-l-4 border-gray-500 text-gray-800',
            cancelled: 'bg-red-100 border-l-4 border-red-500 text-red-800'
        };
        return colors[status as keyof typeof colors] || colors.confirmed;
    };

    return (
        <TooltipProvider>
            <div className=" bg-gray-50 flex flex-col">
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
                    <div className="flex items-center gap-6 mt-4 text-sm ">
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

                {/* Calendar Grid */}
                <div className="flex-1 overflow-hidden ">
                    <ScrollArea className="h-[34rem]">
                        {/* Single Grid Container */}
                        <div
                            className="grid border-collapse"
                            style={{
                                gridTemplateColumns: `130px repeat(${weekDates.length}, minmax(145px, 5fr))`,
                                gridTemplateRows: `60px repeat(${rooms.length}, 80px)`
                            }}
                        >
                            {/* Header - Room Column */}
                            <div
                                className="border-r border-b border-gray-300 p-4 font-semibold bg-gray-100 sticky top-0 z-30"
                                style={{ gridColumn: 1, gridRow: 1 }}
                            >
                                Rooms
                            </div>

                            {/* Header - Date Columns */}
                            {weekDates.map((date, index) => (
                                <div
                                    key={`header-${date.toISOString()}`}
                                    className={`border-r border-b border-gray-300 p-4 text-center text-sm sticky top-0 z-50 ${isToday(date) ? 'bg-blue-50 text-blue-700 font-semibold' : 'bg-gray-100'
                                        }`}
                                    style={{ gridColumn: index + 2, gridRow: 1 }}
                                >
                                    <div className="font-medium">{format(date, 'EEE')}</div>
                                    <div>{format(date, 'MMM d')}</div>
                                </div>
                            ))}

                            {/* Room Labels */}
                            {rooms.map((room, roomIndex) => (
                                <div
                                    key={`room-${room.id}`}
                                    className="border-r border-b border-gray-200 p-3 bg-gray-50 flex items-center sticky left-0 z-10"
                                    style={{
                                        gridColumn: 1,
                                        gridRow: roomIndex + 2
                                    }}
                                >
                                    <div className="font-semibold text-sm">{room.name}</div>
                                </div>
                            ))}

                            {/* Calendar Cells */}
                            {rooms.map((room, roomIndex) =>
                                weekDates.map((date, dateIndex) => (
                                    <div
                                        key={`cell-${room.id}-${date.toISOString()}`}
                                        className={`border-r border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors ${isToday(date) ? 'bg-blue-50' : 'bg-white'
                                            }`}
                                        style={{
                                            gridColumn: dateIndex + 2,
                                            gridRow: roomIndex + 2
                                        }}
                                        onClick={() => handleCellClick(date, room)}
                                    />
                                ))
                            )}

                            {/* Events */}
                            {gridEvents.map((event) => (
                                <Tooltip key={event.id}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={`rounded m-1 px-2 py-1 text-xs font-medium cursor-pointer transition-all hover:shadow-lg hover:scale-101 z-30 ${getStatusColor(event.status)}
                                            `}
                                            style={{
                                                gridColumnStart: event.gridColumnStart,
                                                gridColumnEnd: event.gridColumnEnd,
                                                gridRowStart: event.gridRowStart,
                                                gridRowEnd: event.gridRowEnd
                                            }}
                                            onClick={() => handleReservationClick(event)}
                                        >
                                            <div className="truncate font-medium">{event.guestName}</div>
                                            <div className="truncate text-xs opacity-75">{event.bookingId}</div>
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
                    </ScrollArea>
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
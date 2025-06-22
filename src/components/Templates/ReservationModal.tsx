import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, DollarSign, MessageSquare, CalendarIcon } from 'lucide-react';
import { Reservation, NewReservation, Room } from '../../types/reservation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { Card, CardContent } from '@/components/Organisms/Card';
import { format } from 'date-fns';
import { ScrollArea } from '../atoms/ScrollArea';
import { Popover, PopoverContent, PopoverTrigger } from '../molecules/Popover';
import { Calendar as CalendarComponent } from '../molecules/Calendar';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (reservation: NewReservation) => void;
    reservation?: Reservation;
    room: Room;
    selectedDateRange?: { start: Date; end: Date };
}

const ReservationModal: React.FC<ReservationModalProps> = ({
    isOpen,
    onClose,
    onSave,
    reservation,
    room,
    selectedDateRange
}) => {
    const [formData, setFormData] = useState<NewReservation>({
        guestName: '',
        bookingId: '',
        checkIn: new Date(),
        checkOut: new Date(),
        rate: room.rate,
        specialRequests: '',
        guestEmail: '',
        guestPhone: ''
    });

    useEffect(() => {
        if (reservation) {
            setFormData({
                guestName: reservation.guestName,
                bookingId: reservation.bookingId,
                checkIn: reservation.start,
                checkOut: reservation.end,
                rate: reservation.rate,
                specialRequests: reservation.specialRequests || '',
                guestEmail: reservation.guestEmail || '',
                guestPhone: reservation.guestPhone || ''
            });
        } else if (selectedDateRange) {
            setFormData({
                guestName: '',
                bookingId: `BK-${Date.now().toString().slice(-6)}`,
                checkIn: selectedDateRange.start,
                checkOut: selectedDateRange.end,
                rate: room.rate,
                specialRequests: '',
                guestEmail: '',
                guestPhone: ''
            });
        }
    }, [reservation, selectedDateRange, room.rate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <ScrollArea className="h-[30rem] px-5">
                    <DialogHeader>
                        <DialogTitle className='mb-4'>
                            {reservation ? 'Edit Reservation' : 'New Reservation'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-medium text-blue-900">{room.name}</h3>
                                <p className="text-sm text-blue-700">{room.type} - ${room.rate}/night</p>
                            </CardContent>
                        </Card>                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="checkIn" className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    Check-in Date
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!formData.checkIn}
                                            className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon />
                                            {formData.checkIn ? format(formData.checkIn, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            mode="single"
                                            selected={formData.checkIn}
                                            onSelect={(date) => date && setFormData({ ...formData, checkIn: date })}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="checkOut" className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    Check-out Date
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!formData.checkOut}
                                            className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon />
                                            {formData.checkOut ? format(formData.checkOut, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            mode="single"
                                            selected={formData.checkOut}
                                            onSelect={(date) => date && setFormData({ ...formData, checkOut: date })}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="guestName" className="flex items-center gap-1">
                                <User size={16} />
                                Guest Name
                            </Label>
                            <Input
                                id="guestName"
                                name="guestName"
                                value={formData.guestName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bookingId">Booking ID</Label>
                            <Input
                                id="bookingId"
                                name="bookingId"
                                value={formData.bookingId}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="guestEmail" className="flex items-center gap-1">
                                    <Mail size={16} />
                                    Email
                                </Label>
                                <Input
                                    id="guestEmail"
                                    name="guestEmail"
                                    type="email"
                                    value={formData.guestEmail}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="guestPhone" className="flex items-center gap-1">
                                    <Phone size={16} />
                                    Phone
                                </Label>
                                <Input
                                    id="guestPhone"
                                    name="guestPhone"
                                    type="tel"
                                    value={formData.guestPhone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rate" className="flex items-center gap-1">
                                <DollarSign size={16} />
                                Rate per Night
                            </Label>
                            <Input
                                id="rate"
                                name="rate"
                                type="number"
                                value={formData.rate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialRequests" className="flex items-center gap-1">
                                <MessageSquare size={16} />
                                Special Requests
                            </Label>
                            <Textarea
                                id="specialRequests"
                                name="specialRequests"
                                value={formData.specialRequests}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Any special requests or notes..."
                            />
                        </div>

                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {reservation ? 'Update' : 'Create'} Reservation
                            </Button>
                        </DialogFooter>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ReservationModal;
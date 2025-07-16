import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../Organisms/Dialog"
import { Button } from "../atoms/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../molecules/Select"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { UIReservation } from "../../pages/HotelScheduler"
import { UpdateReservationRequest } from "@/validation/schemas/Reservations"
import { updateReservation } from "@/services/Reservation"
import { getRatePlans } from "@/services/RatePlans"
import { getRooms } from "@/services/Rooms"
import { Popover, PopoverContent, PopoverTrigger } from "../molecules/Popover"
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from "../molecules/Calendar"
import { toast } from "sonner"
import { Label } from "../atoms/Label"
import { ScrollArea } from "../atoms/ScrollArea"
import { GetRatePlansResponse } from "@/validation"

interface EditReservationDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservationData?: UIReservation | null;
    onSave?: (updatedReservation: UIReservation) => void;
    onRefresh?: () => void;
}

const EditReservationDialog = ({
    open,
    setOpen,
    reservationData,
    onSave,
    onRefresh
}: EditReservationDialogProps) => {
    const [formData, setFormData] = useState({
        checkIn: new Date(),
        checkOut: new Date(),
        ratePlanId: '',
        roomIds: [] as string[]
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ratePlans, setRatePlans] = useState<GetRatePlansResponse['data']>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!open) return;

            setIsLoadingData(true);
            try {
                const [ratePlansResponse, roomsResponse] = await Promise.all([
                    getRatePlans(),
                    getRooms()
                ]);

                setRatePlans(ratePlansResponse.data);
                setRooms(roomsResponse.data);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load rate plans and rooms');
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [open]);

    useEffect(() => {
        if (reservationData && open) {
            const initialRoomIds = [reservationData.resourceId];
            setFormData({
                checkIn: reservationData.start,
                checkOut: reservationData.end,
                ratePlanId: reservationData.ratePlanId || '',
                roomIds: initialRoomIds
            });
            setSelectedRooms(initialRoomIds);
            setError(null);
        }
    }, [reservationData, open]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRoomToggle = (roomId: string) => {
        setSelectedRooms(prev => {
            const newSelected = prev.includes(roomId)
                ? prev.filter(id => id !== roomId)
                : [...prev, roomId];

            setFormData(prevForm => ({
                ...prevForm,
                roomIds: newSelected
            }));

            return newSelected;
        });
    };

    const handleSave = async () => {
        if (!reservationData || selectedRooms.length === 0) {
            setError('Please select at least one room');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const updateData: UpdateReservationRequest = {
                checkIn: new Date(formData.checkIn),
                checkOut: new Date(formData.checkOut),
                roomIds: selectedRooms,
                ratePlanId: formData.ratePlanId
            };

            await updateReservation(reservationData.id, updateData);

            if (onSave) {
                const updatedReservation: UIReservation = {
                    ...reservationData,
                    start: new Date(formData.checkIn),
                    end: new Date(formData.checkOut),
                    ratePlanId: formData.ratePlanId
                };
                onSave(updatedReservation);
            }

            if (onRefresh) {
                onRefresh();
            }
            toast("Success!", {
                description: "Reservation was updated successfully.",
            });
            setOpen(false);
        } catch (error: any) {
            setError(error.userMessage || 'Failed to update reservation');
            toast("Error!", {
                description: "Could not update reservation.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setError(null);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Reservation</DialogTitle>
                </DialogHeader>

                return (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Reservation</DialogTitle>
                        </DialogHeader>

                        {isLoadingData ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-sm text-gray-600">Loading...</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                        {error}
                                    </div>
                                )}

                                {/* Display read-only reservation info */}
                                <div className="bg-gray-50 p-3 rounded">
                                    <h4 className="font-medium text-gray-900 mb-2">Reservation Details</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><span className="font-medium">Guest:</span> {reservationData?.guestName}</p>
                                        <p><span className="font-medium">Current Room:</span> {reservationData?.roomNumber}</p>
                                        <p><span className="font-medium">Status:</span> {reservationData?.status}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Check-in Date
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    data-empty={!formData.checkIn}
                                                    className="data-[empty=true]:text-muted-foreground w-40 h-8 justify-start text-left font-normal text-sm"
                                                >
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {formData.checkIn ? format(formData.checkIn, "dd/MM/yyyy") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.checkIn}
                                                    onSelect={(date) => date && setFormData({ ...formData, checkIn: date })}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Check-out Date
                                        </label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    data-empty={!formData.checkOut}
                                                    className="data-[empty=true]:text-muted-foreground w-40 h-8 justify-start text-left font-normal text-sm"
                                                >
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {formData.checkOut ? format(formData.checkOut, "dd/MM/yyyy") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.checkOut}
                                                    onSelect={(date) => date && setFormData({ ...formData, checkOut: date })}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rate Plan
                                    </label>
                                    <Select
                                        value={formData.ratePlanId}
                                        onValueChange={(value) => handleInputChange('ratePlanId', value)}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select rate plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ratePlans.map((plan) => (
                                                <SelectItem key={plan.id} value={plan.id}>
                                                    {plan.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Rooms
                                    </Label>
                                    <div className="border rounded-lg p-3">
                                        <ScrollArea className="h-[10rem]">
                                            {rooms.map((room) => (
                                                <div key={room.id} className="flex items-center space-x-2 py-1">
                                                    <input
                                                        type="checkbox"
                                                        id={`room-${room.id}`}
                                                        checked={selectedRooms.includes(room.id)}
                                                        onChange={() => handleRoomToggle(room.id)}
                                                        disabled={isLoading}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor={`room-${room.id}`} className="text-sm flex-1 cursor-pointer">
                                                        <span className="font-medium">Room {room.roomNumber}</span>
                                                        <span className="text-gray-500 ml-2">
                                                            ({room.roomType?.name}) - Floor {room.floor}
                                                        </span>
                                                        <span className={`ml-2 px-2 py-1 rounded text-xs ${room.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                                            room.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {room.status}
                                                        </span>
                                                    </label>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {selectedRooms.length} room(s) selected
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSave} disabled={isLoading || selectedRooms.length === 0}>
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
                )
            </DialogContent>
        </Dialog>
    )
}

export default EditReservationDialog
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { ChevronLeft, X, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GetGuestsResponse, GetRoomsResponse } from '@/validation';
import { getGuests } from '@/services/Guests';
import { toast } from 'sonner';
import { AddReservationRequest } from '@/validation/schemas/Reservations';
import { addReservation } from '@/services/Reservation';
import { getRooms, getRoomById } from '@/services/Rooms';
import { getRatePlans } from '@/services/RatePlans';
import { GetRatePlansResponse } from '@/validation/schemas/RatePlan';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/molecules/Popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/molecules/Calendar';

const NewReservation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<AddReservationRequest>({
        checkIn: new Date(),
        checkOut: new Date(),
        guestId: '',
        ratePlanId: '',
        roomIds: [],
    });
    const [rooms, setRooms] = useState<GetRoomsResponse['data']>([]);
    const [guests, setGuests] = useState<GetGuestsResponse['data']>([]);
    const [isEditMode, _setIsEditMode] = useState(false);
    const [ratePlans, setRatePlans] = useState<GetRatePlansResponse['data']>([]);
    const [connectableRooms, setConnectableRooms] = useState<GetRoomsResponse['data']>([]);
    const [selectedRoomType, setSelectedRoomType] = useState<string>("");

    const handleInputChange = (field: keyof AddReservationRequest, value: string | string[]) => {
        setFormData(prev => {
            const updatedFormData = {
                ...prev,
                [field]: value
            };
            return updatedFormData;
        });
    };

    const handleRoomSelection = async (roomId: string) => {
        if (!formData.roomIds?.includes(roomId)) {
            const updatedRoomIds = [...(formData.roomIds || []), roomId];
            handleInputChange('roomIds', updatedRoomIds);

            // If this is the first room selected, get its connectable rooms
            if (formData.roomIds?.length === 0) {
                try {
                    const roomResponse = await getRoomById(roomId);
                    // The service returns { data: apiResponse }, and apiResponse has { status, data }
                    const actualRoomData = roomResponse.data.data;
                    const connectedRooms = actualRoomData.connectedRooms || [];
                    console.log('Full room response:', roomResponse);
                    console.log('Actual room data:', actualRoomData);
                    console.log('Connected rooms:', connectedRooms);
                    setConnectableRooms(connectedRooms);
                } catch (error) {
                    console.error('Failed to get room details:', error);
                    toast("Error!", {
                        description: "Failed to get room connection details.",
                    });
                }
            }
        }
    };

    const handleRoomRemoval = (roomIdToRemove: string) => {
        const updatedRoomIds = formData.roomIds?.filter(id => id !== roomIdToRemove) || [];
        handleInputChange('roomIds', updatedRoomIds);

        // If no rooms are left, reset connectable rooms to show all rooms
        if (updatedRoomIds.length === 0) {
            setConnectableRooms([]);
        }
    };

    const getAvailableRooms = () => {
        // If no rooms are selected, filter by selected room type
        if (!formData.roomIds || formData.roomIds.length === 0) {
            return rooms.filter(room =>
                (!selectedRoomType || room.roomType?.id === selectedRoomType) &&
                !formData.roomIds?.includes(room.id)
            );
        }

        // If rooms are selected, show only connectable rooms that aren't already selected
        // Get the full room details from the rooms array using the connected room IDs
        const connectableRoomIds = connectableRooms.map(connectedRoom => connectedRoom.id);
        return rooms.filter(room =>
            connectableRoomIds.includes(room.id) &&
            !formData.roomIds?.includes(room.id)
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addReservation(formData);
            toast("Success!", {
                description: "Reservation was created successfully.",
            })
            navigate('/guests-profile');
        } catch (error) {
            toast("Error!", {
                description: "Failed to submit form.",
            })
            console.error("Failed to submit form:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleGetRooms = async () => {
            try {
                const rooms = await getRooms();
                setRooms(rooms.data);
            } catch (error) {
                console.error(error);
            }
        };

        const handleGetGuests = async () => {
            try {
                const guests = await getGuests();
                setGuests(guests.data);
            } catch (error) {
                console.error(error);
            }
        };

        const handleGetRatePlans = async () => {
            try {
                const ratePlans = await getRatePlans();
                setRatePlans(ratePlans.data);
            } catch (error) {
                console.error(error);
            }
        };

        handleGetRooms();
        handleGetGuests();
        handleGetRatePlans();
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const availableRooms = getAvailableRooms();

    return (
        <div className="p-5">
            <div className="flex items-center gap-3 mb-5">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="p-0"
                >
                    <ChevronLeft className="" />
                </Button>
                <h1 className="text-xl font-bold">{isEditMode ? 'Edit Reservation' : 'New Reservation'}</h1>
            </div>
            <form
                onSubmit={(e) => {
                    handleSubmit(e);
                }}
                className='px-7'
            >
                <div className='space-y-5'>
                    <div className='space-y-1'>
                        <Label>Guest</Label>
                        <Select
                            value={formData.guestId}
                            onValueChange={(value) => handleInputChange('guestId', value)}
                        >
                            <SelectTrigger className='w-full border border-slate-300'>
                                <SelectValue placeholder="Select Guest" />
                            </SelectTrigger>
                            <SelectContent>
                                {guests.map((guest) => (
                                    <SelectItem key={guest.id} value={guest.id}>
                                        {guest.firstName} {guest.lastName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <h2 className='text-lg font-bold'>Room Assignment</h2>

                    <div className='space-y-1'>
                        <Label>Room Type</Label>
                        <Select
                            value={selectedRoomType}
                            onValueChange={(value) => setSelectedRoomType(value)}
                        >
                            <SelectTrigger className='w-full border border-slate-300'>
                                <SelectValue placeholder="Select Room Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Get unique room types from rooms array */}
                                {Array.from(new Map(rooms.map(room => [room.roomType?.id, room.roomType])).values())
                                    .filter(rt => rt && rt.id)
                                    .map(rt => (
                                        <SelectItem key={rt.id} value={rt.id}>
                                            {rt.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-1'>
                        <Label>Room</Label>
                        <div className="relative">
                            <Select
                                value=""
                                onValueChange={handleRoomSelection}
                            >
                                <SelectTrigger className={`border border-slate-300 w-full`}>
                                    <SelectValue placeholder={
                                        formData.roomIds?.length === 0
                                            ? "Select a room..."
                                            : "Select connecting rooms..."
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableRooms.map(room => (
                                        <SelectItem key={room.id} value={room.id}>
                                            {room.roomNumber} - {room.roomType?.name || 'Unknown Type'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Display selected rooms */}
                        {formData.roomIds && formData.roomIds.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm text-slate-600">Selected Rooms:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.roomIds.map(roomId => {
                                        const room = rooms.find(r => r.id === roomId) ||
                                            connectableRooms.find(r => r.id === roomId);
                                        return room ? (
                                            <div key={roomId} className="flex items-center bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
                                                <span>{room.roomNumber} - {room.roomType?.name || 'Unknown Type'}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRoomRemoval(roomId)}
                                                    className="ml-2 text-slate-500 hover:text-red-500"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <h2 className='text-lg font-bold'>Stay Information</h2>

                    <div className='space-y-1'>
                        <Label>Check In</Label>
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

                    <div className='space-y-1'>
                        <Label>Check Out</Label>
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

                    <h2 className='text-lg font-bold'>Extra Information & Services</h2>

                    <div className='space-y-1'>
                        <Label>Rate Plan</Label>
                        <Select
                            value={formData.ratePlanId}
                            onValueChange={(value) => handleInputChange('ratePlanId', value)}
                        >
                            <SelectTrigger className='w-full border border-slate-300'>
                                <SelectValue placeholder="Select Rate Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                {ratePlans.map((ratePlan) => (
                                    <SelectItem key={ratePlan.id} value={ratePlan.id}>
                                        {ratePlan.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-center gap-3 pt-6 col-span-2">
                    <Button
                        type="button"
                        variant='background'
                        className='px-8'
                    >
                        Save Draft
                    </Button>
                    <Button
                        type="submit"
                        variant="foreground"
                        className="px-8"
                        disabled={loading}
                    >
                        {loading
                            ? isEditMode
                                ? "Updating..."
                                : "Creating..."
                            : isEditMode
                                ? "Update Reservation"
                                : "Create Reservation"}
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default NewReservation;
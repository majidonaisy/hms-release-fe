import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GetGuestsResponse, GetRoomsResponse } from '@/validation';
import { getGuests } from '@/services/Guests';
import { toast } from 'sonner';
import { AddReservationRequest } from '@/validation/schemas/Reservations';
import { addReservation } from '@/services/Reservation';
import { getRooms } from '@/services/Rooms';
import { Textarea } from '@/components/atoms/Textarea';
import { getRatePlans } from '@/services/RatePlans';
import { GetRatePlansResponse } from '@/validation/schemas/RatePlan';

const NewReservation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<AddReservationRequest>({
        checkInDate: new Date(),
        checkOutDate: new Date(),
        guestId: '',
        numberOfGuests: 0,
        ratePlanId: '',
        roomId: '',
        specialRequests: ''
    });
    const [rooms, setRooms] = useState<GetRoomsResponse['data']>([]);
    const [guests, setGuests] = useState<GetGuestsResponse['data']>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [ratePlans, setRatePlans] = useState<GetRatePlansResponse['data']>([]);

    const handleInputChange = (field: keyof AddReservationRequest, value: string) => {
        setFormData(prev => {
            const updatedFormData = {
                ...prev,
                [field]: value
            };
            return updatedFormData;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            // if (isEditMode) {
            //     if (id) {
            //         await updateGuest(id, formData);
            //         toast("Success!", {
            //             description: "Guest was updated successfully.",
            //         })

            //     } else {
            //         console.error("Guest ID is undefined.");
            //     }
            // } else {
            await addReservation(formData);
            toast("Success!", {
                description: "Reservation was created successfully.",
            })
            // }
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

                    <div className='space-y-1'>
                        <Label>Room</Label>
                        <Select
                            value={formData.roomId}
                            onValueChange={(value) => handleInputChange('roomId', value)}
                        >
                            <SelectTrigger className='w-full border border-slate-300'>
                                <SelectValue placeholder="Select Room" />
                            </SelectTrigger>
                            <SelectContent>
                                {rooms.map((room) => (
                                    <SelectItem key={room.id} value={room.id}>
                                        {room.roomType.name} {room.roomNumber}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <h2 className='text-lg font-bold'>Stay Information</h2>

                    <div className='space-y-1'>
                        <Label>Check In</Label>
                        <Input
                            className='border border-slate-300'
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Check Out</Label>
                        <Input
                            className='border border-slate-300'
                        />
                    </div>

                    <div>
                        <Label>Number of Guests</Label>
                        <Input
                            className='border border-r-slate-300'
                            type='number'
                            value={formData.numberOfGuests}
                            onChange={(e) => handleInputChange('numberOfGuests', e.target.value)}
                        />
                    </div>

                    <h2 className='text-lg font-bold'>Extra Information & Services</h2>

                    <div className='space-y-1'>
                        <Label>Special Requests</Label>
                        <Textarea
                            className='border border-slate-300'
                            value={formData.specialRequests}
                            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        />
                    </div>

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
                        className='text-white px-8'
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
            </form>
        </div>
    );
};

export default NewReservation;
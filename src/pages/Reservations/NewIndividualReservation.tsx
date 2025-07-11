import { Popover, PopoverContent, PopoverTrigger } from "@/components/molecules/Popover"
import { useEffect, useState } from "react"
import { Calendar as CalendarComponent } from "@/components/molecules/Calendar"
import { Button } from "@/components/atoms/Button"
import { Label } from "@/components/atoms/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/Select"
import { CalendarIcon, Check, X } from "lucide-react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { AddReservationRequest } from "@/validation/schemas/Reservations"
import { GetGuestsResponse, GetRatePlansResponse, GetRoomsResponse } from "@/validation"
import { getRoomById, getRooms } from "@/services/Rooms"
import { toast } from "sonner"
import { getGuests } from "@/services/Guests"
import { getRatePlans } from "@/services/RatePlans"
import { addReservation } from "@/services/Reservation"

export default function NewIndividualReservation() {
    const [currentStep, setCurrentStep] = useState(1)

    const steps = [
        { number: 1, title: "Guest", completed: currentStep > 1 },
        { number: 2, title: "Stay info", completed: currentStep > 2 },
        { number: 3, title: "Room Assignment", completed: currentStep > 3 },
        // { number: 4, title: "Special Requests", completed: currentStep > 4 },
    ]

    const handleNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

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

            if (formData.roomIds?.length === 0) {
                try {
                    const roomResponse = await getRoomById(roomId);
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

        if (updatedRoomIds.length === 0) {
            setConnectableRooms([]);
        }
    };

    const getAvailableRooms = () => {
        if (!formData.roomIds || formData.roomIds.length === 0) {
            return rooms.filter(room =>
                (!selectedRoomType || room.roomType?.id === selectedRoomType) &&
                !formData.roomIds?.includes(room.id)
            );
        }

        const connectableRoomIds = connectableRooms.map(connectedRoom => connectedRoom.id);
        return rooms.filter(room =>
            connectableRoomIds.includes(room.id) &&
            !formData.roomIds?.includes(room.id)
        );
    };

    const handleSubmit = async () => {
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

    const availableRooms = getAvailableRooms();

    const renderStepContent = (stepNumber: number) => {
        if (currentStep !== stepNumber) return null

        switch (stepNumber) {
            case 1:
                return (
                    <div className="">
                        <div className="space-y-4">
                            <div className="bg-hms-accent/15 p-5 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <Label>Guest Name</Label>
                                    <Button variant='background' className="h-7" onClick={() => navigate('/guests-profile/new')}>New Guest Profile</Button>
                                </div>
                                <Select
                                    value={formData.guestId}
                                    onValueChange={(value) => handleInputChange('guestId', value)}
                                >
                                    <SelectTrigger className='w-full border border-slate-300 bg-white'>
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
                                <div className="flex justify-center pt-4">
                                    <Button
                                        onClick={handleNextStep}
                                        className="h-7 px-8"
                                        disabled={!formData.guestId}
                                    >
                                        Next Step
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="bg-hms-accent/15 p-5 rounded-lg space-y-2">
                        <div className="space-y-1">
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
                        <div className="space-y-1">
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
                        <div className="space-y-1">
                            <Label>Rate Plan</Label>
                            <Select
                                value={formData.ratePlanId}
                                onValueChange={(value) => handleInputChange('ratePlanId', value)}
                            >
                                <SelectTrigger className='w-full border border-slate-300 bg-white'>
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
                        <div className="flex justify-center gap-3 pt-4">
                            <Button
                                variant="background"
                                onClick={handlePreviousStep}
                                className="px-8 h-7"
                            >
                                Previous Step
                            </Button>
                            <Button
                                onClick={handleNextStep}
                                className="h-7 px-8"
                                disabled={!formData.checkIn || !formData.checkOut || !formData.ratePlanId}
                                variant="foreground"
                            >
                                Next Step
                            </Button>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="bg-hms-accent/15 p-5 rounded-lg space-y-2">
                        <div className='space-y-1'>
                            <Label>Room Type</Label>
                            <Select
                                value={selectedRoomType}
                                onValueChange={(value) => setSelectedRoomType(value)}
                            >
                                <SelectTrigger className='w-full border border-slate-300 bg-white'>
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
                                    <SelectTrigger className={`border border-slate-300 w-full bg-white`}>
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
                        <div className="flex justify-center gap-3 pt-4">
                            <Button
                                variant="background"
                                onClick={handlePreviousStep}
                                className="h-7 px-8"
                            >
                                Previous Step
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="h-7 px-8"
                                disabled={formData.roomIds.length === 0 || loading}
                            >
                                {loading ? 'Creating...' : 'Create Reservation'}
                            </Button>
                        </div>
                    </div>
                )

            // case 4:
            //     return (
            //         <div className="bg-hms-accent/15 p-5 rounded-lg space-y-2">
            //             <div className="space-y-4">
            //                 <div>
            //                     <Label className="text-base font-medium">Requests</Label>
            //                     <Textarea
            //                         placeholder="Describe the room and any key features guests should know about."
            //                         className="mt-2 min-h-[120px]"
            //                         value={reservationData.specialRequests}
            //                         onChange={(e) => setReservationData({ ...reservationData, specialRequests: e.target.value })}
            //                     />
            //                 </div>
            //                 <div className="flex justify-center gap-3 pt-4">
            //                     <Button
            //                         variant="outline"
            //                         onClick={handlePreviousStep}
            //                         className="bg-amber-200 hover:bg-amber-300 border-amber-300 px-8"
            //                     >
            //                         Previous Step
            //                     </Button>
            //                     <Button onClick={handleCreateReservation} className="bg-red-800 hover:bg-red-900 px-8">
            //                         Create reservation
            //                     </Button>
            //                 </div>
            //             </div>
            //         </div>
            //     )

            default:
                return null
        }
    }

    return (
        <div className="p-5">
            <h1 className="text-2xl font-semibold mb-8">New Reservation</h1>

            <div className="space-y-2">
                {steps.map((step, index) => (
                    <div key={step.number}>
                        {/* Step header */}
                        <div className="flex items-center">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium mr-4 ${step.completed
                                    ? "bg-white text-gray-300 border-2 border-gray-300"
                                    : currentStep === step.number
                                        ? "bg-hms-primary text-white"
                                        : "bg-gray-300 text-gray-600"
                                    }`}
                            >
                                {step.completed ? <Check className="size-5" /> : step.number}
                            </div>
                            <span
                                className={`font-medium ${currentStep === step.number ? "text-black" : "text-gray-600"
                                    }`}
                            >
                                {step.title}
                            </span>
                        </div>

                        <div className="flex">
                            {index < steps.length - 1 && (
                                <div className="w-8 ml-0.5 flex justify-center">
                                    <div className={`w-px bg-gray-300 ${currentStep === step.number ? "h-56" : "h-4"}`}></div>
                                </div>
                            )}
                            <div className="ml-4 flex-1">
                                {/* Step content */}
                                {renderStepContent(step.number)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/atoms/Button"
import { Label } from "@/components/atoms/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/Select"
import { Check, ChevronLeft, X, Search } from "lucide-react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { AddReservationRequest } from "@/validation/schemas/Reservations"
import { GetRatePlansResponse, GetRoomsResponse, GetRoomTypesResponse } from "@/validation"
import { getRoomById, getRooms } from "@/services/Rooms"
import { toast } from "sonner"
import { searchGuests } from "@/services/Guests"
import { getRatePlans } from "@/services/RatePlans"
import { addReservation, getNightPrice } from "@/services/Reservation"
import NewDialogsWithTypes from "@/components/dialogs/NewDialogWIthTypes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card"
import { Separator } from "@/components/atoms/Separator"
import { Input } from "@/components/atoms/Input"
import { getRoomTypes } from "@/services/RoomTypes"
import { DateTimePicker } from "@/components/Organisms/DateTimePicker"
import { GetGuestsResponse, Guest } from "@/validation/schemas/Guests"

export default function NewIndividualReservation() {
    const [currentStep, setCurrentStep] = useState(1)
    const [nightPrice, setNightPrice] = useState<number | null>(null);

    const steps = [
        { number: 1, title: "Guest", completed: currentStep > 1 },
        { number: 2, title: "Stay info", completed: currentStep > 2 },
        { number: 3, title: "Room Assignment", completed: currentStep > 3 },
    ]

    const handleNextStep = () => {
        if (currentStep < 3) {
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
    const [guests, setGuests] = useState<GetGuestsResponse['data']>([]);
    const [guestSearch, setGuestSearch] = useState("");
    const debouncedGuestSearch = useDebounce(guestSearch, 400);
    const [ratePlans, setRatePlans] = useState<GetRatePlansResponse['data']>([]);
    const [connectableRooms, setConnectableRooms] = useState<Array<{ id: string; roomNumber: string }>>([]);
    const [selectedRoomType, setSelectedRoomType] = useState<string>("");
    const [rooms, setRooms] = useState<GetRoomsResponse['data']>([]);
    const [roomTypes, setRoomTypes] = useState<GetRoomTypesResponse['data']>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const allRooms = await getRooms();
                setRooms(allRooms.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
                toast("Error!", { description: "Failed to fetch rooms" });
            }
        };
        fetchRooms();
    }, []);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const response = await getRoomTypes();
                setRoomTypes(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRoomTypes();
    }, []);

    const handleInputChange = (field: keyof AddReservationRequest, value: string | string[]) => {
        setFormData(prev => {
            const updatedFormData = {
                ...prev,
                [field]: value
            };
            return updatedFormData;
        });
    };

    const [openGuestDialog, setOpenGuestDialog] = useState(false);

    // Clear search function
    const clearGuestSearch = () => {
        setGuestSearch("");
    };

    const handleRoomSelection = async (roomId: string) => {
        if (!formData.roomIds?.includes(roomId)) {
            const updatedRoomIds = [...(formData.roomIds || []), roomId];
            handleInputChange('roomIds', updatedRoomIds);

            if (formData.roomIds?.length === 0) {
                try {
                    const roomResponse = await getRoomById(roomId);
                    const actualRoomData = roomResponse.data;
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

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await addReservation(formData);
            toast("Success!", {
                description: "Reservation was created successfully.",
            })
            navigate('/calendar');
        } catch (error: any) {
            let errorMessage = 'Failed to create reservation. Please try again.';

            if (error.userMessage) {
                errorMessage = error.userMessage;
            } else if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.error) {
                    errorMessage = responseData.error;
                } else if (responseData.message) {
                    errorMessage = responseData.message;
                } else if (typeof responseData === 'string') {
                    errorMessage = responseData;
                }
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast('Error', {
                description: errorMessage
            })
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

        const handleGetRatePlans = async () => {
            try {
                const ratePlans = await getRatePlans();
                setRatePlans(ratePlans.data);
            } catch (error) {
                console.error(error);
            }
        };

        handleGetRooms();
        handleGetRatePlans();
    }, []);

    useEffect(() => {
        const handleGetGuests = async () => {
            setSearchLoading(true)
            try {
                const response = await searchGuests({
                    q: debouncedGuestSearch,
                })
                setGuests(response.data)
            } catch (error) {
                console.error("Error fetching guests:", error)
                setGuests([])
            } finally {
                setSearchLoading(false)
            }
        }
        handleGetGuests()
    }, [debouncedGuestSearch])

    const getNights = () => {
        if (!formData.checkIn || !formData.checkOut) return 0;
        const diffTime = formData.checkOut.getTime() - formData.checkIn.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    useEffect(() => {
        const fetchNightPrice = async () => {
            if (!formData.ratePlanId || !selectedRoomType) return;

            try {
                const response = await getNightPrice(formData.ratePlanId, selectedRoomType);
                const price = parseFloat(response.data) || 0;
                setNightPrice(price);
            } catch (error) {
                console.error(error);
                toast("Error!", {
                    description: "Failed to fetch nightly rate."
                });
            }
        };

        if (formData.ratePlanId && selectedRoomType) {
            fetchNightPrice();
        }
    }, [formData.ratePlanId, selectedRoomType]);

    const roomsToShow = selectedRoomType
        ? rooms.filter(room => room.roomType?.id === selectedRoomType)
        : rooms;

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
                                    <Button variant='background' className="h-7" onClick={() => setOpenGuestDialog(true)}>New Guest Profile</Button>
                                </div>
                                <Select
                                    value={formData.guestId}
                                    onValueChange={(value) => handleInputChange('guestId', value)}
                                >
                                    <SelectTrigger className='w-full border border-slate-300 bg-white'>
                                        <SelectValue placeholder="Select Guest" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <div className="p-2">
                                            <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3">
                                                <Input
                                                    type="text"
                                                    placeholder="Search guests..."
                                                    value={guestSearch}
                                                    onChange={e => setGuestSearch(e.target.value)}
                                                    className="w-full h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
                                                />
                                                {guestSearch && (
                                                    <button
                                                        onClick={clearGuestSearch}
                                                        className="text-gray-400 hover:text-gray-600 mr-2 text-sm font-medium"
                                                        aria-label="Clear search"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                                <Search className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                        {searchLoading ? (
                                            <SelectItem value="loading" disabled>
                                                Loading guests...
                                            </SelectItem>
                                        ) : guests.length > 0 ? (
                                            guests.map((guest: Guest) => (
                                                <SelectItem key={guest.id} value={guest.id}>
                                                    {guest.firstName} {guest.lastName}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-results" disabled>
                                                No guests found.
                                            </SelectItem>
                                        )}
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
                            <DateTimePicker
                                label="Check In"
                                date={formData.checkIn}
                                onDateTimeChange={(date) => {
                                    if (date) {
                                        setFormData({ ...formData, checkIn: date });
                                        setFormData(prev => ({ ...prev, roomIds: [] }));
                                        setConnectableRooms([]);
                                    }
                                }}
                                placeholder="Select check-in date and time"
                                disabled={(date) => date < new Date()}
                            />
                        </div>
                        <div className="space-y-1">
                            <DateTimePicker
                                label="Check Out"
                                date={formData.checkOut}
                                onDateTimeChange={(date) => {
                                    if (date) {
                                        setFormData({ ...formData, checkOut: date });
                                        setFormData(prev => ({ ...prev, roomIds: [] }));
                                        setConnectableRooms([]);
                                    }
                                }}
                                placeholder="Select check-out date and time"
                                disabled={(date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (date < today) return true;
                                    if (formData.checkIn && date <= formData.checkIn) return true;
                                    return false;
                                }}
                            />
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
                        <div className="mb-4 p-3 bg-white rounded-lg">
                            <p className="text-sm text-hms-primary font-bold">
                                Showing available rooms for {format(formData.checkIn, "MMM dd")} - {format(formData.checkOut, "MMM dd, yyyy")}
                            </p>
                            <p className="text-xs text-hms-primary mt-1">
                                {rooms.length} room(s) available
                            </p>
                        </div>

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
                                    {roomTypes.map(rt => (
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
                                        {rooms.length === 0 ? (
                                            <SelectItem value="no-rooms" disabled>
                                                No rooms available for selected dates
                                            </SelectItem>
                                        ) : roomsToShow.length > 0 ? (
                                            roomsToShow.map(room => (
                                                <SelectItem key={room.id} value={room.id}>
                                                    {room.roomNumber} - {room.roomType?.name || 'Unknown Type'}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-rooms" disabled>
                                                There are no rooms for the selected room type
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Display selected rooms */}
                            {formData.roomIds && formData.roomIds.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm text-slate-600">Selected Rooms:</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.roomIds.map(roomId => {
                                            const room = rooms.find(r => r.id === roomId);
                                            const connectableRoom = connectableRooms.find(r => r.id === roomId);
                                            const displayRoom = room || connectableRoom;

                                            return displayRoom ? (
                                                <div key={roomId} className="flex items-center bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm">
                                                    <span>
                                                        {displayRoom.roomNumber} - {
                                                            // Use room type name if available, otherwise show Unknown Type
                                                            room?.roomType?.name || 'Unknown Type'
                                                        }
                                                    </span>
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

            default:
                return null
        }
    }

    return (
        <div className="p-5">
            <div className="flex gap-2 items-center mb-8">
                <ChevronLeft onClick={() => navigate(-1)} />
                <h1 className="text-2xl font-semibold">New Reservation</h1>
            </div>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-7">
                <div className="space-y-2">
                    {steps.map((step, index) => (
                        <div key={step.number}>
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
                                    {renderStepContent(step.number)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Card className="bg-hms-accent/15">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            Reservation Summary
                        </CardTitle>
                        <CardContent className="p-0 space-y-1">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-semibold">Total Guests:</span>
                                <span>1 guest</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-semibold">Total Nights:</span>
                                <span>{getNights()} {getNights() === 1 ? 'night' : 'nights'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-semibold">Rate Per Night:</span>
                                <span>{nightPrice !== null ? `$${nightPrice}` : "-"}</span>
                            </div>
                            <Separator className="bg-black" />
                            <div className="flex justify-between">
                                <span className="text-hms-primary font-bold text-lg">Total</span>
                                <span>
                                    {nightPrice !== null ? `$${nightPrice * getNights()}` : "-"}
                                </span>
                            </div>
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>

            <NewDialogsWithTypes
                open={openGuestDialog}
                setOpen={setOpenGuestDialog}
                description='Select Guest Type'
                textOne='For personal bookings and solo travelers.'
                textTwo='For company accounts and business reservations.'
                title='New Guest'
                groupRoute='/guests-profile/new-group'
                individualRoute='/guests-profile/new-individual'
            />
        </div>
    )
}
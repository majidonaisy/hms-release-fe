import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/atoms/Button"
import { Label } from "@/components/atoms/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/Select"
import { Check, ChevronLeft, X, Search } from "lucide-react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { GetRatePlansResponse, GetRoomTypesResponse } from "@/validation"
import { getRoomsByRoomTypes } from "@/services/Rooms"
import { toast } from "sonner"
import { searchGroupProfiles } from "@/services/Guests"
import { getRatePlans } from "@/services/RatePlans"
import { addGroupReservation, getNightPrice } from "@/services/Reservation"
import NewDialogsWithTypes from "@/components/dialogs/NewDialogWIthTypes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card"
import { Separator } from "@/components/atoms/Separator"
import { Checkbox } from "@/components/atoms/Checkbox"
import { Input } from "@/components/atoms/Input"
import { getAlRoomTypes } from "@/services/RoomTypes"
import { DateTimePicker } from "@/components/Organisms/DateTimePicker"
import { GetGroupProfilesResponse } from "@/validation/schemas/Guests"

interface GroupReservationRequest {
    groupProfileId: string;
    checkIn: Date;
    checkOut: Date;
    ratePlanId: string;
    guestsAndRooms: Record<string, string[]>;
}

interface GroupProfile {
    id: string;
    name: string;
    LinkedGuests?: {
        id: string;
        firstName: string;
        lastName: string;
    }[];
}

export default function NewGroupReservation() {
    const [currentStep, setCurrentStep] = useState(1)
    const [nightPrice, setNightPrice] = useState<number | null>(null);

    const steps = [
        { number: 1, title: "Group Profile", completed: currentStep > 1 },
        { number: 2, title: "Stay Info", completed: currentStep > 2 },
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
    const [formData, setFormData] = useState<GroupReservationRequest>({
        groupProfileId: '',
        checkIn: new Date(),
        checkOut: new Date(),
        ratePlanId: '',
        guestsAndRooms: {},
    });

    const [roomsByType, setRoomsByType] = useState<any[]>([]);
    const [ratePlans, setRatePlans] = useState<GetRatePlansResponse['data']>([]);
    const [groupProfiles, setGroupProfiles] = useState<GroupProfile[]>([]);
    const [groupProfileSearch, setGroupProfileSearch] = useState("");
    const debouncedGroupProfileSearch = useDebounce(groupProfileSearch, 400);
    const [selectedRoomType, setSelectedRoomType] = useState<string>("");
    const [openGuestDialog, setOpenGuestDialog] = useState(false);
    const [roomTypes, setRoomTypes] = useState<GetRoomTypesResponse['data']>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [roomsLoading, setRoomsLoading] = useState(false);

    // Fetch rooms by room type when room type is selected
    useEffect(() => {
        const fetchRoomsByType = async () => {
            if (!selectedRoomType) {
                setRoomsByType([]);
                return;
            }

            setRoomsLoading(true);
            try {
                const response = await getRoomsByRoomTypes(selectedRoomType, {
                    // Add any additional params if needed for availability check
                });
                setRoomsByType(response.data);
            } catch (error) {
                console.error('Error fetching rooms by type:', error);
                toast("Error!", { description: "Failed to fetch rooms for selected type" });
                setRoomsByType([]);
            } finally {
                setRoomsLoading(false);
            }
        };

        fetchRoomsByType();
    }, [selectedRoomType]);

    const handleInputChange = (field: keyof GroupReservationRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Clear search function
    const clearGroupProfileSearch = () => {
        setGroupProfileSearch("");
    };

    const handleGuestRoomAssignment = (guestId: string, roomIds: string[]) => {
        setFormData(prev => ({
            ...prev,
            guestsAndRooms: {
                ...prev.guestsAndRooms,
                [guestId]: roomIds
            }
        }));
    };

    const handleRemoveGuestRoomAssignment = (guestId: string) => {
        setFormData(prev => {
            const newGuestsAndRooms = { ...prev.guestsAndRooms };
            delete newGuestsAndRooms[guestId];
            return {
                ...prev,
                guestsAndRooms: newGuestsAndRooms
            };
        });
    };

    const getAssignedGuests = () => {
        return Object.keys(formData.guestsAndRooms);
    };

    const handleRoomTypeChange = (value: string) => {
        setSelectedRoomType(value);
        // Clear guest room assignments when room type changes
        setFormData(prev => ({ ...prev, guestsAndRooms: {} }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await addGroupReservation(formData);
            toast("Success!", {
                description: "Group reservation was created successfully.",
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
        const handleGetRatePlans = async () => {
            try {
                const ratePlans = await getRatePlans();
                setRatePlans(ratePlans.data);
            } catch (error) {
                console.error(error);
            }
        };

        handleGetRatePlans();
    }, []);

    useEffect(() => {
        const handleGetGroupProfiles = async () => {
            setSearchLoading(true)
            try {
                const response = ((await searchGroupProfiles({
                    q: debouncedGroupProfileSearch,
                })) as GetGroupProfilesResponse)
                setGroupProfiles(response.data)
            } catch (error) {
                console.error(error)
            } finally {
                setSearchLoading(false)
            }
        }
        handleGetGroupProfiles()
    }, [debouncedGroupProfileSearch])

    const getNights = () => {
        if (!formData.checkIn || !formData.checkOut) return 0;
        const diffTime = formData.checkOut.getTime() - formData.checkIn.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getTotalGuests = () => {
        return Object.keys(formData.guestsAndRooms).length;
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

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const response = await getAlRoomTypes();
                setRoomTypes(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRoomTypes();
    }, []);

    const renderStepContent = (stepNumber: number) => {
        if (currentStep !== stepNumber) return null

        switch (stepNumber) {
            case 1:
                return (
                    <div className="">
                        <div className="space-y-4">
                            <div className="bg-hms-accent/15 p-5 rounded-lg space-y-2">
                                <div className="flex justify-between">
                                    <Label>Group Profile</Label>
                                    <Button variant='background' className="h-7" onClick={() => setOpenGuestDialog(true)}>New Group Profile</Button>
                                </div>
                                <Select
                                    value={formData.groupProfileId}
                                    onValueChange={(value) => handleInputChange('groupProfileId', value)}
                                >
                                    <SelectTrigger className='w-full border border-slate-300 bg-white'>
                                        <SelectValue placeholder="Select Group Profile" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <div className="p-2">
                                            <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3">
                                                <Input
                                                    type="text"
                                                    placeholder="Search group profiles..."
                                                    value={groupProfileSearch}
                                                    onChange={e => setGroupProfileSearch(e.target.value)}
                                                    className="w-full h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
                                                />
                                                {groupProfileSearch && (
                                                    <button
                                                        onClick={clearGroupProfileSearch}
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
                                                Loading...
                                            </SelectItem>
                                        ) : groupProfiles.length > 0 ? (
                                            groupProfiles.map((groupProfile) => (
                                                <SelectItem key={groupProfile.id} value={groupProfile.id}>
                                                    {groupProfile.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-results" disabled>
                                                No results found.
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <div className="flex justify-center pt-4">
                                    <Button
                                        onClick={handleNextStep}
                                        className="h-7 px-8"
                                        disabled={!formData.groupProfileId}
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
                                        setFormData(prev => ({ ...prev, guestsAndRooms: {} }));
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
                                        setFormData(prev => ({ ...prev, guestsAndRooms: {} }));
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

            case 3: {
                const linkedGuests = groupProfiles.find(gp => gp.id === formData.groupProfileId)?.LinkedGuests ?? [];

                return (
                    <div className="space-y-6 ml-5 p-5 bg-hms-accent/15 rounded-lg">
                        <div className="">
                            <Label className="mb-2 block">Select Room Type</Label>
                            <Select
                                value={selectedRoomType}
                                onValueChange={handleRoomTypeChange}
                            >
                                <SelectTrigger className="bg-white w-full">
                                    <SelectValue placeholder="Room Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roomTypes.map((roomType) => (
                                        <SelectItem key={roomType.id} value={roomType.id}>
                                            {roomType.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {getAssignedGuests().length > 0 && (
                            <div className="mt-6 space-y-4 border rounded-lg p-4 bg-white">
                                <h3 className="font-semibold text-lg text-hms-primary">Assigned Guests Summary</h3>
                                <ul className="space-y-2 text-sm">
                                    {getAssignedGuests().map((guestId) => {
                                        const guest = linkedGuests.find((g) => g.id === guestId);
                                        const roomIds = formData.guestsAndRooms[guestId];
                                        const roomNumbers = roomsByType
                                            .filter((room) => roomIds.includes(room.id))
                                            .map((room) => room.roomNumber)
                                            .join(", ");

                                        return (
                                            <li key={guestId}>
                                                <span className="font-medium">
                                                    {guest?.firstName} {guest?.lastName}
                                                </span>{" "}
                                                → Rooms: <span className="text-muted-foreground">{roomNumbers}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {!selectedRoomType && (
                            <div className="text-center py-8 bg-white rounded-lg border">
                                <div className="text-muted-foreground">
                                    <p className="text-lg font-medium">Please select a room type first</p>
                                    <p className="text-sm mt-2">
                                        Choose a room type from the dropdown above to see available rooms
                                    </p>
                                </div>
                            </div>
                        )}

                        {selectedRoomType && roomsLoading && (
                            <div className="text-center py-8 bg-white rounded-lg border">
                                <div className="text-muted-foreground">
                                    <p className="text-lg font-medium">Loading rooms...</p>
                                    <p className="text-sm mt-2">Please wait while we fetch available rooms</p>
                                </div>
                            </div>
                        )}

                        {selectedRoomType && !roomsLoading && roomsByType.length === 0 && (
                            <div className="text-center py-8 bg-white rounded-lg border">
                                <div className="text-muted-foreground">
                                    <p className="text-lg font-medium">No rooms available</p>
                                    <p className="text-sm mt-2">
                                        There are no available rooms for the selected dates ({format(formData.checkIn, "PPP")} - {format(formData.checkOut, "PPP")})
                                    </p>
                                    <p className="text-xs mt-1">
                                        Please try different dates or check room availability
                                    </p>
                                </div>
                            </div>
                        )}

                        {selectedRoomType && !roomsLoading && roomsByType.length > 0 && (
                            <div className="rounded-lg border">
                                <div className="grid grid-cols-9 gap-4 p-4 border-b font-medium text-sm">
                                    <div className="col-span-1"></div>
                                    <div className="col-span-3">Guest Name</div>
                                    <div className="col-span-3">Room Number(s)</div>
                                </div>
                                <div className="divide-y">
                                    {linkedGuests.map((guest, index) => (
                                        <div key={guest.id} className="p-4 space-y-4">
                                            <div className="grid grid-cols-9 gap-4 items-center bg-hms-accent/35 p-7 rounded-lg">
                                                <div className="col-span-1 flex items-center justify-center">
                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                                <div className="col-span-3">
                                                    <div className="w-full p-2 border rounded bg-white">
                                                        {guest.firstName} {guest.lastName}
                                                    </div>
                                                </div>
                                                <div className="col-span-3 space-y-1 max-h-[150px] overflow-y-auto border rounded bg-white p-2">
                                                    {roomsByType.map((room) => {
                                                        const isChecked = formData.guestsAndRooms[guest.id]?.includes(room.id) ?? false;
                                                        return (
                                                            <div key={room.id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    checked={isChecked}
                                                                    onCheckedChange={(checked) => {
                                                                        const currentRooms = formData.guestsAndRooms[guest.id] || [];
                                                                        if (checked) {
                                                                            handleGuestRoomAssignment(guest.id, [...currentRooms, room.id]);
                                                                        } else {
                                                                            handleGuestRoomAssignment(
                                                                                guest.id,
                                                                                currentRooms.filter((r) => r !== room.id)
                                                                            );
                                                                        }
                                                                    }} />
                                                                <Label htmlFor={`guest-${guest.id}-room-${room.id}`}>
                                                                    {room.roomNumber}
                                                                </Label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="col-span-2 flex items-center justify-end">
                                                    {formData.guestsAndRooms[guest.id] && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveGuestRoomAssignment(guest.id)}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer Buttons */}
                        <div className="flex justify-center gap-3">
                            <Button
                                variant="background"
                                onClick={handlePreviousStep}
                                className="px-8 h-7"
                            >
                                Previous Step
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="px-8 h-7"
                                disabled={Object.keys(formData.guestsAndRooms).length === 0 || loading || !selectedRoomType}
                            >
                                {loading ? 'Creating...' : 'Create Group Reservation'}
                            </Button>
                        </div>
                    </div>
                );
            }
            default:
                return null
        }
    }

    return (
        <div className="p-5">
            <div className="flex gap-2 items-center mb-8">
                <ChevronLeft onClick={() => navigate(-1)} />
                <h1 className="text-2xl font-semibold">New Group Reservation</h1>
            </div>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-7">
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

                <Card className="bg-hms-accent/15">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            Reservation Summary
                        </CardTitle>
                        <CardContent className="p-0 space-y-1">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-semibold">Total Guests:</span>
                                <span>{getTotalGuests()} {getTotalGuests() === 1 ? 'guest' : 'guests'}</span>
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
                                    {nightPrice !== null && getTotalGuests() > 0
                                        ? `$${nightPrice * getNights() * getTotalGuests()}`
                                        : "-"}
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
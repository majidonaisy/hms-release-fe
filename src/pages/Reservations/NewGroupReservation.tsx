import { Popover, PopoverContent, PopoverTrigger } from "@/components/molecules/Popover"
import { useEffect, useState, useCallback } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { Calendar as CalendarComponent } from "@/components/molecules/Calendar"
import { Button } from "@/components/atoms/Button"
import { Label } from "@/components/atoms/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/Select"
import { CalendarIcon, Check, ChevronLeft, X } from "lucide-react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { GetRatePlansResponse, GetRoomsResponse } from "@/validation"
import { getRooms } from "@/services/Rooms"
import { toast } from "sonner"
import { getGroupProfiles } from "@/services/Guests"
import type { GetGroupProfilesResponse } from "@/validation/schemas/Guests"
import { searchGroupProfiles } from "@/services/Guests"
import { getRatePlans } from "@/services/RatePlans"
import { addGroupReservation, getNightPrice, getReservations } from "@/services/Reservation"
import NewDialogsWithTypes from "@/components/dialogs/NewDialogWIthTypes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card"
import { Separator } from "@/components/atoms/Separator"
import { Checkbox } from "@/components/atoms/Checkbox"

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

    const [rooms, setRooms] = useState<GetRoomsResponse['data']>([]);
    const [availableRooms, setAvailableRooms] = useState<GetRoomsResponse['data']>([]);
    const [ratePlans, setRatePlans] = useState<GetRatePlansResponse['data']>([]);
    const [groupProfiles, setGroupProfiles] = useState<GroupProfile[]>([]);
    const [groupProfileSearch, setGroupProfileSearch] = useState("");
    const [groupProfileSearchLoading, setGroupProfileSearchLoading] = useState(false);
    const debouncedGroupProfileSearch = useDebounce(groupProfileSearch, 300);
    const [selectedRoomType, setSelectedRoomType] = useState<string>("");
    const [openGuestDialog, setOpenGuestDialog] = useState(false);
    // Removed unused selectedGuest and selectedRooms

    const handleInputChange = (field: keyof GroupReservationRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getAvailableRoomsForDates = useCallback(async (checkIn: Date, checkOut: Date) => {
        try {
            const reservationsResponse = await getReservations(checkIn, checkOut);
            const reservedRoomIds = new Set<string>();

            if (reservationsResponse.data?.reservations) {
                reservationsResponse.data.reservations.forEach(reservation => {
                    reservation.Room.forEach(room => {
                        const hasOverlap = room.reservations.some(res => {
                            const resCheckIn = new Date(res.checkIn);
                            const resCheckOut = new Date(res.checkOut);
                            return (
                                (checkIn >= resCheckIn && checkIn < resCheckOut) ||
                                (checkOut > resCheckIn && checkOut <= resCheckOut) ||
                                (checkIn <= resCheckIn && checkOut >= resCheckOut)
                            );
                        });
                        if (hasOverlap) {
                            reservedRoomIds.add(room.id);
                        }
                    });
                });
            }

            const availableRooms = rooms.filter(room =>
                !reservedRoomIds.has(room.id) &&
                room.status === 'AVAILABLE'
            );

            setAvailableRooms(availableRooms);
        } catch (error) {
            console.error('Error fetching available rooms:', error);
            toast("Error!", {
                description: "Failed to fetch available rooms"
            });
        }
    }, [rooms]);

    useEffect(() => {
        if (formData.checkIn && formData.checkOut && rooms.length > 0) {
            getAvailableRoomsForDates(formData.checkIn, formData.checkOut);
        }
    }, [formData.checkIn, formData.checkOut, rooms, getAvailableRoomsForDates]);

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

    const getFilteredAvailableRooms = () => {
        const assignedRoomIds = Object.values(formData.guestsAndRooms).flat();
        return availableRooms.filter(room =>
            (!selectedRoomType || room.roomType?.id === selectedRoomType) &&
            !assignedRoomIds.includes(room.id)
        );
    };

    const getAssignedGuests = () => {
        return Object.keys(formData.guestsAndRooms);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await addGroupReservation(formData);
            toast("Success!", {
                description: "Group reservation was created successfully.",
            })
            navigate('/guests-profile');
        } catch (error) {
            toast("Error!", {
                description: "Failed to create group reservation.",
            })
            console.error("Failed to submit form:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true)
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

        const handleGetGroupProfiles = async (q?: string) => {
            try {
                setGroupProfileSearchLoading(true);
                const groupProfiles = q
                  ? (await searchGroupProfiles({ q }) as GetGroupProfilesResponse)
                  : await getGroupProfiles();
                setGroupProfiles(groupProfiles.data);
            } catch (error) {
                console.error(error);
            } finally {
                setGroupProfileSearchLoading(false);
            }
        };

        Promise.all([
            handleGetRooms(),
            handleGetRatePlans(),
            handleGetGroupProfiles()
        ])
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const fetchProfiles = async (searchTerm: string) => {
            setGroupProfileSearchLoading(true);
            try {
                const groupProfiles = searchTerm
                  ? (await searchGroupProfiles({ q: searchTerm }) as GetGroupProfilesResponse)
                  : await getGroupProfiles();
                setGroupProfiles(groupProfiles.data);
            } catch (error) {
                console.error(error);
            } finally {
                setGroupProfileSearchLoading(false);
            }
        };
        fetchProfiles(debouncedGroupProfileSearch);
    }, [debouncedGroupProfileSearch]);

    const filteredAvailableRooms = getFilteredAvailableRooms();

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
                                            <input
                                                type="text"
                                                className="w-full border border-slate-300 rounded px-2 py-1 mb-2"
                                                placeholder="Search group profiles..."
                                                value={groupProfileSearch}
                                                onChange={e => setGroupProfileSearch(e.target.value)}
                                            />
                                        </div>
                                        {groupProfileSearchLoading || loading ? (
                                            <SelectItem value="loading" disabled>
                                                Loading...
                                            </SelectItem>
                                        ) : (
                                            groupProfiles.map((groupProfile) => (
                                                <SelectItem key={groupProfile.id} value={groupProfile.id}>
                                                    {groupProfile.name}
                                                </SelectItem>
                                            ))
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
                                        onSelect={(date) => {
                                            if (date) {
                                                setFormData({ ...formData, checkIn: date });
                                                setFormData(prev => ({ ...prev, guestsAndRooms: {} }));
                                            }
                                        }}
                                        disabled={(date) => date < new Date()}
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
                                        onSelect={(date) => {
                                            if (date) {
                                                setFormData({ ...formData, checkOut: date });
                                                setFormData(prev => ({ ...prev, guestsAndRooms: {} }));
                                            }
                                        }}
                                        disabled={(date) => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            if (date < today) return true;
                                            if (formData.checkIn && date <= formData.checkIn) return true;
                                            return false;
                                        }}
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

            case 3: {
                const linkedGuests = groupProfiles.find(gp => gp.id === formData.groupProfileId)?.LinkedGuests ?? [];

                return (
                    <div className="space-y-6 ml-5 p-5 bg-hms-accent/15 rounded-lg">
                        <div className="">
                            <Label className="mb-2 block">Select Room Type</Label>
                            <Select
                                value={selectedRoomType}
                                onValueChange={(value) => {
                                    setSelectedRoomType(value);
                                    setFormData(prev => ({ ...prev, guestsAndRooms: {} }));
                                }}
                            >
                                <SelectTrigger className=" bg-white w-full">
                                    <SelectValue placeholder="Room Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from(new Map(availableRooms.map((room) => [room.roomType?.id, room.roomType])).values())
                                        .filter((rt) => rt && rt.id)
                                        .map((rt) => (
                                            <SelectItem key={rt.id} value={rt.id}>
                                                {rt.name}
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
                                        const roomNumbers = availableRooms
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

                        {selectedRoomType && (
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
                                                    {filteredAvailableRooms.length === 0 ? (
                                                        <div className="text-center text-muted-foreground">
                                                            <p className="">No rooms available</p>
                                                        </div>
                                                    ) : (
                                                        filteredAvailableRooms.map((room) => {
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
                                                        })
                                                    )}
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

                        {selectedRoomType && availableRooms.length === 0 && (
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/molecules/Popover"
import { useEffect, useState } from "react"
import { Calendar as CalendarComponent } from "@/components/molecules/Calendar"
import { Button } from "@/components/atoms/Button"
import { Label } from "@/components/atoms/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/Select"
import { CalendarIcon, Check, ChevronLeft, X } from "lucide-react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { GetGuestsResponse, GetRatePlansResponse, GetRoomsResponse } from "@/validation"
import { getRooms } from "@/services/Rooms"
import { toast } from "sonner"
import { getGroupProfiles, getGuests } from "@/services/Guests"
import { getRatePlans } from "@/services/RatePlans"
import { addGroupReservation } from "@/services/Reservation"
import NewDialogsWithTypes from "@/components/dialogs/NewDialogWIthTypes"

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
}

export default function NewGroupReservation() {
    const [currentStep, setCurrentStep] = useState(1)

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
    const [guests, setGuests] = useState<GetGuestsResponse['data']>([]);
    const [ratePlans, setRatePlans] = useState<GetRatePlansResponse['data']>([]);
    const [groupProfiles, setGroupProfiles] = useState<GroupProfile[]>([]);
    const [selectedRoomType, setSelectedRoomType] = useState<string>("");
    const [openGuestDialog, setOpenGuestDialog] = useState(false);

    const handleInputChange = (field: keyof GroupReservationRequest, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGuestRoomAssignment = (guestId: string, roomId: string) => {
        setFormData(prev => ({
            ...prev,
            guestsAndRooms: {
                ...prev.guestsAndRooms,
                [guestId]: [roomId]
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

    const getAvailableRooms = () => {
        const assignedRoomIds = Object.values(formData.guestsAndRooms).flat();
        return rooms.filter(room =>
            (!selectedRoomType || room.roomType?.id === selectedRoomType) &&
            !assignedRoomIds.includes(room.id)
        );
    };

    const getAssignedGuests = () => {
        return Object.keys(formData.guestsAndRooms);
    };

    const getUnassignedGuests = () => {
        const assignedGuestIds = getAssignedGuests();
        return guests.filter(guest => !assignedGuestIds.includes(guest.id));
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

        const handleGetGroupProfiles = async () => {
            try {
                const groupProfiles = await getGroupProfiles();
                setGroupProfiles(groupProfiles.data);
            } catch (error) {
                console.error(error);
            }
        };

        Promise.all([
            handleGetRooms(),
            handleGetGuests(),
            handleGetRatePlans(),
            handleGetGroupProfiles()
        ])
    }, []);

    const availableRooms = getAvailableRooms();
    const unassignedGuests = getUnassignedGuests();

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
                                        {groupProfiles.map((group) => (
                                            <SelectItem key={group.id} value={group.id}>
                                                {group.name}
                                            </SelectItem>
                                        ))}
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
                    <div className="bg-hms-accent/15 p-5 rounded-lg space-y-4">
                        <div className='space-y-1'>
                            <Label>Room Type Filter</Label>
                            <Select
                                value={selectedRoomType}
                                onValueChange={(value) => setSelectedRoomType(value)}
                            >
                                <SelectTrigger className='w-full border border-slate-300 bg-white'>
                                    <SelectValue placeholder="All Room Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Room Types</SelectItem>
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

                        {/* Guest-Room Assignment Section */}
                        <div className="space-y-3">
                            <Label>Guest Room Assignments</Label>

                            {/* Show assigned guests */}
                            {Object.entries(formData.guestsAndRooms).map(([guestId, roomIds]) => {
                                const guest = guests.find(g => g.id === guestId);
                                const room = rooms.find(r => r.id === roomIds[0]);

                                return (
                                    <div key={guestId} className="flex items-center justify-between bg-slate-100 p-3 rounded">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{guest?.firstName} {guest?.lastName}</span>
                                            <span className="text-slate-600">→</span>
                                            <span className="text-sm bg-white px-2 py-1 rounded">
                                                {room?.roomNumber} - {room?.roomType?.name}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveGuestRoomAssignment(guestId)}
                                            className="text-slate-500 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}

                            {/* Add new assignment */}
                            {unassignedGuests.length > 0 && availableRooms.length > 0 && (
                                <div className="border-2 border-dashed border-slate-300 p-4 rounded-lg">
                                    <Label className="text-sm text-slate-600 mb-2 block">Assign Guest to Room</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value=""
                                            onValueChange={(guestId) => {
                                                // Store selected guest for room assignment
                                                const selectedGuest = guestId;
                                                // You might want to handle this differently based on your UX
                                                console.log('Selected guest:', selectedGuest);
                                            }}
                                        >
                                            <SelectTrigger className="flex-1 border border-slate-300 bg-white">
                                                <SelectValue placeholder="Select Guest" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {unassignedGuests.map(guest => (
                                                    <SelectItem key={guest.id} value={guest.id}>
                                                        {guest.firstName} {guest.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value=""
                                            onValueChange={(roomId) => {
                                                // For now, assign to first unassigned guest
                                                if (unassignedGuests.length > 0) {
                                                    handleGuestRoomAssignment(unassignedGuests[0].id, roomId);
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="flex-1 border border-slate-300 bg-white">
                                                <SelectValue placeholder="Select Room" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableRooms.map(room => (
                                                    <SelectItem key={room.id} value={room.id}>
                                                        {room.roomNumber} - {room.roomType?.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            {unassignedGuests.length === 0 && Object.keys(formData.guestsAndRooms).length === 0 && (
                                <div className="text-center py-8 text-slate-500">
                                    No guests available for assignment
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
                                disabled={Object.keys(formData.guestsAndRooms).length === 0 || loading}
                            >
                                {loading ? 'Creating...' : 'Create Group Reservation'}
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
                <h1 className="text-2xl font-semibold">New Group Reservation</h1>
            </div>

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
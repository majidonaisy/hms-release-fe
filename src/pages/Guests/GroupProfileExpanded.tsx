import { Button } from "@/components/atoms/Button";
import { ScrollArea } from "@/components/atoms/ScrollArea";
import { Skeleton } from "@/components/atoms/Skeleton";
import { GuestSelectionDialog } from "@/components/dialogs/AddGuestDialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/Organisms/Card";
import EditingSkeleton from "@/components/Templates/EditingSkeleton";
import { getGroupProfileById, getGuests, linkGuestsToGroup } from "@/services/Guests";
import { GetGuestsResponse, GroupProfileResponse } from "@/validation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const GroupProfileExpanded = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [group, setGroup] = useState<GroupProfileResponse['data'] | null>(null);
    const [linkedGuestsToGroup, setLinkedGuestsToGroup] = useState<GetGuestsResponse['data']>([]);
    const [allGuests, setAllGuests] = useState<GetGuestsResponse['data']>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);

    const getBusinessTypeDisplay = (businessType: string) => {
        const map = {
            "CORPORATE": "Corporate",
            "TRAVEL_AGENCY": "Travel Agency",
            "EVENT_PLANNER": "Event Planner",
            "GOVERNMENT": "Government",
            "OTHER": "Other",
        };
        return map[businessType as keyof typeof map] || businessType;
    };


    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const [groupRes, allGuestsRes] = await Promise.all([
                getGroupProfileById(id),
                getGuests(),
            ]);
            setGroup(groupRes.data);
            setLinkedGuestsToGroup(groupRes.data.LinkedGuests || []);
            setAllGuests(allGuestsRes.data);
        } catch (err: any) {
            console.error(err);
            setError(err.userMessage || "Failed to load group profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleGuestSelect = async (selectedGuests: GetGuestsResponse['data']) => {
        if (!id) return;

        // Filter out any duplicates (optional but good)
        const existingIds = linkedGuestsToGroup.map(g => g.id);
        const newGuests = selectedGuests.filter(g => !existingIds.includes(g.id));

        // Combine old + new for the request:
        const updatedGuests = [...linkedGuestsToGroup, ...newGuests];

        try {
            await linkGuestsToGroup(updatedGuests.map(g => g.id), id);
            toast("Linked guests updated");
            fetchData(); // Refresh whole state from server
        } catch (err) {
            console.error(err);
            toast("Failed to save linked guests");
        } finally {
            setDialogOpen(false);
        }
    };


    if (loading && !group) {
        return (
            <EditingSkeleton />
        );
    }

    if (error || !group) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="p-1"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {error || "Group not found"}
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="p-1"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">Group Profile</h1>
            </div>

            <div className="grid grid-cols-3 gap-7">
                <div className="space-y-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>{group.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <span className="font-semibold">Profile Type:</span>{" "}
                            {getBusinessTypeDisplay(group.businessType)}
                        </CardContent>
                    </Card>

                    <Card className="p-3">
                        <CardHeader className="p-0">
                            <CardTitle className="font-bold text-lg p-0 pb-1 border-b">
                                Corporate Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            <span className="flex justify-between">
                                <p className="font-semibold">Business Type</p>
                                <p>{getBusinessTypeDisplay(group.businessType)}</p>
                            </span>
                            <span className="flex justify-between">
                                <p className="font-semibold">Business Address</p>
                                <p>
                                    {group.address.country} {group.address.city}
                                </p>
                            </span>
                        </CardContent>
                    </Card>

                    <Card className="p-3">
                        <CardHeader className="p-0">
                            <CardTitle className="font-bold text-lg p-0 pb-1 border-b">
                                Contact Person
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            <span className="flex justify-between">
                                <p className="font-semibold">Name</p>
                                <p>{group.primaryContact.name}</p>
                            </span>
                            <span className="flex justify-between">
                                <p className="font-semibold">Email Address</p>
                                <p>{group.primaryContact.email}</p>
                            </span>
                            <span className="flex justify-between">
                                <p className="font-semibold">Phone Number</p>
                                <p>{group.primaryContact.phone}</p>
                            </span>
                        </CardContent>
                    </Card>

                    <Card className="p-3">
                        <CardHeader className="p-0">
                            <CardTitle className="font-bold text-lg p-0 pb-1 border-b">
                                Special Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            {group.specialRequirements ? (
                                group.specialRequirements
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    No special requests
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle>Linked Guests</CardTitle>
                        <Button onClick={() => setDialogOpen(true)} className="h-7" disabled={loading}>
                            + Add Guests
                        </Button>
                    </CardHeader>

                    <ScrollArea className="h-[30rem] px-2">
                        {loading ? (
                            <div className=" space-y-3">
                                <Skeleton className="w-full h-20" />
                                <Skeleton className="w-full h-20" />
                                <Skeleton className="w-full h-20" />
                                <Skeleton className="w-full h-20" />
                                <Skeleton className="w-full h-20" />
                            </div>
                        ) :
                            linkedGuestsToGroup.map((guest) => (
                                <div
                                    key={guest.id}
                                    className="grid-cols-5 grid items-center gap-3 p-3 bg-hms-accent/10 mb-2 rounded-lg hover:bg-hms-accent/30 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/guests-profile/${guest.id}/view`)}
                                >
                                    <Avatar className="h-10 w-10 bg-hms-accent-35 rounded-full flex justify-center items-center">
                                        <AvatarImage />
                                        <AvatarFallback>
                                            {guest.firstName.charAt(0).toUpperCase()}
                                            {guest.lastName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex justify-between col-span-3">
                                        <p className="font-medium text-gray-900">
                                            {guest.firstName} {guest.lastName}
                                            {guest.email && (
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Mail className="h-3 w-3" />
                                                    {guest.email}
                                                </div>
                                            )}
                                            {guest.phoneNumber && (
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Phone className="h-3 w-3" />
                                                    {guest.phoneNumber}
                                                </div>
                                            )}
                                        </p>

                                    </div>

                                </div>
                            ))}
                    </ScrollArea>

                </Card>

                <Card className="p-3">
                    <CardHeader className="p-0">
                        <CardTitle className="font-bold text-lg p-0 pb-1 border-b">
                            Reservation History / Upcoming Stays
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2">
                        {/* Reservation content goes here */}
                    </CardContent>
                </Card>
            </div>

            <GuestSelectionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onGuestSelect={handleGuestSelect}
                guestsData={allGuests}
            />
        </div >
    );
};

export default GroupProfileExpanded;

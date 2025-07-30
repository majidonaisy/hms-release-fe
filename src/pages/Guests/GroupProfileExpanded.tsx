import { Button } from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card";
import { getGroupProfileById } from "@/services/Guests";
import { GroupProfileResponse } from "@/validation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronLeft, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const GroupProfileExpanded = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [group, setGroup] = useState<GroupProfileResponse['data'] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getBusinessTypeDisplay = (businessType: string) => {
        const businessTypeMap = {
            "CORPORATE": "Corporate",
            "TRAVEL_AGENCY": "Travel Agency",
            "EVENT_PLANNER": "Event Planner",
            "GOVERNMENT": "Government",
            "OTHER": "Other"
        };
        return businessTypeMap[businessType as keyof typeof businessTypeMap] || businessType;
    };

    useEffect(() => {
        const fetchGuestData = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const guestResponse = await getGroupProfileById(id);
                setGroup(guestResponse.data);

            } catch (error: any) {
                console.error('Error fetching guest data:', error);
                setError(error.userMessage || 'Failed to load guest data');
            } finally {
                setLoading(false);
            }
        };

        fetchGuestData();
    }, [id, location.state]);

    if (loading && !group) {
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
                    <h1 className="text-2xl font-semibold text-gray-900">Loading...</h1>
                </div>
            </div>
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
                        {error || 'Guest Not Found'}
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
                <h1 className="text-xl font-bold">
                    Group Profile
                </h1>
            </div>

            <div className="grid grid-cols-3 gap-7">
                <div className="space-y-3">
                    <Card className="text-center gap-2">
                        <CardHeader className="">
                            <CardTitle className="text-xl font-bold">
                                {group.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="">
                            <span className="font-semibold">Profile Type: </span>
                            {getBusinessTypeDisplay(group.businessType)}
                        </CardContent>
                    </Card>
                    <Card className='p-3 gap-2'>
                        <CardHeader className='p-0'>
                            <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                                Corporate Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            <span className="flex justify-between">
                                <p className="font-semibold">Business Type</p>
                                <p>
                                    {getBusinessTypeDisplay(group.businessType)}
                                </p>
                            </span>
                            <span className="flex justify-between">
                                <p className="font-semibold">Business Address</p>
                                <p>
                                    {group.address.country} {group.address.city}
                                </p>
                            </span>
                        </CardContent>
                    </Card>
                    <Card className='p-3 gap-2'>
                        <CardHeader className='p-0'>
                            <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                                Contact Person
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            <span className="flex justify-between">
                                <p className="font-semibold">Name</p>
                                <p>
                                    {group.primaryContact.name}
                                </p>
                            </span>
                            <span className="flex justify-between">
                                <p className="font-semibold">Email Address</p>
                                <p>
                                    {group.primaryContact.email}
                                </p>
                            </span>
                            <span className="flex justify-between">
                                <p className="font-semibold">Phone Number</p>
                                <p>
                                    {group.primaryContact.phone}
                                </p>
                            </span>
                        </CardContent>
                    </Card>
                    <Card className='p-3 gap-2'>
                        <CardHeader className='p-0'>
                            <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                                Special Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            {group.specialRequirements ? group.specialRequirements : (
                                <div className="text-center text-muted-foreground">
                                    No special requests
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <Card className='p-3 gap-2'>
                    <CardHeader className='p-0'>
                        <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                            Linked Guests
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2">
                        {group.LinkedGuests && group.LinkedGuests.length > 0 ? (
                            <div className="space-y-3">
                                {group.LinkedGuests.map((guest) => (
                                    <div
                                        key={guest.id}
                                        className="flex items-center gap-3 p-3 bg-hms-accent/10 rounded-lg hover:bg-hms-accent/50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/guests-profile/${guest.id}/view`)}
                                    >
                                        <Avatar className="h-10 w-10 bg-hms-accent-35 rounded-full flex justify-center items-center">
                                            <AvatarImage />
                                            <AvatarFallback>
                                                {guest.firstName.charAt(0).toUpperCase()}
                                                {guest.lastName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {guest.firstName} {guest.lastName}
                                            </p>
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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-lg font-medium">No linked guests</p>
                                <p className="text-sm">This group profile has no linked individual guests yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className='p-3 gap-2'>
                    <CardHeader className='p-0'>
                        <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                            Reservation History / Upcoming Stays
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2">

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default GroupProfileExpanded
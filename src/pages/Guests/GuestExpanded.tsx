import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Label } from '@/components/atoms/Label';
import { getGuestById } from '@/services/Guests';
import { GetGuestByIdResponse, RoomType } from '@/validation';
import { getRoomTypes } from '@/services/RoomTypes';

const GuestProfileView = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [guest, setGuest] = useState<GetGuestByIdResponse | null>(null);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

    useEffect(() => {
        const fetchGuestData = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                // Get guest data
                const guestResponse = await getGuestById(id);
                setGuest(guestResponse);

                const roomTypesResponse = await getRoomTypes();
                setRoomTypes(roomTypesResponse.data);

            } catch (error: any) {
                console.error('Error fetching guest data:', error);
                setError(error.userMessage || 'Failed to load guest data');
            } finally {
                setLoading(false);
            }
        };

        fetchGuestData();
    }, [id, location.state]);

    const roomTypeMap = roomTypes.reduce((map, roomType) => {
        map[roomType.id] = roomType.name;
        return map;
    }, {} as Record<string, string>);

    const formatDate = (dateString: Date): string => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (loading) {
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

    if (error || !guest) {
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
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="p-1"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">Guest Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Guest Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <Card className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-center mb-4">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src="" alt={`${guest.data.firstName} ${guest.data.lastName}`} />
                                <AvatarFallback className="text-2xl">
                                    {guest.data.firstName.charAt(0).toUpperCase()}{guest.data.lastName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="text-center mb-4">
                            <h2 className="text-xl font-semibold">{guest.data.firstName} {guest.data.lastName}</h2>
                            <Badge className="bg-blue-100 text-blue-700 border-0 mb-2">
                                {/* {guest.data.profileType || 'Individual'} */}
                            </Badge>
                        </div>

                    </Card>

                    {/* Personal Info Card */}
                    <Card className="p-3">
                        <CardHeader className='p-0'>
                            <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                                Personal Info
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0 space-y-3">
                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Full Name</Label>
                                <p>{guest.data.firstName} {guest.data.lastName}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Email</Label>
                                <p>{guest.data.email}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Phone Number</Label>
                                <p>{guest.data.phoneNumber}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Date of Birth</Label>
                                <p>{formatDate(guest.data.dob)}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Nationality</Label>
                                <p>{guest.data.nationality || '-'}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Guest ID</Label>
                                <p>{guest.data.gid || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents Card
                    {guest.data.documents && guest.data.documents.length > 0 && (
                        <Card className="p-3">
                            <CardHeader className='p-0'>
                                <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                                    ID, Passport, or Other Legal Documents
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-0 space-y-3">
                                {guest.data.documents.map((doc, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm font-medium">{doc.type}</span>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleViewDocument(doc.url)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDownloadDocument(doc.url)}
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )} */}
                </div>

                {/* Middle Column - Preferences */}
                <Card className="p-3">
                    <CardHeader className='p-0'>
                        <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                            Special Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                        <div className='flex justify-between items-center'>
                            <Label className="font-semibold">Preferred Room</Label>
                            <p>{guest.data.preferences?.roomType ? roomTypeMap[guest.data.preferences.roomType] || 'Unknown' : '-'}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <Label className="font-semibold">Smoking Preference</Label>
                            <p>{guest.data.preferences?.smoking ? 'Smoking' : 'No Smoking'}</p>
                        </div>
                        {/* {guest.data.preferences?.specialRequests && guest.data.preferences.specialRequests.length > 0 && (
                            <div className="mt-4">
                                <Label className="font-semibold">Special Requests</Label>
                                <div className="space-y-1 mt-2">
                                    {guest.data.preferences.specialRequests.map((request, index) => (
                                        <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                                            • {request}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}
                    </CardContent>
                </Card>

                {/* Right Column - Reservation History */}
                <Card className="p-3">
                    <CardHeader className='p-0'>
                        <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                            Reservation History / Upcoming Stays
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center rounded-lg border px-1">
                                <Input
                                    type="text"
                                    placeholder="Search here"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="border-none outline-none focus-visible:ring-0 bg-transparent text-sm h-5"
                                />
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <Button variant="outline" className='h-6'>
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <p className='text-sm text-muted-foreground'>Filter</p>
                            </Button>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};

export default GuestProfileView;
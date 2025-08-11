import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Filter, Calendar as CalendarIcon, CloudUpload, Plus, DoorOpen, Calendar1, Pin } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/molecules/Popover';
import { Calendar } from '@/components/molecules/Calendar';
import { Switch } from '@/components/atoms/Switch';
import { format } from 'date-fns';
import { deleteGuest, getGuestById, updateGuest } from '@/services/Guests';
import { RoomType, GetReservationByGuestId } from '@/validation';
import { getRoomTypes } from '@/services/RoomTypes';
import { toast } from 'sonner';
import DeleteDialog from "../../components/molecules/DeleteDialog";
import { getReservationByGuestId } from '@/services/Reservation';
import { AddGuestRequest, GetGuestByIdResponse } from '@/validation/schemas/Guests';

const GuestProfileView = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [guestToDelete, setGuestToDelete] = useState<GetGuestByIdResponse['data'] | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [reservationData, setReservationData] = useState<GetReservationByGuestId | null>(null)
    const [guest, setGuest] = useState<GetGuestByIdResponse | null>(null);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [formData, setFormData] = useState<AddGuestRequest>({
        firstName: '',
        lastName: '',
        dob: new Date(),
        nationality: '',
        email: '',
        phoneNumber: '',
        identification: {
            type: 'passport',
            number: '1234'
        },
        preferences: {
            smoking: false,
            roomType: '',
        }
    });

    useEffect(() => {
        const fetchGuestData = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const guestResponse = await getGuestById(id);
                setGuest(guestResponse);
                setFormData({
                    firstName: guestResponse.data.firstName,
                    lastName: guestResponse.data.lastName,
                    dob: guestResponse.data.dob,
                    nationality: guestResponse.data.nationality,
                    email: guestResponse.data.email,
                    phoneNumber: guestResponse.data.phoneNumber,
                    identification: guestResponse.data.identification || {
                        type: 'passport',
                        number: '1234'
                    },
                    preferences: {
                        smoking: guestResponse.data.preferences?.smoking || false,
                        roomType: guestResponse.data.preferences?.roomType || '',
                    }
                });

                const roomTypesResponse = await getRoomTypes();
                setRoomTypes(roomTypesResponse.data);

            } catch (error: any) {
                console.error('Error fetching guest data:', error);
                setError(error.userMessage || 'Failed to load guest data');
            } finally {
                setLoading(false);
            }
        };

        const getGuestHistory = async () => {
            try {
                const history = await getReservationByGuestId(id || '')
                setReservationData(history)
            } catch (err) {
                console.error(err)
            }
        }

        fetchGuestData();
        getGuestHistory()
    }, [id, location.state]);

    const handleInputChange = (field: keyof AddGuestRequest | 'preferences.roomType', value: string) => {
        if (field === 'preferences.roomType') {
            setFormData((prev: AddGuestRequest) => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    roomType: value
                }
            }));
        } else {
            setFormData((prev: AddGuestRequest) => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev: AddGuestRequest) => ({
            ...prev,
            photo: file
        }));
    };

    const handleSaveEdit = async () => {
        if (!id) return;

        setLoading(true);
        try {
            await updateGuest(id, formData);
            toast("Success!", {
                description: "Guest was updated successfully.",
            });

            // Refresh guest data
            const guestResponse = await getGuestById(id);
            setGuest(guestResponse);
            setIsEditMode(false);
        } catch (error) {
            toast("Error!", {
                description: "Failed to update guest.",
            });
            console.error("Failed to update guest:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        if (guest) {
            // Reset form data to original values
            setFormData({
                firstName: guest.data.firstName,
                lastName: guest.data.lastName,
                dob: guest.data.dob,
                nationality: guest.data.nationality,
                email: guest.data.email,
                phoneNumber: guest.data.phoneNumber,
                identification: guest.data.identification || {
                    type: 'passport',
                    number: '1234'
                },
                preferences: {
                    smoking: guest.data.preferences?.smoking || false,
                    roomType: guest.data.preferences?.roomType || '',
                }
            });
        }
        setIsEditMode(false);
    };

    const handleDeleteGuest = async () => {
        setLoading(true);
        if (guestToDelete) {
            try {
                await deleteGuest(guestToDelete.id);
                setDeleteDialogOpen(false);
                setGuestToDelete(null);
                navigate('/guests-profile');
                toast("Success!", {
                    description: "Guest was deleted successfully.",
                });
            } catch (error) {
                if (error instanceof Error && 'userMessage' in error) {
                    console.error("Failed to delete guest:", (error as any).userMessage);
                } else {
                    console.error("Failed to delete guest:", error);
                }
            } finally {
                setLoading(false);
            }
        }
    };

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

    const formatHistoryDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short'
        });
    };

    const handleDeleteCancel = (): void => {
        setDeleteDialogOpen(false);
        setGuestToDelete(null);
    };

    if (loading && !guest) {
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
                <h1 className="text-xl font-bold">
                    {isEditMode ? 'Edit Guest Profile' : 'Guest Profile'}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Guest Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <Card className="bg-white rounded-lg shadow p-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-semibold">
                                {isEditMode ?
                                    `${formData.firstName} ${formData.lastName}` :
                                    `${guest.data.firstName} ${guest.data.lastName}`
                                }
                            </h2>
                            <CardContent className="">
                                <span className="font-semibold">Profile Type: </span>
                                Individual
                            </CardContent>
                        </div>

                        <div className='flex gap-2 text-center justify-center'>
                            {isEditMode ? (
                                <>
                                    <Button
                                        onClick={handleSaveEdit}
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button
                                        variant='primaryOutline'
                                        onClick={handleCancelEdit}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => setIsEditMode(true)}>
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant='primaryOutline'
                                        onClick={() => {
                                            setGuestToDelete(guest.data);
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        Delete Profile
                                    </Button>
                                </>
                            )}
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
                                <Label className="font-semibold">First Name</Label>
                                {isEditMode ? (
                                    <Input
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className='w-40 h-8 text-sm'
                                        placeholder='John'
                                    />
                                ) : (
                                    <p>{guest.data.firstName}</p>
                                )}
                            </div>

                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Last Name</Label>
                                {isEditMode ? (
                                    <Input
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className='w-40 h-8 text-sm'
                                        placeholder='Doe'
                                    />
                                ) : (
                                    <p>{guest.data.lastName}</p>
                                )}
                            </div>

                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Email</Label>
                                {isEditMode ? (
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className='w-40 h-8 text-sm'
                                        placeholder='john.doe@example.com'
                                    />
                                ) : (
                                    <p>{guest.data.email}</p>
                                )}
                            </div>

                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Phone Number</Label>
                                {isEditMode ? (
                                    <Input
                                        type='tel'
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                        className='w-40 h-8 text-sm'
                                        placeholder='1234567890'
                                    />
                                ) : (
                                    <p>{guest.data.phoneNumber}</p>
                                )}
                            </div>

                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Date of Birth</Label>
                                {isEditMode ? (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                data-empty={!formData.dob}
                                                className="data-[empty=true]:text-muted-foreground w-40 h-8 justify-start text-left font-normal text-sm"
                                            >
                                                <CalendarIcon className="h-3 w-3" />
                                                {formData.dob ? format(formData.dob, "dd/MM/yyyy") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.dob}
                                                onSelect={(date) => date && setFormData({ ...formData, dob: date })}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <p>{formatDate(guest.data.dob)}</p>
                                )}
                            </div>

                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Nationality</Label>
                                {isEditMode ? (
                                    <Input
                                        value={formData.nationality}
                                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                                        className='w-40 h-8 text-sm'
                                        placeholder='US'
                                    />
                                ) : (
                                    <p>{guest.data.nationality || '-'}</p>
                                )}
                            </div>

                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Guest ID</Label>
                                <p>{guest.data.gid || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='space-y-6'>
                    <Card className='p-3'>
                        <CardHeader className='p-0'>
                            <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                                ID, Passport, Legal Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                            {isEditMode ? (
                                <div className="border border-slate-300 rounded-lg p-5 text-center">
                                    <div className='flex justify-center'>
                                        <CloudUpload className="" />
                                    </div>
                                    <p className="text-muted-foreground text-sm">Drag & drop or click to choose file</p>
                                    <Label htmlFor="photo-upload" className="cursor-pointer justify-center">
                                        <Button type="button" variant="foreground" className='px-3 mt-2'>
                                            <Plus />
                                        </Button>
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </Label>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center">No documents uploaded</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="p-3">
                        <CardHeader className='p-0'>
                            <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                                Special Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-3">
                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Preferred Room</Label>
                                {isEditMode ? (
                                    <Select
                                        value={formData.preferences.roomType}
                                        onValueChange={(value) => handleInputChange('preferences.roomType', value)}
                                    >
                                        <SelectTrigger className='w-40 h-8 text-sm'>
                                            <SelectValue placeholder="Select Room" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roomTypes.map((type) => (
                                                <SelectItem key={type.id} value={type.id}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p>{guest.data.preferences?.roomType ? roomTypeMap[guest.data.preferences.roomType] || 'Unknown' : '-'}</p>
                                )}
                            </div>

                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Smoking Preference</Label>
                                {isEditMode ? (
                                    <Switch
                                        checked={formData.preferences.smoking}
                                        onCheckedChange={(checked) =>
                                            setFormData((prev: AddGuestRequest) => ({
                                                ...prev,
                                                preferences: {
                                                    ...prev.preferences,
                                                    smoking: checked,
                                                },
                                            }))
                                        }
                                        className='data-[state=checked]:bg-hms-primary'
                                    />
                                ) : (
                                    <p>{guest.data.preferences?.smoking ? 'Smoking' : 'No Smoking'}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="p-3">
                    <CardHeader className='p-0'>
                        <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                            Reservation History
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
                    <CardContent className='space-y-3 px-0'>
                        {reservationData?.data.map((reservation) => (
                            <Card key={reservation.id} className='bg-hms-accent/15 px-2 gap-2'>
                                <span className='flex justify-between'>
                                    <p className='flex gap-1 items-center font-semibold'>
                                        <DoorOpen className='size-4' />
                                        Room(s):
                                    </p>
                                    <span className='text-sm'>
                                        {reservation.rooms.map((room) => (
                                            <p key={room.id}>{room.roomNumber}</p>
                                        ))}
                                    </span>
                                </span>
                                <span className='flex justify-between'>
                                    <p className='flex gap-1 items-center font-semibold'>
                                        <Calendar1 className='size-4' />
                                        Stay Dates:
                                    </p>
                                    <p className='text-sm'>
                                        {formatHistoryDate(reservation.checkIn)} - {formatHistoryDate(reservation.checkOut)}
                                    </p>
                                </span>
                                <span className='flex justify-between'>
                                    <p className='flex gap-1 items-center font-semibold'>
                                        <Pin className='size-4' />
                                        Status:
                                    </p>
                                    <p className='text-sm'>
                                        {reservation.status.replace('_', ' ').charAt(0) + reservation.status.slice(1).replace('_', " ").toLowerCase()}
                                    </p>
                                </span>
                            </Card>
                        ))}
                    </CardContent>
                </Card>

                <DeleteDialog
                    isOpen={isDeleteDialogOpen}
                    onCancel={handleDeleteCancel}
                    onConfirm={handleDeleteGuest}
                    loading={loading}
                    title="Delete Guest"
                    description={`Are you sure you want to delete guest ${guestToDelete?.firstName} ${guestToDelete?.lastName}? This action cannot be undone.`}
                />
            </div>
        </div>
    );
};

export default GuestProfileView;
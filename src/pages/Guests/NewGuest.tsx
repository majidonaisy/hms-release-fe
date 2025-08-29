import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Calendar as CalendarIcon, Check, ChevronLeft, CloudUpload, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/molecules/Popover';
import { Calendar } from '@/components/molecules/Calendar';
import { format } from 'date-fns';
import { GetRoomTypesResponse } from '@/validation';
import { addGuest, getGuestById, updateGuest } from '@/services/Guests';
import { getRoomTypes } from '@/services/RoomTypes';
import { Switch } from '@/components/atoms/Switch';
import { toast } from 'sonner';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogDescription, DialogTitle } from '@/components/Organisms/Dialog';
import EditingSkeleton from '@/components/Templates/EditingSkeleton';
import { AddGuestRequest } from '@/validation/schemas/Guests';
import { getCountries } from '@/services/Hotel';
import { useDebounce } from '@/hooks/useDebounce';

const NewGuest = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [guestLoading, setGuestLoading] = useState(false);
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
    const [roomTypes, setRoomTypes] = useState<GetRoomTypesResponse['data']>([]);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const { id } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [guestCreatedDialog, setGuestCreatedDialog] = useState(false);
    const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);
    const [countrySearch, setCountrySearch] = useState("");
    const debouncedCountrySearch = useDebounce(countrySearch, 400);
    const [countriesLoading, setCountriesLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            const fetchGuest = async () => {
                setGuestLoading(true);
                try {
                    const guest = await getGuestById(id);
                    setFormData(guest.data);
                } catch (error) {
                    console.error("Failed to fetch guest:", error);
                } finally {
                    setGuestLoading(false);
                }
            };
            fetchGuest();
        }
    }, [id]);

    const handleInputChange = (field: keyof AddGuestRequest | 'preferences.roomType', value: string) => {
        if (field === 'preferences.roomType') {
            setFormData((prev: AddGuestRequest) => {
                const updatedFormData = {
                    ...prev,
                    preferences: {
                        ...prev.preferences,
                        roomType: value
                    }
                };
                return updatedFormData;
            });
        } else {
            setFormData((prev: AddGuestRequest) => {
                const updatedFormData = {
                    ...prev,
                    [field]: value
                };
                return updatedFormData;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev: AddGuestRequest) => ({
            ...prev,
            photo: file
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({});
        // Validate using Zod
        const result = AddGuestRequestSchema.safeParse(formData);
        if (!result.success) {
            // Extract errors
            const errors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                const path = err.path.join('.');
                errors[path] = err.message;
            });
            setValidationErrors(errors);
            setLoading(false);
            return;
        }
        try {
            if (isEditMode) {
                if (id) {
                    await updateGuest(id, formData);
                    toast.success("Success!", {
                        description: "Guest was updated successfully.",
                    })
                } else {
                    console.error("Guest ID is undefined.");
                }
            } else {
                await addGuest(formData);
                toast.success("Success!", {
                    description: "Guest was created successfully.",
                })
            }
            setGuestCreatedDialog(true)
        } catch (error: any) {
            toast.error("Error!", {
                description: error.userMessage,
            });
            console.error("Failed to submit form:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleGetRoomTypes = async () => {
            try {
                const roomTypes = await getRoomTypes();
                setRoomTypes(roomTypes.data);
            } catch (error) {
                console.error(error);
            }
        };

        handleGetRoomTypes();
    }, []);

    // Fixed countries fetch - similar pattern to guest search in reservation
    useEffect(() => {
        const handleGetCountries = async () => {
            setCountriesLoading(true);
            try {
                const response = await getCountries({ q: debouncedCountrySearch });
                setCountries(response.data);
            } catch (error) {
                console.error("Error fetching countries:", error);
                setCountries([]);
            } finally {
                setCountriesLoading(false);
            }
        };
        handleGetCountries();
    }, [debouncedCountrySearch]);

    const clearCountrySearch = () => {
        setCountrySearch("");
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            {guestLoading && (
                <EditingSkeleton />
            )}
            <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="p-0"
                    >
                        <ChevronLeft className="" />
                    </Button>
                    <h1 className="text-xl font-bold">{isEditMode ? 'Edit Guest' : 'New Guest'}</h1>
                </div>
                <form
                    onSubmit={(e) => {
                        handleSubmit(e);
                    }}
                    className='px-7 grid grid-cols-2'
                >
                    <div className='space-y-5'>
                        <h2 className='text-lg font-bold'>Personal Info</h2>

                        <div className='space-y-1'>
                            <Label>First Name</Label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className='border border-slate-300'
                                placeholder='John'
                            />
                            {validationErrors.firstName && (
                                <span className="text-red-500 text-xs">{validationErrors.firstName}</span>
                            )}
                        </div>

                        <div className='space-y-1'>
                            <Label>Last Name</Label>
                            <Input
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className='border border-slate-300'
                                placeholder='Doe'
                            />
                            {validationErrors.lastName && (
                                <span className="text-red-500 text-xs">{validationErrors.lastName}</span>
                            )}
                        </div>

                        <div className='space-y-1'>
                            <Label>Date of Birth</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!formData.dob}
                                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon />
                                        {formData.dob ? format(formData.dob, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.dob}
                                        onSelect={(date) => date && setFormData({ ...formData, dob: date })}
                                        captionLayout="dropdown"
                                        startMonth={new Date(1900, 0)}
                                        endMonth={new Date(new Date().getFullYear(), 11)}
                                        defaultMonth={formData.dob}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className='space-y-1'>
                            <Label>Nationality</Label>
                            <div className="relative">
                                <Select
                                    value={formData.nationality}
                                    onValueChange={(value) => handleInputChange('nationality', value)}
                                  
                                >
                                    <SelectTrigger className='w-full border border-slate-300'>
                                        <SelectValue placeholder="Select Nationality" />
                                    </SelectTrigger>
                                    <SelectContent 
                                        onKeyDown={(e) => {
                                            if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        <div className="p-2">
                                            <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3">
                                                <Input
                                                    type="text"
                                                    placeholder="Search countries..."
                                                    value={countrySearch}
                                                    onChange={e => setCountrySearch(e.target.value)}
                                                    className="w-full h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
                                                    onKeyDown={(e) => {
                                                        // Stop propagation to prevent triggering Select's keyboard navigation
                                                        e.stopPropagation();
                                                    }}
                                                />
                                                {countrySearch && (
                                                    <button
                                                        onClick={clearCountrySearch}
                                                        className="text-gray-400 hover:text-gray-600 mr-2 text-sm font-medium cursor-pointer"
                                                        aria-label="Clear search"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                                <CalendarIcon className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                        {countriesLoading ? (
                                            <SelectItem value="loading" disabled>
                                                Loading countries...
                                            </SelectItem>
                                        ) : countries.length > 0 ? (
                                            countries.map((country) => (
                                                <SelectItem key={country.code} value={country.code}>
                                                    {country.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-results" disabled>
                                                No countries found.
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className='space-y-1'>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className='border border-slate-300'
                                placeholder='john.doe@example.com'
                            />
                            {validationErrors.email && (
                                <span className="text-red-500 text-xs">{validationErrors.email}</span>
                            )}
                        </div>

                        <div className='space-y-1'>
                            <Label>Phone Number</Label>
                            <Input
                                type='number'
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                className='border border-slate-300'
                                placeholder='1234567890'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Preferred Room Type</Label>
                            <Select
                                value={formData.preferences.roomType}
                                onValueChange={(value) => handleInputChange('preferences.roomType', value)}
                            >
                                <SelectTrigger className='w-full border border-slate-300'>
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
                        </div>
                    </div>

                    <div className='px-5 space-y-3'>
                        <div className='space-y-5'>
                            <div className='space-y-1'>
                                <Label className=''>Upload ID, Passport, or Other Legal Documents</Label>
                                <div className="border border-slate-300 rounded-lg p-5 text-center">
                                    <div className='flex justify-center'>
                                        <CloudUpload className="" />
                                    </div>
                                    <p className="text-muted-foreground text-sm">Drag & drop or click to choose file</p>
                                    <Label htmlFor="photo-upload" className="cursor-pointer justify-center">
                                        <Button type="button" variant="foreground" className='px-3'>
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
                            </div>

                            <div className='space-y-1'>
                                <Label>Special Requests</Label>

                                <div className='px-7 py-3 flex justify-between'>
                                    <Label>Smoking?</Label>
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
                                        className='border border-slate-300 data-[state=checked]:bg-hms-primary'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-3 pt-6 col-span-2">
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
                                    ? "Update Guest"
                                    : "Create Guest"}
                        </Button>
                    </div>
                </form>

                <Dialog open={guestCreatedDialog} onOpenChange={() => setGuestCreatedDialog(false)}>
                    <DialogContent className='w-fit flex flex-col items-center text-center'>
                        <DialogHeader>
                            <DialogTitle className="flex flex-col items-center gap-2">
                                <Check className="bg-green-500 text-white rounded-full p-1 w-6 h-6" />
                                The guest profile has been created
                            </DialogTitle>

                        </DialogHeader>
                        <DialogDescription>
                            Would you like to create a reservation for this guest now or later?
                        </DialogDescription>
                        <DialogFooter>
                            <Button onClick={() => { setGuestCreatedDialog(false); navigate('/guests-profile') }} variant='background'>
                                Maybe Later
                            </Button>
                            <Button onClick={() => navigate('/new-reservation/new-individual-reservation')}>
                                Create Reservation
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div >
        </>
    );
};

export default NewGuest;
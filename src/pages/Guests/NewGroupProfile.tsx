import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { ChevronLeft, X, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AddGroupProfileRequest, GetGuestsResponse, UpdateGroupProfileRequest } from '@/validation/schemas/Guests';
import { addGroupProfile, getGuests, linkGuestsToGroup, getGroupProfileById, updateGroupProfile } from '@/services/Guests';
import { toast } from 'sonner';
import { Switch } from '@/components/atoms/Switch';
import { Card, CardContent, CardFooter } from '@/components/Organisms/Card';
import { Avatar, AvatarFallback } from '@/components/atoms/Avatar';
import { GuestSelectionDialog } from '@/components/dialogs/AddGuestDialog';
import EditingSkeleton from '@/components/Templates/EditingSkeleton';
import { Guest } from '@/validation/schemas/Guests';
import { getCountries } from '@/services/Hotel';
import { useDebounce } from '@/hooks/useDebounce';

const NewGroupProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [createLoading, setCreateLoading] = useState(false);
    const [groupLoading, setGroupLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [formData, setFormData] = useState<AddGroupProfileRequest>({
        address: {
            city: '',
            country: '',
        },
        billingAddress: {
            city: '',
            country: '',
        },
        businessType: 'CORPORATE',
        email: '',
        isVip: false,
        legalName: '',
        name: '',
        notes: '',
        phone: '',
        primaryContact: {
            email: '',
            name: '',
            phone: ''
        },
        specialRequirements: '',
    });
    const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);
    const [countrySearch, setCountrySearch] = useState("");
    const debouncedCountrySearch = useDebounce(countrySearch, 400);
    const [countriesLoading, setCountriesLoading] = useState(false);

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

    // Clear search function
    const clearCountrySearch = () => {
        setCountrySearch("");
    };

    const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);
    const businessTypeOptions = [
        { value: "CORPORATE", label: "Corporate" },
        { value: "TRAVEL_AGENCY", label: "Travel Agency" },
        { value: "EVENT_PLANNER", label: "Event Planner" },
        { value: "GOVERNMENT", label: "Government" },
        { value: "OTHER", label: "Other" }
    ];
    const [guests, setGuests] = useState<GetGuestsResponse["data"]>([])
    const [linkedGuests, setLinkedGuests] = useState<GetGuestsResponse["data"]>([])
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            const fetchGroup = async () => {
                setGroupLoading(true);
                try {
                    const groupResponse = await getGroupProfileById(id);
                    const groupData = groupResponse.data;

                    setFormData({
                        address: groupData.address || { city: '', country: '' },
                        billingAddress: groupData.billingAddress || { city: '', country: '' },
                        businessType: groupData.businessType,
                        email: groupData.email,
                        isVip: groupData.isVip || false,
                        legalName: groupData.legalName || '',
                        name: groupData.name,
                        notes: groupData.notes || '',
                        phone: groupData.phone,
                        primaryContact: groupData.primaryContact || { email: '', name: '', phone: '' },
                        specialRequirements: groupData.specialRequirements || '',
                    });

                    setLinkedGuests(groupData.LinkedGuests || []);
                    setCreatedGroupId(id);
                } catch (error) {
                    console.error("Failed to fetch group:", error);
                    toast.error("Error!", {
                        description: "Failed to load group data.",
                    });
                } finally {
                    setGroupLoading(false);
                }
            };
            fetchGroup();
        }
    }, [id]);

    useEffect(() => {
        const handleGetGuests = async () => {
            setGroupLoading(true)
            try {
                const response = await getGuests()
                setGuests(response.data)
            } catch (error) {
                console.error(error)
            } finally {
                setGroupLoading(false)
            }
        }

        handleGetGuests()
    }, [])

    const handleInputChange = (field: keyof AddGroupProfileRequest, value: string | boolean) => {
        setFormData((prev: AddGroupProfileRequest) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNestedInputChange = <T extends keyof AddGroupProfileRequest>(
        parentField: T,
        childField: keyof AddGroupProfileRequest[T],
        value: string
    ) => {
        setFormData((prev: AddGroupProfileRequest) => ({
            ...prev,
            [parentField]: {
                ...(prev[parentField] as object),
                [childField]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreateLoading(true);

        try {
            if (isEditMode && id) {
                // Update existing group
                const updateData: UpdateGroupProfileRequest = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    businessType: formData.businessType,
                    isVip: formData.isVip,
                    notes: formData.notes,
                    specialRequirements: formData.specialRequirements
                };

                await updateGroupProfile(id, updateData);

                if (linkedGuests.length > 0) {
                    const guestIds = linkedGuests.map((guest: Guest) => guest.id);
                    try {
                        await linkGuestsToGroup(guestIds, id);
                        toast.success("Success!", {
                            description: "Group profile updated and guests linked successfully.",
                        });
                    } catch (linkError) {
                        console.error("Failed to link guests:", linkError);
                        toast.success("Partial Success", {
                            description: "Group profile updated but failed to link some guests.",
                        });
                    }
                } else {
                    toast.success("Success!", {
                        description: "Group profile updated successfully.",
                    });
                }

                navigate(`/group-profile/${id}/view`);
            } else {
                const response = await addGroupProfile(formData);
                const groupId = response.data?.id;
                setCreatedGroupId(groupId);

                if (linkedGuests.length > 0 && groupId) {
                    const guestIds = linkedGuests.map((guest: Guest) => guest.id);
                    try {
                        await linkGuestsToGroup(guestIds, groupId);
                        toast.success("Success!", {
                            description: "Group profile created and guests linked successfully.",
                        });
                    } catch (linkError) {
                        console.error("Failed to link guests:", linkError);
                        toast.success("Partial Success", {
                            description: "Group profile created but failed to link some guests.",
                        });
                    }
                } else {
                    toast.success("Success!", {
                        description: "Group profile created successfully.",
                    });
                }

                navigate('/guests-profile');
            }
        } catch (error) {
            toast.error("Error!", {
                description: isEditMode ? "Failed to update group profile." : "Failed to create group profile.",
            });
            console.error("Failed to submit form:", error);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleGuestSelect = async (selectedGuests: GetGuestsResponse["data"]) => {
        setLinkedGuests(selectedGuests);

        if (createdGroupId && isEditMode) {
            try {
                const guestIds = selectedGuests.map((guest: Guest) => guest.id);
                await linkGuestsToGroup(guestIds, createdGroupId);
                toast.success("Success!", {
                    description: "Guests linked to group successfully.",
                });
            } catch (error) {
                console.error("Failed to link guests:", error);
                toast.error("Error!", {
                    description: "Failed to link guests to group.",
                });
            }
        }
    };

    const handleBack = () => {
        if (isEditMode) {
            navigate(`/group-profile/${id}/view`);
        } else {
            navigate(-1);
        }
    };

    if (groupLoading) {
        return <EditingSkeleton />;
    }

    return (
        <>
            <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="p-0"
                    >
                        <ChevronLeft className="" />
                    </Button>
                    <h1 className="text-xl font-bold">
                        {isEditMode ? 'Edit Group Profile' : 'New Guest Profile'}
                    </h1>
                </div>

                <form
                    onSubmit={(e) => {
                        handleSubmit(e);
                    }}
                    className='px-7 grid grid-cols-2'
                >
                    <div className='space-y-5'>
                        <h2 className='text-lg font-bold'>Business Information</h2>

                        <div className='space-y-1'>
                            <Label>Business Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className='border border-slate-300'
                                placeholder='ABC Corporation'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Legal Business Name</Label>
                            <Input
                                value={formData.legalName}
                                onChange={(e) => handleInputChange('legalName', e.target.value)}
                                className='border border-slate-300'
                                placeholder='ABC Corporation Ltd.'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Type</Label>
                            <Select
                                value={formData.businessType}
                                onValueChange={(value) => handleInputChange('businessType', value)}
                            >
                                <SelectTrigger className='border border-slate-300 w-full'>
                                    <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businessTypeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-1'>
                            <Label>Email</Label>
                            <Input
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className='border border-slate-300'
                                placeholder='abc@example.com'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Phone Number</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className='border border-slate-300'
                                placeholder='1234567890'
                                type='number'
                            />
                        </div>

                        <div className='space-y-1'>
                            <h3 className='font-semibold'>Business Address</h3>

                            <div className='ml-5 space-y-2'>
                                <Label>Country</Label>
                                <Select
                                    value={formData.address.country}
                                    onValueChange={(value) => handleNestedInputChange('address', 'country', value)}
                                >
                                    <SelectTrigger className='w-full border border-slate-300'>
                                        <SelectValue placeholder="Select Country" />
                                    </SelectTrigger>
                                    <SelectContent
                                        onKeyDown={(e) => {
                                            // Prevent the default letter navigation behavior
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
                                                <Search className="h-4 w-4 text-gray-400" />
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

                                <Label>State</Label>
                                <Input
                                    value={formData.address.city}
                                    onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                                    className='border border-slate-300'
                                    placeholder='New York'
                                />
                            </div>
                        </div>

                        <div className='space-y-1'>
                            <h3 className='font-semibold'>Billing Address</h3>

                            <div className='ml-5 space-y-2'>
                                <Label>Country</Label>
                                <Select
                                    value={formData.billingAddress.country}
                                    onValueChange={(value) => handleNestedInputChange('billingAddress', 'country', value)}
                                >
                                    <SelectTrigger className='w-full border border-slate-300'>
                                        <SelectValue placeholder="Select Country" />
                                    </SelectTrigger>
                                    <SelectContent
                                        onKeyDown={(e) => {
                                            // Prevent the default letter navigation behavior
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
                                                <Search className="h-4 w-4 text-gray-400" />
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

                                <Label>City</Label>
                                <Input
                                    value={formData.billingAddress.city}
                                    onChange={(e) => handleNestedInputChange('billingAddress', 'city', e.target.value)}
                                    className='border border-slate-300'
                                    placeholder='New York'
                                />
                            </div>
                        </div>

                        <h2 className='text-lg font-bold'>Primary Contact Person</h2>

                        <div className='space-y-1'>
                            <Label>Name</Label>
                            <Input
                                value={formData.primaryContact.name}
                                onChange={(e) => handleNestedInputChange('primaryContact', 'name', e.target.value)}
                                className='border border-slate-300'
                                placeholder='John Doe'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Email</Label>
                            <Input
                                value={formData.primaryContact.email}
                                onChange={(e) => handleNestedInputChange('primaryContact', 'email', e.target.value)}
                                className='border border-slate-300'
                                placeholder='john.doe@example.com'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Phone Number</Label>
                            <Input
                                value={formData.primaryContact.phone}
                                onChange={(e) => handleNestedInputChange('primaryContact', 'phone', e.target.value)}
                                className='border border-slate-300'
                                placeholder='1234567890'
                                type='number'
                            />
                        </div>

                        <h2 className='text-lg font-bold'>Other Information</h2>

                        <div className='flex justify-between'>
                            <Label>Is VIP</Label>
                            <Switch
                                checked={formData.isVip}
                                onCheckedChange={(checked) => handleInputChange('isVip', checked)}
                                className='border border-slate-300 data-[state=checked]:bg-hms-primary'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Special Requirements</Label>
                            <Input
                                value={formData.specialRequirements}
                                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                                className='border border-slate-300'
                                placeholder='Special requirements for the group'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Notes</Label>
                            <Input
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                className='border border-slate-300'
                                placeholder='Additional notes about the group'
                            />
                        </div>
                    </div>

                    <div className='px-5 space-y-4'>
                        <h2 className='font-bold text-lg'>Linked Guests:</h2>

                        <Card className='bg-hms-accent/15 border-none'>
                            <CardContent className='space-y-4'>
                                {linkedGuests.length > 0 ? (
                                    linkedGuests.map((guest: Guest) => (
                                        <div key={guest.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-sm">
                                                        {guest.firstName.charAt(0)}{guest.lastName.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{guest.firstName} {guest.lastName}</p>
                                                    <p className="text-xs">{guest.email}</p>
                                                </div>
                                            </div>
                                            <Button variant="defaultLint" size="icon" onClick={() => {
                                                const updatedGuests = linkedGuests.filter(g => g.id !== guest.id)
                                                setLinkedGuests(updatedGuests)
                                            }}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center">No linked guests</p>
                                )}
                                <CardFooter className='flex justify-center'>
                                    <Button type="button" variant='defaultLint' onClick={() => setDialogOpen(true)}>+ Add a Guest</Button>
                                </CardFooter>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-center gap-3 pt-6 col-span-2">
                        <Button
                            type="submit"
                            variant="foreground"
                            className="px-8"
                            disabled={createLoading}
                        >
                            {createLoading
                                ? isEditMode
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditMode
                                    ? "Update Profile"
                                    : "Create Profile"}
                        </Button>
                    </div>
                </form>

                <GuestSelectionDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onGuestSelect={handleGuestSelect}
                    guestsData={guests}
                />
            </div >
        </>
    );
};

export default NewGroupProfile;
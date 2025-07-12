import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Check, ChevronLeft, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AddGroupProfileRequest, GetGuestsResponse } from '@/validation';
import { addGroupProfile, getGuests } from '@/services/Guests';
import { toast } from 'sonner';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogDescription, DialogTitle } from '@/components/Organisms/Dialog';
import { Switch } from '@/components/atoms/Switch';
import { Card, CardContent, CardFooter } from '@/components/Organisms/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';

const NewGroupProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
    const [guestCreatedDialog, setGuestCreatedDialog] = useState(false);
    const businessTypeOptions = [
        { value: "CORPORATE", label: "Corporate" },
        { value: "TRAVEL_AGENCY", label: "Travel Agency" },
        { value: "EVENT_PLANNER", label: "Event Planner" },
        { value: "GOVERNMENT", label: "Government" },
        { value: "OTHER", label: "Other" }
    ];
    const [guests, setGuests] = useState<GetGuestsResponse["data"]>([])
    const [linkedGuests, setLinkedGuests] = useState<GetGuestsResponse["data"]>([])

    useEffect(() => {
        const handleGetGuests = async () => {
            setLoading(true)
            try {
                const response = await getGuests()
                setGuests(response.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        handleGetGuests()
    }, [])

    const handleInputChange = (field: keyof AddGroupProfileRequest, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNestedInputChange = <T extends keyof AddGroupProfileRequest>(
        parentField: T,
        childField: keyof AddGroupProfileRequest[T],
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [parentField]: {
                ...(prev[parentField] as object),
                [childField]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {

            await addGroupProfile(formData);
            toast("Success!", {
                description: "Guest was created successfully.",
            })
            setGuestCreatedDialog(true)
        } catch (error) {
            toast("Error!", {
                description: "Failed to submit form.",
            })
            console.error("Failed to submit form:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

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
                    <h1 className="text-xl font-bold">New Guest Profile</h1>
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
                                placeholder='ABC Corporation Ltd.'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Phone Number</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className='border border-slate-300'
                                placeholder='ABC Corporation Ltd.'
                                type='number'
                            />
                        </div>

                        <div className='space-y-1'>
                            <h3 className='font-semibold'>Business Address</h3>

                            <div className='ml-5 space-y-2'>
                                <Label>Country</Label>
                                <Input
                                    value={formData.address.country}
                                    onChange={(e) => handleNestedInputChange('address', 'country', e.target.value)}
                                    className='border border-slate-300'
                                    placeholder='ABC Corporation Ltd.'
                                />

                                <Label>State</Label>
                                <Input
                                    value={formData.address.city}
                                    onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                                    className='border border-slate-300'
                                    placeholder='ABC Corporation Ltd.'
                                />
                            </div>
                        </div>

                        <div className='space-y-1'>
                            <h3 className='font-semibold'>Billing Address</h3>

                            <div className='ml-5 space-y-2'>
                                <Label>Country</Label>
                                <Input
                                    value={formData.billingAddress.country}
                                    onChange={(e) => handleNestedInputChange('billingAddress', 'country', e.target.value)}
                                    className='border border-slate-300'
                                    placeholder='ABC Corporation Ltd.'
                                />

                                <Label>City</Label>
                                <Input
                                    value={formData.billingAddress.city}
                                    onChange={(e) => handleNestedInputChange('billingAddress', 'city', e.target.value)}
                                    className='border border-slate-300'
                                    placeholder='ABC Corporation Ltd.'
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
                                placeholder='ABC Corporation Ltd.'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Email</Label>
                            <Input
                                value={formData.primaryContact.email}
                                onChange={(e) => handleNestedInputChange('primaryContact', 'email', e.target.value)}
                                className='border border-slate-300'
                                placeholder='ABC Corporation Ltd.'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Phone Number</Label>
                            <Input
                                value={formData.primaryContact.phone}
                                onChange={(e) => handleNestedInputChange('primaryContact', 'phone', e.target.value)}
                                className='border border-slate-300'
                                placeholder='ABC Corporation Ltd.'
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
                                placeholder='ABC Corporation Ltd.'
                            />
                        </div>

                        <div className='space-y-1'>
                            <Label>Notes</Label>
                            <Input
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                className='border border-slate-300'
                                placeholder='ABC Corporation Ltd.'
                            />
                        </div>
                    </div>


                    <div className='px-5 space-y-4'>
                        <h2 className='font-bold text-lg'>Linked Guests</h2>

                        <Card className='bg-hms-accent/15 border-none'>
                            <CardContent className='space-y-4'>
                                {linkedGuests.length > 0 ? (
                                    linkedGuests.map((guest, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Avatar>
                                                    <AvatarImage />
                                                    <AvatarFallback>
                                                        {guest.firstName.charAt(0)} {guest.lastName.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">{guest.firstName} {guest.lastName}</p>
                                                    <p className="text-sm text-muted-foreground">{guest.email}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                // onClick={() => handleRemoveLinkedGuest(guest.id)}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center">No linked guests</p>
                                )}
                                <CardFooter>
                                    <Button variant='link'>fhdsjhfkjd</Button>
                                </CardFooter>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-center gap-3 pt-6 col-span-2">
                        <Button
                            type="button"
                            variant='background'
                            className='px-8'
                        >
                            Save Draft
                        </Button>
                        <Button
                            type="submit"
                            variant="foreground"
                            className="px-8"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Profile"}
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
                            <Button onClick={() => navigate('/new-reservation')}>
                                Create Reservation
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div >
        </>
    );
};

export default NewGroupProfile;
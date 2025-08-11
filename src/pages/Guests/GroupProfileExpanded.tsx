import { Button } from "@/components/atoms/Button";
import { ScrollArea } from "@/components/atoms/ScrollArea";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Input } from "@/components/atoms/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/Select";
import { Switch } from "@/components/atoms/Switch";
import { GuestSelectionDialog } from "@/components/dialogs/AddGuestDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card";
import EditingSkeleton from "@/components/Templates/EditingSkeleton";
import { getGroupProfileById, getGuests, linkGuestsToGroup, updateGroupProfile, deleteGroupProfile, unlinkGuests } from "@/services/Guests";
import { GetGuestsResponse, GroupProfileResponse, UpdateGroupProfileRequest, Guest } from "@/validation/schemas/Guests";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronLeft, Mail, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import DeleteDialog from "@/components/molecules/DeleteDialog";

const GroupProfileExpanded = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [group, setGroup] = useState<GroupProfileResponse['data'] | null>(null);
    const [linkedGuestsToGroup, setLinkedGuestsToGroup] = useState<GetGuestsResponse['data']>([]);
    const [allGuests, setAllGuests] = useState<GetGuestsResponse['data']>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<GroupProfileResponse['data'] | null>(null);
    const [removeGuestDialog, setRemoveGuestsDialog] = useState(false);
    const [guestToRemove, setGuestToRemove] = useState<Guest | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [formData, setFormData] = useState<UpdateGroupProfileRequest>({
        name: '',
        email: '',
        phone: '',
        businessType: 'CORPORATE',
        isVip: false,
        notes: '',
        specialRequirements: ''
    });

    const businessTypeOptions = [
        { value: "CORPORATE", label: "Corporate" },
        { value: "TRAVEL_AGENCY", label: "Travel Agency" },
        { value: "EVENT_PLANNER", label: "Event Planner" },
        { value: "GOVERNMENT", label: "Government" },
        { value: "OTHER", label: "Other" }
    ];

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

    const handleInputChange = (field: keyof UpdateGroupProfileRequest, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
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

            // Initialize form data
            setFormData({
                name: groupRes.data.name,
                email: groupRes.data.email,
                phone: groupRes.data.phone,
                businessType: groupRes.data.businessType,
                isVip: groupRes.data.isVip || false,
                notes: groupRes.data.notes || '',
                specialRequirements: groupRes.data.specialRequirements || ''
            });
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

    const handleSaveEdit = async () => {
        if (!id) return;

        setLoading(true);
        try {
            await updateGroupProfile(id, formData);
            toast("Success!", {
                description: "Group profile was updated successfully.",
            });

            fetchData();
            setIsEditMode(false);
        } catch (error) {
            toast("Error!", {
                description: "Failed to update group profile.",
            });
            console.error("Failed to update group profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        if (group) {
            setFormData({
                name: group.name,
                email: group.email,
                phone: group.phone,
                businessType: group.businessType,
                isVip: group.isVip || false,
                notes: group.notes || '',
                specialRequirements: group.specialRequirements || ''
            });
        }
        setIsEditMode(false);
    };

    const handleDeleteGroup = async () => {
        if (!groupToDelete || !id) return;

        setLoading(true);
        try {
            await deleteGroupProfile(id);
            setDeleteDialogOpen(false);
            setGroupToDelete(null);
            navigate('/guests-profile');
            toast("Success!", {
                description: "Group profile was deleted successfully.",
            });
        } catch (error) {
            toast("Error!", {
                description: "Failed to delete group profile.",
            });
            console.error("Failed to delete group profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveGuest = async () => {
        if (!guestToRemove || !id) return;

        setLoading(true);
        try {
            await unlinkGuests(guestToRemove.id, id);
            fetchData();
        } catch (error) {
            toast("Error!", {
                description: "Failed to unlink guest.",
            });
            console.error("Failed to unlink guest:", error);
        } finally {
            setLoading(false);
            setRemoveGuestsDialog(false);
            setGuestToRemove(null);
        }
    };

    const handleDeleteCancel = (): void => {
        setDeleteDialogOpen(false);
        setGroupToDelete(null);
    };

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
                <h1 className="text-xl font-bold">
                    {isEditMode ? 'Edit Group Profile' : 'Group Profile'}
                </h1>
            </div>

            <div className="grid grid-cols-3 gap-7">
                <div className="space-y-3">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle>
                                {isEditMode ? formData.name : group.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <span className="font-semibold">Profile Type:</span>{" "}
                            {isEditMode ?
                                getBusinessTypeDisplay(formData.businessType) :
                                getBusinessTypeDisplay(group.businessType)
                            }
                        </CardContent>

                        <div className='flex gap-2 text-center justify-center pb-4'>
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
                                            setGroupToDelete(group);
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        Delete Profile
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card>

                    <Card className="p-3">
                        <CardHeader className="p-0">
                            <CardTitle className="font-bold text-lg p-0 pb-1 border-b">
                                Corporate Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            <span className="flex justify-between items-center">
                                <p className="font-semibold">Business Name</p>
                                {isEditMode ? (
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className='w-40 h-8 text-sm'
                                        placeholder='Business Name'
                                    />
                                ) : (
                                    <p>{group.name}</p>
                                )}
                            </span>

                            <span className="flex justify-between items-center">
                                <p className="font-semibold">Business Type</p>
                                {isEditMode ? (
                                    <Select
                                        value={formData.businessType}
                                        onValueChange={(value) => handleInputChange('businessType', value)}
                                    >
                                        <SelectTrigger className='w-40 h-8 text-sm'>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {businessTypeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p>{getBusinessTypeDisplay(group.businessType)}</p>
                                )}
                            </span>

                            <span className="flex justify-between">
                                <p className="font-semibold">Business Address</p>
                                <p>
                                    {group.address.country} {group.address.city}
                                </p>
                            </span>

                            <span className="flex justify-between items-center">
                                <p className="font-semibold">Email</p>
                                {isEditMode ? (
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className='w-40 h-8 text-sm'
                                        placeholder='Email'
                                    />
                                ) : (
                                    <p>{group.email}</p>
                                )}
                            </span>

                            <span className="flex justify-between items-center">
                                <p className="font-semibold">Phone</p>
                                {isEditMode ? (
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className='w-40 h-8 text-sm'
                                        placeholder='Phone'
                                    />
                                ) : (
                                    <p>{group.phone}</p>
                                )}
                            </span>

                            <span className="flex justify-between items-center">
                                <p className="font-semibold">VIP Status</p>
                                {isEditMode ? (
                                    <Switch
                                        checked={formData.isVip}
                                        onCheckedChange={(checked) => handleInputChange('isVip', checked)}
                                        className='data-[state=checked]:bg-hms-primary'
                                    />
                                ) : (
                                    <p>{group.isVip ? 'VIP' : 'Regular'}</p>
                                )}
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
                                Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            {isEditMode ? (
                                <Input
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    className='w-full text-sm'
                                    placeholder='Additional notes'
                                />
                            ) : (
                                group.notes ? (
                                    <p>{group.notes}</p>
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        No notes
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>

                    <Card className="p-3">
                        <CardHeader className="p-0">
                            <CardTitle className="font-bold text-lg p-0 pb-1 border-b">
                                Special Requests
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                            {isEditMode ? (
                                <Input
                                    value={formData.specialRequirements}
                                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                                    className='w-full text-sm'
                                    placeholder='Special Requirements'
                                />
                            ) : group.specialRequirements ? (
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
                        ) : linkedGuestsToGroup.length == 0 ? (
                            <p className="text-center text-muted-foreground h-[25rem] flex items-center justify-center">No guests are linked to this group</p>
                        ) : (
                            linkedGuestsToGroup.map((guest: Guest) => (
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
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setGuestToRemove(guest);
                                            setRemoveGuestsDialog(true);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <X />
                                    </Button>
                                </div>
                            )))}
                    </ScrollArea>

                </Card>

                <Card className="p-3">
                    <CardHeader className="p-0">
                        <CardTitle className="font-bold text-lg p-0 pb-1 border-b">
                            Reservation History / Upcoming Stays
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-2">

                    </CardContent>
                </Card>
            </div>

            <GuestSelectionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onGuestSelect={handleGuestSelect}
                guestsData={allGuests}
            />

            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteGroup}
                loading={loading}
                title="Delete Group Profile"
                description={`Are you sure you want to delete group profile ${groupToDelete?.name}? This action cannot be undone.`}
            />

            <DeleteDialog
                isOpen={removeGuestDialog}
                onCancel={() => {
                    setRemoveGuestsDialog(false);
                    setGuestToRemove(null);
                }}
                onConfirm={handleRemoveGuest}
                loading={loading}
                title="Remove Guest"
                description={`Are you sure you want to unlink ${guestToRemove?.firstName} ${guestToRemove?.lastName}?`}
                confirmText="Remove Guest"
            />
        </div >
    );
};

export default GroupProfileExpanded;
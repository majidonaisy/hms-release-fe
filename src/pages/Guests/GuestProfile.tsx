import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Organisms/Table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/atoms/DropdownMenu";
import { Filter, Search, EllipsisVertical, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/atoms/Pagination";
import GuestTypeSelectionDialog, { GuestTypeSelectionData } from "./GuestTypeDialog";
import { deleteGuest, getGuests } from "@/services/Guests";
import { GetGuestByIdResponse, GetGuestsResponse, RoomType } from "@/validation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/Avatar";
import { getRoomTypes } from "@/services/RoomTypes";
import DeleteDialog from "../../components/molecules/DeleteDialog";
import TableSkeleton from "@/components/Templates/TableSkeleton";
import { Can } from "@/context/CASLContext";
const GuestProfile = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isGuestTypeDialogOpen, setIsGuestTypeDialogOpen] = useState(false);
    const [guests, setGuests] = useState<GetGuestsResponse['data']>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [guestToDelete, setGuestToDelete] = useState<GetGuestByIdResponse['data'] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleGetGuests = async () => {
            setLoading(true);
            try {
                const response = await getGuests();
                setGuests(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const handleGetRoomTypes = async () => {
            setLoading(true);
            try {
                const response = await getRoomTypes();
                setRoomTypes(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        handleGetGuests();
        handleGetRoomTypes();
    }, []);

    const roomTypeMap = roomTypes.reduce((map, roomType) => {
        map[roomType.id] = roomType.name;
        return map;
    }, {} as Record<string, string>);

    const totalPages = Math.ceil(300 / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredGuests = guests.filter(guest =>
        guest.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        guest.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleEditClick = (e: React.MouseEvent, guestId: string): void => {
        e.stopPropagation();
        navigate(`/guests-profile/${guestId}`);
    };

    const handleViewClick = (e: React.MouseEvent, guestId: string): void => {
        e.stopPropagation();
        navigate(`/guests-profile/${guestId}/view`);
    };

    const handleDeleteGuest = async () => {
        setLoading(true);
        if (guestToDelete) {
            try {
                await deleteGuest(guestToDelete.id);
                setDeleteDialogOpen(false);
                setGuestToDelete(null);
                const response = await getGuests();
                setGuests(response.data);
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

    const handleDeleteCancel = (): void => {
        setDeleteDialogOpen(false);
        setGuestToDelete(null);
    };

    const clearSearch = () => {
        setSearchText('');
    };

    const handleNewGuestProfile = () => {
        navigate('/guests-profile/new');
    };

    const handleGuestTypeConfirm = (data: GuestTypeSelectionData) => {
        console.log('Guest type selected:', data);
        // switch (data.type) {
        //     case 'individual':
        //         navigate('/guests/new/individual');
        //         break;
        //     case 'corporate':
        //         navigate('/guests/new/corporate');
        //         break;
        //     case 'travel-agency':
        //         navigate('/guests/new/travel-agency');
        //         break;
        //     default:
        //         navigate('/guests/new');
        // }
        navigate('/guests-profile/new');
        setIsGuestTypeDialogOpen(false);
    };

    const handleGuestTypeCancel = () => {
        setIsGuestTypeDialogOpen(false);
    };

    return (
        <>
            {loading ? (
                <TableSkeleton title="Guests Profile" />
            ) : (
                <div className="p-6 bg-gray-50 min-h-screen">
                    {/* Header Section */}
                    <div className="mb-6">
                        {/* Current Guests Title with Count */}
                        <div className="flex items-center gap-2 mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900">Guests Profile</h1>
                            <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {guests.length} profiles
                            </span>
                        </div>

                        {/* Search Bar and Actions */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3">
                                <Input
                                    type="text"
                                    placeholder="Search text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="w-85 h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
                                />
                                {searchText && (
                                    <button
                                        onClick={clearSearch}
                                        className="text-gray-400 hover:text-gray-600 mr-2 text-sm font-medium"
                                        aria-label="Clear search"
                                    >
                                        ✕
                                    </button>
                                )}
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>

                            {/* Filter Button */}
                            <Button
                                variant="outline"
                                onClick={() => setShowFilter(!showFilter)}
                                className="flex items-center gap-2 px-3 py-2 border-2 border-gray-300 hover:border-gray-400"
                            >
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                            <div className="flex gap-2 ml-auto">

                                <Button
                                    onClick={handleNewGuestProfile}

                                >
                                    <Plus className="h-4 w-4" />
                                    New Guest Profile
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg ">
                        <Table>
                            <TableHeader className='bg-hms-accent/15'>
                                <TableRow className="border-b border-gray-200">
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-2"> Name</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Email</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Preferred Room</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Other Requests</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Contact Info</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredGuests && filteredGuests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-10 text-center text-gray-600">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) :
                                    filteredGuests.map((guest) => (
                                        <TableRow key={guest.id} onClick={(e) => handleViewClick(e, guest.id)} className="border-b-2 col-span-7 hover:bg-accent cursor-pointer">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage />
                                                        <AvatarFallback>{guest.firstName.charAt(0).toUpperCase()}{guest.lastName.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-medium text-gray-900">{guest.firstName} {guest.lastName}</div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-6 py-4 font-medium text-gray-900">{guest.email}</TableCell>
                                            <TableCell className="px-6 py-4 text-gray-600">{guest.preferences?.roomType && roomTypeMap[guest.preferences.roomType] || "Unknown"}</TableCell>
                                            <TableCell className="px-6 py-4 text-gray-600">{guest.preferences?.smoking ? 'Smoking' : 'No Smoking'}</TableCell>
                                            <TableCell className="px-6 py-4 text-gray-600">{guest.phoneNumber}</TableCell>
                                            <TableCell className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                <Can action="edit" subject="guest">
                                                    <DropdownMenu modal={false}>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="bg-inherit shadow-none p-0 text-hms-accent font-bold text-xl border hover:border-hms-accent hover:bg-hms-accent/15"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <EllipsisVertical />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="shadow-lg border-hms-accent">
                                                            <DropdownMenuItem onClick={(e) => handleEditClick(e, guest.id)}>Edit</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => {
                                                                setGuestToDelete(guest);
                                                                setDeleteDialogOpen(true);
                                                            }}>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </Can>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        showPreviousNext={true}
                        maxVisiblePages={7}
                    />
                </div>
            )}

            <GuestTypeSelectionDialog
                isOpen={isGuestTypeDialogOpen}
                onConfirm={handleGuestTypeConfirm}
                onCancel={handleGuestTypeCancel}
            />

            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteGuest}
                loading={loading}
                title="Delete Guest"
                description={`Are you sure you want to delete guest ${guestToDelete?.firstName} ${guestToDelete?.lastName}? This action cannot be undone.`}
            />
        </>
    );
};

export default GuestProfile;
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Organisms/Table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/atoms/DropdownMenu";
import { Filter, Search, ChevronDown, EllipsisVertical, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/atoms/Pagination";
import GuestTypeSelectionDialog, { GuestTypeSelectionData } from "./GuestTypeDialog";

// Sample guest data to match the Figma design
const guestsData = [
    {
        id: 1,
        name: "Olivia Rhye",
        username: "@olivia",
        avatar: "OR",
        roomNumber: "101",
        stayDates: "5 June - 18 June",
        guestCount: 1,
        bookingSource: "Website",
        contactInfo: "+123 456 789"
    },
    {
        id: 2,
        name: "Phoenix Baker",
        username: "@phoenix",
        avatar: "PB",
        roomNumber: "200",
        stayDates: "10 June - 20 June",
        guestCount: 1,
        bookingSource: "Phone Call",
        contactInfo: "+123 456 789"
    },
    {
        id: 3,
        name: "Lana Steiner",
        username: "@lana",
        avatar: "LS",
        roomNumber: "25",
        stayDates: "8 June - 11 June",
        guestCount: 2,
        bookingSource: "Walk-In",
        contactInfo: "+123 456 789"
    },
    {
        id: 4,
        name: "Demi Wilkinson",
        username: "@demi",
        avatar: "DW",
        roomNumber: "234",
        stayDates: "5 June - 10 June",
        guestCount: 1,
        bookingSource: "Travel Agency",
        contactInfo: "+123 456 789"
    },
    {
        id: 5,
        name: "Candice Wu",
        username: "@candice",
        avatar: "CW",
        roomNumber: "152",
        stayDates: "11 June - 23 June",
        guestCount: 3,
        bookingSource: "Phone Call",
        contactInfo: "+123 456 789"
    },
    {
        id: 6,
        name: "Natali Craig",
        username: "@natali",
        avatar: "NC",
        roomNumber: "345",
        stayDates: "4 June - 9 June",
        guestCount: 1,
        bookingSource: "Walk-In",
        contactInfo: "+123 456 789"
    },
    {
        id: 7,
        name: "Drew Cano",
        username: "@drew",
        avatar: "DC",
        roomNumber: "123",
        stayDates: "5 June - 25 June",
        guestCount: 2,
        bookingSource: "Walk-In",
        contactInfo: "+123 456 789"
    },
    {
        id: 8,
        name: "Orlando Diggs",
        username: "@orlando",
        avatar: "OD",
        roomNumber: "321",
        stayDates: "6 June - 12 June",
        guestCount: 4,
        bookingSource: "Travel Agency",
        contactInfo: "+123 456 789"
    },
    {
        id: 9,
        name: "Andi Lane",
        username: "@andi",
        avatar: "AL",
        roomNumber: "45",
        stayDates: "5 June - 13 June",
        guestCount: 1,
        bookingSource: "Travel Agency",
        contactInfo: "+123 456 789"
    }
];

const GuestProfile = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isGuestTypeDialogOpen, setIsGuestTypeDialogOpen] = useState(false);

    const totalPages = Math.ceil(300 / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Reset to first page when search changes
    const handleSearchChange = (value: string) => {
        setSearchText(value);
        setCurrentPage(1);
    };

    const filteredGuests = guestsData.filter(guest =>
        guest.name.toLowerCase().includes(searchText.toLowerCase()) ||
        guest.username.toLowerCase().includes(searchText.toLowerCase()) ||
        guest.roomNumber.includes(searchText)
    );

    const handleEditClick = (e: React.MouseEvent, guestId: number): void => {
        e.stopPropagation();
        console.log('Edit guest:', guestId);
    };

    const handleDeleteClick = (e: React.MouseEvent, guestId: number): void => {
        e.stopPropagation();
        console.log('Delete guest:', guestId);
    };

    const handleCreateReservation = (guestId: number): void => {
        console.log('Create reservation for guest:', guestId);
    };

    const clearSearch = () => {
        setSearchText('');
    };

    const handleNewGuestProfile = () => {
        setIsGuestTypeDialogOpen(true);
    };

    const handleGuestTypeConfirm = (data: GuestTypeSelectionData) => {
        console.log('Guest type selected:', data);
        // Navigate to the appropriate form based on guest type
        switch (data.type) {
            case 'individual':
                navigate('/guests/new/individual');
                break;
            case 'corporate':
                navigate('/guests/new/corporate');
                break;
            case 'travel-agency':
                navigate('/guests/new/travel-agency');
                break;
            default:
                navigate('/guests/new');
        }
        setIsGuestTypeDialogOpen(false);
    };

    const handleGuestTypeCancel = () => {
        setIsGuestTypeDialogOpen(false);
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="mb-6">
                    {/* Current Guests Title with Count */}
                    <div className="flex items-center gap-2 mb-4">
                        <h1 className="text-2xl font-semibold text-gray-900">Guests Profile</h1>
                        <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            300 profile
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
                                New Guest Profile™
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg ">
                    <Table>
                        <TableHeader className='bg-hms-accent/15'>
                            <TableRow className="border-b border-gray-200">
                                <TableHead className="text-left font-medium text-gray-700 px-4 py-3 w-[120px] text-sm bg-slate-50">

                                </TableHead>
                                <TableHead className="text-left font-medium text-gray-900 px-6 py-2">
                                    <div className="flex items-center gap-1">
                                        Name
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Room Number</TableHead>
                                <TableHead className="text-left font-medium text-gray-900 px-6 py-2">
                                    <div className="flex items-center gap-1">
                                        Stay Dates
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Guest Count</TableHead>
                                <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Booking Source</TableHead>
                                <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Contact Info</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableCell className="px-6 py-4 bg-hms-accent/15 align-top" rowSpan={10}>
                                <span className="text-gray-600 font-medium">Individual</span>
                            </TableCell>
                            {filteredGuests.length === 0 && searchText ? (
                                <TableRow>
                                    <TableCell className="px-6 py-4 bg-hms-accent text-start">
                                        <span className="text-gray-600 font-medium">Individual</span>
                                    </TableCell>
                                    <TableCell colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="h-8 w-8 text-gray-300" />
                                            <p>No guests found matching "{searchText}"</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={clearSearch}
                                            >
                                                Clear search
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredGuests.map((guest) => (
                                    <TableRow key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-hms-primary/10 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-hms-primary">
                                                        {guest.avatar}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{guest.name}</div>
                                                    <div className="text-sm text-gray-500">{guest.username}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium text-gray-900">
                                            {guest.roomNumber}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">
                                            {guest.stayDates}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">
                                            {guest.guestCount}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">
                                            {guest.bookingSource}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">
                                            {guest.contactInfo}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <DropdownMenu modal={false}>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className='bg-inherit shadow-none p-0 text-hms-accent font-bold text-xl border hover:border-hms-accent hover:bg-hms-accent/15'
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <EllipsisVertical className="" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className='shadow-lg border-hms-accent'>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => handleCreateReservation(guest.id)}
                                                        >
                                                            <div className="w-full flex items-center gap-2">
                                                                Create Reservation
                                                            </div>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={(e) => handleEditClick(e, guest.id)}
                                                        >
                                                            <div className="w-full flex items-center gap-2">
                                                                Edit
                                                            </div>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={(e) => handleDeleteClick(e, guest.id)}
                                                        >
                                                            <div className="w-full flex items-center gap-2">
                                                                Delete
                                                            </div>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
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
            <GuestTypeSelectionDialog
                isOpen={isGuestTypeDialogOpen}
                onConfirm={handleGuestTypeConfirm}
                onCancel={handleGuestTypeCancel}
            />
        </>
    );
};

export default GuestProfile;
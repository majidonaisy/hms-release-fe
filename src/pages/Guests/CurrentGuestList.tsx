import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Organisms/Table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/atoms/DropdownMenu";
import { Filter, Search, ChevronDown, EllipsisVertical } from "lucide-react";
import React, { useState } from "react";
import Pagination from "@/components/atoms/Pagination";
import { guestsData } from "../../data/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/Avatar";

const CurrentGuestList = () => {
    const [searchText, setSearchText] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const totalPages = Math.ceil(100 / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

    const handleViewReservation = (guestId: number): void => {
        console.log('View reservation for guest:', guestId);
    };

    const clearSearch = () => {
        setSearchText('');
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="mb-6">
                    {/* Current Guests Title with Count */}
                    <div className="flex items-center gap-2 mb-4">
                        <h1 className="text-2xl font-semibold text-gray-900">Current Guests List</h1>
                        <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            120 guests
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
                            {['individual', 'corporate', 'travel agency'].map((groupType) => {
                                const guestsOfType = filteredGuests.filter((guest) => guest.type === groupType);
                                if (guestsOfType.length === 0) return null;

                                return guestsOfType.map((guest, index) => (
                                    <TableRow key={guest.id} className="border-b-2 hover:bg-accent/15">
                                        {index === 0 && (
                                            <TableCell
                                                rowSpan={guestsOfType.length}
                                                className="px-6 py-4 bg-hms-accent/15 align-top text-gray-600 font-medium w-[100px]"
                                            >
                                                {groupType.charAt(0).toUpperCase() + groupType.slice(1)}
                                            </TableCell>
                                        )}

                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={guest.imageUrl} alt="pfp" />
                                                    <AvatarFallback>{guest.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-gray-900">{guest.name}</div>
                                                    <div className="text-sm text-gray-500">{guest.username}</div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-6 py-4 font-medium text-gray-900">{guest.roomNumber}</TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">
                                            {guest.stayDates}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">{guest.guestCount}</TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">{guest.bookingSource}</TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">{guest.contactInfo}</TableCell>
                                        <TableCell className="px-6 py-4">
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
                                                    <DropdownMenuItem onClick={() => handleViewReservation(guest.id)}>View Reservation</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={(e) => handleEditClick(e, guest.id)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={(e) => handleDeleteClick(e, guest.id)}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ));
                            })}
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
        </>
    );
};

export default CurrentGuestList;
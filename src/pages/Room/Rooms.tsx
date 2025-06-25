import { useState } from 'react';
import { Search, Filter, Plus, ChevronDown, Trash2, Edit, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Badge } from '@/components/atoms/Badge';
import { useNavigate } from 'react-router-dom';
import NewRoomTypeDialog, { RoomTypeFormData } from './NewRoomTypeDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';

const Rooms = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('name');
    const [isRoomTypeDialogOpen, setIsRoomTypeDialogOpen] = useState(false);


    const roomsData = [
        {
            id: 1,
            name: "Room 100",
            status: "Active",
            type: "Front Desk",
            floor: "Receptionist",
            occupancy: "Product Designer",
            logs: "olivia@untitledui.com"
        },
        {
            id: 2,
            name: "Room 101",
            status: "Inactive",
            type: "Housekeeping",
            floor: "Supervisor",
            occupancy: "Product Manager",
            logs: "phoenix@untitledui.com"
        },
        {
            id: 3,
            name: "Room 102",
            status: "Active",
            type: "IT",
            floor: "Frontend Developer",
            occupancy: "Frontend Developer",
            logs: "lana@untitledui.com"
        },
        {
            id: 4,
            name: "Room 103",
            status: "Active",
            type: "Management",
            floor: "Backend Developer",
            occupancy: "Backend Developer",
            logs: "demi@untitledui.com"
        },
        {
            id: 5,
            name: "Room 104",
            status: "Pending",
            type: "Security",
            floor: "Fullstack Developer",
            occupancy: "Fullstack Developer",
            logs: "candice@untitledui.com"
        },
        {
            id: 6,
            name: "Room 105",
            status: "Active",
            type: "UX Designer",
            floor: "UX Designer",
            occupancy: "UX Designer",
            logs: "natali@untitledui.com"
        },
        {
            id: 7,
            name: "Room 106",
            status: "Inactive",
            type: "UX Copywriter",
            floor: "UX Copywriter",
            occupancy: "UX Copywriter",
            logs: "drew@untitledui.com"
        },
        {
            id: 8,
            name: "Room 107",
            status: "Pending",
            type: "UI Designer",
            floor: "UI Designer",
            occupancy: "UI Designer",
            logs: "orlando@untitledui.com"
        },
        {
            id: 9,
            name: "Room 108",
            status: "Active",
            type: "Product Manager",
            floor: "Product Manager",
            occupancy: "Product Manager",
            logs: "andi@untitledui.com"
        },
        {
            id: 10,
            name: "Room 109",
            status: "Pending",
            type: "QA Engineer",
            floor: "QA Engineer",
            occupancy: "QA Engineer",
            logs: "kate@untitledui.com"
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'Inactive':
                return 'bg-red-100 text-red-700 hover:bg-red-100';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
            default:
                return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
        }
    };

    const handleNewRoomType = () => {
        setIsRoomTypeDialogOpen(true);
    };

    const handleRoomTypeConfirm = (data: RoomTypeFormData) => {
        console.log('Room Type created:', data);
        // Handle room type creation logic here
        // Example: call API to create room type
        setIsRoomTypeDialogOpen(false);
    };

    const handleRoomTypeCancel = () => {
        setIsRoomTypeDialogOpen(false);
    };
    const handleEditClick = (e: React.MouseEvent): void => {
        
    };

    const handleDeleteClick = (e: React.MouseEvent): void => {
    }


        return (
            <>
                <div className="p-6 bg-gray-50 min-h-screen">
                    {/* Header Section */}
                    <div className="mb-6">
                        {/* Rooms Title with Count */}
                        <div className="flex items-center gap-2 mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900">Rooms</h1>
                            <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                100 Room
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
                                <Search className="h-4 w-4 text-gray-400 " />

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

                            {/* Action Buttons */}
                            <div className="flex gap-2 ml-auto">
                                <Button
                                    onClick={handleNewRoomType}
                                >
                                    <Plus className="h-4 w-4" />
                                    New Room Type
                                </Button>
                                <Button
                                    onClick={() => navigate('/rooms/new')}

                                >
                                    <Plus className="h-4 w-4" />
                                    New Room
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg shadow">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-gray-200">
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            Name
                                            <ChevronDown className="h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Status</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Type</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Floor</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Occupancy</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Logs</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roomsData.map((room) => (
                                    <TableRow key={room.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <TableCell className="px-6 py-4 font-medium text-gray-900">
                                            {room.name}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge className={`${getStatusColor(room.status)} border-0`}>
                                                • {room.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">
                                            {room.type}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">
                                            {room.floor}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">
                                            {room.occupancy}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-gray-600">
                                            {room.logs}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <DropdownMenu modal={false}>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            className='bg-inherit shadow-none p-0 text-hms-accent font-bold text-xl border hover:border-hms-accent hover:bg-hms-accent/15'
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <EllipsisVertical className="" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className='shadow-lg border-hms-accent'>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={(e) => handleDeleteClick(e)}
                                                        >
                                                            <div className="w-full flex items-center gap-2">
                                                                Delete
                                                            </div>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={(e) => handleEditClick(e)}
                                                        >
                                                            <div className="w-full flex items-center gap-2">
                                                                Edit
                                                            </div>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* Pagination */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                            <Button variant="outline" className="flex items-center gap-2">
                                ← Previous
                            </Button>

                            <div className="flex items-center gap-2">
                                {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
                                    <Button
                                        key={index}
                                        variant={page === 1 ? "foreground" : "primaryOutline"}
                                        size="sm"
                                        className={`h-8 w-8 `}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>

                            <Button variant="outline" className="flex items-center gap-2">
                                Next →
                            </Button>
                        </div>
                    </div>

                </div>
                <NewRoomTypeDialog
                    isOpen={isRoomTypeDialogOpen}
                    onConfirm={handleRoomTypeConfirm}
                    onCancel={handleRoomTypeCancel}
                />
            </>
        );
    };

    export default Rooms;
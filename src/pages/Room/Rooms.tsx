import { useEffect, useState } from 'react';
import { Search, Filter, Plus, ChevronDown, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Badge } from '@/components/atoms/Badge';
import { useNavigate } from 'react-router-dom';
import NewRoomTypeDialog from './NewRoomTypeDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';
import { deleteRoom, getRooms } from '@/services/Rooms';
import { addRoomType } from '@/services/RoomTypes';
import { AddRoomTypeRequest, Room } from '@/validation';
import Pagination from '@/components/atoms/Pagination';
import RoomSkeleton from '../../components/Templates/RoomSkeleton';
import { toast } from 'sonner';
import DeleteDialog from '@/components/molecules/DeleteDialog';

const Rooms = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    // Sorting state
    const [sortBy, setSortBy] = useState('name');
    const [isRoomTypeDialogOpen, setIsRoomTypeDialogOpen] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [items, setItems] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState<{ id: string; roomNumber: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const totalPages = Math.ceil(items / 10);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const response = await getRooms();
                setRooms(response.data);
                setItems(response.data.length);
            } catch (error) {
                console.error('Error occurred:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRooms();
    }, [searchText, currentPage, sortBy]);

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

    const handleRoomTypeConfirm = async (data: AddRoomTypeRequest) => {
        try {
            console.log('data', data)
            await addRoomType(data);
            toast.success('Room type created successfully');
        } catch (error) {
            toast.error('Error creating room type');
        }
        setIsRoomTypeDialogOpen(false);
    };

    const handleRoomTypeCancel = () => {
        setIsRoomTypeDialogOpen(false);
    };

    const handleEditClick = (e: React.MouseEvent, roomId: string): void => {
        e.stopPropagation();
        navigate(`/rooms/${roomId}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, room: Room): void => {
        e.stopPropagation();
        setRoomToDelete({ id: room.id, roomNumber: room.roomNumber });
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async (): Promise<void> => {
        if (!roomToDelete) return;

        setDeleteLoading(true);
        try {
            await deleteRoom(roomToDelete.id);
            toast.success('Room deleted successfully');
            setRooms(rooms.filter(room => room.id !== roomToDelete.id));
            setItems(items - 1);
        } catch (error: any) {
            console.error('Error deleting room:', error);
            toast.error(error.userMessage || 'Failed to delete room');
        } finally {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            setRoomToDelete(null);
        }
    };

    const handleDeleteCancel = (): void => {
        setDeleteDialogOpen(false);
        setRoomToDelete(null);
    };

    return (
        <>
            {loading ? (
                <RoomSkeleton title='Rooms' />
            ) : (
                <>
                    <div className="p-6 bg-gray-50 min-h-screen">
                        {/* Header Section */}
                        <div className="mb-6">
                            {/* Rooms Title with Count */}
                            <div className="flex items-center gap-2 mb-4">
                                <h1 className="text-2xl font-semibold text-gray-900">Rooms</h1>
                                <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                    {items} Room
                                </span>
                            </div>
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
                                        <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Max Occupancy</TableHead>
                                        <TableHead className="w-[100px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rooms.map((room) => (
                                        <TableRow key={room.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <TableCell className="px-6 py-4 font-medium text-gray-900">
                                                {room.roomNumber}
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge className={`${getStatusColor(room.status)} border-0`}>
                                                    • {room.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-600">
                                                {room.roomType.name}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-600">
                                                {room.floor}
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-600">
                                                {room.adultOccupancy} Adult, {room.childOccupancy} Child
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-600">
                                                {room.maxOccupancy}
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
                                                                onClick={(e) => handleDeleteClick(e, room)}
                                                            >
                                                                <div className="w-full flex items-center gap-2">
                                                                    Delete
                                                                </div>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={(e) => handleEditClick(e, room.id)}
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
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                showPreviousNext={true}
                                maxVisiblePages={7}
                            />
                        </div>

                    </div>
                    <NewRoomTypeDialog
                        isOpen={isRoomTypeDialogOpen}
                        onConfirm={handleRoomTypeConfirm}
                        onCancel={handleRoomTypeCancel}
                    />

                    {/* Delete Confirmation Dialog */}
                    <DeleteDialog
                        isOpen={deleteDialogOpen}
                        onCancel={handleDeleteCancel}
                        onConfirm={handleDeleteConfirm}
                        loading={deleteLoading}
                        title="Delete Room"
                        description={`Are you sure you want to delete room ${roomToDelete?.roomNumber}? This action cannot be undone.`}
                    />
                </>
            )}
        </>
    );
};

export default Rooms;
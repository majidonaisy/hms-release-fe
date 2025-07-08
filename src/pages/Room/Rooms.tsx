import { useEffect, useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { useNavigate } from 'react-router-dom';
import { deleteRoom, getRooms } from '@/services/Rooms';
import { AddRoomTypeRequest, Pagination, Room } from '@/validation';
import DataTable, { ActionMenuItem, defaultRenderers, TableColumn } from '@/components/Templates/DataTable';
import NewRoomTypeDialog from './NewRoomTypeDialog';
import { addRoomType } from '@/services/RoomTypes';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const Rooms = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8); // Default page size
    const [loading, setLoading] = useState(false);
    const [sortBy, _setSortBy] = useState('name');
    const [isRoomTypeDialogOpen, setIsRoomTypeDialogOpen] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [pagination, setPagination] = useState<{
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        hasNext: boolean;
        hasPrevious: boolean;
    } | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const response = await getRooms({
                    page: currentPage,
                    limit: pageSize
                });
                setRooms(response.data);

                // Set pagination if available in response
                if (response.pagination) {
                    setPagination(response.pagination);
                } else {
                    setPagination(null);
                }
            } catch (error) {
                console.error('Error occurred:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRooms();
    }, [currentPage, pageSize, sortBy]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            default:
                return 'bg-red-100 text-red-700 hover:bg-red-100';
        }
    };

    const roomColumns: TableColumn[] = [
        {
            key: 'roomNumber',
            label: 'Name',
            sortable: true,
            className: 'font-medium text-gray-900'
        },
        {
            key: 'status',
            label: 'Status',
            render: (_item, value) => (
                <Badge className={`${getStatusColor(value)} border-0`}>
                    • {value}
                </Badge>
            )
        },
        {
            key: 'roomType',
            label: 'Type',
            render: (item) => <span className="text-gray-600">{item.roomType.name}</span>
        },
        {
            key: 'floor',
            label: 'Floor',
            className: 'text-gray-600'
        },
        {
            key: 'occupancy',
            label: 'Occupancy',
            render: defaultRenderers.occupancy
        },
        {
            key: 'maxOccupancy',
            label: 'Max Occupancy',
            render: (item) => <span className="text-gray-600">{item.roomType.maxOccupancy}</span>
        }
    ];

    const roomActions: ActionMenuItem[] = [
        {
            label: 'Edit',
            onClick: (room, e) => {
                e.stopPropagation();
                navigate(`/rooms/${room.id}`);
            }
        }
    ];

    const handleDeleteRoom = async (room: Room) => {
        try {
            await deleteRoom(room.id);
            // Refresh rooms with current pagination after delete
            const response = await getRooms({
                page: currentPage,
                limit: pageSize
            });
            setRooms(response.data);

            // Update pagination
            if (response.pagination) {
                setPagination(response.pagination);
                // If we deleted the last item on a page, go back to previous page
                if (response.data.length === 0 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } else {
                setPagination(null);
            }
        } catch (error) {
            console.error('Error deleting room:', error);
            toast.error('Failed to delete room');
        }
    };

    const handleRoomTypeConfirm = async (data: AddRoomTypeRequest) => {
        try {
            await addRoomType(data);
            toast.success('Room type created successfully');
            setIsRoomTypeDialogOpen(false); // Close dialog after successful creation
        } catch (error: any) {
            console.error('Error creating room type:', error);
            toast.error(error.userMessage || 'Error creating room type');
            throw error; // Re-throw to let the dialog handle loading state
        }
    };

    const handleRoomTypeCancel = () => {
        setIsRoomTypeDialogOpen(false);
    };


    return (
        <>
            <DataTable
                data={rooms}
                loading={loading}
                columns={roomColumns}
                title="Rooms"
                actions={roomActions}
                primaryAction={{
                    label: 'New Room',
                    onClick: () => navigate('/rooms/new')
                }}
                secondaryActions={[
                    {
                        label: 'New Room Type',
                        icon: <Plus />,
                        onClick: () => setIsRoomTypeDialogOpen(true),
                        variant: 'foreground'
                    }
                ]}
                getRowKey={(room) => room.id}
                filter={{
                    searchPlaceholder: "Search rooms...",
                    searchFields: ['roomNumber', 'status', 'roomType.name']
                }}
                pagination={pagination ? {
                    currentPage: pagination.currentPage,
                    totalPages: pagination.totalPages,
                    totalItems: pagination.totalItems,
                    onPageChange: setCurrentPage,
                    showPreviousNext: true,
                    maxVisiblePages: 7
                } : undefined}
                deleteConfig={{
                    onDelete: handleDeleteRoom,
                    getDeleteTitle: () => 'Delete Room',
                    // getDeleteDescription: (room) =>
                    //     `Are you sure you want to delete room ${room.roomNumber}? This action cannot be undone.`,
                    // getItemName: (room) => room.roomNumber
                }}
            />
            <NewRoomTypeDialog
                isOpen={isRoomTypeDialogOpen}
                onCancel={handleRoomTypeCancel}
                onConfirm={handleRoomTypeConfirm}
            />
        </>
    );

};

export default Rooms;
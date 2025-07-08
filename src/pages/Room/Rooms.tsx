import { useEffect, useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { useNavigate } from 'react-router-dom';
import { deleteRoom, getRooms } from '@/services/Rooms';
import { AddRoomTypeRequest, Room } from '@/validation';
import DataTable, { ActionMenuItem, defaultRenderers, TableColumn } from '@/components/Templates/DataTable';
import NewRoomTypeDialog from './NewRoomTypeDialog';
import { addRoomType } from '@/services/RoomTypes';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const Rooms = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [sortBy, _setSortBy] = useState('name');
    const [isRoomTypeDialogOpen, setIsRoomTypeDialogOpen] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const response = await getRooms();
                setRooms(response.data);
            } catch (error) {
                console.error('Error occurred:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRooms();
    }, [currentPage, sortBy]);

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
        await deleteRoom(room.id);
        setRooms(rooms.filter(r => r.id !== room.id));
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
                    },
                ]}
                getRowKey={(room) => room.id}
                filter={{
                    searchPlaceholder: "Search rooms...",
                    searchFields: ['roomNumber', 'status', 'roomType.name']
                }}
                pagination={{
                    currentPage,
                    totalPages: Math.ceil(50 / 10),
                    onPageChange: setCurrentPage,
                    showPreviousNext: true,
                    maxVisiblePages: 7
                }}
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
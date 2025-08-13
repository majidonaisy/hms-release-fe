import { useEffect, useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { useNavigate } from 'react-router-dom';
import { deleteRoom, getRooms } from '@/services/Rooms';
import { getAlRoomTypes, getRoomTypes } from '@/services/RoomTypes';
import { AddRoomTypeRequest, Room, RoomType } from '@/validation';
import DataTable, { ActionMenuItem, defaultRenderers, TableColumn } from '@/components/Templates/DataTable';
import NewRoomTypeDialog from '../../components/dialogs/NewRoomTypeDialog';
import { addRoomType } from '@/services/RoomTypes';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { useDebounce } from '@/hooks/useDebounce';

const Rooms = () => {
    const { canCreate } = usePermissions();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8);
    const [loading, setLoading] = useState(false);
    const [isRoomTypeDialogOpen, setIsRoomTypeDialogOpen] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedRoomType, setSelectedRoomType] = useState('all');
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [pagination, setPagination] = useState<{
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        hasNext: boolean;
        hasPrevious: boolean;
    } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    const [searchLoading, setSearchLoading] = useState(false);

    const roomStatusOptions = [
        { value: 'AVAILABLE', label: 'Available', color: 'bg-chart-1/20 text-chart-1' },
        { value: 'OCCUPIED', label: 'Occupied', color: 'bg-chart-4/20 text-chart-4' },
        { value: 'DIRTY', label: 'Dirty', color: 'bg-chart-5/20 text-chart-5' }
    ];

    useEffect(() => {
        const fetchRoomTypes = async () => {
            setLoading(true)
            try {
                const response = await getAlRoomTypes();
                setRoomTypes(response.data || response);
            } catch (error) {
                console.error("Error fetching room types:", error);
            } finally {
                setLoading(false)
            }
        };
        fetchRoomTypes();
    }, []);

    const roomTypeOptions = roomTypes.map(roomType => ({
        value: roomType.id.toString(),
        label: roomType.name,
    }));

    useEffect(() => {
        const fetchRooms = async () => {
            setSearchLoading(true);
            try {
                const params: any = {
                    page: currentPage,
                    limit: pageSize
                };

                if (debouncedSearchTerm.trim()) {
                    params.q = debouncedSearchTerm;
                }

                if (selectedStatus !== 'all') {
                    params.status = selectedStatus;
                }

                if (selectedRoomType !== 'all') {
                    params.roomTypeId = selectedRoomType;
                }

                const response = await getRooms(params);
                setRooms(response.data);

                if (response.pagination) {
                    setPagination(response.pagination);
                } else {
                    setPagination(null);
                }
            } catch (error) {
                console.error("Error occurred:", error);
            } finally {
                setSearchLoading(false);
            }
        };

        fetchRooms();
    }, [debouncedSearchTerm, currentPage, pageSize, selectedStatus, selectedRoomType]);

    const handleSearch = (search: string) => {
        setSearchTerm(search);
        setCurrentPage(1);
    };

    const handleStatusFilter = (status: string) => {
        setSelectedStatus(status);
        setCurrentPage(1);
    };

    const handleRoomTypeFilter = (roomTypeId: string) => {
        setSelectedRoomType(roomTypeId);
        setCurrentPage(1);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return 'bg-chart-1/20 text-chart-1 hover:bg-chart-1/20';
            case 'OCCUPIED':
                return 'bg-chart-4/20 text-chart-4 hover:bg-chart-4/20';
            case 'DIRTY':
                return 'bg-chart-5/20 text-chart-5 hover:bg-chart-5/20';
            default:
                return 'bg-chart-5/20 text-chart-5 hover:bg-chart-5/20';
        }
    };

    const roomColumns: TableColumn[] = [
        {
            key: 'roomNumber',
            label: 'Room Number ',
            className: 'font-medium text-gray-900'
        },
        {
            key: 'status',
            label: 'Status',
            render: (_item, value) => (
                <Badge className={`${getStatusColor(value)} w-full border-0`}>
                    {value}
                </Badge>
            )
        },
        {
            key: 'description',
            label: 'Description',
            render: (item) => <span className="text-gray-600">{item.description || 'No description'}</span>,
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
            },
            action: "update",
            subject: "Room"
        }
    ];

    const handleDeleteRoom = async (room: Room) => {
        try {
            await deleteRoom(room.id);

            const params: any = {
                page: currentPage,
                limit: pageSize
            };

            if (debouncedSearchTerm.trim()) {
                params.q = debouncedSearchTerm;
            }

            if (selectedStatus !== 'all') {
                params.status = selectedStatus;
            }

            if (selectedRoomType !== 'all') {
                params.roomTypeId = selectedRoomType;
            }

            const response = await getRooms(params);
            setRooms(response.data);

            if (response.pagination) {
                setPagination(response.pagination);
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
            setIsRoomTypeDialogOpen(false);

            const response = await getRoomTypes();
            setRoomTypes(response.data || response);
        } catch (error: any) {
            console.error('Error creating room type:', error);
            toast.error(error.userMessage || 'Error creating room type');
            throw error;
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
                searchLoading={searchLoading}
                primaryAction={canCreate('Room') ? {
                    label: 'New Room',
                    onClick: () => navigate('/rooms/new'),
                    action: "create",
                    subject: "Room"
                } : undefined}
                secondaryActions={canCreate('RoomType') ? [
                    {
                        label: 'New Room Type',
                        icon: <Plus />,
                        onClick: () => setIsRoomTypeDialogOpen(true),
                        variant: 'foreground',
                        action: "create",
                        subject: "RoomType"
                    },
                ] : []}
                getRowKey={(room) => room.id}
                filter={{
                    searchPlaceholder: "Search rooms...",
                    searchFields: ['roomNumber', 'status', 'roomType.name'],
                    showFilter: true,
                    selectFilters: [
                        {
                            key: 'status',
                            label: 'Status',
                            options: roomStatusOptions,
                            defaultLabel: "All Statuses",
                            onFilterChange: handleStatusFilter
                        },
                        {
                            key: 'roomType',
                            label: 'Room Type',
                            options: roomTypeOptions,
                            defaultLabel: "All Room Types",
                            onFilterChange: handleRoomTypeFilter
                        }
                    ]
                }}
                onSearch={handleSearch}
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
                    action: "delete",
                    subject: "Room"
                }}
            />
            <NewRoomTypeDialog
                open={isRoomTypeDialogOpen}
                onClose={handleRoomTypeCancel}
                onSuccess={() => handleRoomTypeConfirm}
            />
        </>
    );
};

export default Rooms;
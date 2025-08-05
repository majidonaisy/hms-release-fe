import { useEffect, useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { useNavigate } from 'react-router-dom';
import { deleteRoom, getRooms, searchRooms } from '@/services/Rooms';
import { getRoomTypes } from '@/services/RoomTypes'; // Add this import
import { AddRoomTypeRequest, GetRoomsResponse, Room, RoomType } from '@/validation'; // Add RoomType import
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
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedRoomType, setSelectedRoomType] = useState('all'); // Add room type filter state
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]); // Add room types state
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

    // Fetch room types on component mount
    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const response = await getRoomTypes();
                setRoomTypes(response.data || response); // Handle different API response structures
            } catch (error) {
                console.error("Error fetching room types:", error);
            }
        };
        fetchRoomTypes();
    }, []);

    // Convert room types to filter options
    const roomTypeOptions = roomTypes.map(roomType => ({
        value: roomType.id.toString(),
        label: roomType.name,
    }));

    useEffect(() => {
        const fetchRooms = async () => {
            setSearchLoading(true);
            try {
                const response = debouncedSearchTerm
                    ? ((await searchRooms(debouncedSearchTerm)) as GetRoomsResponse)
                    : await getRooms({ page: currentPage, limit: pageSize })
                setRooms(response.data)
            } catch (error) {
                console.error("Error occurred:", error);
            } finally {
                setSearchLoading(false);
            }
        };

        if (debouncedSearchTerm.trim() || !searchTerm.trim()) {
            fetchRooms();
        }
    }, [debouncedSearchTerm, currentPage, pageSize]);

    useEffect(() => {
        let filtered = rooms;

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(room => room.status === selectedStatus);
        }

        if (selectedRoomType !== 'all') {
            filtered = filtered.filter(room => room.roomType.id.toString() === selectedRoomType);
        }

        setFilteredRooms(filtered);
    }, [rooms, searchTerm, selectedStatus, selectedRoomType]); // Add selectedRoomType dependency

    useEffect(() => {
        const handleGetEmployees = async () => {
            setLoading(true);
            try {
                const response = await getRooms({
                    page: currentPage,
                    limit: pageSize
                });
                console.log('response', response);
                setRooms(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                } else {
                    setPagination(null);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        handleGetEmployees();

    }, [currentPage, pageSize]);

    const handleSearch = (search: string) => {
        setSearchTerm(search);
    };

    const handleStatusFilter = (status: string) => {
        setSelectedStatus(status);
    };

    const handleRoomTypeFilter = (roomTypeId: string) => {
        setSelectedRoomType(roomTypeId);
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
            label: 'Name',
            sortable: true,
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

            // Refresh room types list
            const response = await getRoomTypes();
            setRoomTypes(response.data || response);
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
                data={filteredRooms}
                loading={loading}
                columns={roomColumns}
                title="Rooms"
                actions={roomActions}
                searchLoading={searchLoading}
                primaryAction={canCreate('Room') ? {
                    label: 'New Room',
                    onClick: () => navigate('/rooms/new')
                } : undefined}
                secondaryActions={canCreate('RoomType') ? [
                    {
                        label: 'New Room Type',
                        icon: <Plus />,
                        onClick: () => setIsRoomTypeDialogOpen(true),
                        variant: 'foreground'
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
                    totalItems: filteredRooms.length,
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
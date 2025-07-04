import { useEffect, useState } from 'react';
import { Search, Plus, ChevronDown, EllipsisVertical, Wrench, Calendar } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Badge } from '@/components/atoms/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';
import Pagination from '@/components/atoms/Pagination';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import NewMaintenanceDialog from './NewMaintenanceDialog';
import DeleteDialog from '@/components/molecules/DeleteDialog';

interface MaintenanceRequest {
    id: string;
    roomNumber: string;
    type: 'ROUTINE' | 'REPAIR' | 'URGENT' | 'CLEANING';
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    title: string;
    description: string;
    requestedBy: string;
    assignedTo?: string;
    requestDate: string;
    scheduledDate?: string;
    completedDate?: string;
    estimatedDuration: number; // in hours
}

// Mock data
const mockMaintenanceData: MaintenanceRequest[] = [
    {
        id: '1',
        roomNumber: '101',
        type: 'REPAIR',
        status: 'PENDING',
        priority: 'HIGH',
        title: 'AC Unit Not Working',
        description: 'Air conditioning unit in room 101 is not cooling properly',
        requestedBy: 'John Manager',
        assignedTo: 'Mike Technician',
        requestDate: '2025-01-02',
        scheduledDate: '2025-01-03',
        estimatedDuration: 2
    },
    {
        id: '2',
        roomNumber: '205',
        type: 'CLEANING',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        title: 'Deep Cleaning Required',
        description: 'Deep cleaning needed after checkout',
        requestedBy: 'Sarah Housekeeper',
        assignedTo: 'Lisa Cleaner',
        requestDate: '2025-01-02',
        scheduledDate: '2025-01-02',
        estimatedDuration: 3
    },
    {
        id: '3',
        roomNumber: '312',
        type: 'ROUTINE',
        status: 'COMPLETED',
        priority: 'LOW',
        title: 'Monthly Safety Check',
        description: 'Monthly safety inspection and maintenance check',
        requestedBy: 'System Auto',
        assignedTo: 'Tom Inspector',
        requestDate: '2025-01-01',
        scheduledDate: '2025-01-01',
        completedDate: '2025-01-01',
        estimatedDuration: 1
    },
    {
        id: '4',
        roomNumber: '408',
        type: 'URGENT',
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        title: 'Water Leak Emergency',
        description: 'Water leak detected in bathroom ceiling',
        requestedBy: 'Emergency Alert',
        assignedTo: 'Emergency Team',
        requestDate: '2025-01-02',
        scheduledDate: '2025-01-02',
        estimatedDuration: 4
    },
    {
        id: '5',
        roomNumber: '150',
        type: 'REPAIR',
        status: 'PENDING',
        priority: 'MEDIUM',
        title: 'Broken Window Latch',
        description: 'Window latch is broken and needs replacement',
        requestedBy: 'Guest Complaint',
        requestDate: '2025-01-02',
        estimatedDuration: 1
    },
    {
        id: '6',
        roomNumber: '150',
        type: 'REPAIR',
        status: 'PENDING',
        priority: 'MEDIUM',
        title: 'Broken Window Latch',
        description: 'Window latch is broken and needs replacement',
        requestedBy: 'Guest Complaint',
        requestDate: '2025-01-02',
        estimatedDuration: 1
    },
    {
        id: '7',
        roomNumber: '150',
        type: 'REPAIR',
        status: 'PENDING',
        priority: 'MEDIUM',
        title: 'Broken Window Latch',
        description: 'Window latch is broken and needs replacement',
        requestedBy: 'Guest Complaint',
        requestDate: '2025-01-02',
        estimatedDuration: 1
    },
    {
        id: '8',
        roomNumber: '150',
        type: 'REPAIR',
        status: 'PENDING',
        priority: 'MEDIUM',
        title: 'Broken Window Latch',
        description: 'Window latch is broken and needs replacement',
        requestedBy: 'Guest Complaint',
        requestDate: '2025-01-02',
        estimatedDuration: 1
    },
    {
        id: '9',
        roomNumber: '150',
        type: 'REPAIR',
        status: 'PENDING',
        priority: 'MEDIUM',
        title: 'Broken Window Latch',
        description: 'Window latch is broken and needs replacement',
        requestedBy: 'Guest Complaint',
        requestDate: '2025-01-02',
        estimatedDuration: 1
    },
    {
        id: '10',
        roomNumber: '150',
        type: 'REPAIR',
        status: 'PENDING',
        priority: 'MEDIUM',
        title: 'Broken Window Latch',
        description: 'Window latch is broken and needs replacement',
        requestedBy: 'Guest Complaint',
        requestDate: '2025-01-02',
        estimatedDuration: 1
    },
    {
        id: '11',
        roomNumber: '150',
        type: 'REPAIR',
        status: 'PENDING',
        priority: 'MEDIUM',
        title: 'Broken Window Latch',
        description: 'Window latch is broken and needs replacement',
        requestedBy: 'Guest Complaint',
        requestDate: '2025-01-02',
        estimatedDuration: 1
    }
];

const Maintenance = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(mockMaintenanceData);
    const [isNewMaintenanceDialogOpen, setIsNewMaintenanceDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<{ id: string; title: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const itemsPerPage = 7;

    // Filter and search logic
    const filteredRequests = maintenanceRequests.filter(request => {
        const matchesSearch = request.roomNumber.toLowerCase().includes(searchText.toLowerCase()) ||
            request.title.toLowerCase().includes(searchText.toLowerCase()) ||
            request.assignedTo?.toLowerCase().includes(searchText.toLowerCase()) ||
            request.requestedBy.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;
        const matchesType = typeFilter === 'ALL' || request.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const paginatedRequests = filteredRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Status badge styling
    const getStatusBadge = (status: MaintenanceRequest['status']) => {
        const styles = {
            PENDING: 'bg-chart-1/20 text-chart-1 hover:bg-chart-1/20',
            IN_PROGRESS: 'bg-chart-2/20 text-chart-2 hover:bg-chart-2/20',
            COMPLETED: 'bg-chart-3/20 text-chart-3 hover:bg-chart-3/20',
            CANCELLED: 'bg-chart-4/20 text-chart-4 hover:bg-chart-4/20'
        };
        return styles[status];
    };

    // Add this function alongside your existing badge styling functions
    const getStatusDotColor = (status: MaintenanceRequest['status']) => {
        const dotColors = {
            PENDING: 'bg-chart-1',
            IN_PROGRESS: 'bg-chart-2',
            COMPLETED: 'bg-chart-3',
            CANCELLED: 'bg-chart-4'
        };
        return dotColors[status];
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEditClick = (e: React.MouseEvent, requestId: string) => {
        e.stopPropagation();
        navigate(`/maintenance/${requestId}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, request: MaintenanceRequest) => {
        e.stopPropagation();
        setRequestToDelete({ id: request.id, title: request.title });
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!requestToDelete) return;

        setDeleteLoading(true);
        try {
            // Mock delete operation
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMaintenanceRequests(prev => prev.filter(req => req.id !== requestToDelete.id));
            toast.success('Maintenance request deleted successfully');
        } catch (error) {
            toast.error('Failed to delete maintenance request');
        } finally {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            setRequestToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setRequestToDelete(null);
    };

    const handleNewMaintenanceConfirm = async (data: any) => {
        try {
            // Mock API call to create maintenance request
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create new maintenance request from dialog data
            const newRequest: MaintenanceRequest = {
                id: `new_${Date.now()}`,
                roomNumber: data.areaNameOrNumber,
                type: 'REPAIR', // Map from dialog data
                status: 'PENDING',
                priority: data.priority,
                title: data.issueDescription.substring(0, 50) + '...',
                description: data.issueDescription,
                requestedBy: 'Current User', // Should come from auth context
                assignedTo: data.assignedTo,
                requestDate: new Date().toISOString().split('T')[0],
                estimatedDuration: 2 // Default value
            };

            setMaintenanceRequests(prev => [newRequest, ...prev]);
            setIsNewMaintenanceDialogOpen(false);
            toast.success('Maintenance request created successfully');
        } catch (error) {
            toast.error('Failed to create maintenance request');
            throw error; // Re-throw to let dialog handle it
        }
    };

    const handleNewMaintenanceCancel = () => {
        setIsNewMaintenanceDialogOpen(false);
    };

    const handleStatusChange = (requestId: string, newStatus: MaintenanceRequest['status']) => {
        setMaintenanceRequests(prev =>
            prev.map(request =>
                request.id === requestId
                    ? { ...request, status: newStatus }
                    : request
            )
        );
        toast.success('Status updated successfully');
    };

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, statusFilter, typeFilter]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Wrench className="h-6 w-6 text-hms-primary" />
                    <h1 className="text-2xl font-semibold text-gray-900">Maintenance</h1>
                    <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {filteredRequests.length} Request{filteredRequests.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3 min-w-80">
                        <Input
                            type="text"
                            placeholder="Search by room, title, or assignee..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
                        />
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Type Filter */}
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            <SelectItem value="ROUTINE">Routine</SelectItem>
                            <SelectItem value="REPAIR">Repair</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                            <SelectItem value="CLEANING">Cleaning</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Action Button */}
                    <div className="flex gap-2 ml-auto">
                        <Button onClick={() => setIsNewMaintenanceDialogOpen(true)}>
                            <Plus className="h-4 w-4" />
                            New Request
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
                                Area Type
                            </TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Area Name or Number</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Issue Description</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Priority</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Status</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Assigned To</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedRequests.map((request) => (
                            <TableRow key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <TableCell className="px-6 py-4 font-medium text-gray-900">
                                    {request.roomNumber}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{request.title}</div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    {request.type.toLowerCase()}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    {request.priority.toLowerCase()}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${getStatusBadge(request.status)} border-0`}>
                                            <div className={`w-2 h-2 rounded-full ${getStatusDotColor(request.status)}`}></div>
                                            {request.status.replace('_', ' ').toLowerCase()}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-600">
                                    {request.assignedTo || 'Unassigned'}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                className="bg-inherit shadow-none p-0 text-hms-accent font-bold text-xl border hover:border-hms-accent hover:bg-hms-accent/15"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <EllipsisVertical />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="shadow-lg border-hms-accent">
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={(e) => handleEditClick(e, request.id)}
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {request.status === 'PENDING' && (
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => handleStatusChange(request.id, 'IN_PROGRESS')}
                                                >
                                                    Start Work
                                                </DropdownMenuItem>
                                            )}
                                            {request.status === 'IN_PROGRESS' && (
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => handleStatusChange(request.id, 'COMPLETED')}
                                                >
                                                    Mark Complete
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="cursor-pointer text-red-600"
                                                onClick={(e) => handleDeleteClick(e, request)}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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

            {/* New Maintenance Dialog */}
            <NewMaintenanceDialog
                isOpen={isNewMaintenanceDialogOpen}
                onConfirm={handleNewMaintenanceConfirm}
                onCancel={handleNewMaintenanceCancel}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                isOpen={deleteDialogOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                title="Delete Maintenance Request"
                description={`Are you sure you want to delete "${requestToDelete?.title}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default Maintenance;

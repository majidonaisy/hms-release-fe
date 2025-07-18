import { useEffect, useState } from 'react';
import { Search, Plus, EllipsisVertical, Wrench } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Badge } from '@/components/atoms/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';
import Pagination from '@/components/atoms/Pagination';
import { toast } from 'sonner';
import NewMaintenanceDialog from '../../components/dialogs/NewMaintenanceDialog';
import DeleteDialog from '@/components/molecules/DeleteDialog';
import ActivityLogDialog, { ActivityLogEntry } from '@/components/dialogs/ActivityLogDialog';
import { addMaintenance, completeMaintenance, deleteMaintenance, getMaintenances, startMaintenance } from '@/services/Maintenance';
import { Maintenance as MaintenanceType } from '@/validation';

const MaintenancePage = () => {
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8);
    const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceType[]>([]);
    const [isNewMaintenanceDialogOpen, setIsNewMaintenanceDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceType | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<{ id: string; title: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activityLogOpen, setActivityLogOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [pagination, setPagination] = useState<{
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        hasNext: boolean;
        hasPrevious: boolean;
    } | null>(null);

    // With server-side pagination, we'll use the filtered data directly
    // Client-side filtering will be done later or if there's no pagination from backend
    const filteredRequests = maintenanceRequests;

    // Status badge styling - Updated for new status values
    const getStatusBadge = (status: MaintenanceType['status']) => {
        const styles = {
            PENDING: 'bg-chart-1/20 text-chart-1 hover:bg-chart-1/20',
            IN_PROGRESS: 'bg-chart-2/20 text-chart-2 hover:bg-chart-2/20',
            COMPLETED: 'bg-chart-3/20 text-chart-3 hover:bg-chart-3/20',
            CANCELED: 'bg-chart-4/20 text-chart-4 hover:bg-chart-4/20' // Updated from CANCELLED to CANCELED
        };
        return styles[status];
    };

    // Priority badge styling - Updated for new priority values
    const getPriorityBadge = (priority: MaintenanceType['priority']) => {
        const styles = {
            LOW: 'bg-green-100 text-green-700 hover:bg-green-100',
            MEDIUM: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
            HIGH: 'bg-red-100 text-red-700 hover:bg-red-100', // Updated from CRITICAL to HIGH
        };
        return styles[priority];
    };

    // Status dot color - Updated for new status values
    const getStatusDotColor = (status: MaintenanceType['status']) => {
        const dotColors = {
            PENDING: 'bg-chart-1',
            IN_PROGRESS: 'bg-chart-2',
            COMPLETED: 'bg-chart-3',
            CANCELED: 'bg-chart-4' // Updated from CANCELLED to CANCELED
        };
        return dotColors[status];
    };

    const fetchMaintenanceRequests = async () => {
        setLoading(true);
        try {
            const response = await getMaintenances({
                page: currentPage,
                limit: pageSize
            });
            setMaintenanceRequests(response.data);

            // Set pagination if available in response
            if (response.pagination) {
                setPagination(response.pagination);
            } else {
                setPagination(null);
            }
        } catch (error) {
            console.error('Failed to fetch maintenance requests:', error);
            toast.error('Failed to load maintenance requests');
        } finally {
            setLoading(false);
        }
    };



    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Data will be fetched in the useEffect when currentPage changes
    };

    const handleEditClick = (e: React.MouseEvent, requestId: string) => {
        e.stopPropagation();
        const maintenanceToEdit = maintenanceRequests.find(req => req.id === requestId);
        console.log('maintenanceToEdit', maintenanceToEdit)
        if (maintenanceToEdit) {
            setEditingMaintenance(maintenanceToEdit);
            setIsEditMode(true);
            setIsNewMaintenanceDialogOpen(true);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, request: MaintenanceType) => {
        e.stopPropagation();
        setRequestToDelete({
            id: request.id,
            title: request.title || request.description.substring(0, 50) + '...'
        });
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!requestToDelete) return;

        setDeleteLoading(true);
        try {
            await deleteMaintenance(requestToDelete.id);
            setMaintenanceRequests(prev => prev.filter(request => request.id !== requestToDelete.id));
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

    const handleActivityLogClick = (requestId: string) => {
        setSelectedRequestId(requestId);
        setActivityLogOpen(true);
    };

    const handleActivityLogClose = () => {
        setActivityLogOpen(false);
        setSelectedRequestId(null);
    };

    // Mock activity log data - replace this with actual API call
    const getMockActivityLog = (_requestId: string): ActivityLogEntry[] => {
        return [
            {
                id: '1',
                date: '2025-06-21',
                time: '3:27 am',
                description: 'Status changed from "Working On" to "Completed"',
                author: 'Rana K.'
            },
            {
                id: '2',
                date: '2025-06-20',
                time: '5:36 am',
                description: 'Edited',
                author: 'Ali R.'
            },
            {
                id: '3',
                date: '2025-06-18',
                time: '8:10 am',
                description: 'Created',
                author: 'Sara H.'
            },
            {
                id: '4',
                date: '2025-06-18',
                time: '2:15 pm',
                description: 'Priority changed from "Low" to "High"',
                author: 'John D.'
            },
            {
                id: '5',
                date: '2025-06-17',
                time: '10:30 am',
                description: 'Assigned to maintenance team',
                author: 'Admin'
            },
            {
                id: '6',
                date: '2025-06-17',
                time: '9:45 am',
                description: 'Photos uploaded for inspection',
                author: 'Mike T.'
            }
        ];
    };

    const handleNewMaintenanceConfirm = async (data: any) => {
        try {
            if (isEditMode && editingMaintenance) {
                // Handle edit mode
                const updateData = {
                    ...data,
                    id: editingMaintenance.id
                };
                setMaintenanceRequests(prev =>
                    prev.map(request =>
                        request.id === editingMaintenance.id
                            ? { ...request, ...updateData, updatedAt: new Date().toISOString() }
                            : request
                    )
                );
                toast.success('Maintenance request updated successfully');
            } else {
                // Handle add mode
                await addMaintenance(data);

                // Add the new maintenance request to the beginning of the list
                fetchMaintenanceRequests();
                setCurrentPage(1);
                toast.success('Maintenance request created successfully');
            }

            setIsNewMaintenanceDialogOpen(false);
            setIsEditMode(false);
            setEditingMaintenance(null);
        } catch (error) {
            toast.error(isEditMode ? 'Failed to update maintenance request' : 'Failed to create maintenance request');
            throw error;
        }
    };

    const handleNewMaintenanceCancel = () => {
        setIsNewMaintenanceDialogOpen(false);
        setIsEditMode(false);
        setEditingMaintenance(null);
    };

    const handleStatusChange = async (requestId: string) => {
        try {
            await startMaintenance(requestId);
            setMaintenanceRequests(prev =>
                prev.map(request =>
                    request.id === requestId
                        ? { ...request, status: 'IN_PROGRESS' }
                        : request
                )
            );
            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update status');
            return;

        }
    };
    const handleStatusComplete = async (requestId: string) => {
        try {
            await completeMaintenance(requestId);
            setMaintenanceRequests(prev =>
                prev.map(request =>
                    request.id === requestId
                        ? { ...request, status: 'COMPLETED' }
                        : request
                )
            );
            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update status');
            return;

        }
    };

    // Define fetchMaintenanceRequests within the useEffect to avoid dependency issues
    useEffect(() => {
        // Reset to page 1 when filters change
        setCurrentPage(1);
    }, [searchText, statusFilter, typeFilter]);

    // Fetch data whenever page, pageSize, or filter changes
    useEffect(() => {
        fetchMaintenanceRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize, searchText, statusFilter, typeFilter]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Wrench className="h-6 w-6 text-hms-primary" />
                    <h1 className="text-2xl font-semibold text-gray-900">Maintenance</h1>
                    <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {pagination ? pagination.totalItems : filteredRequests.length} Request{(pagination ? pagination.totalItems : filteredRequests.length) !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3 min-w-80">
                        <Input
                            type="text"
                            placeholder="Search by room, description, or assignee..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
                        />
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>

                    {/* Status Filter - Updated for new status values */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELED">Canceled</SelectItem>
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
                        <Button onClick={() => {
                            setIsEditMode(false);
                            setEditingMaintenance(null);
                            setIsNewMaintenanceDialogOpen(true);
                        }}>
                            <Plus className="h-4 w-4" />
                            Add Maintenance
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
                                Type
                            </TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Room</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Description</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Priority</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Status</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Assigned To</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center text-gray-600">
                                    Loading maintenance requests...
                                </TableCell>
                            </TableRow>
                        ) : filteredRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center text-gray-600">
                                    No maintenance requests found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRequests.map((request) => (
                                <TableRow key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <TableCell className="px-6 py-4 font-medium text-gray-900">
                                        {request.type || 'N/A'}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {request.room?.roomNumber || request.roomId || 'Unknown Room'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="truncate max-w-xs" title={request.description}>
                                            {request.description}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <Badge className={`${getPriorityBadge(request.priority)} border-0`}>
                                            {request.priority.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${getStatusDotColor(request.status)}`}></div>
                                            <Badge className={`${getStatusBadge(request.status)} border-0`}>
                                                {request.status.replace('_', ' ').toLowerCase()}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-600">
                                        {request.user?.firstName + " " + request.user?.lastName || 'Unassigned'}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
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
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => handleActivityLogClick(request.id)}
                                                >
                                                    Activity Log
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {request.status === 'PENDING' && (
                                                    <>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => handleStatusChange(request.id)}
                                                        >
                                                            Start Work
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}
                                                {request.status === 'IN_PROGRESS' && (
                                                    <>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => handleStatusComplete(request.id)}
                                                        >
                                                            Mark Complete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}
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
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination - only show if pagination data is available */}
                {pagination && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        showPreviousNext={true}
                        maxVisiblePages={7}
                    />
                )}
            </div>

            {/* New Maintenance Dialog */}
            <NewMaintenanceDialog
                isOpen={isNewMaintenanceDialogOpen}
                onConfirm={handleNewMaintenanceConfirm}
                onCancel={handleNewMaintenanceCancel}
                isEditMode={isEditMode}
                editData={editingMaintenance ? {
                    id: editingMaintenance.id,
                    areaTypeId: editingMaintenance.type || 'REPAIR',
                    areaId: editingMaintenance.roomId,
                    description: editingMaintenance.description,
                    priority: editingMaintenance.priority,
                    userId: editingMaintenance.userId || editingMaintenance.user?.id || '',
                    photos: editingMaintenance.photos || [],
                    isExternal: false,
                    frequency: '',
                    type: editingMaintenance.type,
                    status: editingMaintenance.status
                } : null}
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

            {/* Activity Log Dialog */}
            <ActivityLogDialog
                isOpen={activityLogOpen}
                onClose={handleActivityLogClose}
                title="Maintenance activity log"
                activities={selectedRequestId ? getMockActivityLog(selectedRequestId) : []}
            />
        </div>
    );
};

export default MaintenancePage;
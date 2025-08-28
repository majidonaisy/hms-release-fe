import { useCallback, useEffect, useState } from 'react';
import { Plus, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Badge } from '@/components/atoms/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';
import Pagination from '@/components/atoms/Pagination';
import { toast } from 'sonner';
import NewMaintenanceDialog from '../../components/dialogs/NewMaintenanceDialog';
import DeleteDialog from '@/components/molecules/DeleteDialog';
import ActivityLogDialog, { ActivityLogEntry } from '@/components/dialogs/ActivityLogDialog';
import { addMaintenance, completeMaintenance, deleteMaintenance, getMaintenances, startMaintenance, updateMaintenance } from '@/services/Maintenance';
import { Maintenance as MaintenanceType } from '@/validation';
import { Can, CanAll } from '@/context/CASLContext';

const MaintenancePage = () => {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(18);
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
    const [error, setError] = useState<string | null>(null);

    const getPriorityBadge = (priority: MaintenanceType['priority']) => {
        const styles = {
            LOW: 'bg-green-100 text-green-700 hover:bg-green-100',
            MEDIUM: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
            HIGH: 'bg-red-100 text-red-700 hover:bg-red-100',
        };
        return styles[priority];
    };

    const getStatusDotColor = (status: MaintenanceType['status']) => {
        const dotColors = {
            PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
            IN_PROGRESS: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
            COMPLETED: 'bg-green-100 text-green-800 hover:bg-green-100',
            CANCELED: 'bg-red-100 text-red-800 hover:bg-red-100',
        };
        return dotColors[status];
    };

    const fetchMaintenanceRequests = useCallback(async () => {
        setLoading(true);
        setError(null)
        try {
            const params: any = {
                page: currentPage,
                limit: pageSize,
            };

            if (statusFilter !== 'ALL') {
                params.status = statusFilter;
            }

            const response = await getMaintenances(params);
            setMaintenanceRequests(response.data);

            if (response.pagination) {
                setPagination(response.pagination);
            } else {
                setPagination(null);
            }
        } catch (error: any) {
            console.error('Failed to fetch maintenance requests:', error);
            toast.error('Failed to load maintenance requests');
            setError(error.userMessage || "Failed to get maintenance requests")
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, statusFilter]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

    // Generate activity log from maintenance request data
    const generateActivityLog = (requestId: string): ActivityLogEntry[] => {
        const request = maintenanceRequests.find(r => r.id === requestId);
        if (!request) return [];

        const activities: ActivityLogEntry[] = [];

        // Helper function to format date and time
        const formatDateTime = (dateString: string) => {
            const date = new Date(dateString);
            const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).toLowerCase();
            return { date: formattedDate, time: formattedTime };
        };

        // Add creation activity
        if (request.createdAt) {
            const { date, time } = formatDateTime(request.createdAt);
            activities.push({
                id: `${request.id}-created`,
                date,
                time,
                description: 'Status changed from "New" to "Pending"'
            });
        }

        // Add started activity if request was started
        if (request.startedAt) {
            const { date, time } = formatDateTime(request.startedAt);
            activities.push({
                id: `${request.id}-started`,
                date,
                time,
                description: 'Status changed from "Pending" to "In Progress"'
            });
        }

        // Add completion activity if request was completed
        if (request.completedAt) {
            const { date, time } = formatDateTime(request.completedAt);
            activities.push({
                id: `${request.id}-completed`,
                date,
                time,
                description: 'Status changed from "In Progress" to "Completed"'
            });
        }

        // Sort activities by date and time (most recent first)
        activities.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateB.getTime() - dateA.getTime();
        });

        return activities;
    };

    const handleNewMaintenanceConfirm = async (data: any) => {
        try {
            if (isEditMode && editingMaintenance) {
                // Handle edit mode
                await updateMaintenance(editingMaintenance.id, data);
                fetchMaintenanceRequests();
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
        const currentTimestamp = new Date().toISOString();

        setMaintenanceRequests(prev =>
            prev.map(request =>
                request.id === requestId
                    ? {
                        ...request,
                        status: 'IN_PROGRESS',
                        startedAt: currentTimestamp
                    }
                    : request
            )
        );

        try {
            const apiResponse = await startMaintenance(requestId);
            toast.success('Status updated successfully');

            if (apiResponse?.data) {
                setMaintenanceRequests(prev =>
                    prev.map(request =>
                        request.id === requestId
                            ? { ...request, ...apiResponse.data }
                            : request
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update status');

            setMaintenanceRequests(prev =>
                prev.map(request =>
                    request.id === requestId
                        ? { ...request, status: 'PENDING', startedAt: undefined }
                        : request
                )
            );
            return;
        }
    };

    const handleStatusComplete = async (requestId: string) => {
        const currentTimestamp = new Date().toISOString();

        setMaintenanceRequests(prev =>
            prev.map(request =>
                request.id === requestId
                    ? {
                        ...request,
                        status: 'COMPLETED',
                        completedAt: currentTimestamp
                    }
                    : request
            )
        );

        try {
            const apiResponse = await completeMaintenance(requestId);
            toast.success('Status updated successfully');

            if (apiResponse?.data) {
                setMaintenanceRequests(prev =>
                    prev.map(request =>
                        request.id === requestId
                            ? { ...request, ...apiResponse.data }
                            : request
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update status');

            setMaintenanceRequests(prev =>
                prev.map(request =>
                    request.id === requestId
                        ? { ...request, status: 'IN_PROGRESS', completedAt: undefined }
                        : request
                )
            );
            return;
        }
    };

    const handleStatusFilterChange = (value: string) => {
        setCurrentPage(1);
        setStatusFilter(value);
    };

    useEffect(() => {
        fetchMaintenanceRequests();
    }, [fetchMaintenanceRequests]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold text-gray-900">Maintenance</h1>
                    <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {pagination ? pagination.totalItems : maintenanceRequests.length} Request{(pagination ? pagination.totalItems : maintenanceRequests.length) !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Search and Filters */}
                <div className="flex gap-2 justify-end text-end">

                    {/* Status Filter - Updated for new status values */}
                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELED">Canceled</SelectItem>
                        </SelectContent>
                    </Select>

                    <CanAll
                        permissions={[
                            { action: "create", subject: "Maintenance" },
                            { action: "read", subject: "Area" }
                        ]}
                    >
                        <div className="">
                            <Button onClick={() => {
                                setIsEditMode(false);
                                setEditingMaintenance(null);
                                setIsNewMaintenanceDialogOpen(true);
                            }}>
                                <Plus className="h-4 w-4" />
                                Add Maintenance
                            </Button>
                        </div>
                    </CanAll>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow ">
                <Table >
                    <TableHeader className="bg-hms-accent/15">
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4 w-1/5">Room</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4 w-1/5">Description</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4 w-1/5">Priority</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4 w-1/5">Status</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4 w-1/5">Assigned To</TableHead>
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
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center text-gray-600">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : maintenanceRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center text-gray-600">
                                    No maintenance requests found
                                </TableCell>
                            </TableRow>
                        ) : (
                            maintenanceRequests.map((request) => (
                                <TableRow key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <TableCell className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {request.room ? (
                                                <> Room {request.room.roomNumber}</>
                                            ) : request.area ? (
                                                request.area.name
                                            ) : (
                                                <>Unknown</>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="truncate max-w-xs" title={request.description}>
                                            {request.description}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <Badge className={`${getPriorityBadge(request.priority)} border-0`}>
                                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1).toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <Badge className={`  ${getStatusDotColor(request.status)}`}>
                                            {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1).toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={`px-6 py-4 text-gray-600 ${request.user ? 'text-black' : 'text-muted-foreground'}`}>
                                        {request.user ? `${request.user.firstName} ${request.user.lastName}` : 'Unassigned'}
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
                                                <CanAll permissions={[
                                                    { action: "update", subject: "Maintenance" },
                                                    { action: "read", subject: "Area" }
                                                ]}>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={(e) => handleEditClick(e, request.id)}
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                </CanAll>

                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => handleActivityLogClick(request.id)}
                                                >
                                                    Activity Log
                                                </DropdownMenuItem>
                                                <Can action='update' subject='Maintenance'>
                                                    {request.status === 'PENDING' && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() => handleStatusChange(request.id)}
                                                            >
                                                                Start Work
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {request.status === 'IN_PROGRESS' && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() => handleStatusComplete(request.id)}
                                                            >
                                                                Mark Complete
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </Can>
                                                <Can action='delete' subject='Maintenance'>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="cursor-pointer text-red-600"
                                                        onClick={(e) => handleDeleteClick(e, request)}
                                                    >
                                                        Delete
                                                    </DropdownMenuItem>
                                                </Can>
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

            <NewMaintenanceDialog
                isOpen={isNewMaintenanceDialogOpen}
                onConfirm={handleNewMaintenanceConfirm}
                onCancel={handleNewMaintenanceCancel}
                isEditMode={isEditMode}
                editData={editingMaintenance ? {
                    id: editingMaintenance.id,
                    areaTypeId: editingMaintenance.roomId ? 'ROOM' : 'AREA',
                    areaId: editingMaintenance.roomId ? undefined : (editingMaintenance as any).areaId,
                    roomId: editingMaintenance.roomId,
                    description: editingMaintenance.description,
                    priority: editingMaintenance.priority,
                    userId: editingMaintenance.userId || editingMaintenance.user?.id || '',
                    photos: editingMaintenance.photos || [],
                    isExternal: Boolean(editingMaintenance.userId || editingMaintenance.user?.id),
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
                activities={selectedRequestId ? generateActivityLog(selectedRequestId) : []}
            />
        </div >
    );
};

export default MaintenancePage;
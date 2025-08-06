import { useCallback, useEffect, useState } from 'react';
import { Plus, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Badge } from '@/components/atoms/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';
import Pagination from '@/components/atoms/Pagination';
import { toast } from 'sonner';
import NewHousekeepingDialog from '../../components/dialogs/NewHousekeepingDialog';
import DeleteDialog from '@/components/molecules/DeleteDialog';
import ActivityLogDialog, { type ActivityLogEntry } from '@/components/dialogs/ActivityLogDialog';
import { addHousekeepingTask, deleteHousekeepingTask, getHousekeepingTasks, startHousekeepingTask, completeHousekeepingTask, updateHousekeepingTask } from '@/services/Housekeeping';
import { type Housekeeping } from '@/validation';
import TableSkeleton from '@/components/Templates/TableSkeleton';

interface HousekeepingFormData {
    id?: string;
    roomId: string;
    userId: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

const HousekeepingPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(7);
    const [housekeepingTasks, setHousekeepingTasks] = useState<Housekeeping[]>([]);
    const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingTask, setEditingTask] = useState<HousekeepingFormData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activityLogOpen, setActivityLogOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [pagination, setPagination] = useState<{
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        hasNext: boolean;
        hasPrevious: boolean;
    } | null>(null);
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Priority badge styling
    const getPriorityBadge = (priority: Housekeeping['priority']) => {
        const styles = {
            LOW: 'bg-green-100 text-green-700 hover:bg-green-100',
            MEDIUM: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
            HIGH: 'bg-red-100 text-red-700 hover:bg-red-100',
        };
        return styles[priority];
    };

    // Status dot color
    const getStatusDotColor = (status: Housekeeping['status']) => {
        const dotColors = {
            PENDING: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
            IN_PROGRESS: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
            COMPLETED: 'bg-green-100 text-green-700 hover:bg-green-100',
            CANCELED: 'bg-red-100 text-red-700 hover:bg-red-100',
        };
        return dotColors[status];
    };

    const fetchHousekeepingTasks = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                limit: pageSize,
            };

            if (statusFilter !== 'ALL') {
                params.status = statusFilter;
            }

            const response = await getHousekeepingTasks(params);
            setHousekeepingTasks(response.data);

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
    }, [currentPage, pageSize, statusFilter]);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Data will be fetched in useEffect when currentPage changes
    };

    const handleEditClick = (e: React.MouseEvent, task: Housekeeping) => {
        e.stopPropagation();
        setEditingTask({
            id: task.id,
            roomId: task.roomId,
            userId: task.userId,
            status: task.status,
            priority: task.priority,
        });
        setIsEditMode(true);
        setIsNewTaskDialogOpen(true);
    };

    const handleDeleteClick = (e: React.MouseEvent, task: Housekeeping) => {
        e.stopPropagation();
        setTaskToDelete({
            id: task.id,
            title: `Room ${task.room?.roomNumber || task.roomId} }`
        });
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!taskToDelete) return;

        setDeleteLoading(true);
        try {
            await deleteHousekeepingTask(taskToDelete.id);
            setHousekeepingTasks(prev => prev.filter(task => task.id !== taskToDelete.id));
            toast.success('Housekeeping task deleted successfully');
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to delete task');
        } finally {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
    };

    const handleActivityLogClick = (taskId: string) => {
        setSelectedTaskId(taskId);
        setActivityLogOpen(true);
    };

    const handleActivityLogClose = () => {
        setActivityLogOpen(false);
        setSelectedTaskId(null);
    };

    // Mock activity log data - replace this with actual API call
    const getMockActivityLog = (_taskId: string): ActivityLogEntry[] => {
        return [
            {
                id: '1',
                date: '2025-06-21',
                time: '3:27 am',
                description: 'Status changed from "Pending" to "Completed"',
                author: 'Rana K.'
            },
            {
                id: '2',
                date: '2025-06-20',
                time: '5:36 am',
                description: 'Task started and status changed to "In Progress"',
                author: 'Ali R.'
            },
            {
                id: '3',
                date: '2025-06-18',
                time: '8:10 am',
                description: 'Housekeeping task created',
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
                description: 'Task assigned to housekeeping staff',
                author: 'Admin'
            },
            {
                id: '6',
                date: '2025-06-17',
                time: '9:45 am',
                description: 'Room inspection completed',
                author: 'Mike T.'
            }
        ];
    };

    const handleNewTaskConfirm = async (data: HousekeepingFormData) => {
        try {
            if (isEditMode && editingTask) {
                // Handle edit mode
                const updateData = {
                    roomId: data.roomId,
                    userId: data.userId,
                    status: data.status,
                    priority: data.priority || 'MEDIUM' as const,
                };
                await updateHousekeepingTask(editingTask.id!, updateData);
                toast.success('Housekeeping task updated successfully');
                fetchHousekeepingTasks();
            } else {
                const requestData = {
                    roomId: data.roomId,
                    userId: data.userId,
                    priority: data.priority || 'MEDIUM' as const,

                };
                await addHousekeepingTask(requestData);
                toast.success('Housekeeping task created successfully');
                setCurrentPage(1);
                fetchHousekeepingTasks();
            }

            setIsNewTaskDialogOpen(false);
            setIsEditMode(false);
            setEditingTask(null);
        } catch (error: any) {
            toast.error(error.userMessage || `Failed to ${isEditMode ? 'update' : 'create'} housekeeping task`);
            throw error;
        }
    };

    const handleNewTaskCancel = () => {
        setIsNewTaskDialogOpen(false);
        setIsEditMode(false);
        setEditingTask(null);
    };

    const handleStatusChange = async (taskId: string, newStatus: Housekeeping['status']) => {
        // Store the current task state for potential rollback
        const currentTask = housekeepingTasks.find(task => task.id === taskId);
        const previousStatus = currentTask?.status;

        if (!currentTask || !previousStatus) {
            toast.error('Task not found');
            return;
        }

        // Optimistic update - update the state immediately
        setHousekeepingTasks(prev =>
            prev.map(task =>
                task.id === taskId
                    ? { ...task, status: newStatus }
                    : task
            )
        );

        try {
            if (newStatus === 'IN_PROGRESS') {
                await startHousekeepingTask(taskId);
                toast.success('Housekeeping task started successfully');
            } else if (newStatus === 'COMPLETED') {
                await completeHousekeepingTask(taskId);
                toast.success('Housekeeping task completed successfully');
            }
        } catch (error: any) {
            // Revert the optimistic update using the stored previous status
            setHousekeepingTasks(prev =>
                prev.map(task =>
                    task.id === taskId
                        ? { ...task, status: previousStatus }
                        : task
                )
            );

            toast.error(error.userMessage || `Failed to update task status`);
        }
    };

    const handleStatusFilterChange = (value: string) => {
        setCurrentPage(1);
        setStatusFilter(value);
    };

    useEffect(() => {
        fetchHousekeepingTasks();
    }, [fetchHousekeepingTasks]);

    if (loading) {
        return <TableSkeleton title='HouseKeeping' />;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold text-gray-900">Housekeeping</h1>
                    <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {pagination?.totalItems || housekeepingTasks.length} Task{(pagination?.totalItems || housekeepingTasks.length) !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Search and Filters */}
                <div className="flex gap-2 justify-end text-end">

                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
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

                    {/* Action Button */}
                    <div className="">
                        <Button onClick={() => {
                            setIsEditMode(false);
                            setEditingTask(null);
                            setIsNewTaskDialogOpen(true);
                        }}>
                            <Plus className="h-4 w-4" />
                            Assign Cleaning Tasks
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white shadow">
                <Table>
                    <TableHeader className="bg-hms-accent/15">
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="text-center font-medium text-gray-900 px-6 py-2 w-1/7">Room</TableHead>
                            <TableHead className="text-center font-medium text-gray-900 px-6 py-2 w-1/7">Room Type</TableHead>
                            <TableHead className="text-center font-medium text-gray-900 px-6 py-2 w-1/7">Floor</TableHead>
                            <TableHead className="text-center font-medium text-gray-900 px-6 py-2 w-1/7">Status</TableHead>
                            <TableHead className="text-center font-medium text-gray-900 px-6 py-2 w-1/7">Priority</TableHead>
                            <TableHead className="text-center font-medium text-gray-900 px-6 py-2 w-1/7">Assigned To</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-10 text-center text-gray-600">
                                    Loading housekeeping tasks...
                                </TableCell>
                            </TableRow>
                        ) : housekeepingTasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-10 text-center text-gray-600">
                                    No housekeeping tasks found
                                </TableCell>
                            </TableRow>
                        ) : (
                            housekeepingTasks.map((task) => (
                                <TableRow key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <TableCell className="px-6 py-4 w-1/7 text-center">
                                        <div className="font-medium text-gray-900">
                                            {task.room?.roomNumber || task.roomId}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 w-1/7 text-center">
                                        <div className="font-medium text-gray-900">
                                            {task.room?.roomType?.name || 'Room'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 w-1/7 text-center">
                                        <div className="font-medium text-gray-900">
                                            {task.room?.floor || '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 w-1/7 text-center">
                                        <Badge className={`  ${getStatusDotColor(task.status)}`}>
                                            {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.slice(1).toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 w-1/7 text-center">
                                        <Badge className={`${getPriorityBadge(task.priority)} border-0`}>
                                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-600 w-1/7 text-center">
                                        {task.user ? `${task.user.firstName} ${task.user.lastName}` : 'Unassigned'}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-center ">
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
                                                    onClick={() => handleActivityLogClick(task.id)}
                                                >
                                                    Activity Log
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={(e) => handleEditClick(e, task)}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {task.status === 'PENDING' && (
                                                    <>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                                                        >
                                                            Start Task
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}
                                                {task.status === 'IN_PROGRESS' && (
                                                    <>
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                                                        >
                                                            Mark Complete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </>
                                                )}
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-red-600"
                                                    onClick={(e) => handleDeleteClick(e, task)}
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

                {/* Pagination */}
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

            {/* New Housekeeping Dialog */}
            <NewHousekeepingDialog
                isOpen={isNewTaskDialogOpen}
                onConfirm={handleNewTaskConfirm}
                onCancel={handleNewTaskCancel}
                isEditMode={isEditMode}
                editData={editingTask}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                isOpen={deleteDialogOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                title="Delete Housekeeping Task"
                description={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
            />

            {/* Activity Log Dialog */}
            <ActivityLogDialog
                isOpen={activityLogOpen}
                onClose={handleActivityLogClose}
                title="Housekeeping activity log"
                activities={selectedTaskId ? getMockActivityLog(selectedTaskId) : []}
            />
        </div>
    );
};

export default HousekeepingPage;
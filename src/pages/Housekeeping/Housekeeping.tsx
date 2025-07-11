import { useEffect, useState } from 'react';
import { Search, Plus, EllipsisVertical, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Badge } from '@/components/atoms/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';
import Pagination from '@/components/atoms/Pagination';
import { toast } from 'sonner';
import NewHousekeepingDialog from '../../components/dialogs/NewHousekeepingDialog';
import DeleteDialog from '@/components/molecules/DeleteDialog';
import HousekeepingSkeleton from '@/components/Templates/HousekeepingSkeleton';
import { addHousekeepingTask, deleteHousekeepingTask, getHousekeepingTasks, startHousekeepingTask, completeHousekeepingTask, updateHousekeepingTask } from '@/services/Housekeeping';
import { type Housekeeping } from '@/validation';

interface HousekeepingFormData {
    id?: string;
    roomId: string;
    userId: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

const HousekeepingPage = () => {
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
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
    const [pagination, setPagination] = useState<{
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        hasNext: boolean;
        hasPrevious: boolean;
    } | null>(null);    // Filter and search logic
    // With server-side pagination, we'll use the data directly from the API
    // Client-side filtering will be handled by the backend
    const filteredTasks = housekeepingTasks;



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
            PENDING: 'bg-chart-1',
            IN_PROGRESS: 'bg-chart-2',
            COMPLETED: 'bg-chart-3',
            CANCELED: 'bg-chart-4'
        };
        return dotColors[status];
    };

    const fetchHousekeepingTasks = async () => {
        setLoading(true);
        try {
            const response = await getHousekeepingTasks({
                page: currentPage,
                limit: pageSize
            });
            setHousekeepingTasks(response.data || []);

            // Set pagination if available in response
            if (response.pagination) {
                setPagination(response.pagination);
            } else {
                setPagination(null);
            }
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to fetch housekeeping tasks');
        } finally {
            setLoading(false);
        }
    };

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
            description: task.description || undefined,
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

    const handleNewTaskConfirm = async (data: HousekeepingFormData) => {
        try {
            if (isEditMode && editingTask) {
                // Handle edit mode
                const updateData = {
                    roomId: data.roomId,
                    userId: data.userId,
                    status: data.status,
                    description: data.description,
                    priority: data.priority || 'MEDIUM' as const,
                };
                await updateHousekeepingTask(editingTask.id!, updateData);
                toast.success('Housekeeping task updated successfully');
                fetchHousekeepingTasks();
            } else {
                const requestData = {
                    roomId: data.roomId,
                    userId: data.userId,
                    description: data.description,
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

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, statusFilter, priorityFilter]);

    // Fetch data whenever page, pageSize, or filter changes
    useEffect(() => {
        fetchHousekeepingTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize]);

    if (loading) {
        return <HousekeepingSkeleton />;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-hms-primary" />
                    <h1 className="text-2xl font-semibold text-gray-900">Housekeeping</h1>
                    <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {pagination?.totalItems || filteredTasks.length} Task{(pagination?.totalItems || filteredTasks.length) !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3 min-w-80">
                        <Input
                            type="text"
                            placeholder="Search by room, task type, assigned staff, or description..."
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
                            <SelectItem value="CANCELED">Canceled</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Priority Filter */}
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Priority</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Action Button */}
                    <div className="flex gap-2 ml-auto">
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
            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Room</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Room Type</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Floor</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Status</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Priority</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">description</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Assigned To</TableHead>
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
                        ) : filteredTasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-10 text-center text-gray-600">
                                    No housekeeping tasks found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTasks.map((task) => (
                                <TableRow key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <TableCell className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {task.room?.roomNumber || task.roomId}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {task.room?.roomType?.name || 'Room'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {task.room?.floor || '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${getStatusDotColor(task.status)}`}></div>
                                            {task.status.replace('_', ' ').toLowerCase()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <Badge className={`${getPriorityBadge(task.priority)} border-0`}>
                                            {task.priority.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="truncate max-w-xs text-gray-600" title={task.description || ''}>
                                            {task.description || '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-600">
                                        {task.user ? `${task.user.firstName} ${task.user.lastName}` : 'Unassigned'}
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
                                                    onClick={() => {/* To be implemented */ }}
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
        </div>
    );
};

export default HousekeepingPage;
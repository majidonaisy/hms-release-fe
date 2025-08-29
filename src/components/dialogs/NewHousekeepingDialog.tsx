import { useState, useEffect } from 'react';
import { User, CheckCircle2, Search } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Input } from '@/components/atoms/Input';
import { toast } from 'sonner';
import { getRooms } from '@/services/Rooms';
import { useDebounce } from '@/hooks/useDebounce';
import { HousekeepingUsers } from '@/validation';
import { getHousekeepingUsers } from '@/services/Hotel';

interface NewHousekeepingDialogProps {
    isOpen: boolean;
    onConfirm: (data: HousekeepingFormData) => Promise<void>;
    onCancel: () => void;
    editData?: Partial<HousekeepingFormData> | null;
    isEditMode?: boolean;
}

interface HousekeepingFormData {
    id?: string;
    roomId: string;
    userId: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
    description?: string;
    estimatedDuration?: number;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface Room {
    id: string;
    roomNumber: string;
    status: string;
    floor: number;
}

const NewHousekeepingDialog = ({
    isOpen,
    onConfirm,
    onCancel,
    editData,
    isEditMode = false
}: NewHousekeepingDialogProps) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomSearch, setRoomSearch] = useState('');
    const debouncedRoomSearch = useDebounce(roomSearch, 400);
    const [roomSearchLoading, setRoomSearchLoading] = useState(false);

    const [employees, setEmployees] = useState<HousekeepingUsers>();
    const [loadingData, setLoadingData] = useState(false);

    const [formData, setFormData] = useState<HousekeepingFormData>({
        roomId: '',
        userId: '',
        status: 'PENDING',
        description: '',
        estimatedDuration: undefined,
        priority: 'MEDIUM',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadEmployees();
            if (editData) {
                setFormData({
                    id: editData.id,
                    roomId: editData.roomId || '',
                    userId: editData.userId || '',
                    status: editData.status || 'PENDING',
                    description: editData.description || '',
                    estimatedDuration: editData.estimatedDuration,
                    priority: editData.priority || 'MEDIUM',
                });
            } else {
                setFormData({
                    roomId: '',
                    userId: '',
                    status: 'PENDING',
                    description: '',
                    estimatedDuration: undefined,
                    priority: 'MEDIUM',
                });
            }
        }
    }, [isOpen, editData]);

    const loadEmployees = async () => {
        setLoadingData(true);
        try {
            const employeesResponse = await getHousekeepingUsers();
            setEmployees(employeesResponse || null);
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to load employees');
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        const fetchRooms = async () => {
            setRoomSearchLoading(true);
            try {
                const params: any = {};
                if (debouncedRoomSearch.trim()) {
                    params.q = debouncedRoomSearch.trim();
                }
                const response = await getRooms(params);
                setRooms(response.data || []);
            } catch (error: any) {
                toast.error(error.userMessage || 'Failed to load rooms');
            } finally {
                setRoomSearchLoading(false);
            }
        };
        fetchRooms();
    }, [debouncedRoomSearch]);

    const clearRoomSearch = () => setRoomSearch('');

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.roomId) newErrors.roomId = 'Room is required';
        if (!formData.userId) newErrors.userId = 'Assigned user is required';
        if (formData.estimatedDuration && formData.estimatedDuration < 1)
            newErrors.estimatedDuration = 'Estimated duration must be at least 1 minute';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await onConfirm(formData);
        } catch (error: any) {
            toast.error(error.userMessage || `Failed to ${isEditMode ? 'update' : 'create'} housekeeping task`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            roomId: '',
            userId: '',
            status: 'PENDING',
            description: '',
            estimatedDuration: undefined,
            priority: 'MEDIUM',
        });
        setErrors({});
        setRoomSearch('');
        onCancel();
    };

    const getPriorityBadgeColor = (priority: string) => {
        switch (priority) {
            case 'HIGH':
                return 'bg-red-100 text-red-800';
            case 'MEDIUM':
                return 'bg-orange-100 text-orange-800';
            case 'LOW':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        {isEditMode ? 'Edit Housekeeping Task' : 'New Housekeeping Task'}
                    </DialogTitle>
                </DialogHeader>

                {loadingData ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Room Selection with search */}
                        <div className="space-y-2">
                            <Label htmlFor="roomId" className="flex items-center gap-2">
                                Select Dirty Room *
                            </Label>
                            <Select
                                value={formData.roomId}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, roomId: value }))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a room" />
                                </SelectTrigger>
                                <SelectContent>
                                    <div className="p-2">
                                        <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3">
                                            <Input
                                                type="text"
                                                placeholder="Search rooms..."
                                                value={roomSearch}
                                                onChange={e => setRoomSearch(e.target.value)}
                                                className="w-full h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
                                            />
                                            {roomSearch && (
                                                <button
                                                    onClick={clearRoomSearch}
                                                    className="text-gray-400 hover:text-gray-600 mr-2 text-sm font-medium cursor-pointer"
                                                    aria-label="Clear search"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {roomSearchLoading ? (
                                        <div className="p-2 text-center text-sm text-gray-500">Loading...</div>
                                    ) : rooms.length === 0 ? (
                                        <div className="p-2 text-center text-sm text-gray-500">No rooms found.</div>
                                    ) : (
                                        rooms.map((room) => (
                                            <SelectItem key={room.id} value={room.id}>
                                                Room {room.roomNumber} - Floor {room.floor} ({room.status})
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.roomId && <p className="text-sm text-red-600">{errors.roomId}</p>}
                        </div>

                        {/* User Assignment */}
                        <div className="space-y-2">
                            <Label htmlFor="userId" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Assigned To *
                            </Label>
                            <Select
                                value={formData.userId}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees?.data.data.map((employee) => (
                                        <SelectItem key={employee.id} value={employee.id}>
                                            {employee.firstName} {employee.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.userId && <p className="text-sm text-red-600">{errors.userId}</p>}
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadgeColor('LOW')}`}>
                                                LOW
                                            </span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="MEDIUM">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadgeColor('MEDIUM')}`}>
                                                MEDIUM
                                            </span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="HIGH">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadgeColor('HIGH')}`}>
                                                HIGH
                                            </span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                placeholder="Additional description or special instructions..."
                                value={formData.description || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        {/* Submit buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        {isEditMode ? 'Updating...' : 'Creating...'}
                                    </div>
                                ) : (
                                    isEditMode ? 'Update Task' : 'Create Task'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default NewHousekeepingDialog;

import { useState, useEffect } from 'react';
import { X, User, Home, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { toast } from 'sonner';
import { getRooms } from '@/services/Rooms';
import { getEmployees } from '@/services/Employees';

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

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    role: {
        name: string;
    };
}



const NewHousekeepingDialog = ({
    isOpen,
    onConfirm,
    onCancel,
    editData,
    isEditMode = false
}: NewHousekeepingDialogProps) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    // Form data state
    const [formData, setFormData] = useState<HousekeepingFormData>({
        roomId: '',
        userId: '',
        status: 'PENDING',
        description: '',
        estimatedDuration: undefined,
        priority: 'MEDIUM',
    });

    // Form validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load rooms and employees when dialog opens
    useEffect(() => {
        if (isOpen) {
            loadData();
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

    const loadData = async () => {
        setLoadingData(true);
        try {
            const [roomsResponse, employeesResponse] = await Promise.all([
                getRooms(),
                getEmployees(),
            ]);
            setRooms(roomsResponse.data || []);
            setEmployees(employeesResponse.data || []);
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to load data');
        } finally {
            setLoadingData(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.roomId) {
            newErrors.roomId = 'Room is required';
        }

        if (!formData.userId) {
            newErrors.userId = 'Assigned user is required';
        }

        if (formData.estimatedDuration && formData.estimatedDuration < 1) {
            newErrors.estimatedDuration = 'Estimated duration must be at least 1 minute';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4"
                        onClick={handleClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                {loadingData ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Room Selection */}
                        <div className="space-y-2 ">
                            <Label htmlFor="roomId" className="flex items-center gap-2 ">
                                Select Dirty Room *
                            </Label>
                            <Select
                                value={formData.roomId}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, roomId: value }))}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select a room" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rooms.map((room) => (
                                        <SelectItem key={room.id} value={room.id}>
                                            Room {room.roomNumber} - Floor {room.floor} ({room.status})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.roomId && (
                                <p className="text-sm text-red-600">{errors.roomId}</p>
                            )}
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
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select a staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((employee) => (
                                        <SelectItem key={employee.id} value={employee.id}>
                                            {employee.firstName} {employee.lastName} - {employee.role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.userId && (
                                <p className="text-sm text-red-600">{errors.userId}</p>
                            )}
                        </div>


                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
                            >
                                <SelectTrigger className='w-full'>
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

                        {/* description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                placeholder="Additional description or special instructions..."
                                value={formData.description || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        {/* Submit Button */}
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

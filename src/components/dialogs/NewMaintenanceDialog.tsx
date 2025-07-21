import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Switch } from '@/components/atoms/Switch';
import { X, Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { getAreas, getRooms } from '@/services/Rooms';
import { Room } from '@/validation';
import { Employee } from '@/validation/schemas/Employees';
import { getEmployees } from '@/services/Employees';

interface NewMaintenanceDialogProps {
    isOpen: boolean;
    onConfirm: (data: MaintenanceFormData) => Promise<void>;
    onCancel: () => void;
    editData?: Partial<MaintenanceFormData> | null;
    isEditMode?: boolean;
}

interface MaintenanceFormData {
    id?: string;
    areaTypeId: string; // Changed from areaType to areaTypeId
    areaId?: string; // This will store the actual area ID (made optional)
    roomId?: string; // Add roomId as optional
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    userId?: string;
    photos: File[];
    frequency: string;
    type?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
    isExternal?: boolean;
}

const areaTypes = [
    { value: 'ROOM', label: 'Room', id: 'room-type-001' },
    { value: 'AREA', label: 'Area', id: 'area-type-001' }
];



const NewMaintenanceDialog: React.FC<NewMaintenanceDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    editData = null,
    isEditMode = false
}) => {
    const [loading, setLoading] = useState(false);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [areasLoading, setAreasLoading] = useState(false);
    const [formData, setFormData] = useState<MaintenanceFormData>({
        areaTypeId: '',
        areaId: '',
        roomId: '',
        description: '',
        priority: 'MEDIUM',
        userId: '',
        photos: [],
        frequency: '',
        isExternal: false,
    });

    const [rooms, setRooms] = useState<Room[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [areas, setAreas] = useState<{ id: string; name: string; hotelId: string }[]>([]);

    const fetchEmployees = async () => {
        try {
            const response = await getEmployees();
            setEmployees(response.data);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            toast.error('Failed to fetch employees. Please try again later.');
        }
    };

    const fetchAreas = async () => {
        setAreasLoading(true);
        try {
            const response = await getAreas();
            setAreas(response.data);
        } catch (error) {
            console.error('Failed to fetch areas:', error);
            toast.error('Failed to fetch areas. Please try again later.');
        } finally {
            setAreasLoading(false);
        }
    };

    // Load edit data when editing
    useEffect(() => {
        if (isEditMode && editData) {
            setFormData({
                id: editData.id || '',
                areaTypeId: editData.areaTypeId || '',
                areaId: editData.areaId || '',
                roomId: editData.roomId || '',
                description: editData.description || '',
                priority: editData.priority || 'MEDIUM',
                userId: editData.userId || '',
                photos: editData.photos || [],
                frequency: editData.frequency || '',
                isExternal: editData.isExternal || false,
            });
        } else {
            // Reset form for new maintenance
            setFormData({
                areaTypeId: '',
                areaId: '',
                roomId: '',
                description: '',
                priority: 'MEDIUM',
                userId: '',
                photos: [],
                isExternal: false,
                frequency: ''
            });
        }
    }, [isEditMode, editData, isOpen]);

    const handleInputChange = (field: keyof MaintenanceFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            // Reset areaId and roomId when areaTypeId changes
            ...(field === 'areaTypeId' && { areaId: '', roomId: '' })
        }));

        // Fetch appropriate data when area type changes
        if (field === 'areaTypeId') {
            if (value === 'ROOM') {
                fetchRooms();
            } else if (value === 'AREA') {
                fetchAreas();
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter(file =>
            file.type === 'image/jpeg' || file.type === 'image/png'
        );

        if (validFiles.length !== files.length) {
            toast.error('Only JPG and PNG files are allowed');
        }

        setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, ...validFiles]
        }));
    };

    const removePhoto = (index: number) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('formData', formData)

        if (!formData.areaTypeId) {
            toast.error('Please select an area type');
            return;
        }

        if (!formData.areaId && !formData.roomId) {
            toast.error('Please select a room or area');
            return;
        }

        if (!formData.description) {
            toast.error('Please enter issue description');
            return;
        }



        setLoading(true);
        try {
            // Prepare data based on area type selection
            const submitData = {
                ...formData,
                // If room is selected, send as roomId; if area is selected, send as areaId
                ...(formData.areaTypeId === 'ROOM' ? {
                    roomId: formData.areaId,
                    areaId: undefined
                } : {
                    areaId: formData.areaId,
                    roomId: undefined
                })
            };

            await onConfirm(submitData);
            if (!isEditMode) {
                setFormData({
                    areaTypeId: '',
                    areaId: '',
                    roomId: '',
                    description: '',
                    priority: 'MEDIUM',
                    userId: '',
                    photos: [],
                    isExternal: false,
                    frequency: ''
                });
            }
        } catch (error) {
            toast.error('Failed to submit maintenance request. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (!isEditMode) {
            setFormData({
                areaTypeId: '',
                areaId: '',
                roomId: '',
                description: '',
                priority: 'MEDIUM',
                userId: '',
                photos: [],
                isExternal: false,
                frequency: ''
            });
        }
        onCancel();
    };

    const fetchRooms = async () => {
        setRoomsLoading(true);
        try {
            const response = await getRooms();
            setRooms(response.data);
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
            toast.error('Failed to fetch rooms. Please try again later.');
        } finally {
            setRoomsLoading(false);
        }
    }


    useEffect(() => {
        Promise.all([
            fetchEmployees()
        ]);
    }, []);
    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between pb-4">
                    <DialogTitle className="text-xl font-semibold">
                        {isEditMode ? 'Edit Maintenance' : 'New Maintenance'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="areaType">Area Type</Label>
                        <Select value={formData.areaTypeId} onValueChange={(value) => handleInputChange('areaTypeId', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select area type" />
                            </SelectTrigger>
                            <SelectContent>
                                {areaTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="areaNameOrNumber">
                            {formData.areaTypeId === 'ROOM' ? 'Room' : formData.areaTypeId === 'AREA' ? 'Area' : 'Area name or number'}
                        </Label>
                        <Select
                            value={formData.areaId}
                            onValueChange={(value) => handleInputChange('areaId', value)}
                            disabled={!formData.areaTypeId || roomsLoading || areasLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={
                                    !formData.areaTypeId
                                        ? "Please select area type first"
                                        : roomsLoading || areasLoading
                                            ? "Loading..."
                                            : formData.areaTypeId === 'ROOM'
                                                ? "Select a room"
                                                : "Select an area"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {formData.areaTypeId === 'ROOM' && !roomsLoading && rooms.map((room) => (
                                    <SelectItem key={room.id} value={room.id}>
                                        Room {room.roomNumber} - Floor {room.floor}
                                    </SelectItem>
                                ))}
                                {formData.areaTypeId === 'AREA' && !areasLoading && areas.map((area) => (
                                    <SelectItem key={area.id} value={area.id}>
                                        {area.name}
                                    </SelectItem>
                                ))}
                                {(roomsLoading || areasLoading) && (
                                    <SelectItem value="loading" disabled>
                                        Loading...
                                    </SelectItem>
                                )}
                                {formData.areaTypeId && !roomsLoading && !areasLoading && (formData.areaTypeId === 'ROOM' ? rooms : areas).length === 0 && (
                                    <SelectItem value="no-data" disabled>
                                        No {formData.areaTypeId === 'ROOM' ? 'rooms' : 'areas'} available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Issue description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe the maintenance issue..."
                            className="min-h-20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Low, Medium or High" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="CRITICAL">Critical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* External Maintenance */}
                    <div className="flex items-center justify-between">
                        <Label htmlFor="isExternal" className="text-sm font-medium">
                            Assign To
                        </Label>
                        <Switch
                            id="isExternal"
                            className='data-[state=checked]:bg-hms-primary'
                            checked={formData.isExternal}
                            onCheckedChange={(checked) => handleInputChange('isExternal', checked)}
                        />
                    </div>
                    {formData.isExternal && (
                        <Select value={formData.userId} onValueChange={(value) => handleInputChange('userId', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select maintenance staff" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((staff) => (
                                    <SelectItem key={staff.id} value={staff.id}>
                                        {staff.firstName} {staff.lastName} - {staff.role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>)}

                    {/* Upload Photos */}
                    <div className="space-y-2">
                        <Label>Upload Photos</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <div className="space-y-2">
                                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                                <p className="text-sm text-gray-500">
                                    Drag & drop or click to upload<br />
                                    (JPG or PNG)
                                </p>
                                <div className="flex items-center justify-center">
                                    <Button
                                        type="button"
                                        size="sm"
                                        className=" rounded-full h-10 w-10 p-0"
                                        onClick={() => document.getElementById('photo-upload')?.click()}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <input
                                    id="photo-upload"
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Show uploaded photos */}
                        {formData.photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {formData.photos.map((photo, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt={`Upload ${index + 1}`}
                                            className="w-full h-16 object-cover rounded border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute -top-1 -right-1 rounded-full p-1 text-xs"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>



                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full "
                    >
                        {loading ?
                            (isEditMode ? 'Updating...' : 'Creating...') :
                            (isEditMode ? 'Update Maintenance' : 'Create Maintenance')
                        }
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewMaintenanceDialog;

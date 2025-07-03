import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Switch } from '@/components/atoms/Switch';
import { X, Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface NewMaintenanceDialogProps {
    isOpen: boolean;
    onConfirm: (data: MaintenanceFormData) => Promise<void>;
    onCancel: () => void;
}

interface MaintenanceFormData {
    areaType: string;
    areaNameOrNumber: string;
    issueDescription: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    assignedTo: string;
    photos: File[];
    repeatMaintenance: boolean;
    frequency: string;
}

const areaTypes = [
    { value: 'ROOM', label: 'Room' },
    { value: 'LOBBY', label: 'Lobby' },
    { value: 'RESTAURANT', label: 'Restaurant' },
    { value: 'GYM', label: 'Gym' },
    { value: 'POOL', label: 'Pool' },
    { value: 'PARKING', label: 'Parking' },
    { value: 'ELEVATOR', label: 'Elevator' },
    { value: 'STAIRWAY', label: 'Stairway' },
    { value: 'CORRIDOR', label: 'Corridor' },
    { value: 'OTHER', label: 'Other' }
];

const maintenanceStaff = [
    { value: 'john_doe', label: 'John Doe - Technician' },
    { value: 'mike_smith', label: 'Mike Smith - Electrician' },
    { value: 'sarah_jones', label: 'Sarah Jones - Plumber' },
    { value: 'tom_wilson', label: 'Tom Wilson - General Maintenance' },
    { value: 'lisa_brown', label: 'Lisa Brown - Cleaner' }
];

const frequencies = [
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'QUARTERLY', label: '3 Months' },
    { value: 'SEMI_ANNUAL', label: '6 Months' },
    { value: 'ANNUAL', label: 'Year' }
];

const NewMaintenanceDialog: React.FC<NewMaintenanceDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel
}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<MaintenanceFormData>({
        areaType: '',
        areaNameOrNumber: '',
        issueDescription: '',
        priority: 'MEDIUM',
        assignedTo: '',
        photos: [],
        repeatMaintenance: false,
        frequency: ''
    });

    const handleInputChange = (field: keyof MaintenanceFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
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
        
        if (!formData.areaType) {
            toast.error('Please select an area type');
            return;
        }
        
        if (!formData.areaNameOrNumber) {
            toast.error('Please enter area name or number');
            return;
        }
        
        if (!formData.issueDescription) {
            toast.error('Please enter issue description');
            return;
        }
        
        if (!formData.assignedTo) {
            toast.error('Please assign to a staff member');
            return;
        }

        if (formData.repeatMaintenance && !formData.frequency) {
            toast.error('Please select frequency for repeat maintenance');
            return;
        }

        setLoading(true);
        try {
            await onConfirm(formData);
            // Reset form after successful submission
            setFormData({
                areaType: '',
                areaNameOrNumber: '',
                issueDescription: '',
                priority: 'MEDIUM',
                assignedTo: '',
                photos: [],
                repeatMaintenance: false,
                frequency: ''
            });
        } catch (error) {
            // Error handling is done in parent component
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            areaType: '',
            areaNameOrNumber: '',
            issueDescription: '',
            priority: 'MEDIUM',
            assignedTo: '',
            photos: [],
            repeatMaintenance: false,
            frequency: ''
        });
        onCancel();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between pb-4">
                    <DialogTitle className="text-xl font-semibold">New Maintenance</DialogTitle>
                    
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Area Type */}
                    <div className="space-y-2">
                        <Label htmlFor="areaType">Area Type</Label>
                        <Select value={formData.areaType} onValueChange={(value) => handleInputChange('areaType', value)}>
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

                    {/* Area name or number */}
                    <div className="space-y-2">
                        <Label htmlFor="areaNameOrNumber">Area name or number</Label>
                        <Select value={formData.areaNameOrNumber} onValueChange={(value) => handleInputChange('areaNameOrNumber', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select area name or number" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Mock area options - in real app, this would be dynamic based on areaType */}
                                <SelectItem value="101">Room 101</SelectItem>
                                <SelectItem value="102">Room 102</SelectItem>
                                <SelectItem value="201">Room 201</SelectItem>
                                <SelectItem value="lobby_main">Main Lobby</SelectItem>
                                <SelectItem value="elevator_1">Elevator 1</SelectItem>
                                <SelectItem value="pool_area">Pool Area</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Issue description */}
                    <div className="space-y-2">
                        <Label htmlFor="issueDescription">Issue description</Label>
                        <Textarea
                            id="issueDescription"
                            value={formData.issueDescription}
                            onChange={(e) => handleInputChange('issueDescription', e.target.value)}
                            placeholder="Describe the maintenance issue..."
                            className="min-h-20"
                        />
                    </div>

                    {/* Priority */}
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
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Assign to */}
                    <div className="space-y-2">
                        <Label htmlFor="assignedTo">Assign to</Label>
                        <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select maintenance staff" />
                            </SelectTrigger>
                            <SelectContent>
                                {maintenanceStaff.map((staff) => (
                                    <SelectItem key={staff.value} value={staff.value}>
                                        {staff.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

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

                    {/* Repeat this maintenance */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="repeatMaintenance">Repeat this maintenance</Label>
                            <Switch
                                id="repeatMaintenance"
                                className='data-[state=checked]:bg-hms-primary'
                                checked={formData.repeatMaintenance}
                                onCheckedChange={(checked) => handleInputChange('repeatMaintenance', checked)}
                            />
                        </div>

                        {formData.repeatMaintenance && (
                            <div className="space-y-2">
                                <Label htmlFor="frequency">Frequency</Label>
                                <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select every: Week / Month / 3 Months / 6 Months / Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {frequencies.map((freq) => (
                                            <SelectItem key={freq.value} value={freq.value}>
                                                {freq.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full "
                    >
                        {loading ? 'Creating...' : 'Create Maintenance'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewMaintenanceDialog;

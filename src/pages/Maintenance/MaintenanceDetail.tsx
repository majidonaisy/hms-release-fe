import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { toast } from 'sonner';

interface MaintenanceFormData {
    roomNumber: string;
    type: 'ROUTINE' | 'REPAIR' | 'URGENT' | 'CLEANING';
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    title: string;
    description: string;
    requestedBy: string;
    assignedTo: string;
    scheduledDate: string;
    estimatedDuration: number;
}

const MaintenanceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<MaintenanceFormData>({
        roomNumber: '',
        type: 'REPAIR',
        status: 'PENDING',
        priority: 'MEDIUM',
        title: '',
        description: '',
        requestedBy: '',
        assignedTo: '',
        scheduledDate: '',
        estimatedDuration: 1
    });

    const isEditMode = id && id !== 'new';

    useEffect(() => {
        if (isEditMode) {
            // Mock data for edit mode
            setFormData({
                roomNumber: '101',
                type: 'REPAIR',
                status: 'PENDING',
                priority: 'HIGH',
                title: 'AC Unit Not Working',
                description: 'Air conditioning unit in room 101 is not cooling properly',
                requestedBy: 'John Manager',
                assignedTo: 'Mike Technician',
                scheduledDate: '2025-01-03',
                estimatedDuration: 2
            });
        }
    }, [isEditMode]);

    const handleInputChange = (field: keyof MaintenanceFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success(
                isEditMode
                    ? 'Maintenance request updated successfully'
                    : 'Maintenance request created successfully'
            );
            navigate('/maintenance');
        } catch (error) {
            toast.error('Failed to save maintenance request');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/maintenance');
    };

    return (
        <div className="p-5 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="p-0 hover:bg-slate-100"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">
                    {isEditMode ? 'Edit Maintenance Request' : 'New Maintenance Request'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                Request Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="roomNumber">Room Number</Label>
                                <Input
                                    id="roomNumber"
                                    value={formData.roomNumber}
                                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                                    placeholder="e.g. 101"
                                    className="border border-slate-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Brief description of the issue"
                                    className="border border-slate-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Detailed description of the maintenance request"
                                    className="border border-slate-300 min-h-24"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                                        <SelectTrigger className="border border-slate-300">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ROUTINE">Routine</SelectItem>
                                            <SelectItem value="REPAIR">Repair</SelectItem>
                                            <SelectItem value="URGENT">Urgent</SelectItem>
                                            <SelectItem value="CLEANING">Cleaning</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                                        <SelectTrigger className="border border-slate-300">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                            <SelectItem value="CRITICAL">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Assignment & Scheduling
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="requestedBy">Requested By</Label>
                                <Input
                                    id="requestedBy"
                                    value={formData.requestedBy}
                                    onChange={(e) => handleInputChange('requestedBy', e.target.value)}
                                    placeholder="Person who requested this maintenance"
                                    className="border border-slate-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assignedTo">Assigned To</Label>
                                <Input
                                    id="assignedTo"
                                    value={formData.assignedTo}
                                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                                    placeholder="Technician or team assigned"
                                    className="border border-slate-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                                <Input
                                    id="scheduledDate"
                                    type="date"
                                    value={formData.scheduledDate}
                                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                                    className="border border-slate-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="estimatedDuration">Estimated Duration (hours)</Label>
                                <Input
                                    id="estimatedDuration"
                                    type="number"
                                    min="1"
                                    value={formData.estimatedDuration}
                                    onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value) || 1)}
                                    className="border border-slate-300"
                                />
                            </div>

                            {isEditMode && (
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                        <SelectTrigger className="border border-slate-300">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            isEditMode ? 'Updating...' : 'Creating...'
                        ) : (
                            isEditMode ? 'Update Request' : 'Create Request'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default MaintenanceDetail;

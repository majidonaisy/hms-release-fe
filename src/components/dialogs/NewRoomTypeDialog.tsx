import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/atoms/Textarea';
import { toast } from 'sonner';
import { Switch } from '@/components/atoms/Switch';
import { AddRoomTypeRequest } from '@/validation';

interface RoomTypeDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm: (data: AddRoomTypeRequest) => Promise<void>;
    editData?: Partial<AddRoomTypeRequest> | null;
}

const RoomTypeDialog = ({ isOpen, onOpenChange, onConfirm, editData }: RoomTypeDialogProps) => {
    const isEditMode = !!editData;
    const [formData, setFormData] = useState<AddRoomTypeRequest>({
        name: '',
        description: '',
        capacity: 1,
        isActive: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form when dialog opens or edit data changes
    useEffect(() => {
        if (isOpen) {
            if (editData) {
                setFormData({
                    name: editData.name || '',
                    description: editData.description || '',
                    capacity: editData.capacity || 1,
                    isActive: editData.isActive !== undefined ? editData.isActive : true,
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    capacity: 1,
                    isActive: true,
                });
            }
            setErrors({});
        }
    }, [isOpen, editData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (formData.capacity < 1) {
            newErrors.capacity = 'Capacity must be at least 1';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onConfirm(formData);
            onOpenChange(false);
        } catch (error: any) {
            const errorMessage = error.userMessage || 'An error occurred';
            setErrors({ form: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Room Type' : 'Add Room Type'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Update the details for this room type.'
                            : 'Add a new room type to your hotel.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Standard Double"
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe this room type"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                            id="capacity"
                            type="number"
                            min={1}
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                            className={errors.capacity ? "border-red-500" : ""}
                        />
                        {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="isActive">Active</Label>
                        <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                    </div>

                    {errors.form && (
                        <div className="bg-red-50 p-3 rounded-md text-red-600 flex items-center text-sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.form}
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        <Button
                            variant="background"
                            type="button"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="min-w-[100px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isEditMode ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    {isEditMode ? 'Update' : 'Add Room Type'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RoomTypeDialog;
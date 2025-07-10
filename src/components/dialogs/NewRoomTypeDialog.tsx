import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { AddRoomTypeRequest, AddRoomTypeRequestSchema } from '@/validation';
import { toast } from 'sonner';

interface NewRoomTypeDialogProps {
    isOpen: boolean;
    onConfirm: (data: AddRoomTypeRequest) => Promise<void>;
    onCancel: () => void;
}

const NewRoomTypeDialog: React.FC<NewRoomTypeDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel
}) => {
    const [formData, setFormData] = useState<AddRoomTypeRequest>({
        name: '',
        description: '',
        baseRate: 0,
        maxOccupancy: 1,
        childOccupancy: 0,
        adultOccupancy: 0,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: keyof AddRoomTypeRequest, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const validatedData = AddRoomTypeRequestSchema.parse(formData);
            setIsLoading(true);

            await onConfirm(validatedData);

            // Reset form and close dialog
            setFormData({
                name: '',
                description: '',
                baseRate: 0,
                maxOccupancy: 1,
                childOccupancy: 0,
                adultOccupancy: 0,
            });
            setErrors({});

            // Close the dialog
            onCancel();
        } catch (error: any) {
            if (error.errors) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err: any) => {
                    if (err.path && err.path.length > 0) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(fieldErrors);
                toast.error('Please fix the validation errors');
            } else {
                toast.error('Failed to create room type');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (isLoading) return;

        setFormData({
            name: '',
            description: '',
            baseRate: 0,
            maxOccupancy: 1,
            childOccupancy: 0,
            adultOccupancy: 0,
        });
        setErrors({});
        onCancel();
    };


    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl font-semibold">New Room Type</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Room Name */}
                    <div className="space-y-2">
                        <Label htmlFor="roomName">Room Name</Label>
                        <Input
                            id="roomName"
                            placeholder="e.g. Single Room"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={errors.name ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    {/* Capacity */}
                    <div className="space-y-2">
                        <Label htmlFor="capacity">Max Occupancy (Total Guests)</Label>
                        <Input
                            id="capacity"
                            type="number"
                            min="1"
                            placeholder="e.g. 2"
                            value={formData.maxOccupancy || ''}
                            onChange={(e) => handleInputChange('maxOccupancy', parseInt(e.target.value) || 0)}
                            className={errors.maxOccupancy ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {errors.maxOccupancy && <p className="text-red-500 text-sm">{errors.maxOccupancy}</p>}
                    </div>

                    {/* Adult Occupancy */}
                    <div className="space-y-2">
                        <Label htmlFor="adultOccupancy">Adult Occupancy</Label>
                        <Input
                            id="adultOccupancy"
                            type="number"
                            min="0"
                            placeholder="e.g. 2"
                            value={formData.adultOccupancy || ''}
                            onChange={(e) => handleInputChange('adultOccupancy', parseInt(e.target.value) || 0)}
                            className={errors.adultOccupancy ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {errors.adultOccupancy && <p className="text-red-500 text-sm">{errors.adultOccupancy}</p>}
                    </div>

                    {/* Child Occupancy */}
                    <div className="space-y-2">
                        <Label htmlFor="childOccupancy">Child Occupancy</Label>
                        <Input
                            id="childOccupancy"
                            type="number"
                            min="0"
                            placeholder="e.g. 1"
                            value={formData.childOccupancy || ''}
                            onChange={(e) => handleInputChange('childOccupancy', parseInt(e.target.value) || 0)}
                            className={errors.childOccupancy ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {errors.childOccupancy && <p className="text-red-500 text-sm">{errors.childOccupancy}</p>}
                    </div>

                    {/* Price Per Night */}
                    <div className="space-y-2">
                        <Label htmlFor="baseRate">Price Per Night</Label>
                        <Input
                            id="baseRate"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="e.g. 150"
                            value={formData.baseRate || ''}
                            onChange={(e) => handleInputChange('baseRate', parseFloat(e.target.value) || 0)}
                            className={errors.baseRate ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {errors.baseRate && <p className="text-red-500 text-sm">{errors.baseRate}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the room and any key features guests should know about."
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={4}
                            className={`resize-none ${errors.description ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full text-white mt-6"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Room Type'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewRoomTypeDialog;
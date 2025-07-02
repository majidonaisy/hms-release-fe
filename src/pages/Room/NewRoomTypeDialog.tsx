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
  onConfirm: (data: AddRoomTypeRequest) => void;
  onCancel: () => void;
}

const NewRoomTypeDialog: React.FC<NewRoomTypeDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  const [formData, setFormData] = useState<AddRoomTypeRequest>({
    name: '',
    baseRate: 0,
    description: '',
    capacity: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof AddRoomTypeRequest, value: string | number) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = AddRoomTypeRequestSchema.parse(formData);
      onConfirm(validatedData);

      // Reset form after submission
      setFormData({
        name: '',
        baseRate: 0,
        description: '',
        capacity: 0
      });
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
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      baseRate: 0,
      description: '',
      capacity: 0
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
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (Number of Guests)</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              placeholder="e.g. 2"
              value={formData.capacity || ''}
              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
              className={errors.capacity ? 'border-red-500' : ''}
            />
            {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity}</p>}
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
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full text-white mt-6"
          >
            Create Room Type
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRoomTypeDialog;
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { AddRoomTypeRequest } from '@/validation';

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
    baseRate: 100,
    description: '',
    capacity: 1
  });

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



    onConfirm(formData);

    // Reset form after submission
    setFormData({
      name: '',
      baseRate: 0,
      description: '',
      capacity: 1
    });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      baseRate: 0,
      description: '',
      capacity: 1
    });
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
              required
            />
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (Number of Guests)</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              placeholder="e.g. 2"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 1)}
              required
            />
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
              value={formData.baseRate}
              onChange={(e) => handleInputChange('baseRate', parseFloat(e.target.value) || 0)}
              required
            />
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
              className="resize-none"
            />
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
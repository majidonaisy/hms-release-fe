import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { X } from 'lucide-react';

export interface RoomTypeFormData {
  name: string;
  pricePerNight: string;
  description: string;
}

interface NewRoomTypeDialogProps {
  isOpen: boolean;
  onConfirm: (data: RoomTypeFormData) => void;
  onCancel: () => void;
}

const NewRoomTypeDialog: React.FC<NewRoomTypeDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  const [formData, setFormData] = useState<RoomTypeFormData>({
    name: '',
    pricePerNight: '',
    description: ''
  });

  const handleInputChange = (field: keyof RoomTypeFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
    // Reset form after submission
    setFormData({
      name: '',
      pricePerNight: '',
      description: ''
    });
  };

  const handleCancel = () => {
    // Reset form when canceling
    setFormData({
      name: '',
      pricePerNight: '',
      description: ''
    });
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
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

          {/* Price Per Night */}
          <div className="space-y-2">
            <Label htmlFor="pricePerNight">Price Per Night</Label>
            <Input
              id="pricePerNight"
              type="number"
              placeholder="e.g. 150"
              value={formData.pricePerNight}
              onChange={(e) => handleInputChange('pricePerNight', e.target.value)}
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
            Create Room
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRoomTypeDialog;
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { addRoomType, updateRoomType } from '@/services/RoomTypes';
import type { AddRoomTypeRequest, RoomType } from '@/validation';

interface NewRoomTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: RoomType | null;
}

export default function NewRoomTypeDialog({ open, onClose, onSuccess, editData }: NewRoomTypeDialogProps) {
  const [formData, setFormData] = useState<AddRoomTypeRequest>({
    name: '',
    description: '',
    baseRate: 0,
    maxOccupancy: 1,
    childOccupancy: 0,
    adultOccupancy: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name ?? '',
        description: editData.description ?? '',
        baseRate: parseFloat(editData.baseRate?.toString() || '0'),
        maxOccupancy: editData.maxOccupancy ?? 1,
        childOccupancy: editData.childOccupancy ?? 0,
        adultOccupancy: editData.adultOccupancy ?? 0,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        baseRate: 0,
        maxOccupancy: 1,
        childOccupancy: 0,
        adultOccupancy: 0,
      });
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' || name === 'description' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editData) {
        await updateRoomType(editData.id, formData);
        toast.success('Room type updated successfully');
      } else {
        await addRoomType(formData);
        toast.success('Room type added successfully');
      }
      onSuccess();
      onClose();
      if (!editData) {
        setFormData({
          name: '',
          description: '',
          baseRate: 0,
          maxOccupancy: 1,
          childOccupancy: 0,
          adultOccupancy: 0,
        });
      }
    } catch (error: any) {
      toast.error(error?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    if (!editData) {
      setFormData({
        name: '',
        description: '',
        baseRate: 0,
        maxOccupancy: 1,
        childOccupancy: 0,
        adultOccupancy: 0,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editData ? 'Edit Room Type' : 'New Room Type'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseRate">Base Rate</Label>
            <Input
              id="baseRate"
              name="baseRate"
              type="number"
              min={0}
              value={formData.baseRate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxOccupancy">Max Occupancy</Label>
            <Input
              id="maxOccupancy"
              name="maxOccupancy"
              type="number"
              min={1}
              value={formData.maxOccupancy}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="childOccupancy">Child Occupancy</Label>
            <Input
              id="childOccupancy"
              name="childOccupancy"
              type="number"
              min={0}
              value={formData.childOccupancy}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adultOccupancy">Adult Occupancy</Label>
            <Input
              id="adultOccupancy"
              name="adultOccupancy"
              type="number"
              min={0}
              value={formData.adultOccupancy}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full text-white mt-6" disabled={isLoading}>
            {isLoading
              ? editData
                ? 'Updating...'
                : 'Creating...'
              : editData
                ? 'Update Room Type'
                : 'Create Room Type'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

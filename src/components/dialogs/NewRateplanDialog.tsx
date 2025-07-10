import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Switch } from '@/components/atoms/Switch';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { addRatePlan } from '@/services/RatePlans';
import { getRoomTypes } from '@/services/RoomTypes';

interface RatePlanDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onRatePlanAdded?: () => void;
  editData?: any;
}

const NewRatePlanDialog = ({ isOpen, onOpenChange, onRatePlanAdded, editData }: RatePlanDialogProps) => {
  const isEditMode = !!editData;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 0,
    isActive: true,
    roomTypeId: '',
    isFeatured: false
  });
  
  const [roomTypes, setRoomTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fetchRoomTypes = async () => {
    try {
      const response = await getRoomTypes();
      setRoomTypes(response.data || []);
    } catch (error) {
      console.error('Failed to fetch room types:', error);
      toast.error('Failed to load room types');
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchRoomTypes();
      
      if (editData) {
        setFormData({
          name: editData.name || '',
          description: editData.description || '',
          basePrice: editData.basePrice || 0,
          isActive: editData.isActive !== undefined ? editData.isActive : true,
          roomTypeId: editData.roomTypeId || '',
          isFeatured: editData.isFeatured || false
        });
      } else {
        setFormData({
          name: '',
          description: '',
          basePrice: 0,
          isActive: true,
          roomTypeId: '',
          isFeatured: false
        });
      }
      
      setErrors({});
    }
  }, [isOpen, editData]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.basePrice <= 0) {
      newErrors.basePrice = 'Base price must be greater than 0';
    }
    
    if (!formData.roomTypeId) {
      newErrors.roomTypeId = 'Please select a room type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addRatePlan(formData);
      toast.success('Rate plan added successfully');
      
      if (onRatePlanAdded) {
        onRatePlanAdded();
      }
      
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
          <DialogTitle>{isEditMode ? 'Edit Rate Plan' : 'Add Rate Plan'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the details for this rate plan.' 
              : 'Create a new rate plan for your hotel rooms.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Weekend Special"
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
              placeholder="Describe this rate plan"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price</Label>
            <Input
              id="basePrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
              className={errors.basePrice ? "border-red-500" : ""}
            />
            {errors.basePrice && <p className="text-red-500 text-sm">{errors.basePrice}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roomTypeId">Room Type</Label>
            <Select
              value={formData.roomTypeId}
              onValueChange={(value) => setFormData({ ...formData, roomTypeId: value })}
            >
              <SelectTrigger className={errors.roomTypeId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((roomType) => (
                  <SelectItem key={roomType.id} value={roomType.id}>
                    {roomType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roomTypeId && <p className="text-red-500 text-sm">{errors.roomTypeId}</p>}
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="isFeatured">Featured</Label>
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
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
                  {isEditMode ? 'Update' : 'Add'} Rate Plan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRatePlanDialog;
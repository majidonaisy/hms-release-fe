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
import { AddRatePlanSchema, AddRatePlanApiSchema } from '@/validation/schemas/RatePlan';

interface RoomType {
  id: string;
  name: string;
  description?: string;
  maxOccupancy: number;
  adultOccupancy: number;
  childOccupancy: number;
  baseRate: string;
  hotelId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RatePlanDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onRatePlanAdded?: () => Promise<void>;
  editData?: any;
}

const NewRatePlanDialog = ({ isOpen, onOpenChange, onRatePlanAdded, editData }: RatePlanDialogProps) => {
  const isEditMode = !!editData;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    basePrice: 0,
    baseAdjType: 'PERCENT' as 'PERCENT' | 'FIXED',
    baseAdjVal: 0,
    currencyId: 'cmcx9kq150041k6zcean3uses',
    isActive: true,
    roomTypeId: '',
    isFeatured: false
  });

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
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
          code: editData.code || '',
          description: editData.description || '',
          basePrice: editData.basePrice || 0,
          baseAdjType: editData.baseAdjType || 'PERCENT',
          baseAdjVal: editData.baseAdjVal || 0,
          currencyId: editData.currencyId || 'cmcx9kq150041k6zcean3uses',
          isActive: editData.isActive !== undefined ? editData.isActive : true,
          roomTypeId: editData.roomTypeId || '',
          isFeatured: editData.isFeatured || false
        });
      } else {
        setFormData({
          name: '',
          code: '',
          description: '',
          basePrice: 0,
          baseAdjType: 'PERCENT',
          baseAdjVal: 0,
          currencyId: 'cmcx9kq150041k6zcean3uses',
          isActive: true,
          roomTypeId: '',
          isFeatured: false
        });
      }

      setErrors({});
    }
  }, [isOpen, editData]);

  const validate = () => {
    try {
      // Ensure numeric values are properly typed
      const validationData = {
        ...formData,
        basePrice: Number(formData.basePrice),
        baseAdjVal: Number(formData.baseAdjVal),
      };

      AddRatePlanSchema.parse(validationData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          const field = err.path[0];
          newErrors[field] = err.message;
        });
      }

      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data for API - ensure numeric values are properly typed
      const formDataForApi = {
        ...formData,
        basePrice: Number(formData.basePrice),
        baseAdjVal: Number(formData.baseAdjVal),
      };

      // Transform and validate for API submission (converts baseAdjVal to string)
      const apiData = AddRatePlanApiSchema.parse(formDataForApi);

      await addRatePlan(apiData);
      toast.success('Rate plan added successfully');

      if (onRatePlanAdded) {
        await onRatePlanAdded();
      }

      // Reset form
      setFormData({
        name: '',
        code: '',
        description: '',
        basePrice: 0,
        baseAdjType: 'PERCENT',
        baseAdjVal: 0,
        currencyId: 'cmcx9kq150041k6zcean3uses',
        isActive: true,
        roomTypeId: '',
        isFeatured: false
      });

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
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g. WS2024"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
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
              value={formData.basePrice === 0 ? '' : formData.basePrice}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value === '' ? 0 : parseFloat(value);
                setFormData({
                  ...formData,
                  basePrice: isNaN(numValue) ? 0 : numValue
                });
              }}
              placeholder="Enter base price"
              className={errors.basePrice ? "border-red-500" : ""}
            />
            {errors.basePrice && <p className="text-red-500 text-sm">{errors.basePrice}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseAdjType">Adjustment Type</Label>
            <Select
              value={formData.baseAdjType}
              onValueChange={(value: 'PERCENT' | 'FIXED') => setFormData({ ...formData, baseAdjType: value })}
            >
              <SelectTrigger className={errors.baseAdjType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select adjustment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENT">Percentage</SelectItem>
                <SelectItem value="FIXED">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
            {errors.baseAdjType && <p className="text-red-500 text-sm">{errors.baseAdjType}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseAdjVal">Adjustment Value</Label>
            <Input
              id="baseAdjVal"
              type="number"
              min="0"
              step="0.01"
              value={formData.baseAdjVal === 0 ? '' : formData.baseAdjVal}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value === '' ? 0 : parseFloat(value);
                setFormData({
                  ...formData,
                  baseAdjVal: isNaN(numValue) ? 0 : numValue
                });
              }}
              placeholder="e.g. 10 or 50"
              className={errors.baseAdjVal ? "border-red-500" : ""}
            />
            {errors.baseAdjVal && <p className="text-red-500 text-sm">{errors.baseAdjVal}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currencyId">Currency</Label>
            <Input
              id="currencyId"
              value={formData.currencyId}
              onChange={(e) => setFormData({ ...formData, currencyId: e.target.value })}
              placeholder="e.g. USD, EUR"
              className={errors.currencyId ? "border-red-500" : ""}
            />
            {errors.currencyId && <p className="text-red-500 text-sm">{errors.currencyId}</p>}
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
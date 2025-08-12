import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { addRatePlan, updateRatePlan } from '@/services/RatePlans';
import { AddRatePlanSchema, AddRatePlanRequest } from '@/validation/schemas/RatePlan';
import { store } from '@/redux/store';

interface EditRatePlanData extends AddRatePlanRequest {
  id: string;
}

interface RatePlanDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onRatePlanAdded?: () => Promise<void>;
  editData?: EditRatePlanData;
}

const NewRatePlanDialog = ({ isOpen, onOpenChange, onRatePlanAdded, editData }: RatePlanDialogProps) => {
  const isEditMode = !!editData;

  const [formData, setFormData] = useState<AddRatePlanRequest>({
    name: '',
    code: '',
    baseAdjType: 'PERCENT' as 'PERCENT' | 'FIXED',
    baseAdjVal: 0,
    currencyId: '',
  });

  const baseCurrency = store.getState().currency.currency || 'USD';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | number>>({});

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          name: editData.name || '',
          code: editData.code || '',
          baseAdjType: editData.baseAdjType || 'PERCENT',
          baseAdjVal: editData.baseAdjVal || 0,
          currencyId: editData.currencyId || baseCurrency
        });
      } else {
        setFormData({
          name: '',
          code: '',
          baseAdjType: 'PERCENT',
          baseAdjVal: 0,
          currencyId: baseCurrency,
        });
      }

      setErrors({});
    }
  }, [isOpen, editData, baseCurrency]);

  const validate = () => {
    try {
      const dataToValidate = {
        ...formData,
        baseAdjVal: Number(formData.baseAdjVal)
      };

      AddRatePlanSchema.parse(dataToValidate);
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
      const apiData: AddRatePlanRequest = {
        name: formData.name,
        code: formData.code,
        baseAdjType: formData.baseAdjType,
        baseAdjVal: Number(formData.baseAdjVal),
        currencyId: formData.currencyId || baseCurrency
      };

      if (isEditMode && editData?.id) {
        await updateRatePlan(editData.id, apiData);
        toast.success('Rate plan updated successfully');
      } else {
        await addRatePlan(apiData);
        toast.success('Rate plan added successfully');
      }

      if (onRatePlanAdded) {
        await onRatePlanAdded();
      }

      if (!isEditMode) {
        setFormData({
          name: '',
          code: '',
          baseAdjType: 'PERCENT',
          baseAdjVal: 0,
          currencyId: baseCurrency,
        });
      }

      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error.userMessage || `An error occurred while ${isEditMode ? 'updating' : 'adding'} the rate plan`;
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
            <Label htmlFor="baseAdjType">Adjustment Type</Label>
            <Select
              value={formData.baseAdjType}
              onValueChange={(value: 'PERCENT' | 'FIXED') => setFormData({ ...formData, baseAdjType: value })}
            >
              <SelectTrigger className={`w-full ${errors.baseAdjType ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select adjustment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENT">Percentage</SelectItem>
                <SelectItem value="FIXED">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
            {errors.baseAdjType && <p className="text-red-500 text-sm">{errors.baseAdjType}</p>}
          </div>

          <div className={`${formData.baseAdjType === 'FIXED' ? "grid grid-cols-10 gap-2 items-center" : ""} space-y-2`}>
            <Label htmlFor="baseAdjVal" className={`${formData.baseAdjType === "FIXED" ? "col-span-10" : ""}`}>
              Adjustment Value
            </Label>
            <Input
              id="baseAdjVal"
              type="number"
              min="0"
              step="0.01"
              value={formData.baseAdjVal === 0 ? '' : formData.baseAdjVal}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value === '' ? 0 : Number(value);
                setFormData({
                  ...formData,
                  baseAdjVal: isNaN(numValue) ? 0 : numValue
                });
              }}
              placeholder="e.g. 10 or 50"
              className={`${formData.baseAdjType === "FIXED" ? "col-span-9" : ""} ${errors.baseAdjVal ? "border-red-500" : ""}`}
            />
            {formData.baseAdjType === 'FIXED' && (
              <span className="text-sm text-gray-500">{baseCurrency}</span>
            )}
            {errors.baseAdjVal && <p className="text-red-500 text-sm col-span-10">{errors.baseAdjVal}</p>}
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
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { addAmenity, updateAmenity } from '@/services/Amenities';

interface AmenityDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAmenityAdded?: () => void;
  editData?: { id: string; name: string } | null;
}

const AmenityDialog = ({ isOpen, onOpenChange, onAmenityAdded, editData }: AmenityDialogProps) => {
  const isEditMode = !!editData;
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when dialog opens or edit data changes
  useEffect(() => {
    if (isOpen) {
      setName(editData?.name || '');
      setError('');
    }
  }, [isOpen, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Amenity name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && editData) {
        await updateAmenity(editData.id, { name });
        toast.success('Amenity updated successfully');
      } else {
        await addAmenity({ name });
        toast.success('Amenity added successfully');
      }

      if (onAmenityAdded) {
        await onAmenityAdded();
      }

      // Reset form
      setName('');
      setError('');

      onOpenChange(false);
    } catch (error: any) {
      setError(error.userMessage || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Amenity' : 'Add New Amenity'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the amenity details below.'
              : 'Enter the name of the new amenity you want to add.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amenity-name">Amenity Name</Label>
              <Input
                id="amenity-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Free WiFi"
                className={error ? "border-red-500" : ""}
              />

              {error && (
                <div className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
            </div>
          </div>

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
              id="new-amenity-button"
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
                  {isEditMode ? 'Update' : 'Add'} Amenity
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AmenityDialog;
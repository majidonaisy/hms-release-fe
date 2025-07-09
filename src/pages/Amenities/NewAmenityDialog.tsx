import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/Organisms/Dialog';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { useState, useEffect } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Amenity } from '@/validation/schemas/amenity';

interface NewAmenityDialogProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: (data: { name: string }) => Promise<void>;
    editingAmenity: Amenity | null;
}

const NewAmenityDialog = ({ isOpen, onCancel, onConfirm, editingAmenity }: NewAmenityDialogProps) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!editingAmenity;

    // Reset form when dialog opens and populate when editing
    useEffect(() => {
        if (isOpen) {
            if (editingAmenity) {
                setName(editingAmenity.name);
            } else {
                setName('');
            }
            setError('');
        }
    }, [isOpen, editingAmenity]);

    const validateForm = () => {
        if (!name.trim()) {
            setError('Amenity name is required');
            return false;
        }
        if (name.length < 2) {
            setError('Name must be at least 2 characters long');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onConfirm({ name: name.trim() });
            toast.success(`Amenity ${isEditing ? 'updated' : 'created'} successfully`);
        } catch (error: any) {
            toast.error(error.userMessage || `Failed to ${isEditing ? 'update' : 'create'} amenity`);
            setError(error.userMessage || `Failed to ${isEditing ? 'update' : 'create'} amenity. Please try again.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onCancel()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit' : 'Add New'} Amenity</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Edit this amenity to update its details.'
                            : 'Create a new amenity that guests can enjoy during their stay.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2" id="amenity-form">
                    <div className="grid gap-2">
                        <Label htmlFor="amenity-name" className="text-sm font-medium">
                            Amenity Name
                        </Label>
                        <Input
                            id="amenity-name"
                            placeholder="Enter amenity name (e.g., WiFi, Swimming Pool)"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) validateForm();
                            }}
                            disabled={isSubmitting}
                            className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                            autoFocus
                        />
                        {error && (
                            <div className="text-red-500 text-sm flex items-center mt-1">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {error}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            variant="background"
                            type="button"
                            onClick={onCancel}
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
                                    {isEditing ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    {isEditing ? 'Update' : 'Add'} Amenity
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewAmenityDialog;

import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/Organisms/Dialog';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { useState, useEffect } from 'react';
import { addAmenity } from '@/services/Amenities';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface NewAmenityDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAmenityAdded: () => void;
}

export const NewAmenityDialog = ({ isOpen, onOpenChange, onAmenityAdded }: NewAmenityDialogProps) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Reset form when dialog opens
    useEffect(() => {
        if (isOpen) {
            setName('');
            setError('');
        }
    }, [isOpen]);

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
            await addAmenity({ name: name.trim() });
            toast.success('Amenity added successfully');
            onAmenityAdded();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to add amenity');
            setError(error.userMessage || 'Failed to add amenity. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onOpenChange(open)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Amenity</DialogTitle>
                    <DialogDescription>
                        Create a new amenity that guests can enjoy during their stay.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2" id="new-amenity-form">
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
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Add Amenity
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

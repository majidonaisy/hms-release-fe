import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { addDepartment, updateDepartment } from '@/services/Departments';

interface DepartmentDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onConfirm?: () => void;
    editData?: { id: string; name: string } | null;
}

const DepartmentDialog = ({ isOpen, onOpenChange, onConfirm, editData }: DepartmentDialogProps) => {
    const isEditMode = !!editData;
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(editData?.name || '');
            setError('');
        }
    }, [isOpen, editData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Department name is required');
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditMode && editData) {
                await updateDepartment(editData.id, { name });
                toast.success('Department updated successfully');
            } else {
                await addDepartment({ name });
                toast.success('Department added successfully');
            }

            if (onConfirm) {
                await onConfirm();
            }

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
                    <DialogTitle>{isEditMode ? 'Edit Department' : 'Add New Department'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Update the department details below.'
                            : 'Enter the name of the new department you want to add.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="department-name">Department Name</Label>
                            <Input
                                id="department-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Management"
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
                            id="new-department-button"
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
                                    {isEditMode ? 'Update' : 'Add'} Department
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DepartmentDialog;
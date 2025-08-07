import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';

interface DeleteDialogProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    destructive?: boolean;
    refetchReservations?: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
    isOpen,
    title = "Confirm Deletion",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading = false,
    refetchReservations
}) => {
    const handleConfirm = () => {
        onConfirm();
        if (refetchReservations) {
            refetchReservations();
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
                <DialogFooter>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </Button>
                    <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                        {cancelText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDialog;

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';


interface DeleteGuestDialogProps {
    isOpen: boolean;
    guestId: string | null;
    onConfirm: (id: string) => void;
    onCancel: () => void;
    loading: boolean;
}

const DeleteGuestDialog: React.FC<DeleteGuestDialogProps> = ({
    isOpen,
    guestId,
    onConfirm,
    onCancel,
    loading
}) => {

    const handleDelete = () => {
        if (guestId) {
            onConfirm(guestId);
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this guest?
                </DialogDescription>
                <DialogFooter>
                    <Button onClick={handleDelete} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteGuestDialog;
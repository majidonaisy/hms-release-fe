import React from 'react';
import DeleteDialog from '@/components/molecules/DeleteDialog';
import NewRoomTypeDialog from '../dialogs/NewRoomTypeDialog';
import NewAmenityDialog from '../dialogs/NewAmenityDialog';
import NewRoleDialog from '../dialogs/NewRoleDialog';
import { useDialog } from '@/context/useDialog';
import NewRatePlanDialog from '../dialogs/NewRateplanDialog';
import NewExchangeRateDialog from '../dialogs/NewExchangeRateDialog';

const DialogContainer: React.FC = () => {
  const { isOpen, dialogType, dialogProps, closeDialog } = useDialog();

  console.log('DialogContainer render:', { isOpen, dialogType, dialogProps }); // Debug log

  if (!isOpen || !dialogType) return null;

  const renderDialog = () => {
    switch (dialogType) {
      case 'roomType':
        return (
          <NewRoomTypeDialog
            isOpen={isOpen}
            onCancel={closeDialog}
            onConfirm={(dialogProps as any).onConfirm}
          />
        );
      case 'amenity':
        return (
          <NewAmenityDialog
            isOpen={isOpen}
            onOpenChange={closeDialog}
            onAmenityAdded={(dialogProps as any).onAmenityAdded}
            editData={(dialogProps as any).editData}
          />
        );
      case 'ratePlan':
        return (
          <NewRatePlanDialog
            isOpen={isOpen}
            onOpenChange={closeDialog}
            onRatePlanAdded={(dialogProps as any).onRatePlanAdded}
            editData={(dialogProps as any).editData}
          />
        );
      case 'role':
        return (
          <NewRoleDialog
            isOpen={isOpen}
            onConfirm={(dialogProps as any).onConfirm}
            onCancel={closeDialog}
            editingRole={(dialogProps as any).editingRole}
          />
        );
      case 'exchangeRate':
        return (
          <NewExchangeRateDialog
            isOpen={isOpen}
            onConfirm={(dialogProps as any).onConfirm}
            onCancel={closeDialog}
            />
        );

      case 'delete':
        return (
          <DeleteDialog
            isOpen={isOpen}
            onConfirm={(dialogProps as any).onConfirm}
            onCancel={closeDialog}
            title={(dialogProps as any).title || "Delete Item"}
            description={(dialogProps as any).description || "Are you sure you want to delete this item?"}
            loading={(dialogProps as any).loading}
            confirmText={(dialogProps as any).confirmText}
            cancelText={(dialogProps as any).cancelText}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderDialog()}</>;
};

export default DialogContainer;
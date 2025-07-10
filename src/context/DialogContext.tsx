import React, { useState, ReactNode } from 'react';
import { DialogContext, DialogType, DialogProps } from './DialogContextTypes';

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogType, setDialogType] = useState<DialogType>(null);
    const [dialogProps, setDialogProps] = useState<DialogProps>({});

    const openDialog = (type: DialogType, props: DialogProps = {}) => {
        console.log('DialogContext openDialog called:', type, props); // Debug log
        setDialogType(type);
        setDialogProps(props);
        setIsOpen(true);
        console.log('Dialog state updated:', { type, isOpen: true }); // Debug log
    };

    const closeDialog = () => {
        setIsOpen(false);
        // Reset dialog type and props after animation completes
        setTimeout(() => {
            setDialogType(null);
            setDialogProps({});
        }, 300);
    };

    return (
        <DialogContext.Provider value={{ isOpen, dialogType, dialogProps, openDialog, closeDialog }}>
            {children}
        </DialogContext.Provider>
    );
};
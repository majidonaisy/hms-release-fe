import { useContext } from 'react';
import { DialogContext, DialogContextType } from './DialogContextTypes';

export const useDialog = (): DialogContextType => {
    const context = useContext(DialogContext);
    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Label } from '@/components/atoms/Label';
import { ScrollArea } from '@/components/atoms/ScrollArea';
import { checkOut } from '@/services/Reservation';

interface CheckInCheckoutDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservationId?: string;
    onCheckOutComplete?: () => void;
    onError?: (error: string) => void;
}

const CheckOutDialog = ({
    open,
    setOpen,
    reservationId,
    onCheckOutComplete,
    onError,
}: CheckInCheckoutDialogProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setIsLoading(false);
        }
    }, [open]);

    const handleCheckIn = async () => {
        setIsLoading(true);

        try {
            const targetReservationId = reservationId || '';

            const response = await checkOut(targetReservationId);

            // Handle successful check-in
            console.log('Check-in successful:', response);

            // Call success callback
            onCheckOutComplete?.();

            // Close dialog
            setOpen(false);

        } catch (error: any) {
            console.error('Check-in failed:', error);
            onError?.(error.userMessage || 'Check-in failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-4xl">
                <DialogHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">Check-in</DialogTitle>
                    </div>
                </DialogHeader>
                <ScrollArea className='h-[30rem]'>
                    <Card className='bg-hms-accent/15 border-none mb-5'>
                        <CardHeader>
                            <CardTitle className="text-lg">Reservation Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Label className="text-gray-600">Guest Name</Label>
                                    {/* <p className="font-medium">{reservationData?.guestName}</p> */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </ScrollArea>
                {/* Confirm Button */}
                <div className="mt-6 pt-4 border-t text-center">
                    <Button
                        onClick={handleCheckIn}
                        className="px-20"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Confirm Check-Out'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CheckOutDialog;
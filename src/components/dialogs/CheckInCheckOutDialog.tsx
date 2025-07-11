import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { ScrollArea } from '@/components/atoms/ScrollArea';
import { checkIn } from '@/services/Reservation';
import { UIReservation } from '@/pages/HotelScheduler';

interface CheckInCheckoutDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservationId?: string;
    reservationData?: UIReservation | null;
    onCheckInComplete?: () => void;
    onError?: (error: string) => void;
}

const CheckInCheckoutDialog = ({
    open,
    setOpen,
    reservationId,
    reservationData,
    onCheckInComplete,
    onError,
}: CheckInCheckoutDialogProps) => {
    const [deposit, setDeposit] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);


    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setDeposit('');
            setIsLoading(false);
        }
    }, [open]);

    const handleCheckIn = async () => {
        if (!deposit) {
            onError?.('Please select a deposit amount');
            return;
        }

        setIsLoading(true);

        try {
            const depositAmount = parseFloat(deposit);
            const targetReservationId = reservationId || '';

            const response = await checkIn(targetReservationId, depositAmount);

            // Handle successful check-in
            console.log('Check-in successful:', response);

            // Call success callback
            onCheckInComplete?.();

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
                                    <p className="font-medium">{reservationData?.guestName}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {/* Deposit */}
                            <div className="space-y-2">
                                <Label htmlFor="deposit" className="text-sm font-medium">Deposit *</Label>
                                <Select value={deposit} onValueChange={setDeposit} disabled={isLoading}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select deposit amount" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="100">$100</SelectItem>
                                        <SelectItem value="200">$200</SelectItem>
                                        <SelectItem value="300">$300</SelectItem>
                                        <SelectItem value="500">$500</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                </ScrollArea>
                {/* Confirm Button */}
                <div className="mt-6 pt-4 border-t text-center">
                    <Button
                        onClick={handleCheckIn}
                        className="px-20"
                        disabled={isLoading || !deposit}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Confirm Check-In'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CheckInCheckoutDialog;
import { useState, useEffect } from 'react';
import { Mail, Printer, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Label } from '@/components/atoms/Label';
import { Separator } from '@/components/atoms/Separator';
import { ScrollArea } from '@/components/atoms/ScrollArea';
import { checkOut } from '@/services/Reservation';

interface BillingItem {
    description: string;
    amount: number;
}

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

    const billingItems: BillingItem[] = [
        { description: 'Room Charges (5 nights)', amount: 750.00 },
        { description: 'Resort Fee', amount: 50.00 },
        { description: 'Taxes', amount: 80.00 },
        { description: 'Parking', amount: 25.00 }
    ];

    const total = billingItems.reduce((sum, item) => sum + item.amount, 0);
    const depositPaid = 200.00;
    const totalDue = total - depositPaid;

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

    const handleEmailInvoice = () => {
        // Implement email invoice functionality
        console.log('Email invoice requested');
    };

    const handlePrintInvoice = () => {
        // Implement print invoice functionality
        console.log('Print invoice requested');
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Card className='bg-hms-accent/15 border-none'>
                                <CardHeader>
                                    <CardTitle className="text-lg">Billing Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {billingItems.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">{item.description}</span>
                                            <span className="font-medium">${item.amount.toFixed(2)}</span>
                                        </div>
                                    ))}

                                    <Separator />

                                    <div className="flex justify-between items-center font-medium">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Deposit Paid</span>
                                        <span>-${depositPaid.toFixed(2)}</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Total due</span>
                                        <span>${totalDue.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Invoice Actions */}
                            <div className="flex space-x-2">
                                <Button
                                    variant="background"
                                    className="flex-1 h-7"
                                    onClick={handleEmailInvoice}
                                    disabled={isLoading}
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email Invoice
                                </Button>
                                <Button
                                    variant="background"
                                    className="flex-1 h-7"
                                    onClick={handlePrintInvoice}
                                    disabled={isLoading}
                                >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print Invoice
                                </Button>
                            </div>
                        </div>
                    </div>
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
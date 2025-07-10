import { useState, useEffect } from 'react';
import { Check, Mail, Printer, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Separator } from '@/components/atoms/Separator';
import { ScrollArea } from '@/components/atoms/ScrollArea';
import { checkIn } from '@/services/Reservation';

// Types
interface GuestCount {
    adults: number;
    children: number;
}

interface ReservationData {
    guestName: string;
    reservationId: string;
    guestCount: GuestCount;
    roomType: string;
    roomNumber: string;
    stayDates: string;
    bookingSource: string;
}

interface BillingItem {
    description: string;
    amount: number;
}

interface CheckInCheckoutDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservationId?: string;
    reservationData?: ReservationData | null;
    onCheckInComplete?: () => void;
    onError?: (error: string) => void;
}

const CheckInCheckoutDialog = ({
    open,
    setOpen,
    reservationId,
    reservationData,
    onCheckInComplete,
    onError
}: CheckInCheckoutDialogProps) => {
    const [deposit, setDeposit] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isIdVerified, setIsIdVerified] = useState<boolean>(true);

    // Default/mock reservation data if none provided
    const defaultReservationData: ReservationData = {
        guestName: 'John Doe',
        reservationId: 'RES-2024-001',
        guestCount: { adults: 2, children: 1 },
        roomType: 'Deluxe Suite',
        roomNumber: '205',
        stayDates: 'Jul 10 - Jul 15, 2024',
        bookingSource: 'Direct Booking'
    };

    // Use provided reservation data or default
    const currentReservationData = reservationData || defaultReservationData;

    // Mock billing items - in real app, these would come from the reservation data
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
            setDeposit('');
            setPaymentMethod('');
            setIsLoading(false);
        }
    }, [open]);

    const handleCheckIn = async () => {
        if (!deposit) {
            onError?.('Please select a deposit amount');
            return;
        }

        if (!paymentMethod) {
            onError?.('Please select a payment method');
            return;
        }

        setIsLoading(true);

        try {
            const depositAmount = parseFloat(deposit);
            const targetReservationId = reservationId || currentReservationData.reservationId;
            
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
                                    <p className="font-medium">{currentReservationData.guestName}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600">Room Type</Label>
                                    <p className="font-medium">{currentReservationData.roomType}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600">Reservation ID</Label>
                                    <p className="font-medium">{currentReservationData.reservationId}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600">Room Number</Label>
                                    <p className="font-medium">{currentReservationData.roomNumber}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600">Guest Count</Label>
                                    <p className="font-medium">
                                        {currentReservationData.guestCount.adults} Adults, {currentReservationData.guestCount.children} Children
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-gray-600">Stay Dates</Label>
                                    <p className="font-medium">{currentReservationData.stayDates}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-gray-600">Booking Source</Label>
                                    <p className="font-medium">{currentReservationData.bookingSource}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">ID/Passport verification</Label>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-green-600">Already uploaded</span>
                                    </div>
                                </div>
                            </div>

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

                            {/* Payment Method */}
                            <div className="space-y-2">
                                <Label htmlFor="payment" className="text-sm font-medium">Payment method *</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isLoading}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="credit_card">Credit Card</SelectItem>
                                        <SelectItem value="debit_card">Debit Card</SelectItem>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Right Column - Billing Summary */}
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
                        disabled={isLoading || !deposit || !paymentMethod}
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
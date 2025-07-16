import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Label } from '@/components/atoms/Label';
import { checkOut } from '@/services/Reservation';
import { UIReservation } from '@/pages/HotelScheduler';
import { format } from 'date-fns';

interface CheckInCheckoutDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservationId?: string;
    reservationData?: UIReservation | null
    onCheckOutComplete?: () => void;
    onError?: (error: string) => void;
}

const CheckOutDialog = ({
    open,
    setOpen,
    reservationId,
    reservationData,
    onCheckOutComplete,
    onError,
}: CheckInCheckoutDialogProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setIsLoading(false);
            setError(null);
        }
    }, [open]);

    const handleCheckIn = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const targetReservationId = reservationId || '';
            await checkOut(targetReservationId);
            onCheckOutComplete?.();
            setOpen(false);
        } catch (error: any) {
            console.error('Check-out failed:', error);

            let errorMessage = 'Check-out failed. Please try again.';

            if (error.userMessage) {
                errorMessage = error.userMessage;

            } else if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.error) {
                    errorMessage = responseData.error;
                } else if (responseData.message) {
                    errorMessage = responseData.message;
                } else if (typeof responseData === 'string') {
                    errorMessage = responseData;
                }

            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-4xl">
                <DialogHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">Check-out</DialogTitle>
                    </div>
                </DialogHeader>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-800 mb-1">Check-out Error</h4>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <Card className="bg-hms-accent/15 border-none mb-5">
                    <CardHeader>
                        <CardTitle className="text-lg">Reservation Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-6 text-sm">
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-gray-600 text-xs">Guest Name</Label>
                                    <p className="font-medium">{reservationData?.guestName || "N/A"}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600 text-xs">Guest Count:</Label>
                                    <div className="ml-4">
                                        <p className="text-sm">Adults: 2</p>
                                        <p className="text-sm">Children: 0</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-gray-600 text-xs">Room Type</Label>
                                    <p className="font-medium">{reservationData?.roomType || "N/A"}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-gray-600 text-xs">Room Number</Label>
                                    <p className="font-medium">{reservationData?.roomNumber || "N/A"}</p>
                                </div>
                                <div>
                                    <Label className="text-gray-600 text-xs">Stay Dates (Check-in & Check-out)</Label>
                                    <p className="font-medium">
                                        {reservationData?.start && reservationData?.end
                                            ? `${format(reservationData.start, "MMM dd, yyyy")} - ${format(reservationData.end, "MMM dd, yyyy")}`
                                            : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-gray-600 text-xs">Booking Source</Label>
                                    <p className="font-medium">Direct Booking</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
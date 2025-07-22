import { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Label } from '@/components/atoms/Label';
import { checkOut } from '@/services/Reservation';
import { UIReservation } from '@/pages/HotelScheduler';
import { format } from 'date-fns';
import { Checkbox } from '../atoms/Checkbox';
import { Input } from '../atoms/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { settleLateCheckoutFee, getLateCheckoutFee } from '@/services/Charges';
import { getAllCurrencies } from '@/services/Currency';
import { Currency } from '@/validation/schemas/Currency';
import { store } from '@/redux/store';
import { toast } from 'sonner';

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
    const [hasLateCheckoutFee, setHasLateCheckoutFee] = useState<boolean>(false);
    const [lateCheckoutFee, setLateCheckoutFee] = useState<string>('');
    const [isLateCheckoutFeeSettled, setIsLateCheckoutFeeSettled] = useState<boolean>(false);
    const [feeMode, setFeeMode] = useState<'manual' | 'automatic'>('automatic');

    // States for manual fee entry
    const [selectedCurrency, setSelectedCurrency] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [settlingFee, setSettlingFee] = useState(false);

    // States for automatic fee
    const [automaticFeeInfo, setAutomaticFeeInfo] = useState<{
        fee: number;
        currencyId: string;
    } | null>(null);
    const [loadingAutomaticFee, setLoadingAutomaticFee] = useState(false);

    const baseCurrency = store.getState().currency.currency || 'USD';
    const paymentMethods = [
        { value: 'CASH', label: 'Cash' },
        { value: 'CREDIT_CARD', label: 'Credit Card' },
        { value: 'DEBIT_CARD', label: 'Debit Card' },
        { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
        { value: 'CHECK', label: 'Check' },
    ];

    const isCheckoutDisabled = isLoading || (hasLateCheckoutFee && !isLateCheckoutFeeSettled);

    // Fetch currencies data
    const fetchCurrencies = useCallback(async () => {
        try {
            const response = await getAllCurrencies();
            const currenciesData = response.data || [];
            setCurrencies(currenciesData);
        } catch (error: any) {
            console.error('Failed to fetch currencies:', error);
            toast.error(error.userMessage || 'Failed to fetch currencies');
            setCurrencies([]);
        }
    }, []);

    // Fetch automatic late checkout fee info
    const fetchAutomaticFeeInfo = useCallback(async () => {
        if (!reservationId) return;

        try {
            setLoadingAutomaticFee(true);
            const response = await getLateCheckoutFee(reservationId);
            setAutomaticFeeInfo(response.data);
        } catch (error: any) {
            console.error('Failed to fetch automatic fee info:', error);
            // Don't show error toast as this is optional information
            setAutomaticFeeInfo(null);
        } finally {
            setLoadingAutomaticFee(false);
        }
    }, [reservationId]);

    useEffect(() => {
        if (open) {
            setIsLoading(false);
            setError(null);
            setHasLateCheckoutFee(false);
            setLateCheckoutFee('');
            setIsLateCheckoutFeeSettled(false);
            setFeeMode('automatic');
            setSelectedCurrency(baseCurrency);
            setPaymentMethod('');
            setAutomaticFeeInfo(null);

            // Fetch required data
            fetchCurrencies();
        }
    }, [open, baseCurrency, fetchCurrencies]);

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

    const handleSettleLateCheckoutFee = async () => {
        if (!reservationId) {
            setError('Reservation ID is required');
            return;
        }

        try {
            setSettlingFee(true);
            setError(null);

            if (feeMode === 'manual') {
                // Validate manual fee inputs
                if (!lateCheckoutFee || parseFloat(lateCheckoutFee) <= 0) {
                    setError('Please enter a valid late checkout fee amount');
                    return;
                }
                if (!selectedCurrency) {
                    setError('Please select a currency');
                    return;
                }
                if (!paymentMethod) {
                    setError('Please select a payment method');
                    return;
                }

                // Settle manual fee
                await settleLateCheckoutFee(reservationId, {
                    fee: parseFloat(lateCheckoutFee),
                    currencyId: selectedCurrency,
                    paymentMethod: paymentMethod,
                });

                toast.success(`Late checkout fee of ${parseFloat(lateCheckoutFee).toFixed(2)} ${selectedCurrency} has been settled`);
            } else {
                // Settle automatic fee
                if (!automaticFeeInfo || automaticFeeInfo.fee <= 0) {
                    setError('No automatic late checkout fee is applicable');
                    return;
                }

                await settleLateCheckoutFee(reservationId, {});
                toast.success(`Automatic late checkout fee of ${automaticFeeInfo.fee.toFixed(2)} ${automaticFeeInfo.currencyId} has been settled`);
            }

            setIsLateCheckoutFeeSettled(true);
        } catch (error: any) {
            console.error('Failed to settle late checkout fee:', error);
            const errorMessage = error.userMessage || 'Failed to settle late checkout fee';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setSettlingFee(false);
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
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="lateCheckoutFee"
                            checked={hasLateCheckoutFee}
                            onCheckedChange={(checked) => {
                                setHasLateCheckoutFee(checked === true);
                                if (checked && feeMode === 'automatic') {
                                    fetchAutomaticFeeInfo();
                                }
                            }}
                            className="data-[state=checked]:bg-hms-primary"
                        />
                        <Label htmlFor="lateCheckoutFee" className="text-sm font-medium">
                            Late Checkout Fee
                        </Label>
                    </div>

                    {hasLateCheckoutFee && (
                        <div className="space-y-4 ml-6">
                            {/* Fee Mode Selection */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Fee Type</Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="feeMode"
                                            value="automatic"
                                            checked={feeMode === 'automatic'}
                                            onChange={(e) => {
                                                setFeeMode(e.target.value as 'automatic');
                                                if (e.target.checked) {
                                                    fetchAutomaticFeeInfo();
                                                }
                                            }}
                                            className="h-4 w-4 text-hms-primary focus:ring-hms-primary"
                                        />
                                        <span className="text-sm">Automatic</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="feeMode"
                                            value="manual"
                                            checked={feeMode === 'manual'}
                                            onChange={(e) => setFeeMode(e.target.value as 'manual')}
                                            className="h-4 w-4 text-hms-primary focus:ring-hms-primary"
                                        />
                                        <span className="text-sm">Manual</span>
                                    </label>
                                </div>
                            </div>

                            {/* Automatic Fee Info */}
                            {feeMode === 'automatic' && (
                                <div className="space-y-3">
                                    {loadingAutomaticFee ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading automatic fee information...
                                        </div>
                                    ) : automaticFeeInfo ? (
                                        automaticFeeInfo.fee > 0 ? (
                                            <div className="p-3 bg-hms-accent/15 border border-hms-accent rounded-lg">
                                                <div className="text-sm">
                                                    <p className="font-medium ">Late Checkout Fee</p>
                                                    <p className="text-hms-primary mt-1">
                                                        Amount: {automaticFeeInfo.fee.toFixed(2)} {automaticFeeInfo.currencyId}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                <p className="text-sm text-gray-600">No automatic late checkout fee is applicable for this reservation.</p>
                                            </div>
                                        )
                                    ) : (
                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-700">Unable to load automatic fee information.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Manual Fee Inputs */}
                            {feeMode === 'manual' && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {/* Fee Amount */}
                                        <div>
                                            <Label htmlFor="feeAmount" className="text-sm">
                                                Fee Amount *
                                            </Label>
                                            <Input
                                                id="feeAmount"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="Enter amount"
                                                value={lateCheckoutFee}
                                                onChange={(e) => setLateCheckoutFee(e.target.value)}
                                                className="mt-1"
                                                disabled={isLateCheckoutFeeSettled}
                                            />
                                        </div>

                                        {/* Currency Selection */}
                                        <div>
                                            <Label className="text-sm">Currency *</Label>
                                            <Select
                                                value={selectedCurrency}
                                                onValueChange={setSelectedCurrency}
                                                disabled={isLateCheckoutFeeSettled}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={baseCurrency}>{baseCurrency}</SelectItem>
                                                    {currencies.filter(c => c.code !== baseCurrency).map((currency) => (
                                                        <SelectItem key={currency.id} value={currency.code}>
                                                            {currency.code} - {currency.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Payment Method */}
                                        <div>
                                            <Label className="text-sm">Payment Method *</Label>
                                            <Select
                                                value={paymentMethod}
                                                onValueChange={setPaymentMethod}
                                                disabled={isLateCheckoutFeeSettled}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paymentMethods.map((method) => (
                                                        <SelectItem key={method.value} value={method.value}>
                                                            {method.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Settle Button */}
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleSettleLateCheckoutFee}
                                    disabled={
                                        isLateCheckoutFeeSettled ||
                                        settlingFee ||
                                        (feeMode === 'manual' && (!lateCheckoutFee || parseFloat(lateCheckoutFee) <= 0 || !selectedCurrency || !paymentMethod)) ||
                                        (feeMode === 'automatic' && (!automaticFeeInfo || automaticFeeInfo.fee <= 0 || loadingAutomaticFee))
                                    }
                                    variant={isLateCheckoutFeeSettled ? "outline" : "default"}
                                    className="min-w-20"
                                >
                                    {settlingFee ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Settling...
                                        </>
                                    ) : isLateCheckoutFeeSettled ? (
                                        'Settled'
                                    ) : (
                                        'Settle Fee'
                                    )}
                                </Button>

                                {isLateCheckoutFeeSettled && (
                                    <div className="text-sm text-green-600 font-medium">
                                        ✓ Late checkout fee has been settled successfully
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-6 pt-4 border-t text-center">
                    <Button
                        onClick={handleCheckIn}
                        className="px-20"
                        disabled={isCheckoutDisabled}
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
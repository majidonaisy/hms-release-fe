import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/Select";
import { Separator } from "@/components/atoms/Separator";
import { ScrollArea } from "@/components/atoms/ScrollArea";
import { Search, ArrowUpDown, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getUnsetledCharges, addPayment } from "@/services/Charges";
import { convertRate, getAddChargeCurrencies } from "@/services/Currency";
import { getReservationById } from '@/services/Reservation';
import { SingleReservation } from '@/validation';
import { Currency } from '@/validation/schemas/Currency';
import { format } from 'date-fns';
import { store } from '@/redux/store';

export interface PaymentChargeItem {
    id: string;
    itemType: string;
    amount: string;
    quantity: number;
    unitPrice: string;
    status: string;
    selected: boolean;
}

const AddPaymentDialog = ({ open, setOpen, reservationId, onBackToChooseOptions }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservationId?: string;
    onBackToChooseOptions: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [notes, setNotes] = useState('');

    // Data states
    const [chargeItems, setChargeItems] = useState<PaymentChargeItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<PaymentChargeItem[]>([]);
    const [reservationDetails, setReservationDetails] = useState<SingleReservation | null>(null);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [loadingCharges, setLoadingCharges] = useState(true);
    const [loadingReservation, setLoadingReservation] = useState(true);
    const [loadingCurrencies, setLoadingCurrencies] = useState(true);
    const [loadingExchangeRate, setLoadingExchangeRate] = useState(false);
    const baseCurrency = store.getState().currency.currency || 'USD'; // Default to USD if not set
    const paymentMethods = [
        { value: 'CASH', label: 'Cash' },
        { value: 'CREDIT_CARD', label: 'Credit Card' },
        { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
        { value: "PAYPAL", label: "PayPal" },
        { value: 'CHECK', label: 'Check' },
        { value: 'OTHER', label: 'Other' }
    ];

    // Calculate total amount
    const totalAmount = selectedItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    // Fetch charges data
    const fetchCharges = useCallback(async () => {
        if (!reservationId) return;

        try {
            setLoadingCharges(true);
            const response = await getUnsetledCharges(reservationId);
            // Handle the actual response structure from your API
            const folioItems = response.data?.folioItems || [];
            const mappedChargeItems: PaymentChargeItem[] = folioItems.map((item: any) => ({
                id: item.id,
                itemType: item.itemType,
                amount: item.amount,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                status: item.status,
                selected: false,
            }));
            setChargeItems(mappedChargeItems);
        } catch (error: any) {
            console.error('Failed to fetch charges:', error);
            toast.error(error.userMessage || 'Failed to load charges');
            setChargeItems([]);
        } finally {
            setLoadingCharges(false);
        }
    }, [reservationId]);

    // Fetch reservation data
    const fetchReservation = useCallback(async () => {
        if (!reservationId) return;

        try {
            setLoadingReservation(true);
            const response = await getReservationById(reservationId);
            
            // Handle both direct data response and wrapped response
            let reservationData: any;
            if (response && typeof response === 'object' && 'data' in response && response.data) {
                reservationData = response.data;
            } else {
                reservationData = response;
            }
            
            // Transform the data to match SingleReservation interface
            const transformedReservation: SingleReservation = {
                id: reservationData.id || '',
                checkIn: reservationData.checkIn instanceof Date 
                    ? reservationData.checkIn.toISOString()
                    : reservationData.checkIn || '',
                checkOut: reservationData.checkOut instanceof Date 
                    ? reservationData.checkOut.toISOString()
                    : reservationData.checkOut || '',
                status: reservationData.status || 'DRAFT',
                guestId: reservationData.guestId || '',
                hotelId: reservationData.hotelId || '',
                ratePlanId: reservationData.ratePlanId || '',
                price: reservationData.price || '0',
                groupBookingId: reservationData.groupBookingId || null,
                chargeRouting: reservationData.chargeRouting || 'OWN_FOLIO',
                createdAt: reservationData.createdAt instanceof Date 
                    ? reservationData.createdAt.toISOString()
                    : reservationData.createdAt || new Date().toISOString(),
                updatedAt: reservationData.updatedAt instanceof Date 
                    ? reservationData.updatedAt.toISOString()
                    : reservationData.updatedAt || new Date().toISOString(),
                rooms: reservationData.rooms || [],
                receiptId: reservationData.receiptId || '',
                guest: reservationData.guest || { id: '', firstName: '', lastName: '' },
            };
            
            setReservationDetails(transformedReservation);
        } catch (error: any) {
            console.error('Failed to fetch reservation details:', error);
            toast.error(error.userMessage || 'Failed to fetch reservation details');
            setReservationDetails(null);
        } finally {
            setLoadingReservation(false);
        }
    }, [reservationId]);

    // Fetch currencies data
    const fetchCurrencies = useCallback(async () => {
        try {
            setLoadingCurrencies(true);
            const response = await getAddChargeCurrencies();
            const currenciesData = response.data || [];
            setCurrencies(currenciesData);
        } catch (error: any) {
            console.error('Failed to fetch currencies:', error);
            toast.error(error.userMessage || 'Failed to fetch currencies');
            setCurrencies([]);
        } finally {
            setLoadingCurrencies(false);
        }
    }, []);

    // Fetch all data using Promise.all
    useEffect(() => {
        const fetchAllData = async () => {
            if (!reservationId || !open) return;

            try {
                // Execute all fetch functions in parallel
                await Promise.all([
                    fetchCharges(),
                    fetchReservation(),
                    fetchCurrencies()
                ]);
            } catch (error: any) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load data');
            }
        };

        fetchAllData();
    }, [reservationId, open, fetchCharges, fetchReservation, fetchCurrencies]);

    // Reset form state when dialog opens
    useEffect(() => {
        if (open) {
            setSearchText('');
            setSortBy('name');
            setPaymentMethod('');
            setSelectedCurrency(baseCurrency);
            setNotes('');
            setSelectedItems([]);
            setExchangeRate(1);
        }
    }, [open, baseCurrency]);

    const convert = useCallback(async (baseCurrency: string, targetCurrency: string, amount: number) => {
        try {
            setLoadingExchangeRate(true);
            const response = await convertRate({ baseCurrency, targetCurrency, amount });
            console.log('response', response)
            setExchangeRate((response as any).data.convertedAmount);
            return response;
        } catch (error: any) {
            console.error('Failed to convert currency:', error);
            toast.error(error.userMessage || 'Failed to convert currency');
            throw error;
        } finally {
            setLoadingExchangeRate(false);
        }
    }, []);

    useEffect(() => {
        if (selectedCurrency && totalAmount > 0 && selectedCurrency !== baseCurrency) {
            convert(baseCurrency, selectedCurrency, totalAmount);
        } else if (selectedCurrency === baseCurrency) {
            setExchangeRate(totalAmount); // Show the total amount for base currency
        }
    }, [totalAmount, selectedCurrency, baseCurrency, convert]);

    const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Alternative helper for just adding commas without currency symbol
    const formatNumber = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Filter and sort charge items
    const filteredAndSortedItems = chargeItems
        .filter(item =>
            item.itemType.toLowerCase().includes(searchText.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.itemType.localeCompare(b.itemType);
            } else if (sortBy === 'amount') {
                return parseFloat(a.amount) - parseFloat(b.amount);
            }
            return 0;
        });

    const handleItemToggle = (item: PaymentChargeItem) => {
        // Prevent toggling paid items
        if (item.status === 'PAID') {
            return;
        }

        const isSelected = selectedItems.find(selected => selected.id === item.id);

        if (isSelected) {
            setSelectedItems(prev => prev.filter(selected => selected.id !== item.id));
        } else {
            setSelectedItems(prev => [...prev, item]);
        }
    };

    const handleConfirmPayment = async () => {
        // Filter out any paid items from selected items (extra safety)
        const unpaidSelectedItems = selectedItems.filter(item => item.status !== 'PAID');

        if (!reservationId || unpaidSelectedItems.length === 0 || !paymentMethod || !selectedCurrency) {
            toast.error('Please select unpaid charges, payment method and currency');
            return;
        }

        setIsLoading(true);
        try {
            // Extract folio item IDs from selected items
            const folioItemIds = unpaidSelectedItems.map(item => item.id);

            // Create payment request with new structure
            const paymentData = {
                folioItemIds,
                currencyId: selectedCurrency,
                method: paymentMethod,
                description: notes || undefined,
            };

            await addPayment(paymentData);

            toast.success('Payment confirmed successfully');
            handleClose();
        } catch (error: any) {
            console.error('Payment confirmation failed:', error);
            toast.error(error.userMessage || 'Failed to confirm payment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        // Just close the modal, don't navigate since we're in a modal context
    };

    if (loadingCharges || loadingReservation || loadingCurrencies) {
        return (
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="max-w-6xl px-6">
                    <DialogHeader>
                        <DialogTitle>Add Payment</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center h-40">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hms-primary mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-600">Loading...</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="!max-w-5xl px-6 !max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-start gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setOpen(false)
                                onBackToChooseOptions?.()
                            }}
                            aria-label="Back to choose options"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span>Add Payment</span>
                        <span className="text-sm font-normal text-gray-500">
                            {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0">
                    {/* Reservation Summary */}
                    <div className="bg-hms-accent/15 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-semibold mb-3">Reservation Summary</h3>
                        {loadingReservation ? (
                            <div className="flex justify-center items-center py-4">
                                <div className="text-sm text-gray-500">Loading reservation details...</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Guest Name</span>
                                        <p className="font-medium">
                                            {reservationDetails ? `${reservationDetails.guest.firstName} ${reservationDetails.guest.lastName}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Reservation ID</span>
                                        <p className="font-medium">{reservationId || 'N/A'}</p>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Guest ID</span>
                                        <p className="font-medium">{reservationDetails?.guest.id || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Room Number</span>
                                        <p className="font-medium">
                                            {reservationDetails?.rooms?.[0]?.roomNumber || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Price</span>
                                        <p className="font-medium">{reservationDetails?.price || 'N/A'}</p>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Stay Dates (Check-in & Check-out)</span>
                                        <p className="font-medium">
                                            {reservationDetails ? (
                                                `${format(new Date(reservationDetails.checkIn), 'MMM dd, yyyy')} - ${format(new Date(reservationDetails.checkOut), 'MMM dd, yyyy')}`
                                            ) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Status</span>
                                        <p className="font-medium">{reservationDetails?.status || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Select Charge/s */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Select Charge/s</h3>

                            {/* Search and Sort */}
                            <div className="border p-2">
                                <div className="flex gap-2 mb-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Search by charge type"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={() => setSortBy(sortBy === 'name' ? 'amount' : 'name')}
                                    >
                                        <ArrowUpDown className="h-4 w-4" />
                                        Sort by {sortBy === 'name' ? 'Amount' : 'Type'}
                                    </Button>
                                </div>

                                {/* Charge Items List */}
                                <ScrollArea className="h-36 ">
                                    <div className="space-y-2">
                                        {filteredAndSortedItems.map((item) => {
                                            const isSelected = selectedItems.find(selected => selected.id === item.id);
                                            const itemAmount = parseFloat(item.amount);
                                            const isPaid = item.status === 'PAID';

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`flex items-center justify-between rounded-lg cursor-pointer transition-colors ${isPaid
                                                        ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                                        : 'hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => !isPaid && handleItemToggle(item)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            checked={!!isSelected}
                                                            disabled={isPaid}
                                                            className={`data-[state=checked]:bg-hms-primary ${isPaid ? 'opacity-50 cursor-not-allowed' : ''
                                                                }`}
                                                            onChange={() => !isPaid && handleItemToggle(item)}
                                                        />
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`font-medium text-sm ${isPaid ? 'text-gray-500' : ''
                                                                    }`}>
                                                                    {item.itemType}
                                                                </span>
                                                                {isPaid && (
                                                                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                                                        PAID
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className={`text-xs ${isPaid ? 'text-gray-400' : 'text-gray-500'
                                                                }`}>
                                                                Qty: {item.quantity} × ${parseFloat(item.unitPrice).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={`font-semibold ${isPaid ? 'text-gray-400' : 'text-hms-accent'
                                                        }`}>
                                                        ${itemAmount.toFixed(2)} USD
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {filteredAndSortedItems.length === 0 && (
                                            <div className="text-center text-gray-500 py-8">
                                                No charges found
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                            {/* Total Amount */}
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center text-lg font-bold bg-hms-accent/15 p-3 rounded-lg">
                                <span>Selected Total</span>
                                <span className="text-hms-primary">{formatCurrency(totalAmount, baseCurrency)}</span>
                            </div>
                        </div>

                        {/* Right Column - Payment Method and Notes */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>

                            <div className="space-y-4">
                                {/* Currency Selection */}
                                <div>
                                    <Label htmlFor="currency">Currency</Label>
                                    <div className='flex items-center gap-2'>

                                        <Input
                                            id="exchangeRate"
                                            type="text"
                                            value={loadingExchangeRate ? '' : formatNumber(exchangeRate)}
                                            placeholder={loadingExchangeRate ? 'Loading...' : `0.00 ${selectedCurrency}`}
                                            disabled
                                            className="text-right font-mono"
                                        />

                                        <Select value={selectedCurrency} onValueChange={(selectedCurrencyCode) => {
                                            setSelectedCurrency(selectedCurrencyCode)

                                            if (selectedCurrencyCode === baseCurrency) {
                                                setExchangeRate(totalAmount); // Show total amount for base currency
                                            } else if (totalAmount > 0) {
                                                convert(baseCurrency, selectedCurrencyCode, totalAmount)
                                            }
                                        }}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={baseCurrency}>{baseCurrency}</SelectItem>
                                                {currencies.map((currency) => (
                                                    <SelectItem key={currency.id} value={currency.code}>
                                                        {currency.code} - {currency.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div>
                                    <Label htmlFor="paymentMethod">Payment Method</Label>
                                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select payment method" />
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

                                {/* Notes */}
                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Add any additional notes about this payment..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="min-h-32"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Confirm Payment Button - Always Visible */}
                    <div className="flex justify-center mt-6 pt-4 border-t bg-white sticky bottom-0">
                        <Button
                            onClick={handleConfirmPayment}
                            disabled={isLoading || selectedItems.length === 0 || !paymentMethod || !selectedCurrency}
                            className="w-full max-w-md h-12 text-lg"
                        >
                            {isLoading ? 'Processing...' : `Confirm Payment - $${totalAmount.toFixed(2)} USD`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddPaymentDialog;
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/Select";
import { Separator } from "@/components/atoms/Separator";
import { Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { addCharges, getUnsetledCharges } from "@/services/Charges";
import { ChargeItem, AddChargeRequest } from "@/validation/schemas/charges";

interface ReservationSummary {
    guestName: string;
    reservationId: string;
    roomType: string;
    roomNumber: string;
    guestCount: {
        adults: number;
        children: number;
    };
    stayDates: {
        checkIn: string;
        checkOut: string;
    };
    bookingSource: string;
}

const AddPaymentDialog = ({ open, setOpen, reservationId, reservationData }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservationId?: string;
    reservationData?: any;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [notes, setNotes] = useState('');

    // Data states
    const [chargeItems, setChargeItems] = useState<ChargeItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<ChargeItem[]>([]);
    const [reservationSummary, setReservationSummary] = useState<ReservationSummary | null>(null);
    const [loadingCharges, setLoadingCharges] = useState(true);
    const [loadingReservation, setLoadingReservation] = useState(true);

    const paymentMethods = [
        { value: 'cash', label: 'Cash' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'debit_card', label: 'Debit Card' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'room_charge', label: 'Room Charge' },
    ];

    // Calculate total amount
    const totalAmount = selectedItems.reduce((sum, item) => sum + item.amount, 0);

    // Fetch data using Promise.all
    useEffect(() => {
        const fetchData = async () => {
            if (!reservationId) return;

            try {
                setLoadingCharges(true);
                setLoadingReservation(true);

                const [chargesResponse] = await Promise.all([
                    getUnsetledCharges(reservationId),
                    // Add more services here if needed in the future
                ]);

                // Set charge items from unsettled charges
                const mappedChargeItems: ChargeItem[] = (chargesResponse.data || []).map(item => ({
                    id: item.id,
                    name: item.itemName,
                    amount: item.amount,
                    selected: false,
                }));
                setChargeItems(mappedChargeItems);

                // Mock reservation summary data - replace with actual service when available
                setReservationSummary({
                    guestName: reservationData?.guestName || 'John Doe',
                    reservationId: reservationId,
                    roomType: reservationData?.roomType || 'Standard Room',
                    roomNumber: reservationData?.roomNumber || '101',
                    guestCount: {
                        adults: reservationData?.adults || 2,
                        children: reservationData?.children || 1,
                    },
                    stayDates: {
                        checkIn: reservationData?.checkIn || '2025-06-21',
                        checkOut: reservationData?.checkOut || '2025-06-25',
                    },
                    bookingSource: reservationData?.bookingSource || 'Direct',
                });

            } catch (error: any) {
                console.error('Failed to fetch data:', error);
                toast.error(error.userMessage || 'Failed to load data');
                // Set fallback data
                setChargeItems([]);
                setReservationSummary({
                    guestName: 'Unknown Guest',
                    reservationId: reservationId || 'Unknown',
                    roomType: 'Unknown Room Type',
                    roomNumber: 'Unknown',
                    guestCount: { adults: 0, children: 0 },
                    stayDates: { checkIn: 'Unknown', checkOut: 'Unknown' },
                    bookingSource: 'Unknown',
                });
            } finally {
                setLoadingCharges(false);
                setLoadingReservation(false);
            }
        };

        fetchData();
    }, [reservationId, reservationData]);




    // Filter and sort charge items
    const filteredAndSortedItems = chargeItems
        .filter(item =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'amount') {
                return a.amount - b.amount;
            }
            return 0;
        });

    const handleItemToggle = (item: ChargeItem) => {
        const isSelected = selectedItems.find(selected => selected.id === item.id);

        if (isSelected) {
            setSelectedItems(prev => prev.filter(selected => selected.id !== item.id));
        } else {
            setSelectedItems(prev => [...prev, item]);
        }
    };

    const handleConfirmPayment = async () => {
        if (!reservationId || selectedItems.length === 0 || !paymentMethod) {
            toast.error('Please select charges and payment method');
            return;
        }

        setIsLoading(true);
        try {
            const chargeData: AddChargeRequest = {
                reservationId,
                items: selectedItems.map(item => ({
                    id: item.id,
                    amount: item.amount,
                })),
                paymentMethod,
                notes: notes || undefined,
            };

            await addCharges(chargeData);

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loadingCharges || loadingReservation) {
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
            <DialogContent className="!max-w-5xl px-6 !max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-start gap-4">
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

                <div className="overflow-y-auto">
                    {/* Reservation Summary */}
                    <div className="bg-hms-accent/15 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-semibold mb-3">Reservation Summary</h3>
                        <div className="grid grid-cols-2  gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Guest Name</span>
                                <p className="font-medium">{reservationSummary?.guestName}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Room Type</span>
                                <p className="font-medium">{reservationSummary?.roomType}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Reservation ID</span>
                                <p className="font-medium">{reservationSummary?.reservationId}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Room Number</span>
                                <p className="font-medium">{reservationSummary?.roomNumber}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Guest Count:</span>
                                <p className="font-medium">
                                    {reservationSummary?.guestCount.adults} Adults, {reservationSummary?.guestCount.children} Children
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600">Stay Dates (Check-in & Check-out)</span>
                                <p className="font-medium">
                                    {reservationSummary?.stayDates.checkIn && formatDate(reservationSummary.stayDates.checkIn)} - {reservationSummary?.stayDates.checkOut && formatDate(reservationSummary.stayDates.checkOut)}
                                </p>
                            </div>
                            <div></div>
                            <div>
                                <span className="text-gray-600">Booking Source</span>
                                <p className="font-medium">{reservationSummary?.bookingSource}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Select Charge/s */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Select Charge/s</h3>

                            {/* Search and Sort */}
                            <div className="flex gap-2 mb-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search text"
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
                                    Sort by {sortBy === 'name' ? 'Price' : 'Name'}
                                </Button>
                            </div>

                            {/* Charge Items List */}
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {filteredAndSortedItems.map((item) => {
                                    const isSelected = selectedItems.find(selected => selected.id === item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleItemToggle(item)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={!!isSelected}
                                                    onChange={() => handleItemToggle(item)}
                                                />
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            <span className="font-semibold text-blue-600">
                                                {item.amount.toFixed(2)} USD
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Total Amount */}
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total Amount</span>
                                <span className="text-hms-primary">{totalAmount.toFixed(2)} USD</span>
                            </div>
                        </div>

                        {/* Right Column - Payment Method and Notes */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Payment method</h3>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="payment-method">Payment Method</Label>
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

                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Describe the room and any key features guests should know about."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="min-h-32"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Confirm Payment Button */}
                    <div className="flex justify-center mt-6 pt-4 border-t">
                        <Button
                            onClick={handleConfirmPayment}
                            disabled={isLoading || selectedItems.length === 0 || !paymentMethod}
                        >
                            {isLoading ? 'Processing...' : 'Confirm Payment'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddPaymentDialog;
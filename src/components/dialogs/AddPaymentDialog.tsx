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
import { Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { addCharges, getUnsetledCharges } from "@/services/Charges";
import { AddChargeRequest } from "@/validation/schemas/charges";
import { getReservationById } from '@/services/Reservation';
import { SingleReservation } from '@/validation';
import { format } from 'date-fns';

interface PaymentChargeItem {
    id: string;
    itemType: string;
    amount: string;
    quantity: number;
    unitPrice: string;
    status: string;
    selected: boolean;
}

const AddPaymentDialog = ({ open, setOpen, reservationId }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservationId?: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [notes, setNotes] = useState('');

    // Data states
    const [chargeItems, setChargeItems] = useState<PaymentChargeItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<PaymentChargeItem[]>([]);
    const [reservationDetails, setReservationDetails] = useState<SingleReservation | null>(null);
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
    const totalAmount = selectedItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    // Fetch charges data
    const fetchCharges = useCallback(async () => {
        if (!reservationId) return [];

        try {
            const response = await getUnsetledCharges(reservationId);
            // Handle the actual response structure from your API
            const folioItems = response.data?.folioItems || [];
            const mappedChargeItems: PaymentChargeItem[] = folioItems.map(item => ({
                id: item.id,
                itemType: item.itemType,
                amount: item.amount,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                status: item.status,
                selected: false,
            }));
            return mappedChargeItems;
        } catch (error: any) {
            console.error('Failed to fetch charges:', error);
            toast.error(error.userMessage || 'Failed to load charges');
            return [];
        }
    }, [reservationId]);

    // Fetch data using Promise.all
    useEffect(() => {
        const fetchData = async () => {
            if (!reservationId) return;

            try {
                setLoadingCharges(true);
                setLoadingReservation(true);

                const [chargesData, reservationData] = await Promise.all([
                    fetchCharges(),
                    (async () => {
                        try {
                            const response = await getReservationById(reservationId);
                            // Handle both direct data response and wrapped response
                            return 'data' in response && response.data ? response.data : response;
                        } catch (error: any) {
                            console.error('Failed to fetch reservation details:', error);
                            toast.error(error.userMessage || 'Failed to fetch reservation details');
                            return null;
                        }
                    })()
                ]);

                setChargeItems(chargesData);
                setReservationDetails(reservationData as SingleReservation);

            } catch (error: any) {
                console.error('Failed to fetch data:', error);
                toast.error(error.userMessage || 'Failed to load data');
                setChargeItems([]);
                setReservationDetails(null);
            } finally {
                setLoadingCharges(false);
                setLoadingReservation(false);
            }
        };

        fetchData();
    }, [reservationId, fetchCharges]);




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
            // For now, we'll use the existing addCharges function
            // In the future, this should be replaced with a proper payment confirmation endpoint
            for (const item of selectedItems) {
                const chargeData: AddChargeRequest = {
                    reservationId,
                    quantity: item.quantity,
                    unitPrice: parseFloat(item.unitPrice),
                    itemType: item.itemType,
                    description: notes || undefined,
                };
                await addCharges(chargeData);
            }

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
            <DialogContent className="!max-w-5xl px-6 !max-h-[90vh] flex flex-col">
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
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between rounded-lg hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleItemToggle(item)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        checked={!!isSelected}
                                                        className='data-[state=checked]:bg-hms-primary'
                                                        onChange={() => handleItemToggle(item)}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{item.itemType}</span>
                                                        <span className="text-xs text-gray-500">
                                                            Qty: {item.quantity} × ${parseFloat(item.unitPrice).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-hms-accent">
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
                                <span className="text-hms-primary">${totalAmount.toFixed(2)} USD</span>
                            </div>
                        </div>

                        {/* Right Column - Payment Method and Notes */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Payment method</h3>

                            <div className="space-y-4">
                                <div>
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
                                        className="min-h-60"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Amount - Always Visible */}
                    {/* <div className="bg-gray-50 rounded-lg p-4 mt-4">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total Amount</span>
                            <span className="text-hms-primary">${totalAmount.toFixed(2)} USD</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                        </div>
                    </div> */}

                    {/* Confirm Payment Button - Always Visible */}
                    <div className="flex justify-center mt-6 pt-4 border-t bg-white sticky bottom-0">
                        <Button
                            onClick={handleConfirmPayment}
                            disabled={isLoading || selectedItems.length === 0 || !paymentMethod}
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
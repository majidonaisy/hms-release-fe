import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/Select";
import { toast } from "sonner";
import { addCharges } from "@/services/Charges";
import { AddChargeRequest } from "@/validation/schemas/charges";
import { Currency } from '@/validation/schemas/Currency';
import { getAllCurrencies } from '@/services/Currency';
import { Loader2 } from 'lucide-react';

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

interface AddChargeDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservationId?: string;
    reservationData?: ReservationSummary;
}

const AddChargeDialog = ({ open, setOpen, reservationId, reservationData }: AddChargeDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [itemType, setItemType] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loadingCurrencies, setLoadingCurrencies] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('USD'); // Default to USD

const itemTypes = [
    { value: 'ROOM_CHARGE', label: 'Room Charge' },
    { value: 'FOOD_BEVERAGE', label: 'Food & Beverage' },
    { value: 'TELEPHONE', label: 'Telephone' },
    { value: 'LAUNDRY', label: 'Laundry' },
    { value: 'SPA', label: 'Spa' },
    { value: 'MINIBAR', label: 'Minibar' },
    { value: 'PARKING', label: 'Parking' },
    { value: 'WIFI', label: 'WiFi' },
    { value: 'TAX', label: 'Tax' },
    { value: 'CITY_TAX', label: 'City Tax' },
    { value: 'SERVICE_CHARGE', label: 'Service Charge' },
    { value: 'INCIDENTAL', label: 'Incidental' },
    { value: 'PAYMENT_CASH', label: 'Payment Cash' },
    { value: 'PAYMENT_CARD', label: 'Payment Card' },
    { value: 'PAYMENT_TRANSFER', label: 'Payment Transfer' },
    { value: 'ADJUSTMENT_CREDIT', label: 'Adjustment Credit' },
    { value: 'ADJUSTMENT_DEBIT', label: 'Adjustment Debit' },
    { value: 'COMP', label: 'Complimentary' },
    { value: 'VOID', label: 'Void' }
];

    const handleConfirmPayment = async () => {
        if (!reservationId) {
            toast.error('Reservation ID is required');
            return;
        }

        if (!itemType) {
            toast.error('Please select a charge type');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setIsLoading(true);

        try {
            const chargeRequest: AddChargeRequest = {
                reservationId,
                quantity: parseInt(amount),
                itemType,
                description: description || undefined,
            };

            await addCharges(chargeRequest);

            toast.success('Charge added successfully');

            // Reset form
            setItemType('');
            setAmount('');
            setDescription('');
            setOpen(false);
        } catch (error: any) {
            console.error('Failed to add charge:', error);
            toast.error(error.userMessage || 'Failed to add charge');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setItemType('');
        setAmount('');
        setDescription('');
        setOpen(false);
    };

    const fetchCurrencies = async() => {
        try {
            const response = await getAllCurrencies();
            setCurrencies(response.data);

            const usdCurrency = response.data?.find(curr => curr.code === 'USD');
            if (usdCurrency) {
                setSelectedCurrency('USD');
            } else if (response.data && response.data.length > 0) {
                setSelectedCurrency(response.data[0].code);
            }
        } catch (error) {
            console.error('Error fetching currencies:', error);
            return [];
        }
    }

    useEffect(() => {
        Promise.all([fetchCurrencies()]);
    }, []);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-2xl">
                <DialogHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <DialogTitle className="text-xl font-semibold">Add Charge</DialogTitle>
                        <span className="text-gray-500 text-sm">June 21, 2025</span>
                    </div>
                    
                </DialogHeader>

                <div className="space-y-6">
                    {/* Reservation Summary */}
                    <div className=" border-blue-300 rounded-lg p-4 bg-hms-primary/15">
                        <h3 className="font-semibold text-lg mb-3">Reservation Summary</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="mb-2">
                                    <span className="text-gray-600">Guest Name</span>
                                    <div className="font-medium">{reservationData?.guestName || 'N/A'}</div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-gray-600">Reservation ID</span>
                                    <div className="font-medium">{reservationData?.reservationId || reservationId || 'N/A'}</div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-gray-600">Guest Count:</span>
                                    <div className="font-medium">
                                        <span className="block">Adults: {reservationData?.guestCount?.adults || 'N/A'}</span>
                                        <span className="block">Children: {reservationData?.guestCount?.children || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="mb-2">
                                    <span className="text-gray-600">Room Type</span>
                                    <div className="font-medium">{reservationData?.roomType || 'N/A'}</div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-gray-600">Room Number</span>
                                    <div className="font-medium">{reservationData?.roomNumber || 'N/A'}</div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-gray-600">Stay Dates (Check-in & Check-out)</span>
                                    <div className="font-medium">
                                        {reservationData?.stayDates?.checkIn || 'N/A'} - {reservationData?.stayDates?.checkOut || 'N/A'}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-gray-600">Booking Source</span>
                                    <div className="font-medium">{reservationData?.bookingSource || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charge Type */}
                    <div className=" border-blue-300 rounded-lg p-4">
                        <Label htmlFor="itemType" className="text-base font-semibold">Charge Type</Label>
                        <Select value={itemType} onValueChange={setItemType}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select Low, Medium or High" />
                            </SelectTrigger>
                            <SelectContent>
                                {itemTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amount */}
                    <div className=" border-blue-300 rounded-lg p-4">
                        <Label htmlFor="amount" className="text-base font-semibold">Amount</Label>
                        <div className="flex mt-2">
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="e.g. 150"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="flex-1"
                            />
                            <div className="w-32">
                                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={loadingCurrencies ? "Loading..." : "Currency"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingCurrencies ? (
                                            <div className="flex items-center justify-center p-4">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                <span>Loading...</span>
                                            </div>
                                        ) : currencies.length > 0 ? (
                                            currencies.map((currency) => (
                                                <SelectItem key={currency.id} value={currency.code}>
                                                    <div className="flex items-center justify-between w-full">
                                                        <span className="font-medium">{currency.code}</span>
                                                        <span className="text-gray-500 ml-2 text-xs">{currency.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="flex items-center justify-center p-4 text-gray-500">
                                                No currencies available
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* description */}
                    <div className=" border-blue-300 rounded-lg p-4">
                        <Label htmlFor="description" className="text-base font-semibold">description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the room and any key features guests should know about."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="mt-2 resize-none"
                        />
                    </div>

                    {/* Confirm Payment Button */}
                    <div className="flex justify-center mt-6">
                    <Button
                        onClick={handleConfirmPayment}
                        disabled={isLoading}
                        className="self-align-center py-3 text-lg font-medium"
                    >
                        {isLoading ? 'Processing...' : 'Confirm Payment'}
                    </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddChargeDialog;

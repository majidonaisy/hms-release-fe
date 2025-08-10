import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/Select";
import { toast } from "sonner";
import { addCharges } from "@/services/Charges";
import { AddChargeRequest } from "@/validation/schemas/charges";
import { getReservationById } from '@/services/Reservation';
import { SingleReservation } from '@/validation';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '../atoms/ScrollArea';
import { store } from '@/redux/store';

interface AddChargeDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservationId: string;
    onBackToChooseOptions: () => void;
}

const AddChargeDialog = ({ open, setOpen, reservationId, onBackToChooseOptions }: AddChargeDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [itemType, setItemType] = useState('');
    const [amount, setAmount] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [description, setDescription] = useState('');
    const [reservationDetails, setReservationDetails] = useState<SingleReservation | null>(null);
    const [receiptId, setReceiptId] = useState('');
    const [isLoadingReservation, setIsLoadingReservation] = useState(false);
    const baseCurrency = store.getState().currency.currency || 'USD';

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

    const handleConfirmCharge = async () => {
        if (!reservationId) {
            toast.error('Reservation ID is required');
            return;
        }

        if (!reservationDetails) {
            toast.error('Please wait for reservation details to load');
            return;
        }

        if (!itemType) {
            toast.error('Please select a charge type');
            return;
        }

        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid quantity');
            return;
        }

        if (!unitPrice || isNaN(parseFloat(unitPrice)) || parseFloat(unitPrice) <= 0) {
            toast.error('Please enter a valid unit price');
            return;
        }

        setIsLoading(true);

        try {
            const chargeRequest: AddChargeRequest = {
                reservationId,
                quantity: parseFloat(amount),
                unitPrice: parseFloat(unitPrice),
                itemType,
                description: description.trim() || undefined,
                receiptId
            };

            await addCharges(chargeRequest);

            toast.success('Charge added successfully');

            // Reset form
            setItemType('');
            setAmount('');
            setUnitPrice('');
            setReceiptId('');
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
        setUnitPrice('');
        setDescription('');
        setReceiptId('');
        setOpen(false);
    };

    const getReservation = useCallback(async () => {
        try {
            if (!reservationId) {
                console.error('Reservation ID is required to fetch reservation details');
                return;
            }
            setIsLoadingReservation(true);
            const response = await getReservationById(reservationId);

            // Handle both direct data response and wrapped response
            let reservationObj: any = response;
            if (reservationObj && typeof reservationObj === 'object' && !('id' in reservationObj) && 'data' in reservationObj && reservationObj.data) {
                reservationObj = reservationObj.data;
            }
            if (reservationObj && typeof reservationObj === 'object' && 'id' in reservationObj) {
                const reservationData: SingleReservation = {
                    ...reservationObj,
                    checkIn: reservationObj.checkIn instanceof Date ? reservationObj.checkIn.toISOString() : typeof reservationObj.checkIn === 'string' ? reservationObj.checkIn : '',
                    checkOut: reservationObj.checkOut instanceof Date ? reservationObj.checkOut.toISOString() : typeof reservationObj.checkOut === 'string' ? reservationObj.checkOut : '',
                    createdAt: reservationObj.createdAt instanceof Date ? reservationObj.createdAt.toISOString() : typeof reservationObj.createdAt === 'string' ? reservationObj.createdAt : '',
                    updatedAt: reservationObj.updatedAt instanceof Date ? reservationObj.updatedAt.toISOString() : typeof reservationObj.updatedAt === 'string' ? reservationObj.updatedAt : '',
                    receiptId: typeof reservationObj.receiptId === 'string' ? reservationObj.receiptId : '',
                    status: typeof reservationObj.status === 'string' && ["CHECKED_IN", "CHECKED_OUT", "DRAFT", "CONFIRMED", "CANCELLED", "NO_SHOW", "HELD"].includes(reservationObj.status) ? reservationObj.status as SingleReservation["status"] : "DRAFT",
                    createdByUser: reservationObj.createdByUser,
                    updatedByUser: reservationObj.updatedByUser
                };
                setReservationDetails(reservationData);
            } else {
                setReservationDetails(null);
            }
        } catch (error: any) {
            console.error('Failed to fetch reservation details:', error);
            toast.error(error.userMessage || 'Failed to fetch reservation details');
            setReservationDetails(null);
        } finally {
            setIsLoadingReservation(false);
        }
    }, [reservationId]);

    useEffect(() => {
        if (open && reservationId) {
            getReservation();
        }

        if (!open) {
            setItemType('');
            setAmount('');
            setUnitPrice('');
            setDescription('');
            setReceiptId('');
            setReservationDetails(null);
        }
    }, [open, reservationId, getReservation]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-2xl">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center">
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
                        <DialogTitle className="text-xl font-semibold">Add Charge</DialogTitle>
                        <span className="text-gray-500 text-sm ml-2">{format(new Date(), 'MMMM dd, yyyy')}</span>
                    </div>
                </DialogHeader>

                <div className="space-y-2">
                    {/* Reservation Summary */}
                    <div className="border rounded-lg p-4 bg-hms-primary/15">
                        <h3 className="font-semibold text-lg mb-3">Reservation Summary</h3>
                        {isLoadingReservation ? (
                            <div className="flex justify-center items-center py-4 h-[200px]">
                                <div className="text-sm text-gray-500">Loading reservation details...</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Guest Name</span>
                                        <div className="font-medium">
                                            {reservationDetails ? `${reservationDetails.guest.firstName} ${reservationDetails.guest.lastName}` : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Reservation ID</span>
                                        <div className="font-medium">{reservationId || 'N/A'}</div>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Guest ID:</span>
                                        <div className="font-medium">
                                            {reservationDetails?.guest.id || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Booked By:</span>
                                        <div className="font-medium">
                                            {reservationDetails?.createdByUser.firstName || 'N/A'} {reservationDetails?.createdByUser.lastName || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Room Number</span>
                                        <div className="font-medium">
                                            {reservationDetails?.rooms?.[0]?.roomNumber || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Price</span>
                                        <div className="font-medium">{reservationDetails?.price || 'N/A'}</div>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Stay Dates (Check-in & Check-out)</span>
                                        <div className="font-medium">
                                            {reservationDetails ? (
                                                `${format(new Date(reservationDetails.checkIn), 'MMM dd, yyyy')} - ${format(new Date(reservationDetails.checkOut), 'MMM dd, yyyy')}`
                                            ) : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-600">Status</span>
                                        <div className="font-medium">{reservationDetails?.status || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <ScrollArea className='h-[20rem]'>
                        {/* Charge Type */}
                        <div className=" rounded-lg ">
                            <Label htmlFor="itemType" className="text-base font-semibold">Charge Type</Label>
                            <Select value={itemType} onValueChange={setItemType}>
                                <SelectTrigger className="mt-2 w-full">
                                    <SelectValue placeholder="Select charge type" />
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

                        {/* Quantity */}
                        <div className=" rounded-lg ">
                            <Label htmlFor="amount" className="text-base font-semibold">Quantity</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="e.g. 2"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="mt-2"
                            />
                        </div>

                        {/* Unit Price */}
                        <div className=" rounded-lg ">
                            <Label htmlFor="unitPrice" className="text-base font-semibold">Unit Price</Label>
                            <div className="flex mt-2 gap-2 items-center">
                                <Input
                                    id="unitPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="e.g. 150.00"
                                    value={unitPrice}
                                    onChange={(e) => setUnitPrice(e.target.value)}
                                    className="flex-1"
                                />
                                <p>{baseCurrency}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className=" rounded-lg ">
                            <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Optional description for this charge"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="mt-2 resize-none"
                            />
                        </div>

                        {/* Receipt ID */}
                        <div className=" rounded-lg ">
                            <Label htmlFor="receiptId" className="text-base font-semibold">Receipt ID</Label>
                            <Input
                                id="receiptId"
                                type="text"
                                placeholder="Receipt ID"
                                value={receiptId}
                                onChange={(e) => setReceiptId(e.target.value)}
                                className="mt-2"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 mt-6">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="py-3 text-lg font-medium"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmCharge}
                                disabled={isLoading}
                                className="py-3 text-lg font-medium"
                            >
                                {isLoading ? 'Processing...' : 'Confirm Charge'}
                            </Button>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddChargeDialog;

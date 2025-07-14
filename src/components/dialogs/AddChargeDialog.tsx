import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/Select";
import { X } from "lucide-react";
import { toast } from "sonner";
import { addCharges } from "@/services/Charges";
import { AddChargeRequest } from "@/validation/schemas/charges";

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
    const [chargeType, setChargeType] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');

    const chargeTypes = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ];

    const handleConfirmPayment = async () => {
        if (!reservationId) {
            toast.error('Reservation ID is required');
            return;
        }

        if (!chargeType) {
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
                items: [
                    {
                        id: `charge-${Date.now()}`, // Generate a temporary ID
                        amount: parseFloat(amount),
                    }
                ],
                paymentMethod: chargeType,
                notes: notes || undefined,
            };

            await addCharges(chargeRequest);

            toast.success('Charge added successfully');

            // Reset form
            setChargeType('');
            setAmount('');
            setNotes('');
            setOpen(false);
        } catch (error: any) {
            console.error('Failed to add charge:', error);
            toast.error(error.userMessage || 'Failed to add charge');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setChargeType('');
        setAmount('');
        setNotes('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <DialogTitle className="text-xl font-semibold">Add Charge</DialogTitle>
                        <span className="text-gray-500 text-sm">June 21, 2025</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        className="h-6 w-6 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Reservation Summary */}
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-gray-50">
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
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
                        <Label htmlFor="chargeType" className="text-base font-semibold">Charge Type</Label>
                        <Select value={chargeType} onValueChange={setChargeType}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select Low, Medium or High" />
                            </SelectTrigger>
                            <SelectContent>
                                {chargeTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amount */}
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
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
                            <div className="ml-2 px-4 py-2 bg-gray-100 border rounded-md flex items-center">
                                <span className="text-sm font-medium">USD</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
                        <Label htmlFor="notes" className="text-base font-semibold">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Describe the room and any key features guests should know about."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="mt-2 resize-none"
                        />
                    </div>

                    {/* Confirm Payment Button */}
                    <Button
                        onClick={handleConfirmPayment}
                        disabled={isLoading}
                        className="w-full bg-red-800 hover:bg-red-900 text-white py-3 text-lg font-medium"
                    >
                        {isLoading ? 'Processing...' : 'Confirm Payment'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddChargeDialog;

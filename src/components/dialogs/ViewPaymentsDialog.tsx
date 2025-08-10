import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Separator } from '@/components/atoms/Separator';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Label } from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { format } from 'date-fns';
import {
  DollarSign,
  FileText,
  User,
  MapPin,
  Loader2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { getPayments, voidPayments } from '@/services/Charges';
import {
  Payment,
  transformFolioItemToPayment,
  PaymentType,
  PaymentStatus,
  GetPaymentsResponse
} from '@/validation/schemas/payments';

interface ViewPaymentsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reservationId: string;
  guestName: string;
  roomNumber: string;
  bookingId: string;
  onBackToChooseOptions: () => void;
}

const ViewPaymentsDialog: React.FC<ViewPaymentsDialogProps> = ({
  open,
  setOpen,
  reservationId,
  guestName,
  roomNumber,
  bookingId,
  onBackToChooseOptions,
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [voidingPayments, setVoidingPayments] = useState(false);
  const [voidReason, setVoidReason] = useState('');

  // Calculate total of all payments regardless of status
  const totalAllPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {

      // Transform the API response to match Payment interface using validation helper
      const { data } = await getPayments(reservationId) as GetPaymentsResponse;
      const transformedPayments: Payment[] = data.map(transformFolioItemToPayment);

      setPayments(transformedPayments);
    } catch (err: any) {
      setError('Failed to fetch payments. Please try again.');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  }, [reservationId]);

  useEffect(() => {
    if (open && reservationId) {
      fetchPayments();
      setSelectedPayments([]); // Clear selections when dialog opens
      setVoidReason(''); // Clear void reason when dialog opens
    }
  }, [open, reservationId, fetchPayments]);

  const handleSelectPayment = (paymentId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments(prev => [...prev, paymentId]);
    } else {
      setSelectedPayments(prev => prev.filter(id => id !== paymentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select only payments that can be voided (not already voided or failed)
      const voidablePayments = payments
        .filter(p => !['VOIDED', 'FAILED', 'CANCELLED'].includes(p.status))
        .map(p => p.id);
      setSelectedPayments(voidablePayments);
    } else {
      setSelectedPayments([]);
    }
  };

  const handleVoidPayments = async () => {
    if (selectedPayments.length === 0) return;

    if (!voidReason.trim()) {
      setError('Please provide a reason for voiding the payments.');
      return;
    }

    setVoidingPayments(true);
    try {
      // Call the void payments API with the new structure
      await voidPayments({
        ids: selectedPayments,
        voidReason: voidReason.trim()
      });

      // Refresh the payments list after voiding
      await fetchPayments();
      setSelectedPayments([]);
      setVoidReason('');

      // You might want to show a success message here
      console.log('Successfully voided payments:', selectedPayments);
    } catch (err: any) {
      console.error('Error voiding payments:', err);
      setError('Failed to void payments. Please try again.');
    } finally {
      setVoidingPayments(false);
    }
  };

  const isPaymentVoidable = (payment: Payment) => {
    return !['VOIDED', 'FAILED', 'CANCELLED'].includes(payment.status);
  };

  const voidablePayments = payments.filter(isPaymentVoidable);
  const allVoidableSelected = voidablePayments.length > 0 &&
    voidablePayments.every(p => selectedPayments.includes(p.id));

  const getPaymentTypeColor = (type: PaymentType) => {
    const colors = {
      DEPOSIT: 'bg-blue-100 text-blue-800',
      PAYMENT: 'bg-green-100 text-green-800',
      CHARGE: 'bg-orange-100 text-orange-800',
      REFUND: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: PaymentStatus) => {
    const colors = {
      COMPLETED: 'bg-green-100 text-green-800',
      PAID: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      FAILED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      VOIDED: 'bg-red-100 text-red-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-4xl !max-h-[90vh] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
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
            Payment History
          </DialogTitle>
          <DialogDescription>
            View all payments and transactions for this reservation
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Reservation Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{guestName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>Room {roomNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span>#{bookingId.slice(0, 8)}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-green-600">
                  ${totalAllPayments.toFixed(2)} Total
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payments List */}
          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Transaction History</h3>
              {voidablePayments.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={allVoidableSelected}
                      onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                      Select All
                    </label>
                  </div>
                  {selectedPayments.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {selectedPayments.length} payment(s) selected
                    </div>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading payments...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8 text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No payments found for this reservation.
              </div>
            ) : (
              <div className="border rounded-lg flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: '400px' }}>
                  <div className="space-y-2">
                    {payments.map((payment) => {
                      const isSelected = selectedPayments.includes(payment.id);
                      const isVoidable = isPaymentVoidable(payment);
                      return (
                        <div
                          key={payment.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${!isVoidable
                            ? 'opacity-50 cursor-not-allowed bg-gray-100'
                            : isSelected
                              ? 'bg-hms-accent/15 border-hms-primary border'
                              : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          onClick={() => isVoidable && handleSelectPayment(payment.id, !isSelected)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isSelected}
                              disabled={!isVoidable}
                              className={`data-[state=checked]:bg-hms-primary ${!isVoidable ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            />
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium text-sm ${!isVoidable ? 'text-gray-500' : ''
                                  }`}>
                                  {payment.description || payment.paymentMethod}
                                </span>
                                <Badge className={getPaymentTypeColor(payment.paymentType)}>
                                  {payment.paymentType}
                                </Badge>
                                <Badge className={getStatusColor(payment.status)}>
                                  {payment.status}
                                </Badge>
                                {!isVoidable && (
                                  <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                                    NON-VOIDABLE
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                <span>Added By: {payment.createdByUser.firstName} {payment.createdByUser.lastName}</span>
                                <span>Date: {format(new Date(payment.paymentDate), 'MMM d, yyyy h:mm a')}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`font-semibold text-lg ${!isVoidable ? 'text-gray-400' : 'text-hms-accent'
                            }`}>
                            ${payment.amount.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Void Form - Show when payments are selected */}
            {selectedPayments.length > 0 && (
              <div className="bg-hms-accent/30 border border-hms-accent rounded-lg p-4 space-y-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 " />
                  <h4 className="font-semibold ">Void {selectedPayments.length} Payment(s)</h4>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voidReason" className="text-sm font-medium ">
                    Reason for voiding (required) *
                  </Label>
                  <Textarea
                    id="voidReason"
                    placeholder="Please provide a detailed reason for voiding these payments..."
                    value={voidReason}
                    onChange={(e) => setVoidReason(e.target.value)}
                    className="min-h-20 border border-hms-accent focus:border-hms-primary"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm">
                    This action cannot be undone. {selectedPayments.length} payment(s) will be permanently voided.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPayments([]);
                        setVoidReason('');
                        setError(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleVoidPayments}
                      disabled={voidingPayments || !voidReason.trim()}
                    >
                      {voidingPayments ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Voiding...
                        </>
                      ) : (
                        'Confirm Void'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPaymentsDialog;
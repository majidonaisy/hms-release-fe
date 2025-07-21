import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { ScrollArea } from '@/components/atoms/ScrollArea';
import { Badge } from '@/components/atoms/Badge';
import { Separator } from '@/components/atoms/Separator';
import { format } from 'date-fns';
import {
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  User,
  MapPin,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getPayments } from '@/services/Charges';
import {
  Payment,
  PaymentSummary,
  transformFolioItemToPayment,
  calculatePaymentSummary,
  PaymentType,
  PaymentStatus
} from '@/validation/schemas/payments';

interface ViewPaymentsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reservationId: string;
  guestName: string;
  roomNumber: string;
  bookingId: string;
}

const ViewPaymentsDialog: React.FC<ViewPaymentsDialogProps> = ({
  open,
  setOpen,
  reservationId,
  guestName,
  roomNumber,
  bookingId,
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPayments(reservationId);

      // Transform the API response to match Payment interface using validation helper
      const transformedPayments: Payment[] = response.data.map(transformFolioItemToPayment);

      setPayments(transformedPayments);
      setPaymentSummary(calculatePaymentSummary(transformedPayments));
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
    }
  }, [open, reservationId, fetchPayments]);

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
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </DialogTitle>
          <DialogDescription>
            View all payments and transactions for this reservation
          </DialogDescription>
        </DialogHeader>

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
                ${(paymentSummary?.totalPayments || 0).toFixed(2)} Total
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-orange-600">
              ${paymentSummary?.totalCharges.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-orange-600">Total Charges</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              ${paymentSummary?.totalPayments.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-green-600">Total Payments</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-yellow-600">
              ${paymentSummary?.totalPending.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600">
              {paymentSummary?.itemCount || 0}
            </div>
            <div className="text-sm text-blue-600">Total Items</div>
          </div>
        </div>

        <Separator />

        {/* Payments List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Transaction History</h3>

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
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            ${payment.amount.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {payment.paymentMethod}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPaymentTypeColor(payment.paymentType)}>
                            {payment.paymentType}
                          </Badge>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(payment.paymentDate), 'MMM d, yyyy')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {format(new Date(payment.paymentDate), 'h:mm a')}
                        </div>
                      </div>
                    </div>

                    {payment.description && (
                      <div className="text-sm text-gray-600 mb-2">
                        {payment.description}
                      </div>
                    )}

                    {payment.transactionId && (
                      <div className="text-xs text-gray-400">
                        Transaction ID: {payment.transactionId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              // Add export functionality here
              console.log('Export payments for reservation:', reservationId);
            }}
          >
            Export Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPaymentsDialog;
import { useState, useEffect } from "react"
import { useDropzone } from 'react-dropzone';
import { AlertCircle, ArrowLeft, Loader2, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog"
import { Button } from "@/components/atoms/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card"
import { Label } from "@/components/atoms/Label"
import { checkIn } from "@/services/Reservation"
import type { UIReservation } from "@/pages/HotelScheduler"
import { format } from "date-fns"
import { Input } from "../atoms/Input"
import { toast } from "sonner"

interface CheckInDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    reservationId?: string
    reservationData?: UIReservation | null
    onCheckInComplete?: () => void
    onError?: (error: string) => void
    onBackToChooseOptions: () => void;
}

const CheckInDialog = ({
    open,
    setOpen,
    reservationId,
    reservationData,
    onCheckInComplete,
    onError,
    onBackToChooseOptions
}: CheckInDialogProps) => {
    const [deposit, setDeposit] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [identificationFiles, setIdentificationFiles] = useState<File[]>([]);
    const [identificationData, setIdentificationData] = useState<any>(null);
    const [uploadingIdentification, setUploadingIdentification] = useState(false);

    const {
        getRootProps: getIdentificationRootProps,
        getInputProps: getIdentificationInputProps,
        isDragActive: isIdentificationDragActive
    } = useDropzone({
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            setUploadingIdentification(true);
            setError(null);
            if (acceptedFiles.length === 0) {
                setIdentificationFiles([]);
                setIdentificationData(null);
                setUploadingIdentification(false);
                return;
            }
            const file = acceptedFiles[0];
            setIdentificationFiles([file]);
            setIdentificationData(file);
            setUploadingIdentification(false);
        }
    });

    useEffect(() => {
        if (open) {
            setDeposit("");
            setIsLoading(false);
            setError(null);
            setIdentificationFiles([]);
            setIdentificationData(null);
            setUploadingIdentification(false);
        }
    }, [open])

    const handleCheckIn = async () => {
        if (!deposit) {
            onError?.("Please select a deposit amount")
            return
        }

        setIsLoading(true);
        try {
            const depositAmount = Number.parseFloat(deposit);
            const targetReservationId = reservationId || "";
            await checkIn(
                targetReservationId,
                depositAmount,
                identificationData || {}
            );

            onCheckInComplete?.();
            setOpen(false);
            toast.success(
                "Success!", {
                description: "Check-in was successful"
            }
            );
        } catch (error: any) {
            console.error('Check-in failed:', error);

            let errorMessage = 'Check-in failed. Please try again.';

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
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-4xl max-w-5xl">
                <DialogHeader className="pb-4">
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
                        <DialogTitle className="text-xl font-semibold">Check-in</DialogTitle>
                    </div>
                </DialogHeader>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-800 mb-1">Check-in Error</h4>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <Card className="bg-hms-accent/15 border-none">
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
                                    <Label className="text-gray-600 text-xs">Room Type</Label>
                                    <p className="font-medium">{reservationData?.roomType || "N/A"}</p>
                                </div>

                                <div>
                                    <Label className="text-gray-600 text-xs">Booked By</Label>
                                    <p className="font-medium">{reservationData?.createdByUser}</p>
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

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="deposit" className="text-sm font-semibold">Deposit</Label>
                            <Input
                                id="deposit"
                                type="number"
                                value={deposit}
                                onChange={e => setDeposit(e.target.value)}
                                placeholder="Enter deposit amount"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">Identification</Label>
                            <div
                                {...getIdentificationRootProps()}
                                className={`border h-24 p-4 rounded-md cursor-pointer flex items-center justify-center hover:bg-accent/50 transition-colors bg-white`}
                            >
                                <input {...getIdentificationInputProps()} />
                                {uploadingIdentification ? (
                                    <p className="text-center text-gray-500">Uploading file...</p>
                                ) : (
                                    <p className="text-center text-gray-500">
                                        {isIdentificationDragActive ? "Drop the file here..." : "Drag & drop a file here, or click to select file"}
                                    </p>
                                )}
                            </div>
                            <div className="mt-2">
                                {identificationFiles.length === 0 && (
                                    <p className="text-sm text-gray-500">No file selected.</p>
                                )}
                                {identificationFiles.length > 0 && (
                                    <ul className="flex flex-wrap gap-3">
                                        {identificationFiles.map((fileObj, index) => (
                                            <li key={index} className="flex items-center gap-1 p-2 border rounded-md">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                                                        <span className="text-xs">{fileObj.name.split('.').pop()}</span>
                                                    </div>
                                                    <span className="text-sm overflow-hidden text-ellipsis max-w-40">{fileObj.name}</span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        setIdentificationFiles([]);
                                                        setIdentificationData(null);
                                                        setError(null);
                                                    }}
                                                    className="h-7 w-7"
                                                >
                                                    <X />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    <Card className="bg-hms-accent/15">
                        <CardHeader className="p-0 px-3">
                            <CardTitle className="text-lg font-semibold">
                                Deposit Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <Label className="text-gray-600 text-xs">Deposit Amount</Label>
                                <p className="font-medium text-lg">
                                    {deposit ? `$${parseFloat(deposit).toFixed(2)}` : "$0.00"}
                                </p>
                            </div>
                            {identificationFiles.length > 0 && (
                                <div className="mt-2">
                                    <Label className="text-gray-600 text-xs">Identification File</Label>
                                    <p className="text-sm text-gray-700">
                                        <strong>Name:</strong> {identificationFiles[0].name}<br />
                                        <strong>Type:</strong> {identificationFiles[0].type || 'Unknown'}
                                    </p>
                                </div>
                            )}
                            <p className="text-sm text-gray-700">
                                This amount will be held for the guest's stay.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 pt-4 border-t text-center">
                    <Button
                        onClick={handleCheckIn}
                        className="px-20"
                        disabled={isLoading || !deposit}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Confirm Check-In"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CheckInDialog
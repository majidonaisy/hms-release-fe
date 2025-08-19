import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog"
import { Separator } from "@/components/atoms/Separator"
import { format } from "date-fns"
import { GetReservationById } from "@/validation"
import { getReservationById } from "@/services/Reservation"
import { Button } from "../atoms/Button"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { store } from "@/redux/store"

interface ViewReservationDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    reservationId: string
    onBackToChooseOptions: () => void
    createdByUser?: string,
    checkedInAt?: Date
}

const ViewReservationDialog: React.FC<ViewReservationDialogProps> = ({ open, setOpen, reservationId, onBackToChooseOptions, createdByUser, checkedInAt }) => {
    const [reservation, setReservation] = useState<GetReservationById['data'] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const baseCurrency = store.getState().currency.currency || 'USD';

    useEffect(() => {
        if (open && reservationId) {
            fetchReservation()
        }
    }, [open, reservationId])

    const fetchReservation = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getReservationById(reservationId)
            // Handle both wrapped and direct response formats
            const reservationData = "data" in response ? response.data : response
            if (reservationData) {
                setReservation(reservationData)
            }
        } catch (err: any) {
            setError(err.userMessage || "Failed to load reservation")
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString: Date) => {
        try {
            return format(new Date(dateString), "dd MMM yyyy")
        } catch {
            return "Invalid date"
        }
    }

    const formatCheckedInDate = (dateString: undefined | Date) => {
        if (!dateString) return ""
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className=" flex flex-col !max-w-xl">
                <DialogHeader className="flex-shrink-0 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-row">
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
                            <DialogTitle className="text-2xl font-semibold">
                                <p>Reservation</p>
                                <DialogDescription className="text-sm text-muted-foreground mt-1">#{reservationId}</DialogDescription>
                            </DialogTitle>
                        </div>

                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading reservation...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        </div>
                    ) : reservation ? (
                        <div className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Guest Information */}
                                <div className="">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        Guest
                                    </div>
                                    <div className="text-lg font-semibold">
                                        {reservation.guest.firstName} {reservation.guest.lastName}
                                    </div>
                                </div>

                                {/* Room Type */}
                                <div className="">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        Room
                                    </div>
                                    <div className="text-lg font-semibold">{reservation.rooms.map((room) => (
                                        room.roomNumber
                                    ))}</div>
                                </div>

                                <div className="">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        Booked By
                                    </div>
                                    <div className="text-lg font-semibold">
                                        {createdByUser || "Unknown User"}
                                    </div>
                                </div>

                                <div className="">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        Checked In At
                                    </div>
                                    <div className="text-lg font-semibold">
                                        {formatCheckedInDate(checkedInAt) || "Unknown"}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Stay Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-hms-accent/15 p-2 rounded-lg">
                                {/* Stay Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 font-medium text-muted-foreground">
                                        Stay Info
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm">
                                            <span className="font-medium">Check In Time:</span> {formatDate(reservation.checkIn)}
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium">Check Out Time:</span> {formatDate(reservation.checkOut)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 font-medium text-muted-foreground">
                                        Reservation Info
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm">
                                            <span className="font-medium">Status:</span> {reservation.status.charAt(0) + reservation.status.slice(1).replace("_", " ").toLowerCase()}
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium">Price:</span> {reservation.price} {baseCurrency}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewReservationDialog
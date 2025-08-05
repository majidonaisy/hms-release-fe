import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog"
import { Badge } from "@/components/atoms/Badge"
import { Separator } from "@/components/atoms/Separator"
import { format } from "date-fns"
import { User, MapPin, Calendar, Users, FileText, Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { GetReservationById } from "@/validation"
import { getReservationById } from "@/services/Reservation"
import { Button } from "../atoms/Button"

interface ViewReservationDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    reservationId: string
    onBackToChooseOptions: () => void
}

const ViewReservationDialog: React.FC<ViewReservationDialogProps> = ({ open, setOpen, reservationId, onBackToChooseOptions }) => {
    const [reservation, setReservation] = useState<GetReservationById['data'] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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
                console.log(reservationData)
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

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "CHECKED_IN":
                return "bg-chart-1/20 text-chart-1"
            case "HELD":
                return "bg-chart-3/20 text-chart-3"
            case "CHECKED_OUT":
                return "bg-chart-5/20 text-chart-5"
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className=" flex flex-col !max-w-2xl">
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
                            <DialogTitle className="text-2xl font-semibold">Reservation</DialogTitle>
                        </div>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">#{reservationId}</DialogDescription>

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
                            {/* Status Badge */}
                            <div className="flex justify-start">
                                <Badge className={getStatusBadgeVariant(reservation.status)}>
                                    {reservation.status.replace("_", " ")}
                                </Badge>
                            </div>

                            {/* Main Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Guest Information */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        Guest
                                    </div>
                                    <div className="text-lg font-semibold">
                                        {reservation.guest.firstName} {reservation.guest.lastName}
                                    </div>
                                </div>

                                {/* Room Type */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        Room Type
                                    </div>
                                    <div className="text-lg font-semibold">Standard Room</div>
                                </div>

                                {/* Room Number */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        Room Number
                                    </div>
                                    <div className="text-lg font-semibold">
                                        {reservation.rooms.map((room) => room.roomNumber).join(", ")}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Stay Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Stay Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        Stay Info
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm">
                                            <span className="font-medium">Check-in:</span> {formatDate(reservation.checkIn)}
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium">Check-out:</span> {formatDate(reservation.checkOut)}
                                        </div>
                                    </div>
                                </div>

                                {/* Guest Count */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        Guest Count
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm">
                                            <span className="font-medium">Adults:</span> 2
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium">Children:</span> 2
                                        </div>
                                    </div>
                                </div>

                                {/* Special Requests */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        Special Requests
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm">- Prefers upper floor</div>
                                        <div className="text-sm">- Gluten allergy</div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Additional Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Charge Routing</div>
                                    <div className="text-sm">{reservation.chargeRouting.replace("_", " ")}</div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Rate Plan ID</div>
                                    <div className="text-sm font-mono">{reservation.ratePlanId}</div>
                                </div>
                            </div>

                            {reservation.groupBookingId && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">Group Booking ID</div>
                                        <div className="text-sm font-mono">{reservation.groupBookingId}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewReservationDialog
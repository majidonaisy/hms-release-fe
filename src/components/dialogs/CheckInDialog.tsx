import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog"
import { Button } from "@/components/atoms/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card"
import { Label } from "@/components/atoms/Label"
import { ScrollArea } from "@/components/atoms/ScrollArea"
// import { Separator } from "@/components/atoms/Separator"
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
}

const CheckInDialog = ({
    open,
    setOpen,
    reservationId,
    reservationData,
    onCheckInComplete,
    onError,
}: CheckInDialogProps) => {
    const [deposit, setDeposit] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (open) {
            setDeposit("")
            setIsLoading(false)
        }
    }, [open])

    const handleCheckIn = async () => {
        if (!deposit) {
            onError?.("Please select a deposit amount")
            return
        }

        setIsLoading(true)
        try {
            const depositAmount = Number.parseFloat(deposit)
            const targetReservationId = reservationId || ""
            await checkIn(targetReservationId, depositAmount)

            onCheckInComplete?.()
            setOpen(false)
            toast(
                "Success!", {
                description: "Check-in was successful"
            }
            )
        } catch (error: any) {
            console.error("Check-in failed:", error)
            onError?.(error.userMessage || "Check-in failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // const calculateNights = () => {
    //     if (!reservationData?.start || !reservationData?.end) return 0
    //     const diffTime = reservationData.end.getTime() - reservationData.start.getTime()
    //     return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    // }

    // const nights = calculateNights()
    // const ratePerNight = Number.parseFloat(reservationData?.rate || "0")
    // const total = nights * ratePerNight
    // const depositAmount = Number.parseFloat(deposit || "0")
    // const totalDue = total - depositAmount

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-4xl max-w-5xl">
                <DialogHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">Check-in</DialogTitle>
                    </div>
                </DialogHeader>

                <ScrollArea className="h-[35rem]">
                    {/* Reservation Summary */}
                    <Card className="bg-hms-accent/15 border-none mb-5">
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
                                        <Label className="text-gray-600 text-xs">Guest Count:</Label>
                                        <div className="ml-4">
                                            <p className="text-sm">Adults: 2</p>
                                            <p className="text-sm">Children: 0</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-gray-600 text-xs">Room Type</Label>
                                        <p className="font-medium">{reservationData?.roomType || "N/A"}</p>
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="deposit" className="text-sm font-semibold">
                                Deposit
                            </Label>
                            <Input type='number' value={deposit} onChange={(e) => setDeposit(e.target.value)} />
                        </div>

                        {/* <Card className="bg-hms-accent/15">
                            <CardHeader className="text-lg font-semibold p-0 px-3">
                                <CardTitle>
                                    Billing Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Room Rate ({nights} {nights === 1 ? "night" : "nights"})
                                    </span>
                                </div>

                                <Separator className="my-2" />

                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Deposit Paid</span>
                                    <span>- ${depositAmount.toFixed(2)}</span>
                                </div>

                                <Separator className="my-2" />

                                <div className="flex justify-between font-bold text-lg text-hms-primary">
                                    <span>Total due</span>
                                    <span>${totalDue.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card> */}
                    </div>
                </ScrollArea>

                {/* Confirm Button */}
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
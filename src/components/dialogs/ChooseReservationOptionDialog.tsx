import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog"
import { LogIn, LogOut, Edit, Eye, Trash2, DoorOpen, Calendar, ChevronRight, Banknote, CircleDollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { getGuestById } from "../../services/Guests"
import { Guest } from "@/validation"

const ChooseReservationOptionDialog = ({
    open,
    setOpen,
    checkIn,
    checkOut,
    addCharges,
    editReservation,
    addCharge,
    isCheckedIn = false,
    isCheckedOut = false,
    guestId,
    roomNumber,
    roomType,
    checkInDate,
    checkOutDate,
    stayDuration,
    cancelReservation
}: {
    open: boolean
    setOpen: (open: boolean) => void
    title: string
    description: string
    checkIn: () => void
    checkOut: () => void
    addCharges: () => void
    editReservation: () => void
    addCharge: () => void
    isCheckedIn?: boolean
    isCheckedOut?: boolean
    guestId?: string
    roomNumber?: string
    roomType?: string
    checkInDate?: string
    checkOutDate?: string
    stayDuration?: string,
    cancelReservation: () => void
}) => {
    const [guestData, setGuestData] = useState<Guest | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (open && guestId) {
            fetchGuestData()
        }
    }, [open, guestId])

    const fetchGuestData = async () => {
        if (!guestId) return

        setIsLoading(true)
        setError(null)

        try {
            const response = await getGuestById(guestId)
            setGuestData(response.data)
        } catch (err: any) {
            setError(err.userMessage || "Failed to fetch guest data")
            console.error("Error fetching guest:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return ""
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    const guestName = guestData ? `${guestData.firstName} ${guestData.lastName}` : (isLoading ? "Loading..." : "Guest")

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="px-0">
                <DialogHeader className="px-6 pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                            {guestName}'s Reservation
                        </DialogTitle>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 bg-hms-accent/15 p-2 rounded-md">
                        <div className="flex items-center gap-2">
                            <DoorOpen className="size-4" />
                            <span>Room: {roomType} - {roomNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4" />
                            <span>Stay: {formatDate(checkInDate)} - {formatDate(checkOutDate)} ({stayDuration})</span>
                        </div>
                    </div>
                </DialogHeader>

                {error && (
                    <div className="px-6 py-2">
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
                            {error}
                        </div>
                    </div>
                )}

                <div className="px-6 space-y-3">
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                            <Eye className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-gray-900">View Reservation</span>
                        </div>
                        <ChevronRight size={15} />
                    </div>

                    <div
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => { setOpen(false); editReservation(); }}
                    >
                        <div className="flex items-center gap-3">
                            <Edit className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-gray-900">Edit Reservation</span>
                        </div>
                        <ChevronRight size={15} />
                    </div>

                    {/* Add Payment */}
                    <div
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => { setOpen(false); addCharges(); }}
                    >
                        <div className="flex items-center gap-3">
                            <Banknote className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-gray-900">Add Payment</span>
                        </div>
                        <ChevronRight size={15} />
                    </div>

                    {/* Add Charges */}
                    <div
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => { setOpen(false); addCharge(); }}
                    >
                        <div className="flex items-center gap-3">
                            <CircleDollarSign className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-gray-900">Add Charges</span>
                        </div>
                        <ChevronRight size={15} />
                    </div>

                    {/* Check-In */}
                    <div
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isCheckedIn
                            ? "bg-gray-50 opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-50"
                            }`}
                        onClick={() => {
                            if (!isCheckedIn) {
                                setOpen(false);
                                checkIn();
                            }
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <LogIn className={`h-5 w-5 ${isCheckedIn ? "text-gray-400" : "text-gray-600"}`} />
                            <span className={`font-medium ${isCheckedIn ? "text-gray-400" : "text-gray-900"}`}>
                                Check-In
                            </span>
                        </div>
                        <span className={isCheckedIn ? "text-gray-300" : "text-gray-400"}>
                            <ChevronRight size={15} />
                        </span>
                    </div>

                    {/* Check-Out */}
                    <div
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${(!isCheckedIn || isCheckedOut)
                            ? "bg-gray-50 opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-50"
                            }`}
                        onClick={() => {
                            if (isCheckedIn && !isCheckedOut) {
                                setOpen(false);
                                checkOut();
                            }
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className={`h-5 w-5 ${(!isCheckedIn || isCheckedOut) ? "text-gray-400" : "text-gray-600"}`} />
                            <span className={`font-medium ${(!isCheckedIn || isCheckedOut) ? "text-gray-400" : "text-gray-900"}`}>
                                Check-Out
                            </span>
                        </div>
                        <span className={(!isCheckedIn || isCheckedOut) ? "text-gray-300" : "text-gray-400"}>
                            <ChevronRight size={15} />
                        </span>
                    </div>

                    {/* Cancel Reservation */}
                    <div className="flex items-center justify-between p-3 hover:bg-red-50 rounded-lg cursor-pointer transition-colors" onClick={() => {setOpen(false); cancelReservation()}}>
                        <div className="flex items-center gap-3">
                            <Trash2 className="h-5 w-5 text-red-600" />
                            <span className="font-medium text-red-600">Cancel Reservation</span>
                        </div>
                        <span className="text-red-400">
                            <ChevronRight size={15} />
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ChooseReservationOptionDialog
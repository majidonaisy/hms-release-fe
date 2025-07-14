import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import { LogIn, LogOut, CreditCard, Edit } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ChooseReservationOptionDialog = ({ 
    open, 
    setOpen, 
    title, 
    description, 
    checkIn, 
    checkOut, 
    addChargesRoute, 
    editReservationRoute,
    isCheckedIn = false,
    isCheckedOut = false
}: { 
    open: boolean
    setOpen: (open: boolean) => void
    title: string
    description: string
    checkIn: () => void
    checkOut: () => void
    addChargesRoute: string
    editReservationRoute: string
    isCheckedIn?: boolean
    isCheckedOut?: boolean
}) => {
    const navigate = useNavigate();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="md:min-w-4xl px-5">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {description}
                </DialogDescription>
                <div className="grid md:grid-cols-4 gap-5 px-10">
                    {/* Check In Card */}
                    <Card 
                        className={`text-center gap-1 transition-transform duration-300 ${
                            isCheckedIn 
                                ? "bg-gray-100 opacity-50 cursor-not-allowed" 
                                : "bg-hms-primary/15 hover:scale-105 cursor-pointer"
                        }`} 
                        onClick={() => { 
                            if (!isCheckedIn) {
                                setOpen(false); 
                                checkIn();
                            }
                        }}
                    >
                        <CardHeader>
                            <div className="flex justify-center">
                                <LogIn className={`h-12 w-12 ${isCheckedIn ? "text-gray-400" : "text-hms-primary"}`} />
                            </div>
                            <CardTitle className={`text-xl font-bold ${isCheckedIn ? "text-gray-400" : ""}`}>
                                Check In
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-1">
                            <span className={isCheckedIn ? "text-gray-400" : ""}>
                                {isCheckedIn ? "Guest already checked in" : "Process guest check-in for reservations"}
                            </span>
                        </CardContent>
                    </Card>

                    {/* Check Out Card */}
                    <Card 
                        className={`text-center gap-1 transition-transform duration-300 ${
                            !isCheckedIn || isCheckedOut
                                ? "bg-gray-100 opacity-50 cursor-not-allowed" 
                                : "bg-hms-primary/15 hover:scale-105 cursor-pointer"
                        }`} 
                        onClick={() => { 
                            if (isCheckedIn && !isCheckedOut) {
                                setOpen(false); 
                                checkOut();
                            }
                        }}
                    >
                        <CardHeader>
                            <div className="flex justify-center">
                                <LogOut className={`h-12 w-12 ${(!isCheckedIn || isCheckedOut) ? "text-gray-400" : "text-hms-primary"}`} />
                            </div>
                            <CardTitle className={`text-xl font-bold ${(!isCheckedIn || isCheckedOut) ? "text-gray-400" : ""}`}>
                                Check Out
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-1">
                            <span className={(!isCheckedIn || isCheckedOut) ? "text-gray-400" : ""}>
                                {!isCheckedIn 
                                    ? "Guest must be checked in first" 
                                    : isCheckedOut 
                                        ? "Guest already checked out" 
                                        : "Process guest check-out and finalize stay"
                                }
                            </span>
                        </CardContent>
                    </Card>

                    {/* Add Charges Card */}
                    <Card className="bg-hms-primary/15 text-center gap-1 transition-transform duration-300 hover:scale-105 cursor-pointer" onClick={() => { setOpen(false); navigate(addChargesRoute) }}>
                        <CardHeader>
                            <div className="flex justify-center">
                                <CreditCard className="h-12 w-12 text-hms-primary" />
                            </div>
                            <CardTitle className="text-xl font-bold">
                                Add Charges
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-1">
                            Add additional charges to guest account
                        </CardContent>
                    </Card>

                    {/* Edit/Delete Card */}
                    <Card className="bg-hms-primary/15 text-center gap-1 transition-transform duration-300 hover:scale-105 cursor-pointer" onClick={() => { setOpen(false); navigate(editReservationRoute) }}>
                        <CardHeader>
                            <div className="flex justify-center">
                                <Edit className="h-12 w-12 text-hms-primary" />
                            </div>
                            <CardTitle className="text-xl font-bold">
                                Edit/Delete
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-1">
                            Edit reservation details or cancel booking
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ChooseReservationOptionDialog
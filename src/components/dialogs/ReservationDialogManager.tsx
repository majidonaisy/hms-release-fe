import { useState } from "react"
import ChooseReservationOptionDialog from "./ChooseReservationOptionDialog"
import AddPaymentDialog from "./AddPaymentDialog"
import CheckInDialog from "./CheckInDialog"
import CheckOutDialog from "./CheckOutDialog"
import AddChargeDialog from "./AddChargeDialog"
import EditReservationDialog from "./EditReservationDialog"
import ViewPaymentsDialog from "./ViewPaymentsDialog"
import ViewReservationDialog from "./ViewReservationDialog"
import { Button } from "../atoms/Button"

export default function ReservationDialogManager() {
    const [isChooseOptionsOpen, setIsChooseOptionsOpen] = useState(true)
    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
    const [isCheckInOpen, setIsCheckInOpen] = useState(false)
    const [isCheckOutOpen, setIsCheckOutOpen] = useState(false)
    const [isAddChargeOpen, setIsAddChargeOpen] = useState(false)
    const [isEditReservationOpen, setIsEditReservationOpen] = useState(false)
    const [isViewPaymentsOpen, setIsViewPaymentsOpen] = useState(false)
    const [isViewReservationOpen, setIsViewReservationOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)

    const [currentReservationId, setCurrentReservationId] = useState<string | null>(null)
    const [currentGuestId, setCurrentGuestId] = useState<string | null>(null)
    const [currentRoomNumber, setCurrentRoomNumber] = useState<string | null>(null)
    const [currentRoomType, setCurrentRoomType] = useState<string | null>(null)
    const [currentCheckInDate, setCurrentCheckInDate] = useState<string | null>(null)
    const [currentCheckOutDate, setCurrentCheckOutDate] = useState<string | null>(null)
    const [currentStayDuration, setCurrentStayDuration] = useState<string | null>(null)
    const [isReservationCheckedIn, setIsReservationCheckedIn] = useState(false)
    const [isReservationCheckedOut, setIsReservationCheckedOut] = useState(false)
    const [currentGuestName, setCurrentGuestName] = useState<string | null>(null)
    const [currentBookingId, setCurrentBookingId] = useState<string | null>(null)

    const handleBackToChooseOptions = () => {
        setIsAddPaymentOpen(false)
        setIsCheckInOpen(false)
        setIsCheckOutOpen(false)
        setIsAddChargeOpen(false)
        setIsEditReservationOpen(false)
        setIsViewPaymentsOpen(false)
        setIsViewReservationOpen(false)
        setIsDeleteOpen(false)
        setIsChooseOptionsOpen(true) 
    }

    const openCheckInDialog = () => {
        setIsChooseOptionsOpen(false)
        setIsCheckInOpen(true)
    }
    const openCheckOutDialog = () => {
        setIsChooseOptionsOpen(false)
        setIsCheckOutOpen(true)
    }
    const openViewPaymentsDialog = () => {
        setIsChooseOptionsOpen(false)
        setIsViewPaymentsOpen(true)
    }
    const openAddChargesDialog = () => {
        setIsChooseOptionsOpen(false)
        setIsAddPaymentOpen(true)
    }
    const openEditReservationDialog = () => {
        setIsChooseOptionsOpen(false)
        setIsEditReservationOpen(true)
    }
    const openAddChargeDialog = () => {
        setIsChooseOptionsOpen(false)
        setIsAddChargeOpen(true)
    }
    const openCancelReservationDialog = () => {
        setIsChooseOptionsOpen(false)
        setIsDeleteOpen(true)
    }
    const openViewReservationDialog = () => {
        setIsChooseOptionsOpen(false)
        setIsViewReservationOpen(true)
    }

    const handleOpenChooseOptionsForReservation = (
        reservationId: string,
        guestId: string,
        roomNumber: string,
        roomType: string,
        checkInDate: string,
        checkOutDate: string,
        stayDuration: string,
        isCheckedIn: boolean,
        isCheckedOut: boolean,
        guestName: string,
        bookingId: string,
    ) => {
        setCurrentReservationId(reservationId)
        setCurrentGuestId(guestId)
        setCurrentRoomNumber(roomNumber)
        setCurrentRoomType(roomType)
        setCurrentCheckInDate(checkInDate)
        setCurrentCheckOutDate(checkOutDate)
        setCurrentStayDuration(stayDuration)
        setIsReservationCheckedIn(isCheckedIn)
        setIsReservationCheckedOut(isCheckedOut)
        setCurrentGuestName(guestName)
        setCurrentBookingId(bookingId)
        setIsChooseOptionsOpen(true)
    }

    return (
        <>
            <ChooseReservationOptionDialog
                open={isChooseOptionsOpen}
                setOpen={setIsChooseOptionsOpen}
                title="Choose Options"
                description="Select an action for the reservation."
                checkIn={openCheckInDialog}
                checkOut={openCheckOutDialog}
                viewPayments={openViewPaymentsDialog}
                addCharges={openAddChargesDialog}
                editReservation={openEditReservationDialog}
                addCharge={openAddChargeDialog}
                cancelReservation={openCancelReservationDialog}
                viewReservation={openViewReservationDialog}
                guestId={currentGuestId || undefined}
                roomNumber={currentRoomNumber || undefined}
                roomType={currentRoomType || undefined}
                checkInDate={currentCheckInDate || undefined}
                checkOutDate={currentCheckOutDate || undefined}
                stayDuration={currentStayDuration || undefined}
                isCheckedIn={isReservationCheckedIn}
                isCheckedOut={isReservationCheckedOut}
            />

            <AddPaymentDialog
                open={isAddPaymentOpen}
                setOpen={setIsAddPaymentOpen}
                reservationId={currentReservationId || undefined}
                onBackToChooseOptions={handleBackToChooseOptions}
            />

            <CheckInDialog
                open={isCheckInOpen}
                setOpen={setIsCheckInOpen}
                reservationId={currentReservationId || undefined}
                reservationData={undefined}
                onBackToChooseOptions={handleBackToChooseOptions}
            />

            <CheckOutDialog
                open={isCheckOutOpen}
                setOpen={setIsCheckOutOpen}
                reservationId={currentReservationId || undefined}
                reservationData={undefined} 
                onBackToChooseOptions={handleBackToChooseOptions}
            />

            <AddChargeDialog
                open={isAddChargeOpen}
                setOpen={setIsAddChargeOpen}
                reservationId={currentReservationId || ""}
                onBackToChooseOptions={handleBackToChooseOptions}
            />

            <EditReservationDialog
                open={isEditReservationOpen}
                setOpen={setIsEditReservationOpen}
                reservationData={undefined}
                onBackToChooseOptions={handleBackToChooseOptions}
            />

            <ViewPaymentsDialog
                open={isViewPaymentsOpen}
                setOpen={setIsViewPaymentsOpen}
                reservationId={currentReservationId || ""}
                guestName={currentGuestName || "N/A"}
                roomNumber={currentRoomNumber || "N/A"}
                bookingId={currentBookingId || "N/A"}
                onBackToChooseOptions={handleBackToChooseOptions}
            />

            <ViewReservationDialog
                open={isViewReservationOpen}
                setOpen={setIsViewReservationOpen}
                reservationId={currentReservationId || ""}
                onBackToChooseOptions={handleBackToChooseOptions}
            />

            {!isChooseOptionsOpen &&
                !isAddPaymentOpen &&
                !isCheckInOpen &&
                !isCheckOutOpen &&
                !isAddChargeOpen &&
                !isEditReservationOpen &&
                !isViewPaymentsOpen &&
                !isViewReservationOpen &&
                !isDeleteOpen && (
                    <div className="fixed bottom-4 right-4">
                        <Button
                            onClick={() =>
                                handleOpenChooseOptionsForReservation(
                                    currentReservationId || "",
                                    currentGuestId || "",
                                    currentRoomNumber || "",
                                    currentRoomType || "",
                                    currentCheckInDate || "",
                                    currentCheckOutDate || "",
                                    currentStayDuration || "",
                                    isReservationCheckedIn,
                                    isReservationCheckedOut,
                                    currentGuestName || "",
                                    currentBookingId || ""
                                )
                            }
                        >
                            Open Reservation Options (Demo)
                        </Button>
                    </div>
                )}
        </>
    )
}

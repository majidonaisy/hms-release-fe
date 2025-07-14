// Example of how to use the updated ChooseReservationOptionDialog with AddChargeDialog

import { useState } from 'react';
import ChooseReservationOptionDialog from '@/components/dialogs/ChooseReservationOptionDialog';
import AddChargeDialog from '@/components/dialogs/AddChargeDialog';

const ExampleUsage = () => {
    const [chooseOptionDialog, setChooseOptionDialog] = useState(false);
    const [addChargeDialog, setAddChargeDialog] = useState(false);
    const [reservationData, setReservationData] = useState({
        id: 'res-123',
        guestName: 'John Doe',
        roomType: 'Standard Room',
        roomNumber: '101',
        status: 'checked-in'
    });

    return (
        <>
            {/* Button to open the reservation options dialog */}
            <button onClick={() => setChooseOptionDialog(true)}>
                Open Reservation Options
            </button>

            {/* Choose Reservation Option Dialog with 5 options */}
            <ChooseReservationOptionDialog
                open={chooseOptionDialog}
                setOpen={setChooseOptionDialog}
                title="Reservation Actions"
                description="Choose an action to perform for this reservation"
                checkIn={() => console.log('Check in clicked')}
                checkOut={() => console.log('Check out clicked')}
                addCharges={() => console.log('Add charges clicked')}
                addCharge={() => setAddChargeDialog(true)} // Opens the simplified charge dialog
                editReservation={() => console.log('Edit reservation clicked')}
                isCheckedIn={reservationData.status === 'checked-in'}
                isCheckedOut={reservationData.status === 'checked-out'}
            />

            {/* Add Charge Dialog (Simplified) */}
            <AddChargeDialog
                open={addChargeDialog}
                setOpen={setAddChargeDialog}
                reservationId={reservationData.id}
                reservationData={{
                    guestName: reservationData.guestName,
                    reservationId: reservationData.id,
                    roomType: reservationData.roomType,
                    roomNumber: reservationData.roomNumber,
                    guestCount: {
                        adults: 2,
                        children: 0,
                    },
                    stayDates: {
                        checkIn: '2025-06-21',
                        checkOut: '2025-06-25',
                    },
                    bookingSource: 'Direct',
                }}
            />
        </>
    );
};

export default ExampleUsage;

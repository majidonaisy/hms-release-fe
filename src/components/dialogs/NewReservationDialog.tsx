import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import GroupReservation from '@/assets/GroupReservation.svg'
import IndividualReservation from '@/assets/IndividualReservation.svg'
import { useNavigate } from "react-router-dom"

const NewReservationDialog = ({
    open,
    setOpen
}: {
    open: boolean
    setOpen: (open: boolean) => void
}) => {
    const navigate = useNavigate();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="md:min-w-3xl px-5">
                <DialogHeader>
                    <DialogTitle>New Reservation</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Select Reservation Type
                </DialogDescription>
                <div className="grid md:grid-cols-2 gap-5 px-10">
                    <Card className="bg-hms-primary/15 text-center gap-1 transition-transform duration-300 hover:scale-105 cursor-pointer" onClick={() => { setOpen(false); navigate('/new-individual-reservation') }}>
                        <CardHeader>
                            <div className="flex justify-center">
                                <img src={IndividualReservation} />
                            </div>
                            <CardTitle className="text-xl font-bold">
                                Individual
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-1">
                            Book a room for one guest
                        </CardContent>
                    </Card>
                    <Card className="bg-hms-primary/15 text-center gap-1 transition-transform duration-300 hover:scale-105 cursor-pointer">
                        <CardHeader>
                            <div className="flex justify-center">
                                <img src={GroupReservation} />
                            </div>
                            <CardTitle className="text-xl font-bold">
                                Group
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-1">
                            Book multiple rooms under a single reservation
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default NewReservationDialog

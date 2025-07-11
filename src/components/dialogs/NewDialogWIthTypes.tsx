import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog"
import { DialogDescription } from "@radix-ui/react-dialog"
import GroupReservation from '@/assets/GroupReservation.svg'
import IndividualReservation from '@/assets/IndividualReservation.svg'
import { useNavigate } from "react-router-dom"

const NewDialogsWithTypes = ({
    open,
    setOpen,
    title,
    description,
    textOne,
    textTwo,
    individualRoute,
    groupRoute,
}: {
    open: boolean
    setOpen: (open: boolean) => void
    title: string
    description: string,
    textOne: string,
    textTwo: string,
    individualRoute: string;
    groupRoute: string;
}) => {
    const navigate = useNavigate();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="md:min-w-3xl px-5">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {description}
                </DialogDescription>
                <div className="grid md:grid-cols-2 gap-5 px-10">
                    <Card className="bg-hms-primary/15 text-center gap-1 transition-transform duration-300 hover:scale-105 cursor-pointer" onClick={() => { setOpen(false); navigate(individualRoute) }}>
                        <CardHeader>
                            <div className="flex justify-center">
                                <img src={IndividualReservation} />
                            </div>
                            <CardTitle className="text-xl font-bold">
                                Individual
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-1">
                            {textOne}
                        </CardContent>
                    </Card>
                    <Card className="bg-hms-primary/15 text-center gap-1 transition-transform duration-300 hover:scale-105 cursor-pointer" onClick={() => { setOpen(false); navigate(groupRoute) }}>
                        <CardHeader>
                            <div className="flex justify-center">
                                <img src={GroupReservation} />
                            </div>
                            <CardTitle className="text-xl font-bold">
                                Group
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-1">
                            {textTwo}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default NewDialogsWithTypes

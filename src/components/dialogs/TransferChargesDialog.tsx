import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../Organisms/Dialog";
import { Button } from "@/components/atoms/Button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/molecules/Select";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Label } from "@/components/atoms/Label";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
    CheckInReservations,
    TransferItemsResponse,
} from "@/validation";
import { getCheckedInReservations } from "@/services/Reservation";
import { getTransferItems } from "@/services/Charges";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { transferCharges } from "@/services/Charges";
import { TransferChargesRequestSchema } from "@/validation";

interface TransferChargesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reservationId: string;
    onBackToChooseOptions: () => void;
}

const TransferChargesDialog = ({
    open,
    onOpenChange,
    reservationId,
    onBackToChooseOptions,
}: TransferChargesDialogProps) => {
    const [reservations, setReservations] =
        useState<CheckInReservations["data"]>([]);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<TransferItemsResponse["data"]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedReservation, setSelectedReservation] = useState<string>("");

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await getCheckedInReservations();
            setReservations(response.data);
        } catch (error: any) {
            toast.error(error.userMessage || "Failed to get reservations");
        } finally {
            setLoading(false);
        }
    };

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await getTransferItems(reservationId);
            setItems(response);
        } catch (error: any) {
            toast.error(error.userMessage || "Failed to get items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchReservations();
            fetchItems();
            setSelectedItems([]);
            setSelectedReservation("");
        }
    }, [open]);

    const toggleItem = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleTransfer = async () => {
        if (!selectedReservation) {
            toast.error("Please select a reservation to transfer to.");
            return;
        }
        if (selectedReservation === reservationId) {
            toast.error("Cannot transfer to the same reservation.");
            return;
        }
        if (selectedItems.length === 0) {
            toast.error("Please select at least one item to transfer.");
            return;
        }

        // Prepare data
        const data = {
            fromReservation: reservationId,
            toReservation: selectedReservation,
            items: selectedItems,
        };

        // Validate data using schema
        const parsed = TransferChargesRequestSchema.safeParse(data);
        if (!parsed.success) {
            toast.error("Invalid data for transfer.");
            return;
        }

        try {
            setLoading(true);
            await transferCharges(parsed.data);
            toast.success("Charges transferred successfully!");
            // Reset state and close dialog
            setSelectedItems([]);
            setSelectedReservation("");
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.userMessage || "Transfer failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="space-y-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <DialogHeader className="flex flex-row items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBackToChooseOptions}
                        aria-label="Back"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <DialogTitle className="text-lg">Transfer Charges</DialogTitle>
                </DialogHeader>

                {/* Reservation Selection */}
                <div className="space-y-1">
                    <Label htmlFor="reservation" className="text-sm text-muted-foreground">
                        Choose Reservation
                    </Label>
                    <Select onValueChange={setSelectedReservation} value={selectedReservation}>
                        <SelectTrigger id="reservation" className="w-full">
                            <SelectValue placeholder="Select a reservation" />
                        </SelectTrigger>
                        <SelectContent>
                            {reservations.length > 0 ? (
                                reservations.map((res) => (
                                    <SelectItem key={res.id} value={res.id}>
                                        {res.rooms.map((room) => room.roomNumber).join(", ")}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-sm text-muted-foreground">
                                    No checked-in reservations
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Transferable Items */}
                <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Choose What to Transfer</Label>
                    {items.length > 0 ? (
                        <div className="grid gap-2">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "flex items-center space-x-3 rounded-md border px-3 py-2 transition-colors",
                                        selectedItems.includes(item.id)
                                            ? "bg-muted border-hms-primary"
                                            : "hover:bg-muted"
                                    )}
                                >
                                    <Checkbox
                                        id={item.id}
                                        checked={selectedItems.includes(item.id)}
                                        onCheckedChange={() => toggleItem(item.id)}
                                        className="data-[state=checked]:bg-hms-primary"
                                    />
                                    <Label htmlFor={item.id} className="cursor-pointer">
                                        {item.itemType}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No items to transfer</p>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="pt-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleTransfer}
                        disabled={
                            loading || !selectedReservation || selectedItems.length === 0 || selectedReservation === reservationId
                        }
                    >
                        {loading ? "Transferring..." : "Transfer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TransferChargesDialog;

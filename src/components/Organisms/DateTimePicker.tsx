import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Label } from "../atoms/Label";
import { Popover, PopoverContent, PopoverTrigger } from "../molecules/Popover";
import { Button } from "../atoms/Button";
import { Calendar } from "../molecules/Calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../molecules/Select";

interface DateTimePickerProps {
    date?: Date;
    onDateTimeChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: (date: Date) => boolean;
    className?: string;
    label?: string;
}

export function DateTimePicker({
    date,
    onDateTimeChange,
    placeholder = "Pick a date and time",
    disabled,
    className = "",
    label
}: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
    const [timeValue, setTimeValue] = useState<string>(
        date ? format(date, "HH:mm") : "15:00" // Default to 3 PM
    );

    const handleDateSelect = (newDate: Date | undefined) => {
        if (!newDate) {
            setSelectedDate(undefined);
            onDateTimeChange?.(undefined);
            return;
        }

        // Parse the time string and apply it to the new date
        const [hours, minutes] = timeValue.split(':').map(Number);
        const dateWithTime = new Date(newDate);
        dateWithTime.setHours(hours, minutes, 0, 0);

        setSelectedDate(dateWithTime);
        onDateTimeChange?.(dateWithTime);
    };

    const handleTimeChange = (newTime: string) => {
        setTimeValue(newTime);

        if (selectedDate) {
            const [hours, minutes] = newTime.split(':').map(Number);
            const dateWithTime = new Date(selectedDate);
            dateWithTime.setHours(hours, minutes, 0, 0);

            setSelectedDate(dateWithTime);
            onDateTimeChange?.(dateWithTime);
        }
    };

    // Generate time options (every 30 minutes)
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const displayTime = format(new Date(2000, 0, 1, hour, minute), 'h:mm a');
                options.push({ value: timeString, label: displayTime });
            }
        }
        return options;
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <Label>{label}</Label>}
            <div className="flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={`flex-1 justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"
                                }`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                                format(selectedDate, "PPP 'at' h:mm a")
                            ) : (
                                <span>{placeholder}</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-3">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                disabled={disabled}
                                initialFocus
                            />
                            <div className="mt-3 border-t pt-3">
                                <Label className="text-sm font-medium">Time</Label>
                                <Select value={timeValue} onValueChange={handleTimeChange}>
                                    <SelectTrigger className="w-full mt-1">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {generateTimeOptions().map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}

// Demo component showing how to use it
export default function DateTimePickerDemo() {
    const [checkIn, setCheckIn] = useState<Date>();
    const [checkOut, setCheckOut] = useState<Date>();

    return (
        <div className="max-w-md mx-auto p-6 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Reservation Date & Time</h2>

            <DateTimePicker
                label="Check In"
                date={checkIn}
                onDateTimeChange={setCheckIn}
                placeholder="Select check-in date and time"
                disabled={(date) => date < new Date()}
            />

            <DateTimePicker
                label="Check Out"
                date={checkOut}
                onDateTimeChange={setCheckOut}
                placeholder="Select check-out date and time"
                disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (date < today) return true;
                    if (checkIn && date <= checkIn) return true;
                    return false;
                }}
            />

            {checkIn && checkOut && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Selected Dates:</h3>
                    <p className="text-sm">
                        <strong>Check In:</strong> {format(checkIn, "PPP 'at' h:mm a")}
                    </p>
                    <p className="text-sm">
                        <strong>Check Out:</strong> {format(checkOut, "PPP 'at' h:mm a")}
                    </p>
                    <p className="text-sm mt-2">
                        <strong>Duration:</strong> {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                </div>
            )}
        </div>
    );
}
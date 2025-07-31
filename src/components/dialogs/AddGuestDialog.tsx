import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Avatar, AvatarFallback } from '@/components/atoms/Avatar';
import { Search, Plus, Check } from 'lucide-react';
import { GetGuestsResponse, Guest } from '@/validation';
import { ScrollArea } from '../atoms/ScrollArea';
import { useDebounce } from '@/hooks/useDebounce';
import { searchGuests } from '@/services/Guests';

interface GuestSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGuestSelect?: (guests: Guest[]) => void;
    onNewGuestProfile?: () => void;
    guestsData: Guest[]
}

export const GuestSelectionDialog: React.FC<GuestSelectionDialogProps> = ({
    open,
    onOpenChange,
    onGuestSelect,
    onNewGuestProfile,
}) => {
    const [selectedGuests, setSelectedGuests] = useState<Guest[]>([]);
    const [guestSearch, setGuestSearch] = useState("");
    const [guestSearchLoading, setGuestSearchLoading] = useState(false);
    const debouncedGuestSearch = useDebounce(guestSearch, 400);
    const [guests, setGuests] = useState<GetGuestsResponse['data']>([]);

    useEffect(() => {
        const handleGetGuests = async () => {
            setGuestSearchLoading(true);
            try {
                const response = ((await searchGuests({
                    q: debouncedGuestSearch,

                })) as GetGuestsResponse)
                setGuests(response.data)
            } catch (error) {
                console.error(error)
            } finally {
                setGuestSearchLoading(false)
            }
        }
        handleGetGuests()
    }, [debouncedGuestSearch])

    const handleGuestToggle = (guest: Guest): void => {
        setSelectedGuests(prev => {
            const isSelected = prev.some(g => g.id === guest.id);
            if (isSelected) {
                return prev.filter(g => g.id !== guest.id);
            } else {
                return [...prev, guest];
            }
        });
    };

    const handleDone = (): void => {
        onGuestSelect?.(selectedGuests);
        setSelectedGuests([]);
        onOpenChange(false);
    };

    const getInitials = (firstName: string, lastName: string): string => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0">
                <div className='bg-hms-accent/15 p-6'>
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle>Add guest</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Search Input */}
                        <div className="relative mt-3 border border- rounded-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                className="pl-10 bg-white"
                                placeholder="Search guests..."
                                value={guestSearch}
                                onChange={e => setGuestSearch(e.target.value)}
                            />
                        </div>

                        <ScrollArea className='h-[200px]'>
                            <div className="overflow-y-auto space-y-2">
                                {guestSearchLoading ? (
                                    <div className="flex justify-center rounded-lg py-8 text-gray-500 bg-white h-[200px] items-center">
                                        Loading...
                                    </div>
                                ) : guests.length === 0 ? (
                                    <div className="flex justify-center rounded-lg py-8 text-gray-500 bg-white h-[200px] items-center">
                                        No guests found.
                                    </div>
                                ) : (
                                    guests.map((guest) => {
                                        const isSelected = selectedGuests.some(g => g.id === guest.id);
                                        return (
                                            <div key={guest.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-sm">
                                                            {getInitials(guest.firstName, guest.lastName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-sm">{guest.firstName} {guest.lastName}</p>
                                                        <p className="text-xs">{guest.email}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="background"
                                                    size="icon"
                                                    onClick={() => handleGuestToggle(guest)}
                                                    className={`h-8 w-8 cursor-pointer ${isSelected ? 'bg-white text-hms-accent border border-hms-accent hover:text-white' : ''}`}
                                                >
                                                    {isSelected ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : (
                                                        <Plus className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </ScrollArea>

                        <DialogFooter className='grid justify-center sm:justify-center'>
                            <Button
                                onClick={onNewGuestProfile}
                                className=""
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                New Guest Profile
                            </Button>

                            {selectedGuests.length > 0 && (
                                <Button onClick={handleDone} className="">
                                    Done ({selectedGuests.length})
                                </Button>
                            )}
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Avatar, AvatarFallback } from '@/components/atoms/Avatar';
import { Search, Plus, Check } from 'lucide-react';
import { Guest } from '@/validation';
import { ScrollArea } from '../atoms/ScrollArea';

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
    guestsData,
}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
    const [selectedGuests, setSelectedGuests] = useState<Guest[]>([]);

    // Filter guests based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredGuests(guestsData);
        } else {
            const filtered = guestsData.filter(guest =>
                guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guest.lastName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredGuests(filtered);
        }
    }, [searchTerm, guestsData]);

    // Initialize filtered guests when dialog opens
    useEffect(() => {
        if (open) {
            setFilteredGuests(guestsData);
        }
    }, [open, guestsData]);

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
        setSearchTerm('');
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
                                placeholder="Search by first name or last name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white"
                            />
                        </div>

                        {/* Selected Guests (when searching) */}
                        {searchTerm && selectedGuests.length > 0 && (
                            <div className="space-y-2 ">
                                {selectedGuests.map((guest) => (
                                    <div key={guest.id} className="flex items-center justify-between p-3  rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-sm">
                                                    {getInitials(guest.firstName, guest.lastName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{guest.firstName} {guest.lastName}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}``
                            </div>
                        )}

                        {/* Guest List */}
                        <ScrollArea className='h-[200px]'>
                            <div className="overflow-y-auto space-y-2">
                                {filteredGuests.length === 0 ? (
                                    <div className="flex justify-center rounded-lg py-8 text-gray-500 bg-white h-[200px] items-center"> 
                                        {searchTerm ? 'No guest found' : 'No guests available'}
                                    </div>
                                ) : (
                                    filteredGuests.map((guest) => {
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
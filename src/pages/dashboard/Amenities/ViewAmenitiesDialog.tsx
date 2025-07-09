import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/Organisms/Dialog';
import { Amenity } from '@/validation/schemas/amenity';
import { useEffect, useState } from 'react';
import { getAmenities, deleteAmenity } from '@/services/Amenities';
import { AlertCircle, Loader2, Trash2, Search, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Input } from '@/components/atoms/Input';
import { ScrollArea } from '@/components/atoms/ScrollArea';
import DeleteDialog from '@/components/molecules/DeleteDialog';
import { format } from 'date-fns';

interface ViewAmenitiesDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAmenityDeleted?: () => void;
}

export const ViewAmenitiesDialog = ({ isOpen, onOpenChange, onAmenityDeleted }: ViewAmenitiesDialogProps) => {
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [filteredAmenities, setFilteredAmenities] = useState<Amenity[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchAmenities = async () => {
        try {
            setLoading(true);
            // We use pagination to ensure we get all amenities
            const response = await getAmenities({ page: 1, limit: 100 });
            setAmenities(response.data);
            setFilteredAmenities(response.data);
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to load amenities');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchAmenities();
        }
    }, [isOpen]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredAmenities(amenities);
        } else {
            const filtered = amenities.filter(amenity =>
                amenity.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredAmenities(filtered);
        }
    }, [searchQuery, amenities]);

    const handleDelete = async (id: string) => {
        if (!id) return;

        try {
            setDeleteLoading(true);
            await deleteAmenity(id);
            setConfirmDelete(null);
            toast.success('Amenity deleted successfully');
            fetchAmenities();
            if (onAmenityDeleted) onAmenityDeleted();
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to delete amenity');
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return 'Invalid date';
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>All Amenities</DialogTitle>
                        <DialogDescription>
                            View and manage all amenities available in your hotel.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Search bar */}
                    <div className="relative mt-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search amenities..."
                            className="pl-9 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2 text-gray-600">Loading amenities...</span>
                        </div>
                    ) : (
                        <ScrollArea className="h-[400px]">
                            {filteredAmenities.length === 0 ? (
                                <div className="py-8 flex flex-col items-center justify-center text-gray-500">
                                    {searchQuery ? (
                                        <>
                                            <AlertCircle className="mb-2 h-10 w-10 text-gray-400" />
                                            <p>No amenities match your search</p>
                                        </>
                                    ) : (
                                        <>
                                            <Info className="mb-2 h-10 w-10 text-gray-400" />
                                            <p>No amenities found</p>
                                            <Button
                                                onClick={() => {
                                                    onOpenChange(false);
                                                    setTimeout(() => document.getElementById('new-amenity-button')?.click(), 100);
                                                }}
                                                className="mt-4"
                                            >
                                                Add your first amenity
                                            </Button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="w-24 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAmenities.map((amenity) => (
                                            <TableRow key={amenity.id}>
                                                <TableCell className="font-medium">{amenity.name}</TableCell>
                                                <TableCell className="text-gray-500">{formatDate(amenity.createdAt)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setConfirmDelete(amenity.id)}
                                                        className="hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                        <span className="sr-only ml-2">Delete</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </ScrollArea>
                    )}

                    <div className="flex justify-between mt-4">
                        <div className="text-sm text-gray-500">
                            {!loading && `Showing ${filteredAmenities.length} of ${amenities.length} amenities`}
                        </div>
                        <Button variant="background" onClick={() => onOpenChange(false)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <DeleteDialog
                isOpen={!!confirmDelete}
                onConfirm={() => handleDelete(confirmDelete!)}
                onCancel={() => setConfirmDelete(null)}
                title="Delete Amenity"
                description="Are you sure you want to delete this amenity? This action cannot be undone."
                loading={deleteLoading}
            />
        </>
    );
};

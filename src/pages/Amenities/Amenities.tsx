import { useEffect, useState } from 'react';
import { Amenity } from '@/validation/schemas/amenity';
import { deleteAmenity, getAmenities, addAmenity, updateAmenity } from '@/services/Amenities';
import DataTable, { ActionMenuItem, TableColumn } from '@/components/Templates/DataTable';
import { format } from 'date-fns';
import NewAmenityDialog from './NewAmenityDialog';

const Amenities = () => {
    const [newAmenityDialogOpen, setNewAmenityDialogOpen] = useState<boolean>(false);
    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchAmenities = async () => {
        try {
            setLoading(true);
            const response = await getAmenities();
            setAmenities(response.data);
        } catch (error: any) {
            console.error('Error fetching amenities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAmenities();
    }, []);

    const handleDeleteAmenity = async (amenity: Amenity) => {
        try {
            await deleteAmenity(amenity.id);
            await fetchAmenities(); // Refresh the amenities list
        } catch (error) {
            console.error('Error deleting amenity:', error);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return 'Invalid date';
        }
    };

    const amenityColumns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true, className: 'font-medium text-gray-900' },
        {
            key: 'createdAt',
            label: 'Created On',
            render: (item) => formatDate(item.createdAt),
            className: 'text-gray-600'
        },
    ];

    const amenityActions: ActionMenuItem[] = [
        {
            label: 'Edit',
            onClick: (amenity, e) => {
                e.stopPropagation();
                setEditingAmenity(amenity as Amenity);
                setNewAmenityDialogOpen(true);
            }
        },
        {
            label: 'Delete',
            onClick: (amenity, e) => {
                e.stopPropagation();
                // The delete action is handled by the deleteConfig in DataTable
            }
        }
    ];

    const handleSaveAmenity = async (data: { name: string }) => {
        try {
            if (editingAmenity) {
                // We're in edit mode, so update the existing amenity
                await updateAmenity(editingAmenity.id, data);
                // Update the amenity in the local state to avoid refetching
                setAmenities(prev =>
                    prev.map(amenity =>
                        amenity.id === editingAmenity.id
                            ? { ...amenity, name: data.name }
                            : amenity
                    )
                );
            } else {
                // We're in create mode, so add a new amenity
                await addAmenity(data);
                // Refresh the list to show the new amenity
                await fetchAmenities();
            }
            setNewAmenityDialogOpen(false);
            setEditingAmenity(null);
        } catch (error: any) {
            console.error('Error saving amenity:', error);
            throw error;
        }
      };

    const handleDialogClose = () => {
        setNewAmenityDialogOpen(false);
        setEditingAmenity(null);
        fetchAmenities(); // Refresh amenities when dialog closes (in case of updates)
    };

    return (
        <>
            <DataTable
                data={amenities}
                loading={loading}
                columns={amenityColumns}
                title="Amenities"
                actions={amenityActions}
                primaryAction={{
                    label: 'New Amenity',
                    onClick: () => {
                        setEditingAmenity(null);
                        setNewAmenityDialogOpen(true);
                    }
                }}
                getRowKey={amenity => amenity.id}
                filter={{
                    searchPlaceholder: 'Search amenities',
                    searchFields: ['name']
                }}
                emptyStateMessage="No amenities found."
                deleteConfig={{
                    onDelete: handleDeleteAmenity,
                    getDeleteTitle: () => 'Delete Amenity',
                    getDeleteDescription: (amenity) => {
                        // Safely check if amenity exists and has a name property
                        const amenityName = amenity && (amenity as Amenity).name;
                        return `Are you sure you want to delete "${amenityName || 'this amenity'}"? This action cannot be undone.`;
                    },
                    getItemName: (amenity) => (amenity as Amenity)?.name || 'Amenity'
                }}
            />
            <NewAmenityDialog
                isOpen={newAmenityDialogOpen}
                onCancel={handleDialogClose}
                onConfirm={handleSaveAmenity}
                editingAmenity={editingAmenity}
            />
        </>
    );
};

export default Amenities;
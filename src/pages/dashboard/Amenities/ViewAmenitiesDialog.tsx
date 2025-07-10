import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAmenities, deleteAmenity } from '@/services/Amenities';
import { format } from 'date-fns';
import { AmenityResponse, Amenity } from '@/validation/schemas/amenity';
import { useDialog } from '@/context/useDialog';
import DataTable, { TableColumn } from '@/components/Templates/DataTable';

const Amenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const { openDialog } = useDialog();

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const response: AmenityResponse = await getAmenities({ page: 1, limit: 100 });
      if (response && response.status === 200) {
        setAmenities(response.data || []);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      toast.error(error.userMessage || 'Failed to load amenities');
      console.error(error);
      // Set an empty data array to prevent undefined errors
      setAmenities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleAddAmenity = () => {
    console.log('handleAddAmenity called'); // Debug log
    openDialog('amenity', {
      onAmenityAdded: async () => {
        try {
          await fetchAmenities();
          return Promise.resolve();
        } catch (error) {
          console.error('Error refreshing amenities:', error);
          return Promise.reject(error);
        }
      }
    });
    console.log('openDialog called for amenity'); // Debug log
  };

  const handleEditAmenity = (amenity: Amenity) => {
    openDialog('amenity', {
      editData: amenity,
      onAmenityAdded: async () => {
        try {
          await fetchAmenities();
          return Promise.resolve();
        } catch (error) {
          console.error('Error refreshing amenities:', error);
          return Promise.reject(error);
        }
      }
    });
  };

  const handleDeleteAmenity = (amenity: Amenity): Promise<void> => {
    return new Promise((resolve, reject) => {
      openDialog('delete', {
        title: 'Delete Amenity',
        description: `Are you sure you want to delete "${amenity.name}"? This action cannot be undone.`,
        onConfirm: async () => {
          try {
            await deleteAmenity(amenity.id);
            toast.success('Amenity deleted successfully');
            await fetchAmenities();
            resolve();
          } catch (error: any) {
            toast.error(error.userMessage || 'Failed to delete amenity');
            reject(error);
          }
        }
      });
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const amenityColumns: TableColumn<Amenity>[] = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      render: (item: Amenity) => formatDate(item.createdAt),
    }
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (item: Amenity, e: React.MouseEvent) => {
        e.stopPropagation();
        handleEditAmenity(item);
      },
    }
  ];

  return (
    <div className="p-6">
      <DataTable
        data={amenities}
        loading={loading}
        columns={amenityColumns}
        title="Amenities"
        getRowKey={(item: Amenity) => item.id}
        actions={actions}
        primaryAction={{
          label: 'Add Amenity',
          onClick: handleAddAmenity
        }}
        deleteConfig={{
          onDelete: handleDeleteAmenity,
          getItemName: (item: Amenity | null) => item ? item.name : 'this amenity',
        }}
      />
    </div>
  );
};

export default Amenities;
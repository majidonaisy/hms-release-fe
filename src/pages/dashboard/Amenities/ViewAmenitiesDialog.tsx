import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAmenities, deleteAmenity } from '@/services/Amenities';
import { format } from 'date-fns';
import { Amenity } from '@/validation/schemas/amenity';
import { useDialog } from '@/context/useDialog';
import DataTable, { TableColumn } from '@/components/Templates/DataTable';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';

const Amenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const { openDialog } = useDialog();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const fetchAmenities = async () => {
    setLoading(true)
    try {
      const params: any = {
        page: currentPage,
        limit: pageSize
      };

      if (debouncedSearchTerm.trim()) {
        params.q = debouncedSearchTerm;
      }

      const response = await getAmenities(params);
      setAmenities(response.data);

      // if (response.status) {
      //   setPagination(response.pagination);
      // } else {
      //   setPagination(null);
      // }
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
  }, [debouncedSearchTerm, currentPage, pageSize]);

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

  const handleDeleteAmenity = async (amenity: Amenity): Promise<void> => {
    try {
      await deleteAmenity(amenity.id);
      toast.success('Amenity deleted successfully');
      await fetchAmenities();
    } catch (error: any) {
      toast.error(error.userMessage || 'Failed to delete amenity');
      throw error; // Re-throw to let DataTable handle the error state
    }
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
    <DataTable
      data={amenities}
      searchLoading={loading}
      columns={amenityColumns}
      title="Amenities"
      getRowKey={(item: Amenity) => item.id}
      actions={actions}
      primaryAction={{
        label: 'Add Amenity',
        onClick: handleAddAmenity,
        action: "create",
        subject: "Amenity"
      }}
      deleteConfig={{
        onDelete: handleDeleteAmenity,
        getDeleteTitle: () => 'Delete Amenity',
        getDeleteDescription: (item: Amenity | null) => item ? `Are you sure you want to delete "${item.name}"? This action cannot be undone.` : 'Are you sure you want to delete this amenity? This action cannot be undone.',
        getItemName: (item: Amenity | null) => item ? item.name : 'this amenity',
      }}
      showBackButton
      onBackClick={() => navigate(-1)}
      onSearch={handleSearch}
    />
  );
};

export default Amenities;
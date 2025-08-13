import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getRoomTypes, deleteRoomType, updateRoomType, addRoomType } from '@/services/RoomTypes';
import DataTable, { TableColumn } from '@/components/Templates/DataTable';
import { useDialog } from '@/context/useDialog';
import { AddRoomTypeRequest, RoomType } from '@/validation/schemas/RoomType';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';

const RoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const { openDialog } = useDialog();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (debouncedSearchTerm.trim()) {
        params.q = debouncedSearchTerm;
      }
      const response = await getRoomTypes(params);
      setRoomTypes(response.data || []);
    } catch (error: any) {
      toast.error(error.userMessage || 'Failed to load room types');
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, [debouncedSearchTerm]);

  const handleAddRoomType = () => {
    openDialog('roomType', {
      onConfirm: async (data: AddRoomTypeRequest) => {
        try {
          await addRoomType(data);
          toast.success('Room type added successfully');
          await fetchRoomTypes();
          return Promise.resolve();
        } catch (error: any) {
          toast.error(error.userMessage || 'Failed to add room type');
          return Promise.reject(error);
        }
      }
    });
  };

  const handleEditRoomType = (roomType: RoomType) => {
    openDialog('roomType', {
      editData: roomType,
      onConfirm: async (data: AddRoomTypeRequest) => {
        try {
          await updateRoomType(roomType.id, data);
          toast.success('Room type updated successfully');
          await fetchRoomTypes();
          return Promise.resolve();
        } catch (error: any) {
          toast.error(error.userMessage || 'Failed to update room type');
          return Promise.reject(error);
        }
      }
    });
  };

  const handleDeleteRoomType = async (roomType: RoomType): Promise<void> => {
    try {
      await deleteRoomType(roomType.id);
      toast.success('Room type deleted successfully');
      await fetchRoomTypes();
    } catch (error: any) {
      toast.error(error.userMessage || 'Failed to delete room type');
      throw error; // Re-throw to let DataTable handle the error state
    }
  };

  const roomTypeColumns: TableColumn<RoomType>[] = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'description',
      label: 'Description',
      render: (item: RoomType) => (
        <div className="max-w-[300px] truncate" title={item.description}>
          {item.description || 'No description'}
        </div>
      ),
    },
    {
      key: 'occupancy',
      label: 'Occupancy',
      render: (item: RoomType) => (
        <div className="text-sm">
          <div className="font-medium">Max: {item.maxOccupancy}</div>
          <div className="text-gray-600">
            Adults: {item.adultOccupancy} | Children: {item.childOccupancy}
          </div>
        </div>
      ),
    },
    {
      key: 'baseRate',
      label: 'Base Rate',
      render: (item: RoomType) => (
        <div className="font-medium">
          ${item.baseRate}
        </div>
      ),
    }
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (item: RoomType, e: React.MouseEvent) => {
        e.stopPropagation();
        handleEditRoomType(item);
      },
      action: "update",
      subject: "RoomType"
    }
  ];

  return (
    <DataTable
      data={roomTypes}
      onSearch={handleSearch}
      searchLoading={loading}
      columns={roomTypeColumns}
      title="Room Types"
      actions={actions}
      primaryAction={{
        label: 'Add Room Type',
        onClick: handleAddRoomType,
        action: "create",
        subject: "RoomType"
      }}
      getRowKey={(item: RoomType) => item.id}
      deleteConfig={{
        onDelete: handleDeleteRoomType,
        getDeleteTitle: () => 'Delete Room Type',
        getDeleteDescription: (item: RoomType | null) => item ? `Are you sure you want to delete "${item.name}"? This action cannot be undone.` : 'Are you sure you want to delete this room type? This action cannot be undone.',
        getItemName: (item: RoomType | null) => item ? item.name : 'this room type',
        action: "delete",
        subject: "RoomType"
      }}
      showBackButton
      onBackClick={() => navigate(-1)}
    />
  );
};

export default RoomTypes;
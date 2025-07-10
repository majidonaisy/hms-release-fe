import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getRoomTypes, deleteRoomType, updateRoomType, addRoomType } from '@/services/RoomTypes';
import DataTable, { TableColumn } from '@/components/Templates/DataTable';
import { useDialog } from '@/context/useDialog';
import { GetRoomTypesResponse, AddRoomTypeRequest } from '@/validation/schemas/RoomType';

interface RoomType {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
  baseRate?: string;
  isActive?: boolean;
  [key: string]: any;
}

const RoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const { openDialog } = useDialog();

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const response = await getRoomTypes();
      setRoomTypes(response.data || []);
    } catch (error: any) {
      toast.error(error.userMessage || 'Failed to load room types');
      console.error(error);
      setRoomTypes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

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
      key: 'capacity',
      label: 'Capacity',
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (item: RoomType) => (
        <div className={`px-2 py-1 rounded-full text-xs inline-block ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {item.isActive ? 'Active' : 'Inactive'}
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
    }
  ];

  return (
    <div className="p-6">
      <DataTable
        data={roomTypes}
        loading={loading}
        columns={roomTypeColumns}
        title="Room Types"
        actions={actions}
        primaryAction={{
          label: 'Add Room Type',
          onClick: handleAddRoomType
        }}
        getRowKey={(item: RoomType) => item.id}
        
        deleteConfig={{
          onDelete: handleDeleteRoomType,
          getDeleteTitle: () => 'Delete Room Type',
          getDeleteDescription: (item: RoomType | null) => item ? `Are you sure you want to delete "${item.name}"? This action cannot be undone.` : 'Are you sure you want to delete this room type? This action cannot be undone.',
          getItemName: (item: RoomType | null) => item ? item.name : 'this room type',
        }}
      />
    </div>
  );
};

export default RoomTypes;
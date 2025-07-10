import { useEffect, useState } from 'react';
import type { RoomType, AddRoomTypeRequest } from '@/validation';
import { addRoomType, deleteRoomType, getRoomTypes } from '@/services/RoomTypes';
import DataTable, { ActionMenuItem, TableColumn } from '@/components/Templates/DataTable';
import NewRoomTypeDialog from './NewRoomTypeDialog';

const RoomTypes = () => {
  const [newRoomTypeDialogOpen, setNewRoomTypeDialogOpen] = useState<boolean>(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const response = await getRoomTypes();
      setRoomTypes(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleDeleteRoomType = async (roomType: RoomType) => {
    try {
      await deleteRoomType(roomType.id);
      await fetchRoomTypes(); // Refresh the room types list
    } catch (error) {
      console.error('Error deleting room type:', error);
    }
  };

  const roomTypeColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, className: 'font-medium text-gray-900' },
    { key: 'maxOccupancy', label: 'Max Occupancy', sortable: true, className: 'text-gray-600' },
    { key: 'baseRate', label: 'Base Rate', sortable: true, className: 'text-gray-600' },
    {
      key: 'occupancy',
      label: 'Occupancy Details',
      render: (item) => (
        <div className="text-gray-600">
          <p>Adult: {item.adultOccupancy}</p>
          <p>Child: {item.childOccupancy}</p>
        </div>
      ),
      className: 'text-gray-600'
    }
  ];

  const roomTypeActions: ActionMenuItem[] = [
    {
      label: 'Edit',
      onClick: (roomType, e) => {
        e.stopPropagation();
        setEditingRoomType(roomType as RoomType);
        setNewRoomTypeDialogOpen(true);
      }
    }
  ];

  const handleCreateRoomType = async (data: AddRoomTypeRequest) => {
    try {
      await addRoomType(data);
      await fetchRoomTypes(); // Refresh the room types list
      setNewRoomTypeDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating room type:', error);
      throw error;
    }
  };

  const handleDialogClose = () => {
    setNewRoomTypeDialogOpen(false);
    setEditingRoomType(null);
  };

  return (
    <>
      <DataTable
        data={roomTypes || []}
        loading={loading}
        columns={roomTypeColumns}
        title="Room Types"
        actions={roomTypeActions}
        primaryAction={{
          label: 'New Room Type',
          onClick: () => {
            setEditingRoomType(null);
            setNewRoomTypeDialogOpen(true);
          }
        }}
        getRowKey={roomType => roomType.id}
        filter={{
          searchPlaceholder: 'Search room types',
          searchFields: ['name']
        }}
        emptyStateMessage="No room types found."
        deleteConfig={{
          onDelete: handleDeleteRoomType,
          getDeleteTitle: () => 'Delete Room Type',
        }}
      />
      <NewRoomTypeDialog
        isOpen={newRoomTypeDialogOpen}
        onCancel={handleDialogClose}
        onConfirm={handleCreateRoomType}
      />
    </>
  );
};

export default RoomTypes;
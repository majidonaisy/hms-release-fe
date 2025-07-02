import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import NewRoomForm, { RoomFormData } from './NewRoomForm';
import { addRoom, getRoomById, updateRoom } from '@/services/Rooms';
import { useEffect, useState } from 'react';
import { Room } from '@/validation';
import { toast } from 'sonner';
import RoomFormSkeleton from './RoomFormSkeleton';

const Newroom = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = id && id !== 'new';
  const isAddMode = id === 'new';

  const handleBack = () => {
    navigate(-1); 
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchRoom = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getRoomById(id);
          setRoom(response.data);
        } catch (error: any) {
          console.error('Error fetching room:', error);
          setError(error.userMessage || 'Failed to load room data');
        } finally {
          setLoading(false);
        }
      };

      fetchRoom();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (data: RoomFormData) => {
    try {
      setLoading(true);

      if (isEditMode) {
        await updateRoom(id, data as any);
        toast.success('Room updated successfully');
      } else if (isAddMode) {
        await addRoom(data as any);
        toast.success('Room created successfully');
      }
      navigate('/rooms');
    } catch (error: any) {
      console.error('Error saving room:', error);
      toast.error(error.userMessage || `Failed to ${isEditMode ? 'update' : 'create'} room`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = (data: RoomFormData) => {
    console.log('Room draft saved:', data);
  };

  const getInitialData = (): Partial<RoomFormData> | undefined => {
    if (!room || isAddMode) return undefined;
    console.log('room', room)
    return {
      roomNumber: room.roomNumber,
      roomTypeId: room.roomTypeId,
      floor: room.floor,
      status: room.status,
      adultOccupancy: room.adultOccupancy,
      childOccupancy: room.childOccupancy,
      maxOccupancy: room.maxOccupancy,
      description: room.description || '',
      // Set default values for fields not in API response
      bedType: '',
      singleBeds: 0,
      doubleBeds: 0,
      baseRate: parseFloat(room.roomType?.baseRate || '0'), // Convert string to number
      isConnecting: false,
      connectingRoom: '',
      facilities: [],
      photos: room.photos ||[]
    };
  };

  if (isEditMode && loading) {
    return <RoomFormSkeleton />;
  }

  if (isEditMode && (error || (!loading && !room))) {
    return (
      <div className="p-5 min-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="p-0 hover:bg-slate-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">
            {error || 'Room Not Found'}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="p-0 hover:bg-slate-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">
          {isEditMode
            ? `Edit Room ${room?.roomNumber || ''}`
            : 'New Room'
          }
        </h1>
      </div>

      {/* Room Form */}
      <NewRoomForm
        initialData={getInitialData()}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        submitButtonText={isEditMode ? "Update Room" : "Create Room"}
        draftButtonText="Save as Draft"
        isLoading={loading}
      />
    </div>
  );
};

export default Newroom;
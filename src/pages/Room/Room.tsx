import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import NewRoomForm, { RoomFormData } from './NewRoomForm';
import { getRoomById, updateRoom, addRoom } from '@/services/Rooms';
import { Room as RoomType } from '@/validation';
import { toast } from 'sonner';
import RoomFormSkeleton from './RoomFormSkeleton';

const Room = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [room, setRoom] = useState<RoomType | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Determine if we're in edit mode or add mode
    const isEditMode = id && id !== 'new';
    const isAddMode = id === 'new';

    useEffect(() => {
        if (isEditMode) {
            const fetchRoom = async () => {
                setLoading(true);
                setError(null);

                try {
                    const response = await getRoomById(id);
                    const roomData = response.data?.data || response.data;
                    setRoom(roomData);
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

    const handleBack = () => {
        navigate('/rooms');
    };

    const handleSubmit = async (data: RoomFormData): Promise<void> => {
        try {
            if (isEditMode && id) {
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
            // Re-throw the error so the form can handle it
            throw error;
        }
    };

    const handleSaveDraft = (data: RoomFormData) => {
        toast.info('Draft saved');
    };

    // Transform room data to form data for editing
    const getInitialData = (): Partial<RoomFormData> | undefined => {
        if (!room || isAddMode) return undefined;

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
            baseRate: room.roomType?.baseRate ? parseFloat(room.roomType.baseRate) : 0,
            isConnecting: false,
            connectingRoom: '',
            amenities: [], // Initialize as empty array, will be populated when amenities are fetched
            photos: Array.isArray(room.photos) ? room.photos : []
        };
      };

    // Show loading skeleton while fetching data in edit mode
    if (isEditMode && loading) {
        return <RoomFormSkeleton />;
    }

    // Show error if failed to load room data
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
            {/* Header with Back Button */}
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
                key={room?.id} // Force re-render when room changes
                initialData={getInitialData()}
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                submitButtonText={isEditMode ? "Update Room" : "Create Room"}
                draftButtonText="Save as Draft"
            />
        </div>
    );
};

export default Room;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import NewRoomForm from './NewRoomForm';
import { getRoomById, updateRoom, addRoom } from '@/services/Rooms';
import { AddRoomRequest, Room } from '@/validation';
import { toast } from 'sonner';
import EditingSkeleton from '../../components/Templates/EditingSkeleton';

const RoomPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [room, setRoom] = useState<Room | null>(null);
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
                    const roomData = response.data;
                    setRoom(roomData);
                } catch (error: any) {
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

    const handleSubmit = async (data: AddRoomRequest): Promise<void> => {
        try {
            if (isEditMode && id) {
                await updateRoom(id, data);
                toast.success('Room updated successfully');
            } else if (isAddMode) {
                await addRoom(data);
                toast.success('Room created successfully');
            }
            navigate('/rooms');
        } catch (error: any) {
            toast.error(error.userMessage || `Failed to ${isEditMode ? 'update' : 'create'} room`);
            throw error;
        }
    };

    const handleSaveDraft = () => {
        toast.info('Draft saved');
    };

    // Transform room data to form data for editing
    const getInitialData = (): Partial<AddRoomRequest> | undefined => {
        if (!room || isAddMode) return undefined;
        return {
            roomNumber: room.roomNumber,
            roomTypeId: room.roomTypeId,
            floor: room.floor,
            description: room.description || '',
            amenities: room.Amenities ? room.Amenities.map((a: any) => a.id) : [],
            connectedRoomIds: room.connectedRooms ? room.connectedRooms.map((cr: any) => cr.id) : [],
            photos: Array.isArray(room.photos) ? room.photos : [],
            hotelId: room.hotelId,
        };
    };

    if (isEditMode && loading) {
        return <EditingSkeleton />;
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
                </div>
                <div className="text-red-500">{error || 'Room not found.'}</div>
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

            <NewRoomForm
                initialData={getInitialData()}
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                isLoading={loading}
                submitButtonText={isEditMode ? 'Update Room' : 'Create Room'}
            />
        </div>
    );
};

export default RoomPage;

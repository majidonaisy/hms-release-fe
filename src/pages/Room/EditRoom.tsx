import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import NewRoomForm, { RoomFormData } from './NewRoomForm';
import { getRoomById, updateRoom } from '@/services/Rooms';
import { Room } from '@/validation';
import { toast } from 'sonner';
import RoomFormSkeleton from './RoomFormSkeleton';

const EditRoom = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState<Room | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoom = async () => {
            if (!id) return;

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
    }, [id]);

    const handleBack = () => {
        navigate('/rooms');
    };

    const handleSubmit = async (data: RoomFormData): Promise<void> => {
        if (!id) return;

        try {
            await updateRoom(id, data as any);
            toast.success('Room updated successfully');
            navigate('/rooms');
        } catch (error: any) {
            console.error('Error updating room:', error);
            toast.error(error.userMessage || 'Failed to update room');
            throw error;
        }
    };

    const handleSaveDraft = (data: RoomFormData) => {
        console.log('Room draft saved:', data);
        toast.info('Draft saved');
    };

    // Transform room data to form data
    const getInitialData = (): Partial<RoomFormData> | undefined => {
        if (!room) return undefined;

        return {
            roomNumber: room.roomNumber,
            roomTypeId: room.roomTypeId,
            floor: room.floor,
            status: room.status,
            adultOccupancy: room.adultOccupancy,
            childOccupancy: room.childOccupancy,
            maxOccupancy: room.maxOccupancy,
            description: room.description || '',
            bedType: '',
            singleBeds: 0,
            doubleBeds: 0,
            baseRate: parseFloat(room.roomType?.baseRate || '0'),
            isConnecting: false,
            connectingRoom: '',
            facilities: [],
            photos: room.photos || []
        };
    };

    if (loading) {
        return <RoomFormSkeleton />;
    }

    if (error || !room) {
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
                <h1 className="text-xl font-bold">Edit Room {room.roomNumber}</h1>
            </div>

            {/* Room Form */}
            <NewRoomForm
                initialData={getInitialData()}
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                submitButtonText="Update Room"
                draftButtonText="Save as Draft"
            />
        </div>
    );
};

export default EditRoom;

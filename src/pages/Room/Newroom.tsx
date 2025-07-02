import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import NewRoomForm, { RoomFormData } from './NewRoomForm';
import { addRoom } from '@/services/Rooms';
import { toast } from 'sonner';

const Newroom = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/rooms');
  };

  const handleSubmit = async (data: RoomFormData): Promise<void> => {
    try {
      await addRoom(data as any);
      toast.success('Room created successfully');
      navigate('/rooms');
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast.error(error.userMessage || 'Failed to create room');
      throw error;
    }
  };

  const handleSaveDraft = (data: RoomFormData) => {
    console.log('Room draft saved:', data);
    toast.info('Draft saved');
  };

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
        <h1 className="text-xl font-bold">New Room</h1>
      </div>

      {/* Room Form */}
      <NewRoomForm
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        submitButtonText="Create Room"
        draftButtonText="Save as Draft"
      />
    </div>
  );
};

export default Newroom;
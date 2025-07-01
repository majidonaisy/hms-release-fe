import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import NewRoomForm, { RoomFormData } from './NewRoomForm';
import { addRoom } from '@/services/Rooms';

const Newroom = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSubmit = async (data: RoomFormData) => {
    try {
      console.log('data', data)
      const response = await addRoom(data as any);
      console.log('response', response)
    } catch (error) {
      console.log('error', error)
    }
 
  };

  const handleSaveDraft = (data: RoomFormData) => {
    console.log('Room draft saved:', data);

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
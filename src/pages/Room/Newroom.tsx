import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import NewRoomForm, { RoomFormData } from './NewRoomForm';

const Newroom = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSubmit = (data: RoomFormData) => {
    console.log('Room form submitted:', data);
    // Handle room creation logic here
    // Example: call API to create room
    // navigate('/rooms'); // Navigate to rooms list after creation
  };

  const handleSaveDraft = (data: RoomFormData) => {
    console.log('Room draft saved:', data);
    // Handle draft saving logic here
    // Example: save to localStorage or call API
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="h-8 w-8 p-0 hover:bg-slate-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-slate-900">New Room</h1>
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
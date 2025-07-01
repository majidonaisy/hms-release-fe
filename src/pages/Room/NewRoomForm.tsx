import { useEffect, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Upload, X } from 'lucide-react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/atoms/Switch';
import { AddRoomRequest, RoomType } from '@/validation';
import { getRoomTypes } from '@/services/RoomTypes';

// Types for better TypeScript support
export interface RoomFormData extends Omit<AddRoomRequest, 'roomTypeId'> {
  roomType: string; // UI uses string, maps to roomTypeId
  floor: string;
  status: string;
  adults: string;
  children: string;
  bedType: string;
  singleBeds: string;
  doubleBeds: string;
  maxOccupancy: string;
  baseRate: string;
  isConnecting: boolean;
  connectingRoom: string;
  description: string;
  facilities: string[];
  photos: File[];
}

export interface RoomFormProps {
  initialData?: Partial<RoomFormData>;
  onSubmit: (data: RoomFormData) => void;
  onSaveDraft?: (data: RoomFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  draftButtonText?: string;
  className?: string;
  roomTypes?: RoomType[]; // Use your Zod type for room types
}


// Default form data
const defaultFormData: RoomFormData = {
  roomNumber: '', 
  roomType: '',   
  floor: '',
  status: '',
  adults: '',
  children: '',
  bedType: '',
  singleBeds: '',
  doubleBeds: '',
  maxOccupancy: '',
  baseRate: '',
  isConnecting: false,
  connectingRoom: '',
  description: '',
  facilities: [],
  photos: []
};




const floorOptions = [
  { value: 'ground', label: 'Ground Floor' },
  { value: '1st', label: '1st Floor' },
  { value: '2nd', label: '2nd Floor' },
  { value: '3rd', label: '3rd Floor' },
  { value: '4th', label: '4th Floor' },
  { value: '5th', label: '5th Floor' }
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'Under Maintenance' },
  { value: 'out-of-service', label: 'Out of Service' },
  { value: 'cleaning', label: 'Cleaning' }
];

const bedTypeOptions = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'king', label: 'King' },
  { value: 'queen', label: 'Queen' },
  { value: 'sofa', label: 'Sofa Bed' },
  { value: 'crib', label: 'Crib' }
];

const facilitiesOptions = [
  { id: 'kitchenette', label: 'Kitchenette' },
  { id: 'workDesk', label: 'Work Desk' },
  { id: 'seaView', label: 'Sea View' },
  { id: 'cityView', label: 'City View' },
  { id: 'tv', label: 'TV' },
  { id: 'miniBar', label: 'Mini Bar' },
  { id: 'wardrobe', label: 'Wardrobe' },
  { id: 'bathtub', label: 'Bathtub' },
  { id: 'smokingAllowed', label: 'Smoking allowed' },
  { id: 'accessible', label: 'Accessible' },
  { id: 'petFriendly', label: 'Pet friendly' },
  { id: 'label', label: 'Label' }
];

const NewRoomForm: React.FC<RoomFormProps> = ({
  initialData = {},
  onSubmit,
  onSaveDraft,
  isLoading = false,
  submitButtonText = 'Create Room',
  draftButtonText = 'Save as Draft',
  className = ''
}) => {
  const [formData, setFormData] = useState<RoomFormData>({
    ...defaultFormData,
    ...initialData
  });

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoadingRoomTypes, setIsLoadingRoomTypes] = useState(true);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setIsLoadingRoomTypes(true);
        const response = await getRoomTypes();
        console.log('response', response)
        setRoomTypes(response.data); // Set room types in separate state
      } catch (error) {
        console.error('Failed to fetch room types:', error);
        setRoomTypes([]); // Set empty array on error
      } finally {
        setIsLoadingRoomTypes(false);
      }
    };

    fetchRoomTypes();
  }, []);

  const handleInputChange = (field: keyof RoomFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFacilityChange = (facilityId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      facilities: checked
        ? [...prev.facilities, facilityId]
        : prev.facilities.filter(id => id !== facilityId)
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Form Section */}
        <div className='px-7'>

          <div className="space-y-6">
            {/* Room Number */}
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input
                id="roomNumber"
                placeholder="e.g. 204"
                value={formData.roomNumber}
                onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                required
                className='border border-slate-300'
              />
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select
                value={formData.roomType}
                onValueChange={(value) => handleInputChange('roomType', value)}
              >
                <SelectTrigger className='border border-slate-300 w-full'>
                  <SelectValue placeholder="Select Single, Double, Twin, Suite..." />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map(option => (
                    <SelectItem key={option.id} value={option.name}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Floor */}
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Select
                value={formData.floor}
                onValueChange={(value) => handleInputChange('floor', value)}
              >
                <SelectTrigger className='border border-slate-300 w-full'>
                  <SelectValue placeholder="e.g. 2nd Floor" />
                </SelectTrigger>
                <SelectContent>
                  {floorOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className='border border-slate-300 w-full'>
                  <SelectValue placeholder="Select Active, Under Maintenance, Out of Service..." />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Occupancy */}
            <div className="space-y-4">
              <Label>Occupancy</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adults" className="text-sm text-slate-600">Adults</Label>
                  <Input
                    id="adults"
                    type="number"
                    placeholder="Max 5"
                    value={formData.adults}
                    onChange={(e) => handleInputChange('adults', e.target.value)}
                    className='border border-slate-300'
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="children" className="text-sm text-slate-600">Children</Label>
                  <Input
                    id="children"
                    type="number"
                    placeholder="Max 2"
                    value={formData.children}
                    onChange={(e) => handleInputChange('children', e.target.value)}
                    className='border border-slate-300'
                  />
                </div>
              </div>
            </div>

            {/* Bed Types */}
            <div className="space-y-4">
              <Label>Bed Types</Label>
              <Select
                value={formData.bedType}
                onValueChange={(value) => handleInputChange('bedType', value)}
              >
                <SelectTrigger className='border border-slate-300 w-full'>
                  <SelectValue placeholder="Select Single, Double, King, Sofa Bed, Crib..." />
                </SelectTrigger>
                <SelectContent>
                  {bedTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Number of Beds */}
              <div className="space-y-4">
                <Label className="text-sm text-slate-600">Number of Beds</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="singleBeds" className="text-xs text-slate-500">Single</Label>
                    <Input
                      id="singleBeds"
                      type="number"
                      placeholder="1, 2, 3"
                      value={formData.singleBeds}
                      onChange={(e) => handleInputChange('singleBeds', e.target.value)}
                      className='border border-slate-300'
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doubleBeds" className="text-xs text-slate-500">Double</Label>
                    <Input
                      id="doubleBeds"
                      type="number"
                      placeholder="1, 2, 3"
                      value={formData.doubleBeds}
                      onChange={(e) => handleInputChange('doubleBeds', e.target.value)}
                      className='border border-slate-300'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Max Occupancy */}
            <div className="space-y-2">
              <Label htmlFor="maxOccupancy">Max Occupancy</Label>
              <Input
                id="maxOccupancy"
                type="number"
                placeholder="e.g. 4"
                value={formData.maxOccupancy}
                onChange={(e) => handleInputChange('maxOccupancy', e.target.value)}
                className='border border-slate-300'
              />
            </div>

            {/* Base Rate per Night */}
            <div className="space-y-2">
              <Label htmlFor="baseRate">Base Rate per Night</Label>
              <Input
                id="baseRate"
                type="number"
                placeholder="e.g. 150"
                value={formData.baseRate}
                onChange={(e) => handleInputChange('baseRate', e.target.value)}
                className='border border-slate-300'
              />
            </div>

            {/* Connecting Room Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Is this a connecting room?</Label>
                <Switch
                  checked={formData.isConnecting}
                  onCheckedChange={(checked) => handleInputChange('isConnecting', checked)}
                  className='border border-slate-300 data-[state=checked]:bg-hms-primary'
                />
              </div>

              {formData.isConnecting && (
                <div className="space-y-2">
                  <Label htmlFor="connectingRoom">Connects with Room</Label>
                  <Input
                    id="connectingRoom"
                    placeholder="Add room"
                    value={formData.connectingRoom}
                    onChange={(e) => handleInputChange('connectingRoom', e.target.value)}
                    className='border border-slate-300'
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Photo and Additional Info */}
        <div className="space-y-6">

          <div className="space-y-2">
            <Label className=''>Room Photo</Label>
            {/* Photo Upload Area */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 mb-2">Drop files to upload</p>
              <p className="text-slate-400 text-sm mb-4">or</p>
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Button type="button" variant="foreground" >
                  + Add Photo
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
          </div>

          {/* Preview uploaded photos */}
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Facilities */}
          <div className="space-y-4">
            <Label>Facilities:</Label>
            <div className="grid grid-cols-2 gap-3">
              {facilitiesOptions.map((facility) => (
                <div key={facility.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={facility.id}
                    className={cn("data-[state=checked]:bg-hms-primary")}
                    checked={formData.facilities.includes(facility.id)}
                    onCheckedChange={(checked: any) => handleFacilityChange(facility.id, checked as boolean)}
                  />
                  <Label htmlFor={facility.id} className="text-sm">
                    {facility.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Room Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Room Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the room and any featured guests should know about"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 pt-6">
        {onSaveDraft && (
          <Button
            type="button"
            variant='background'
            className='text-white'
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            {draftButtonText}
          </Button>
        )}
        <Button
          type="submit"
          variant="foreground"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default NewRoomForm;
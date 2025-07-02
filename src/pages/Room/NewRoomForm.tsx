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
import { AddRoomRequestSchema, RoomType } from '@/validation';
import { getRoomTypes } from '@/services/RoomTypes';
import { toast } from 'sonner';
import { getAmenities } from '@/services/Rooms';
import { Amenity } from '@/validation/schemas/amenity';

export interface RoomFormData {
  roomNumber: string;
  roomTypeId: string;
  floor: number | string;
  status: string;
  adultOccupancy: number | string;
  childOccupancy: number | string;
  bedType: string;
  singleBeds: number | string;
  doubleBeds: number | string;
  maxOccupancy: number | string;
  baseRate: number | string;
  isConnecting: boolean;
  connectingRoom: string;
  description: string;
  amenities: Amenity[];
  photos: File[];
}

export interface RoomFormProps {
  initialData?: Partial<RoomFormData>;
  onSubmit: (data: RoomFormData) => Promise<void>;
  onSaveDraft?: (data: RoomFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  draftButtonText?: string;
  className?: string;
  roomTypes?: RoomType[];
}


// Default form data
const defaultFormData: RoomFormData = {
  roomNumber: '',
  roomTypeId: '',
  floor: '',
  status: '',
  adultOccupancy: '',
  childOccupancy: '',
  bedType: '',
  singleBeds: '',
  doubleBeds: '',
  maxOccupancy: '',
  baseRate: 0,
  isConnecting: false,
  connectingRoom: '',
  description: '',
  amenities: [],
  photos: []
};


const statusOptions = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'OCCUPIED', label: 'Occupied' },
  { value: 'MAINTENANCE', label: 'Under Maintenance' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
  { value: 'CLEANING', label: 'Cleaning' }
];

const bedTypeOptions = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'king', label: 'King' },
  { value: 'queen', label: 'Queen' },
  { value: 'sofa', label: 'Sofa Bed' },
  { value: 'crib', label: 'Crib' }
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [amenities, setAmenity] = useState<Amenity[]>([]);

  const fetchAmenities = async () => {
    try {
      const response = await getAmenities();
      if (response.status && Array.isArray(response.data)) {
        setAmenity(response.data);
      } else {
        setAmenity([]);
        toast.error('Failed to load amenities');
      }
    } catch (error) {
      setAmenity([]);
      toast.error('Failed to load amenities');
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await getRoomTypes();
      if (response.status && Array.isArray(response.data)) {
        setRoomTypes(response.data);
      } else {
        setRoomTypes([]);
        toast.error('Failed to load room types');
      }
    } catch (error) {
      setRoomTypes([]);
      toast.error('Failed to load room types');
    }
  };

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {

    if (initialData && Object.keys(initialData).length > 0) {
      const newData = {
        ...defaultFormData,
        ...initialData
      };
      setFormData(newData);
    }
  }, [initialData]);

  useEffect(() => {
    fetchRoomTypes();
    fetchAmenities();
  }, []);

  const handleInputChange = (field: keyof RoomFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenities.find(a => a.id === amenityId)].filter(Boolean) as Amenity[]
        : prev.amenities.filter(amenity => amenity?.id !== amenityId)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Transform form data to proper types for validation
      const transformedData = {
        ...formData,
        floor: typeof formData.floor === 'string' && formData.floor === '' ? 0 : Number(formData.floor),
        adultOccupancy: typeof formData.adultOccupancy === 'string' && formData.adultOccupancy === '' ? 0 : Number(formData.adultOccupancy),
        childOccupancy: typeof formData.childOccupancy === 'string' && formData.childOccupancy === '' ? 0 : Number(formData.childOccupancy),
        maxOccupancy: typeof formData.maxOccupancy === 'string' && formData.maxOccupancy === '' ? 0 : Number(formData.maxOccupancy),
        baseRate: typeof formData.baseRate === 'string' && formData.baseRate === '' ? 0 : Number(formData.baseRate),
        singleBeds: typeof formData.singleBeds === 'string' && formData.singleBeds === '' ? 0 : Number(formData.singleBeds),
        doubleBeds: typeof formData.doubleBeds === 'string' && formData.doubleBeds === '' ? 0 : Number(formData.doubleBeds),
        status: formData.status || 'AVAILABLE',
        amenities: formData.amenities.map(amenity => amenity.id) // Transform amenities to array of IDs for API
      };

      const validatedData = AddRoomRequestSchema.parse(transformedData);

      await onSubmit(validatedData as RoomFormData);
      if (submitButtonText.includes('Create')) {
        setFormData(defaultFormData);
      }
    } catch (error: any) {
      console.error('Form submission error:', error);

      if (error.name === 'ZodError') {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please fix the validation errors');
      } else if (error.userMessage) {
        toast.error(error.userMessage);
      } else {
        console.error('API error:', error);
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className='px-7'>
          <div className="space-y-6">
            {/* Room Number */}
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input
                type='text'
                id="roomNumber"
                placeholder="e.g. 204"
                value={formData.roomNumber}
                onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                className={`border border-slate-300 ${errors.roomNumber ? 'border-red-500' : ''}`}
              />
              {errors.roomNumber && <p className="text-red-500 text-sm">{errors.roomNumber}</p>}
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <Label htmlFor="roomTypeId">Room Type</Label>
              <Select
                value={formData.roomTypeId}
                onValueChange={(value) => handleInputChange('roomTypeId', value)}
              >
                <SelectTrigger className={`border border-slate-300 w-full ${errors.roomTypeId ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select Single, Double, Twin, Suite..." />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roomTypeId && <p className="text-red-500 text-sm">{errors.roomTypeId}</p>}
            </div>

            {/* Floor */}
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                placeholder="e.g. 2"
                value={formData.floor === 0 ? '' : formData.floor}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('floor', value === '' ? '' : Number(value));
                }}
                className={`border border-slate-300 ${errors.floor ? 'border-red-500' : ''}`}
              />
              {errors.floor && <p className="text-red-500 text-sm">{errors.floor}</p>}
            </div>
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className={`border border-slate-300 w-full ${errors.status ? 'border-red-500' : ''}`}>
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
              {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
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
                    value={formData.adultOccupancy === 0 || formData.adultOccupancy === '' ? '' : formData.adultOccupancy}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange('adultOccupancy', value === '' ? '' : Number(value));
                    }}
                    className={`border border-slate-300 ${errors.adultOccupancy ? 'border-red-500' : ''}`}
                  />
                  {errors.adultOccupancy && <p className="text-red-500 text-sm">{errors.adultOccupancy}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="children" className="text-sm text-slate-600">Children</Label>
                  <Input
                    id="children"
                    type="number"
                    placeholder="Max 2"
                    value={formData.childOccupancy === 0 || formData.childOccupancy === '' ? '' : formData.childOccupancy}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange('childOccupancy', value === '' ? '' : Number(value));
                    }}
                    className={`border border-slate-300 ${errors.childOccupancy ? 'border-red-500' : ''}`}
                  />
                  {errors.childOccupancy && <p className="text-red-500 text-sm">{errors.childOccupancy}</p>}
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
                      value={formData.singleBeds === 0 || formData.singleBeds === '' ? '' : formData.singleBeds}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange('singleBeds', value === '' ? 0 : Number(value));
                      }}
                      className='border border-slate-300'
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doubleBeds" className="text-xs text-slate-500">Double</Label>
                    <Input
                      id="doubleBeds"
                      type="number"
                      placeholder="1, 2, 3"
                      value={formData.doubleBeds === 0 || formData.doubleBeds === '' ? '' : formData.doubleBeds}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange('doubleBeds', value === '' ? 0 : Number(value));
                      }}
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
                value={formData.maxOccupancy === 0 || formData.maxOccupancy === '' ? '' : formData.maxOccupancy}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('maxOccupancy', value === '' ? '' : Number(value));
                }}
                className={`border border-slate-300 ${errors.maxOccupancy ? 'border-red-500' : ''}`}
              />
              {errors.maxOccupancy && <p className="text-red-500 text-sm">{errors.maxOccupancy}</p>}
            </div>

            {/* Base Rate per Night */}
            <div className="space-y-2">
              <Label htmlFor="baseRate">Base Rate per Night</Label>
              <Input
                id="baseRate"
                type="number"
                placeholder="e.g. 150"
                value={formData.baseRate === 0 ? '' : formData.baseRate}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('baseRate', value === '' ? 0 : Number(value));
                }}
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

          {/* amenities */}
          <div className="space-y-4">
            <Label>Amenities:</Label>
            <div className="grid grid-cols-2 gap-3">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.id}
                    className={cn("data-[state=checked]:bg-hms-primary")}
                    checked={formData.amenities.some(a => a.id === amenity.id)}
                    onCheckedChange={(checked: any) => handleAmenityChange(amenity.id, checked as boolean)}
                  />
                  <Label htmlFor={amenity.id} className="text-sm">
                    {amenity.name}
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
            disabled={isSubmitting || isLoading}
          >
            {draftButtonText}
          </Button>
        )}
        <Button
          type="submit"
          variant="foreground"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting
            ? (submitButtonText.includes('Update') ? 'Updating...' : 'Creating...')
            : submitButtonText
          }
        </Button>
      </div>
    </form>
  );
};

export default NewRoomForm;
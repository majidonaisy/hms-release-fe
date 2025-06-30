import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { X, User, Building, MapPin } from 'lucide-react';

export interface GuestTypeSelectionData {
  type: 'individual' | 'corporate' | 'travel-agency';
}

interface GuestTypeSelectionDialogProps {
  isOpen: boolean;
  onConfirm: (data: GuestTypeSelectionData) => void;
  onCancel: () => void;
}

const GuestTypeSelectionDialog: React.FC<GuestTypeSelectionDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const guestTypes = [
    {
      id: 'individual',
      title: 'Individual',
      description: 'Personal guest profile',
      icon: User,
    },
    {
      id: 'corporate',
      title: 'Corporate',
      description: 'Business guest profile',
      icon: Building,
    },
    {
      id: 'travel-agency',
      title: 'Travel agency',
      description: 'Agency guest profile',
      icon: MapPin,
    },
  ];

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    onConfirm({ type: type as 'individual' | 'corporate' | 'travel-agency' });
    setSelectedType(null); 
  };

  const handleCancel = () => {
    setSelectedType(null);
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="!max-w-3xl p-8" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between mb-8">
          <DialogTitle className="text-2xl font-semibold">Select a profile type</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          {guestTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`
                  relative cursor-pointer rounded-lg border-2 py-6 px-4 text-center transition-all hover:border-hms-primary hover:shadow-lg
                  ${selectedType === type.id ? 'border-hms-primary bg-hms-primary/5' : 'border-gray-200'}
                `}
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Icon Placeholder - You can replace with actual icons */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Icon className="h-10 w-10 text-gray-500" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedType === type.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-hms-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestTypeSelectionDialog;
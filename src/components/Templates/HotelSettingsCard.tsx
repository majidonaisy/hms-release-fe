import React from 'react';
import { Button } from '@/components/atoms/Button';
import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/Organisms/Card';

interface HotelSettingsCardProps {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    onManageClick?: () => void;
    manageButtonText: string;
}

const HotelSettingsCard: React.FC<HotelSettingsCardProps> = ({
    title,
    description,
    imageSrc,
    imageAlt,
    onManageClick,
    manageButtonText,
}) => {
    return (
        <Card className="bg-hms-accent-35">
            <CardContent className="p-6">
                <div className="flex">
                    <div className="mr-4">
                        <div className="h-32 w-44 rounded overflow-hidden">
                            <img
                                src={imageSrc}
                                alt={imageAlt}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{title}</h3>
                        <p className="text-gray-600 mb-4">{description}</p>
                        <div className="flex gap-2">
                            <Button onClick={onManageClick}>
                                <Settings className="mr-2 h-4 w-4" />
                                {manageButtonText}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default HotelSettingsCard;
import React from 'react';
import { Button } from '@/components/atoms/Button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/Organisms/Card';

interface DashboardCardProps {
    title: string;
    description: string;
    totalItems?: number;
    imageSrc: string;
    imageAlt: string;
    onCreateClick?: () => void;
    onViewClick?: () => void;
    createButtonText: string;
    viewButtonText: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    description,
    totalItems,
    imageSrc,
    imageAlt,
    onCreateClick,
    onViewClick,
    createButtonText,
    viewButtonText,
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
                        <p className="text-gray-600 mb-2">{description}</p>
                        {typeof totalItems !== 'undefined' && (
                            <div className="text-sm text-gray-500 mb-2">
                                <span>Total: {totalItems || 0} {title}</span>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <Button onClick={onCreateClick}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                {createButtonText}
                            </Button>
                            <Button variant="background" onClick={onViewClick}>
                                {viewButtonText}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

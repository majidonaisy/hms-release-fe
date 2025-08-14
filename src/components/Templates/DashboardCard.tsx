import React from 'react';
import { Button } from '@/components/atoms/Button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/Organisms/Card';
import { Can } from '@/context/CASLContext';

interface DashboardCardProps {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    onCreateClick?: () => void;
    onViewClick?: () => void;
    createButtonText: string;
    viewButtonText?: string;
    createPermissions?: { action: string; subject: string };
    viewPermissions?: { action: string; subject: string };
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    description,
    imageSrc,
    imageAlt,
    onCreateClick,
    onViewClick,
    createButtonText,
    viewButtonText,
    createPermissions,
    viewPermissions,
}) => {
    return (
        <Card className="bg-hms-accent/30">
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
                        <div className="flex gap-2 mt-2">
                            {createPermissions ? (
                                <Can
                                    action={createPermissions.action}
                                    subject={createPermissions.subject}
                                >
                                    <Button onClick={onCreateClick}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        {createButtonText}
                                    </Button>
                                </Can>
                            ) : (
                                <Button onClick={onCreateClick}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    {createButtonText}
                                </Button>
                            )}

                            {viewPermissions ? (
                                <Can
                                    action={viewPermissions.action}
                                    subject={viewPermissions.subject}
                                >
                                    <Button variant="background" onClick={onViewClick}>
                                        {viewButtonText}
                                    </Button>
                                </Can>
                            ) : (
                                <Button variant="background" onClick={onViewClick}>
                                    {viewButtonText}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
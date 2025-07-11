import React from 'react';
import { Dialog, DialogContent } from '@/components/Organisms/Dialog';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

export interface ActivityLogEntry {
    id: string;
    date: string;
    description: string;
    time: string;
    author?: string;
}

interface ActivityLogDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    activities: ActivityLogEntry[];
    onLoadMore?: () => void;
    hasMore?: boolean;
}

const ActivityLogDialog: React.FC<ActivityLogDialogProps> = ({
    isOpen,
    onClose,
    title = "Activity log",
    activities,
    onLoadMore,
    hasMore = false
}) => {
    const formatTime = (timeString: string): string => {
        const [time, period] = timeString.split(' ');
        return `${time} ${period}`;
    };

    const isToday = (dateString: string): boolean => {
        const today = new Date();
        const logDate = new Date(dateString);
        return today.toDateString() === logDate.toDateString();
    };

    const isYesterday = (dateString: string): boolean => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const logDate = new Date(dateString);
        return yesterday.toDateString() === logDate.toDateString();
    };

    const formatDateLabel = (dateString: string): string => {
        const logDate = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return logDate.toLocaleDateString('en-GB', options);
    };

    const groupActivitiesByDate = (activities: ActivityLogEntry[]) => {
        const grouped: { [key: string]: ActivityLogEntry[] } = {};

        activities.forEach(activity => {
            const dateKey = activity.date;
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(activity);
        });

        // Sort dates in descending order (most recent first)
        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        return sortedDates.map(date => ({
            date,
            logs: grouped[date].sort((a, b) => {
                // Sort logs within each day by time (most recent first)
                const timeA = new Date(`${date} ${a.time}`);
                const timeB = new Date(`${date} ${b.time}`);
                return timeB.getTime() - timeA.getTime();
            })
        }));
    };

    const groupedActivities = groupActivitiesByDate(activities);

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] p-0" showCloseButton={false}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-dashed border-hms-primary">
                    <h2 className="text-lg font-semibold text-hms-primary">{title}</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-6 w-6 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 pt-0 max-h-[60vh] overflow-y-auto">
                    {activities.length > 0 ? (
                        <div className="space-y-6">
                            {groupedActivities.map((group, groupIndex: number) => (
                                <div key={groupIndex}>
                                    <div className='bg-hms-primary/15 text-xs font-medium px-3 py-1 rounded-full mb-4 inline-block'>
                                        {isToday(group.date)
                                            ? 'Today'
                                            : isYesterday(group.date)
                                                ? 'Yesterday'
                                                : formatDateLabel(group.date)
                                        }
                                    </div>

                                    <div className="space-y-4 ml-4">
                                        {group.logs.map((activity: ActivityLogEntry, logIndex: number) => (
                                            <div key={logIndex} className="flex items-start gap-4 relative">
                                                {/* Timeline dot and line */}
                                                <div className="flex flex-col items-center">
                                                    <div className='w-2 h-2 rounded-full bg-hms-primary flex-shrink-0'></div>
                                                    {logIndex < group.logs.length - 1 && (
                                                        <div className="w-px h-8 bg-hms-primary mt-1"></div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0 pb-2">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm text-gray-900 flex-1 pr-4">
                                                            {activity.description}
                                                            {activity.author && (
                                                                <span className="font-medium"> by {activity.author}</span>
                                                            )}
                                                        </p>
                                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                                            {formatTime(activity.time)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {hasMore && onLoadMore && (
                                <div className="text-center pt-4 border-t border-gray-200">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs px-4 py-2"
                                        onClick={onLoadMore}
                                    >
                                        Load more
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            <div className="w-12 h-12 bg-hms-primary/15 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-sm">No activity logs available</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ActivityLogDialog;

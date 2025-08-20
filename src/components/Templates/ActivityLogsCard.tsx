import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card";
import { getActivityLogs } from "@/services/Employees";
import { ActivityLogItem, PaginatedActivityLogs } from "@/validation/schemas/Employees";
import { toast } from "sonner";
import { ScrollArea } from "../atoms/ScrollArea";

interface ActivityLogsCardProps {
    teamMemberId: string;
}

const LIMIT = 20;

const ActivityLogsCard: React.FC<ActivityLogsCardProps> = ({ teamMemberId }) => {
    const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchActivityLogs = async (skipParam = 0): Promise<PaginatedActivityLogs> => {
        try {
            const response = await getActivityLogs(teamMemberId, skipParam, LIMIT);
            return response;
        } catch (error: any) {
            console.error("Failed to fetch activity logs:", error);
            toast.error("Error!", { description: error?.userMessage || "Failed to load activity logs." });

            return {
                status: 500,
                message: error?.userMessage || "Failed to load activity logs",
                data: [] as ActivityLogItem[],
                pagination: {
                    totalItems: 0,
                    totalPages: 0,
                    currentPage: 0,
                    pageSize: LIMIT,
                    hasNext: false,
                    hasPrevious: false,
                    nextPage: null,
                    previousPage: null,
                },
            };
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setSkip(0);
            const logs = await fetchActivityLogs(0);
            setActivityLogs(logs.data);
            setHasMore(logs.pagination.hasNext);
            setSkip(logs.data.length);
            setLoading(false);
        };
        loadInitialData();
    }, [teamMemberId]);

    const loadMoreData = useCallback(async () => {
        const logs = await fetchActivityLogs(skip);
        setActivityLogs(prev => [...prev, ...logs.data]);
        setHasMore(logs.pagination.hasNext);
        setSkip(prev => prev + logs.data.length);
    }, [skip, teamMemberId]);

    const formatDate = (date: string): string => {
        const today = new Date();
        const d = new Date(date);

        if (d.toDateString() === today.toDateString()) return "Today";

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

        return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    };

    const formatTime = (date: string): string => {
        return new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
    };

    const formatCheckInCheckOutDate = (dateString: undefined | Date) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getActivityDisplay = (activity: ActivityLogItem) => {
        switch (activity.action) {
            case "Create Group Booking":
                return {
                    title: "Create Group Booking",
                    details: [
                        `Group: ${activity.metadata.groupProfileName || "Unknown"}`,
                        `Check-in: ${formatCheckInCheckOutDate(activity.metadata.checkInDate) || "N/A"}`,
                        `Check-out: ${formatCheckInCheckOutDate(activity.metadata.checkOutDate) || "N/A"}`,
                    ],
                };
            case "Create Reservation":
                return {
                    title: "Create Reservation",
                    details: [
                        `Guest: ${activity.metadata.guestName || "Unknown Guest"}`,
                        `Check-in: ${formatCheckInCheckOutDate(activity.metadata.checkInDate) || "N/A"}`,
                        `Check-out: ${formatCheckInCheckOutDate(activity.metadata.checkOutDate) || "N/A"}`,
                        `Rooms: ${activity.metadata.roomNumbers?.length ? activity.metadata.roomNumbers.join(", ") : "N/A"}`,
                    ],
                };
            case "Add Charge":
                return {
                    title: "Add Charge",
                    details: [
                        `Amount: $${activity.metadata.chargeAmount || "0"}`,
                        `Type: ${activity.metadata.chargeType || "Unknown"}`,
                        `Rooms: ${activity.metadata.rooms?.length ? activity.metadata.rooms.join(", ") : "N/A"}`,
                    ],
                };
            default:
                return { title: (activity as any).action || "", details: [] };
        }
    };

    const groupActivitiesByDate = (activities: ActivityLogItem[]) => {
        const grouped: { [key: string]: ActivityLogItem[] } = {};
        activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .forEach(activity => {
                const key = formatDate(activity.timestamp);
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(activity);
            });
        return grouped;
    };

    const groupedActivities = groupActivitiesByDate(activityLogs);

    const LoadingSpinner = () => (
        <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-hms-primary"></div>
        </div>
    );

    return (
        <Card className="p-3">
            <CardHeader className="p-0">
                <CardTitle className="font-bold text-lg p-0 pb-1 border-b">Activity Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div id="activity-scroll-container" className="h-[30rem] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                    {loading ? (
                        <LoadingSpinner />
                    ) : activityLogs.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8">No activity logs found</div>
                    ) : (
                        <ScrollArea className="h-full px-3">
                            <InfiniteScroll
                                dataLength={activityLogs.length}
                                next={loadMoreData}
                                hasMore={hasMore}
                                loader={<LoadingSpinner />}
                                endMessage={
                                    <div className="text-center text-muted-foreground text-xs py-4">End of activity logs</div>
                                }
                                scrollableTarget="activity-scroll-container"
                                style={{ overflow: "visible" }}
                            >
                                <div className="space-y-4">
                                    {Object.entries(groupedActivities).map(([dateKey, activities]) => (
                                        <div key={dateKey} className="space-y-3">
                                            <div className="text-sm font-medium bg-hms-primary/15 px-2 py-1 mb-5 rounded">{dateKey}</div>
                                            <div className="space-y-3 pl-4">
                                                {activities.map(activity => {
                                                    const activityDisplay = getActivityDisplay(activity);
                                                    return (
                                                        <div key={activity.id} className="ml-10">
                                                            <div className="flex-shrink-0 relative -left-30 -top-6">
                                                                <div className="w-px h-20 bg-hms-primary mt-1 absolute left-20">
                                                                    <div className='w-12 bg-hms-primary h-px relative top-19'></div>
                                                                    <div className='w-2 h-2 rounded-full bg-hms-primary relative top-18 -left-1'></div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-1 justify-between ml-2 bg-hms-accent/15 p-2 rounded-lg">
                                                                <div className="flex flex-col space-y-1">
                                                                    <span className="text-sm font-medium">{activityDisplay.title}</span>
                                                                    <div className="text-xs text-gray-600">
                                                                        {activityDisplay.details.map((detail, idx) => (
                                                                            <div key={idx}>{detail}</div>
                                                                        ))}
                                                                    </div>
                                                                    {/* <span
                                                                        className={`text-xs px-2 py-1 rounded-full w-fit ${activity.status === "SUCCESS" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                                            }`}
                                                                    >
                                                                        {activity.status}
                                                                    </span> */}
                                                                </div>
                                                                <div className="text-xs text-gray-500 flex flex-col">
                                                                    <p className="text-end">{formatTime(activity.timestamp)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </InfiniteScroll>
                        </ScrollArea>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivityLogsCard;

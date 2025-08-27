import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Organisms/Card";
import { getActivityLogs } from "@/services/Employees";
import { ActivityLogItem, PaginatedActivityLogs } from "@/validation/schemas/Employees";
import { toast } from "sonner";
import { store } from "@/redux/store";

interface ActivityLogsCardProps {
    teamMemberId: string;
}

const LIMIT = 5;

const ActivityLogsCard: React.FC<ActivityLogsCardProps> = ({ teamMemberId }) => {
    const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const baseCurrency = store.getState().currency.currency || 'USD';

    const fetchActivityLogs = async (page = 1): Promise<PaginatedActivityLogs> => {
        try {
            const response = await getActivityLogs(teamMemberId, page, LIMIT);
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
            setCurrentPage(1); // Reset to page 1
            const logs = await fetchActivityLogs(1); // Start with page 1
            setActivityLogs(logs.data);
            setHasMore(logs.pagination.hasNext);
            setCurrentPage(1); // Set current page to 1
            setLoading(false);
        };
        loadInitialData();
    }, [teamMemberId]);

    const loadMoreData = useCallback(async () => {
        const nextPage = currentPage + 1; // Calculate next page
        const logs = await fetchActivityLogs(nextPage);
        setActivityLogs(prev => [...prev, ...logs.data]);
        setHasMore(logs.pagination.hasNext);
        setCurrentPage(nextPage); // Update current page
    }, [currentPage, teamMemberId]); // Changed dependency from skip to currentPage

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
                        `Check In: ${formatCheckInCheckOutDate(activity.metadata.checkInDate) || "N/A"}`,
                        `Check Out: ${formatCheckInCheckOutDate(activity.metadata.checkOutDate) || "N/A"}`,
                    ],
                };
            case "Create Reservation":
                return {
                    title: "Create Reservation",
                    details: [
                        `Guest: ${activity.metadata.guestName || "Unknown Guest"}`,
                        `Check In: ${formatCheckInCheckOutDate(activity.metadata.checkInDate) || "N/A"}`,
                        `Check Out: ${formatCheckInCheckOutDate(activity.metadata.checkOutDate) || "N/A"}`,
                        `Room(s): ${activity.metadata.roomNumbers?.length ? activity.metadata.roomNumbers.join(", ") : "N/A"}`,
                    ],
                };
            case "Add Charge":
                return {
                    title: "Add Charge",
                    details: [
                        `Amount: ${activity.metadata.chargeAmount || "0"} ${activity.metadata.currencyCode || ''}`,
                        `Type: ${activity.metadata.chargeType || "Unknown"}`,
                        `Room(s): ${activity.metadata.rooms?.length ? activity.metadata.rooms.join(", ") : "N/A"}`,
                    ],
                };
            case "Check In Reservation":
                return {
                    title: "Check In Reservation",
                    details: [
                        `Room(s): ${activity.metadata.roomNumbers?.length ? activity.metadata.roomNumbers.join(", ") : "N/A"}`,
                        `Deposit Amount: ${activity.metadata.depositAmount} ${baseCurrency}`,
                    ],
                };
            case "Check Out Reservation":
                return {
                    title: "Check Out Reservation",
                    details: [
                        `Room(s): ${activity.metadata.roomNumbers?.length ? activity.metadata.roomNumbers.join(", ") : "N/A"}`,
                        `Check Out Time: ${formatCheckInCheckOutDate(activity.metadata.checkOutTime)}`,
                    ],
                };
            case "Settle Folio Item":
                return {
                    title: "Settle Folio Item",
                    details: [
                        `Guest Name: ${activity.metadata.guestFullName}`,
                        `Item Type: ${activity.metadata.itemType}`,
                        `Rooms: ${activity.metadata.roomNumbers?.length ? activity.metadata.roomNumbers.join(", ") : "N/A"}`,
                        `Amount: ${activity.responseData.amount} ${activity.metadata.paymentCurrency}`,
                    ],
                };
            case "Void Folio Item":
                return {
                    title: "Void Folio Item",
                    details: [
                        `Rooms: ${activity.metadata.rooms?.length ? activity.metadata.rooms.join(", ") : "N/A"}`,
                        `Voided At: ${formatCheckInCheckOutDate(activity.metadata.voidedAt)}`,
                        `Number of Items: ${activity.metadata.nbOfItems}`,
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

    // Calculate flexible height based on details count
    const getFlexibleHeight = (detailsCount: number, isLast: boolean) => {
        if (isLast) return 80; // Short line for last item

        // Base height + additional height per detail line
        const baseHeight = 60;
        const heightPerDetail = 16; // ~16px per detail line
        return Math.max(baseHeight, baseHeight + (detailsCount * heightPerDetail));
    };

    return (
        <Card className="p-3 w-6/12">
            <CardHeader className="p-0">
                <CardTitle className="font-bold text-lg p-0 pb-1 border-b">Activity Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="h-[30rem] flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : activityLogs.length === 0 ? (
                    <div className="h-[30rem] flex items-center justify-center">
                        <div className="text-center text-muted-foreground text-sm">No activity logs found</div>
                    </div>
                ) : (
                    <div id="activity-scroll-container" className="h-[30rem] overflow-y-auto px-3" style={{ scrollbarWidth: "thin" }}>
                        <InfiniteScroll
                            dataLength={activityLogs.length}
                            next={loadMoreData}
                            hasMore={hasMore}
                            loader={<LoadingSpinner />}
                            endMessage={
                                <div className="text-center text-muted-foreground text-xs py-4">End of activity logs</div>
                            }
                            scrollableTarget="activity-scroll-container"
                        >
                            <div className="space-y-4">
                                {Object.entries(groupedActivities).map(([dateKey, activities]) => (
                                    <div key={dateKey} className="space-y-3">
                                        <div className="text-sm font-medium bg-hms-primary/15 px-2 py-1 mb-5 rounded">{dateKey}</div>
                                        <div className="space-y-3 pl-4">
                                            {activities.map((activity, index) => {
                                                const activityDisplay = getActivityDisplay(activity);
                                                const isLast = index === activities.length - 1;
                                                const flexibleHeight = getFlexibleHeight(activityDisplay.details.length, isLast);

                                                return (
                                                    <div key={activity.id} className="ml-10">
                                                        <div className="flex-shrink-0 relative -left-30 -top-6">
                                                            <div
                                                                className="w-px bg-hms-primary mt-1 absolute left-20"
                                                                style={{ height: `${flexibleHeight}px` }}
                                                            >
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
                    </div>
                )}
            </CardContent>
        </Card >
    );
};

export default ActivityLogsCard;
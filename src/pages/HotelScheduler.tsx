import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { format, addDays, startOfWeek, differenceInDays, isToday } from "date-fns"
import { ChevronLeft, ChevronRight, Circle } from "lucide-react"
import { Button } from "../components/atoms/Button"
import { Input } from "../components/atoms/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/molecules/Select"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../components/atoms/Tooltip"
import { ScrollArea } from "@/components/atoms/ScrollArea"
import { Room } from "@/validation"
import { cancelReservation, getReservations } from "@/services/Reservation"
import { ReservationResponse } from "@/validation/schemas/Reservations"
import CheckOutDialog from "../components/dialogs/CheckOutDialog"
import ChooseReservationOptionDialog from "@/components/dialogs/ChooseReservationOptionDialog"
import AddChargesDialog from "@/components/dialogs/AddPaymentDialog"
import AddChargeDialog from "@/components/dialogs/AddChargeDialog"
import EditReservationDialog from "@/components/dialogs/EditReservationDialog"
import CheckInDialog from "@/components/dialogs/CheckInDialog"
import DeleteDialog from "@/components/molecules/DeleteDialog"
import { toast } from "sonner"
import ViewPaymentsDialog from "@/components/dialogs/ViewPaymentsDialog"
import ViewReservationDialog from "@/components/dialogs/ViewReservationDialog"
import { Skeleton } from "@/components/atoms/Skeleton"
import TransferChargesDialog from "@/components/dialogs/TransferChargesDialog"

interface HotelReservationCalendarProps {
  pageTitle?: string;
}

export type UIReservation = {
  id: string
  resourceId: string
  guestName: string
  bookingId: string
  start: Date
  end: Date
  status: string
  rate: string
  specialRequests: string
  guestId: string
  roomNumber: string
  roomType: string
  ratePlanId?: string
  roomTypeId?: string
  identification?: string
  createdByUser?: string
  checkInTime?: Date
  hasOverlap?: boolean
}

interface GridEvent extends UIReservation {
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
  isSegmented?: boolean;
  overlapIndex?: number;
  totalOverlaps?: number;
  segmentId?: string;
}

const HotelReservationCalendar: React.FC<HotelReservationCalendarProps> = ({ pageTitle }) => {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<UIReservation[]>([])
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1 }), [currentDate]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const [checkInCheckOutDialog, setCheckInCheckOutDialog] = useState(false);
  const [checkOutDialog, setCheckOutDialog] = useState(false);
  const [dialogReservation, setDialogReservation] = useState<UIReservation | null>(null)
  const [chooseOptionDialog, setChooseOptionDialog] = useState(false);
  const [addChargesDialog, setAddChargesDialog] = useState(false);
  const [addChargeDialog, setAddChargeDialog] = useState(false);
  const [editReservationDialog, setEditReservationDialog] = useState(false);
  const [cancelReservationDialog, setCancelReservationDialog] = useState(false)
  const [reservationToCancel, setReservationToCancel] = useState('')
  const [viewPaymentsDialog, setViewPaymentsDialog] = useState(false);
  const [viewReservationDialog, setViewReservationDialog] = useState(false);
  const [transferChargesDialog, setTransferChargesDialog] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true)
      try {
        const response: ReservationResponse = await getReservations(weekStart, weekEnd);
        const apiReservations = response.data.reservations;

        const extractedRooms: Room[] = [];
        const seenRoomIds = new Set<string>();

        apiReservations.forEach((reservation) => {
          reservation.Room.forEach((room) => {
            if (!seenRoomIds.has(room.id)) {
              seenRoomIds.add(room.id);
              extractedRooms.push({
                id: room.id,
                roomNumber: room.roomNumber,
                status: room.status,
                floor: room.floor,
                description: room.description,
                roomTypeId: room.roomTypeId,
                photos: room.photos,
                hotelId: room.hotelId,
                roomType: {
                  id: reservation.id,
                  name: reservation.name,
                  description: reservation.description,
                  baseRate: reservation.baseRate,
                  hotelId: reservation.hotelId,
                  createdAt: reservation.createdAt.toString(),
                  updatedAt: reservation.updatedAt.toString(),
                  maxOccupancy: reservation.maxOccupancy,
                  adultOccupancy: reservation.adultOccupancy,
                  childOccupancy: reservation.childOccupancy,
                }
              });
            }
          });
        });

        setAllRooms(extractedRooms);

        // Create reservations with guest names - THIS WAS MISSING THE ACTUAL MAPPING LOGIC
        const reservationsWithGuestNames: UIReservation[] = [];

        // Add the missing logic to populate reservations
        for (const reservation of apiReservations) {
          for (const room of reservation.Room) {
            for (const mappedReservation of room.reservations || []) {
              reservationsWithGuestNames.push({
                id: mappedReservation.id,
                resourceId: room.id,
                guestName: mappedReservation.guest ? `${mappedReservation.guest.firstName} ${mappedReservation.guest.lastName}` : 'Unknown Guest',
                bookingId: reservation.id,
                start: new Date(mappedReservation.checkIn),
                end: new Date(mappedReservation.checkOut),
                status: String(mappedReservation.status),
                rate: reservation.baseRate,
                specialRequests: reservation.description,
                guestId: mappedReservation.guestId,
                roomNumber: room.roomNumber,
                roomType: reservation.name,
                ratePlanId: mappedReservation.ratePlanId,
                roomTypeId: room.roomTypeId || room.roomTypeId,
                createdByUser: mappedReservation.createdByUser?.firstName + ' ' + mappedReservation.createdByUser?.lastName,
                checkInTime: mappedReservation.checkInTime ? new Date(mappedReservation.checkInTime) : undefined
              });
            }
          }
        }

        setReservations(reservationsWithGuestNames);
      } catch (err: any) {
        console.error("Failed to fetch reservations:", err);
        setError(err.userMessage);
      } finally {
        setLoading(false)
      }
    };

    fetchReservations();
  }, [weekStart, weekEnd]);

  const roomsByType = useMemo(() => {
    const grouped: Record<string, Room[]> = {};
    allRooms.forEach((room) => {
      const typeName = room.roomType?.name ?? "Unknown";
      if (!grouped[typeName]) grouped[typeName] = [];
      grouped[typeName].push(room);
    });
    return grouped;
  }, [allRooms]);

  const validRoomNumbers = useMemo(() => {
    return new Set(allRooms.map(room => room.roomNumber));
  }, [allRooms]);

  const filteredRoomsByType = useMemo(() => {
    if (!searchTerm) return roomsByType;

    const filtered: Record<string, Room[]> = {};

    Object.entries(roomsByType).forEach(([type, typeRooms]) => {
      // Filter rooms that match the search term (by room number, room type, or guest name)
      const matchingRooms = typeRooms.filter((room) =>
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.roomType?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Also search by guest name in reservations
        reservations.some(res =>
          res.resourceId === room.id &&
          res.guestName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      // Only include room types that have matching rooms
      if (matchingRooms.length > 0) {
        filtered[type] = matchingRooms;
      }
    });

    return filtered;
  }, [roomsByType, searchTerm, reservations]);

  const flattenedRooms = useMemo(() => {
    const flattened: (Room | { type: "header"; name: string })[] = [];
    Object.entries(filteredRoomsByType).forEach(([type, typeRooms]) => {
      flattened.push({ type: "header", name: type });
      flattened.push(...typeRooms);
    });
    return flattened;
  }, [filteredRoomsByType]);

  // Replace filteredReservations logic to make status filter functional
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch =
        !searchTerm ||
        reservation.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase());

      // Normalize status for comparison
      const normalizedStatus = reservation.status?.toLowerCase();
      let matchesStatus = true;
      if (filterStatus !== "all") {
        matchesStatus = normalizedStatus === filterStatus.toLowerCase();
      }

      const overlapsWithWeek = reservation.start <= weekEnd && reservation.end >= weekStart;
      const hasValidRoomNumber = validRoomNumbers.has(reservation.roomNumber);

      return matchesSearch && matchesStatus && overlapsWithWeek && hasValidRoomNumber;
    });
  }, [reservations, searchTerm, filterStatus, weekStart, weekEnd, validRoomNumbers]);

  const gridEvents = useMemo((): GridEvent[] => {
    const basicGridEvents: GridEvent[] = filteredReservations.map((reservation) => {
      const visibleStart = reservation.start > weekStart ? reservation.start : weekStart;
      const visibleEnd = reservation.end < weekEnd ? reservation.end : weekEnd;

      const startDayIndex = differenceInDays(visibleStart, weekStart);
      const endDayIndex = differenceInDays(visibleEnd, weekStart);

      const gridStart = Math.max(0, Math.min(startDayIndex, 6)) + 2;
      const gridEnd = Math.max(gridStart, Math.min(endDayIndex, 6) + 3);

      const roomGridIndex = flattenedRooms.findIndex(
        (item) => "id" in item && item.id === reservation.resourceId
      );

      return {
        ...reservation,
        gridColumnStart: gridStart,
        gridColumnEnd: gridEnd,
        gridRowStart: roomGridIndex + 1,
        gridRowEnd: roomGridIndex + 2,
      };
    });

    const reservationsByRoom = new Map<string, GridEvent[]>();
    basicGridEvents.forEach(event => {
      if (!reservationsByRoom.has(event.resourceId)) {
        reservationsByRoom.set(event.resourceId, []);
      }
      reservationsByRoom.get(event.resourceId)!.push(event);
    });

    const finalEvents: GridEvent[] = [];

    reservationsByRoom.forEach(roomReservations => {
      if (roomReservations.length === 1) {
        finalEvents.push(...roomReservations);
        return;
      }

      const sortedReservations = roomReservations.sort((a, b) =>
        a.gridColumnStart - b.gridColumnStart || a.start.getTime() - b.start.getTime()
      );

      sortedReservations.forEach((reservation, index) => {
        let hasOverlap = false;
        let overlapIndex = 0;

        for (let i = 0; i < sortedReservations.length; i++) {
          if (i === index) continue;

          const other = sortedReservations[i];
          const overlapStart = Math.max(reservation.gridColumnStart, other.gridColumnStart);
          const overlapEnd = Math.min(reservation.gridColumnEnd, other.gridColumnEnd);

          if (overlapStart < overlapEnd) {
            hasOverlap = true;
            if (reservation.status === 'CHECKED_OUT' && other.status !== 'CHECKED_OUT') {
              overlapIndex = 0;
            } else if (other.status === 'CHECKED_OUT' && reservation.status !== 'CHECKED_OUT') {
              overlapIndex = 1;
            } else {
              overlapIndex = index;
            }
            break;
          }
        }

        if (hasOverlap) {
          finalEvents.push({
            ...reservation,
            isSegmented: true,
            overlapIndex: overlapIndex,
            totalOverlaps: 2,
            segmentId: `${reservation.id}-overlap`
          });
        } else {
          finalEvents.push(reservation);
        }
      });
    });

    return finalEvents;
  }, [filteredReservations, flattenedRooms, weekStart, weekEnd]);

  const getStatusColor = (status: string) => {
    const colors = {
      "CHECKED_IN": "bg-chart-1/20 border-l-4 border-chart-1",
      "CHECKED_OUT": "bg-chart-5/20 border-l-4 border-chart-5",
      "HELD": "bg-chart-3/20 border-l-4 border-chart-3",
    };
    return colors[status as keyof typeof colors] || colors.HELD;
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CHECKED_IN":
        return "Checked In";
      case "CHECKED_OUT":
        return "Checked Out";
      case "HELD":
        return "Held";
      default:
        return status;
    }
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "text-chart-1 fill-chart-1";
      case "OCCUPIED":
        return "text-chart-5 fill-chart-5";
      case "MAINTENANCE":
        return "text-chart-4 fill-chart-4";
      case "DIRTY":
        return "text-chart-6 fill-chart-6";
      case "CLEANING":
        return "text-chart-7 fill-chart-7";
      case "RESERVED":
        return "text-chart-3 fill-chart-3";
      case "OUT_OF_SERVICE":
        return "text-chart-2 fill-chart-2";
      default:
        return "text-gray-500 fill-gray-500";
    }
  };

  const calculateStayDuration = (start: Date, end: Date): string => {
    const nights = differenceInDays(end, start);
    return `${nights} night${nights !== 1 ? 's' : ''}`;
  };

  const handleReservationUpdate = (updatedReservation: UIReservation) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === updatedReservation.id ? updatedReservation : reservation
      )
    );
  };

  const refreshReservations = async () => {
    try {
      const response: ReservationResponse = await getReservations(weekStart, weekEnd);
      const apiReservations = response.data.reservations;

      // Extract all rooms from the reservation response
      const extractedRooms: Room[] = [];
      const seenRoomIds = new Set<string>();

      apiReservations.forEach((reservation) => {
        reservation.Room.forEach((room) => {
          if (!seenRoomIds.has(room.id)) {
            seenRoomIds.add(room.id);
            extractedRooms.push({
              id: room.id,
              roomNumber: room.roomNumber,
              status: room.status,
              floor: room.floor,
              description: room.description,
              roomTypeId: room.roomTypeId,
              photos: room.photos,
              hotelId: room.hotelId,
              roomType: {
                id: reservation.id,
                name: reservation.name,
                description: reservation.description,
                baseRate: reservation.baseRate,
                hotelId: reservation.hotelId,
                createdAt: reservation.createdAt.toString(),
                updatedAt: reservation.updatedAt.toString(),
                maxOccupancy: reservation.maxOccupancy,
                adultOccupancy: reservation.adultOccupancy,
                childOccupancy: reservation.childOccupancy,
              }
            });
          }
        });
      });

      setAllRooms(extractedRooms);

      // Create reservations with guest names
      const reservationsWithGuestNames: UIReservation[] = [];

      for (const reservation of apiReservations) {
        for (const room of reservation.Room) {
          for (const mappedReservation of room.reservations || []) {
            // Fetch guest name for each reservation

            reservationsWithGuestNames.push({
              id: mappedReservation.id,
              resourceId: room.id,
              guestName: mappedReservation.guest.firstName + mappedReservation.guest.lastName,
              bookingId: reservation.id,
              start: new Date(mappedReservation.checkIn),
              end: new Date(mappedReservation.checkOut),
              status: String(mappedReservation.status),
              rate: reservation.baseRate,
              specialRequests: reservation.description,
              guestId: mappedReservation.guestId,
              roomNumber: room.roomNumber,
              roomType: reservation.name,
              ratePlanId: mappedReservation.ratePlanId,
              roomTypeId: room.roomTypeId || room.roomTypeId,
            });
          }
        }
      }

      setReservations(reservationsWithGuestNames);
    } catch (err) {
      console.error("Failed to refresh reservations:", err);
    }
  };

  const handleCancelReservation = async () => {
    try {
      await cancelReservation(reservationToCancel);
      toast.success('Success', {
        description: 'Reservation was canceled'
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Could not cancel reservation'
      })
    } finally {
      setCancelReservationDialog(false)
    }
  }

  const handleBackToChooseOptions = () => {
    setAddChargeDialog(false)
    setCheckInCheckOutDialog(false)
    setCheckOutDialog(false)
    setAddChargesDialog(false)
    setEditReservationDialog(false)
    setViewPaymentsDialog(false)
    setViewReservationDialog(false)
    setCancelReservationDialog(false)
    setTransferChargesDialog(false)
    setChooseOptionDialog(true)
  }

  return (
    <TooltipProvider>
      <div className="px-4">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          </div>

          <div className="grid grid-cols-5 ww-full items-center gap-4">
            {/* <div className="flex gap-2 text-sm w-full"> */}
            <div className="flex items-center bg-chart-1/20 border-l-chart-1 border-l-4 pl-1 rounded py-0.5 font-semibold ">
              <span className="text-xs">Checked In</span>
            </div>
            <div className="flex items-center bg-chart-5/20 border-l-chart-5 border-l-4 pl-1 rounded py-0.5 font-semibold ">
              <span className="text-xs">Checked Out</span>
            </div>
            <div className="flex items-center bg-chart-3/20 border-l-chart-3 border-l-4 pl-1 rounded py-0.5 font-semibold ">
              <span className="text-xs">Held</span>
            </div>
            {/* </div> */}

            {/* <div className="flex gap-2"> */}
            <Input
              placeholder="Search Room or Room Type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                <SelectItem value="CHECKED_OUT">Checked Out</SelectItem>
                {/* <SelectItem value="CONFIRMED">Confirmed</SelectItem> */}
                <SelectItem value="HELD">Held</SelectItem>
              </SelectContent>
            </Select>
            {/* </div> */}
          </div>
        </div>

        {/* Calendar Header */}
        <div className="bg-white border-b border-gray-300 mb-5">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `130px repeat(${weekDates.length}, minmax(145px, 5fr))`,
              gridTemplateRows: `auto auto auto`,
            }}
          >
            <div className="border-x border-gray-300 p-4 flex items-center" style={{ gridColumn: 1, gridRow: "1 / 4" }}>
              <span className="font-semibold">Rooms</span>
            </div>

            <div
              className="border-b border-r border-gray-300 p-2 flex items-center justify-start gap-2"
              style={{ gridColumn: `2 / ${weekDates.length + 2}`, gridRow: 1 }}
            >
              <span className="text-md font-bold">{format(currentDate, "MMMM yyyy")}</span>
              <Button
                size="icon"
                onClick={() => setCurrentDate((prev) => addDays(prev, -7))}
                className="h-6 w-6 rounded-full bg-hms-accent/25 text-black hover:bg-hms-accent/50"
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                size="icon"
                onClick={() => setCurrentDate((prev) => addDays(prev, 7))}
                className="h-6 w-6 rounded-full bg-hms-accent/25 text-black hover:bg-hms-accent/50"
              >
                <ChevronRight size={14} />
              </Button>
            </div>

            {weekDates.map((date, index) => {
              return (
                <div
                  key={`day-${date.toISOString()}`}
                  className={`border-r border-gray-300 text-start px-2 text-xs text-muted-foreground font-medium ${isToday(date) ? "bg-blue-50 text-blue-700" : ""
                    }`}
                  style={{ gridColumn: index + 2, gridRow: 2 }}
                >
                  {format(date, "EEE").toUpperCase()}
                </div>
              );
            })}

            {weekDates.map((date, index) => {
              return (
                <div
                  key={`date-${date.toISOString()}`}
                  className={`border-r border-gray-300 text-start px-2 text-lg font-semibold ${isToday(date) ? "bg-blue-50 text-blue-700" : ""
                    }`}
                  style={{ gridColumn: index + 2, gridRow: 3 }}
                >
                  {format(date, "d")}
                </div>
              );
            })}
          </div>
        </div>

        {
          loading ? (
            <>
              <Skeleton className="h-[100px] mb-2" />
              <Skeleton className="h-[100px] mb-2" />
              <Skeleton className="h-[100px] mb-2" />
              <Skeleton className="h-[100px] mb-2" />
              <Skeleton className="h-[100px] mb-2" />
              <Skeleton className="h-[100px] mb-2" />
            </>
          ) : error ? (
            <div className="mt-10 text-center text-muted-foreground text-lg">{error}</div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div
                  className="grid border-collapse"
                  style={{
                    gridTemplateColumns: `130px repeat(${weekDates.length}, minmax(145px, 5fr))`,
                    gridTemplateRows: flattenedRooms
                      .map((item) => ("type" in item && item.type === "header" ? "40px" : "100px"))
                      .join(" "),
                  }}
                >
                  {flattenedRooms.map((item, index) => (
                    <div
                      key={`room-${index}`}
                      className={`border-b border-gray-200 flex items-center justify-between sticky left-0 z-10 ${"type" in item && item.type === "header"
                        ? "bg-hms-accent/15 font-bold text-gray-700 px-3 py-1"
                        : "bg-gray-50 border-r flex justify-center"
                        }`}
                      style={{
                        gridColumn: 1,
                        gridRow: index + 1,
                      }}
                    >
                      {"type" in item && item.type === "header" ? (
                        <div className="font-bold text-xs uppercase tracking-wide">{item.name}</div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-sm">{(item as Room).roomNumber}</div>
                          <span
                            className={`text-xs gap-1 font-medium flex items-center ${getRoomStatusColor((item as Room).status)}`}
                            style={{ minWidth: 70, textAlign: 'center' }}
                          >
                            <Circle className={`${getRoomStatusColor((item as Room).status)} size-1`} />
                            {(item as Room).status}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  {flattenedRooms.map((item, roomIndex) =>
                    weekDates.map((date, dateIndex) => {
                      return (
                        <div
                          key={`cell-${roomIndex}-${date.toISOString()}`}
                          className={`border-b border-gray-200 transition-colors ${"type" in item && item.type === "header"
                            ? "bg-hms-accent/15 cursor-default"
                            : `border-r ${isToday(date) ? "bg-blue-50" : "bg-white"
                            }`
                            }`}
                          style={{
                            gridColumn: dateIndex + 2,
                            gridRow: roomIndex + 1,
                          }}
                        />
                      );
                    })
                  )}

                  {gridEvents.map((event) => (
                    <Tooltip key={event.segmentId || event.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`rounded m-1 px-2 py-1 text-xs font-medium cursor-pointer transition-all hover:shadow-lg hover:scale-101 z-30 ${getStatusColor(
                            event.status
                          )}`}
                          style={{
                            gridColumnStart: event.gridColumnStart,
                            gridColumnEnd: event.gridColumnEnd,
                            gridRowStart: event.gridRowStart,
                            gridRowEnd: event.gridRowEnd,
                            ...(event.totalOverlaps && event.totalOverlaps > 1 && {
                              height: event.overlapIndex === 0 ? 'calc(50% - 3px)' : 'calc(50% - 9px)',
                              position: 'relative',
                              top: event.overlapIndex === 0 ? '0%' : '50%',
                              zIndex: 35 + (event.overlapIndex || 0),
                            })
                          }}
                          onClick={() => {
                            setChooseOptionDialog(true);
                            setDialogReservation(event);
                            setReservationToCancel(event.id)
                          }}
                        >
                          <div className="truncate font-medium">{event.guestName}</div>
                          <div className="truncate text-xs opacity-75">{getStatusLabel(event.status)}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <div className="font-medium">{event.guestName}</div>
                          <div className="text-sm">Room: {event.roomNumber}</div>
                          <div className="text-sm">Type: {event.roomType}</div>
                          <div className="text-sm">
                            {format(event.start, "MMM d")} - {format(event.end, "MMM d")}
                          </div>
                          <div className="text-sm">Status: {getStatusLabel(event.status)}</div>
                          <div className="text-sm">${event.rate}/night</div>
                          {event.specialRequests && (
                            <div className="text-sm text-gray-600">{event.specialRequests}</div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

      </div>
      <CheckInDialog open={checkInCheckOutDialog} setOpen={setCheckInCheckOutDialog} reservationId={dialogReservation?.id} reservationData={dialogReservation} onCheckInComplete={refreshReservations} onBackToChooseOptions={handleBackToChooseOptions} />
      <CheckOutDialog open={checkOutDialog} setOpen={setCheckOutDialog} reservationId={dialogReservation?.id} reservationData={dialogReservation} onCheckOutComplete={refreshReservations} onBackToChooseOptions={handleBackToChooseOptions} />
      <EditReservationDialog
        open={editReservationDialog}
        setOpen={setEditReservationDialog}
        reservationData={dialogReservation}
        onSave={handleReservationUpdate}
        onRefresh={refreshReservations}
        onBackToChooseOptions={handleBackToChooseOptions}
      />
      <AddChargesDialog
        open={addChargesDialog}
        setOpen={setAddChargesDialog}
        reservationId={dialogReservation?.id}
        onBackToChooseOptions={handleBackToChooseOptions}
      />
      <AddChargeDialog
        open={addChargeDialog}
        setOpen={setAddChargeDialog}
        reservationId={dialogReservation?.id || ''}
        onBackToChooseOptions={handleBackToChooseOptions}
      />
      <ViewPaymentsDialog
        open={viewPaymentsDialog}
        setOpen={setViewPaymentsDialog}
        reservationId={dialogReservation?.id || ''}
        guestName={dialogReservation?.guestName || ''}
        roomNumber={dialogReservation?.roomNumber || ''}
        bookingId={dialogReservation?.bookingId || ''}
        onBackToChooseOptions={handleBackToChooseOptions}
      />
      <ViewReservationDialog
        open={viewReservationDialog}
        setOpen={setViewReservationDialog}
        reservationId={dialogReservation?.id || ''}
        onBackToChooseOptions={handleBackToChooseOptions}
        checkedInAt={dialogReservation?.checkInTime}
        createdByUser={dialogReservation?.createdByUser}
      />
      <TransferChargesDialog
        open={transferChargesDialog}
        onOpenChange={setTransferChargesDialog}
        reservationId={dialogReservation?.id || ''}
        onBackToChooseOptions={handleBackToChooseOptions}
      />
      <ChooseReservationOptionDialog
        open={chooseOptionDialog}
        setOpen={setChooseOptionDialog}
        title="Reservation Actions"
        description="Choose an action to perform for this reservation"
        checkIn={() => setCheckInCheckOutDialog(true)}
        checkOut={() => setCheckOutDialog(true)}
        addCharges={() => setAddChargesDialog(true)}
        addCharge={() => setAddChargeDialog(true)}
        editReservation={() => { setEditReservationDialog(true) }}
        isCheckedIn={dialogReservation?.status?.toLowerCase() === 'checked_in' || dialogReservation?.status?.toLowerCase() === 'occupied'}
        isCheckedOut={dialogReservation?.status?.toLowerCase() === 'checked_out'}
        viewPayments={() => setViewPaymentsDialog(true)}
        guestId={dialogReservation?.guestId}
        roomNumber={dialogReservation?.roomNumber}
        roomType={dialogReservation?.roomType}
        checkInDate={dialogReservation?.start?.toISOString()}
        checkOutDate={dialogReservation?.end?.toISOString()}
        stayDuration={dialogReservation ? calculateStayDuration(dialogReservation.start, dialogReservation.end) : ''}
        cancelReservation={() => setCancelReservationDialog(true)}
        viewReservation={() => setViewReservationDialog(true)}
        createdByUser={dialogReservation?.createdByUser || 'Unknown User'}
        checkedInAt={dialogReservation?.checkInTime || null}
        transferCharge={() => setTransferChargesDialog(true)} />
      <DeleteDialog isOpen={cancelReservationDialog} onCancel={() => { setCancelReservationDialog(false); setReservationToCancel('') }} onConfirm={handleCancelReservation} cancelText="Back" confirmText="Cancel Reservation" description="Are you sure you want to cancel this reservation?" title="Cancel Reservation" refetchReservations={refreshReservations} />
    </TooltipProvider>
  );
};

export default HotelReservationCalendar;
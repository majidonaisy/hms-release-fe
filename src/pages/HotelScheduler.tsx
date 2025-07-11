import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { format, addDays, startOfWeek, differenceInDays, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../components/atoms/Button"
import { Input } from "../components/atoms/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/molecules/Select"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../components/atoms/Tooltip"
import { ScrollArea } from "@/components/atoms/ScrollArea"
import { Room } from "@/validation"
import { getRooms } from "@/services/Rooms"
import { getReservations } from "@/services/Reservation"
import { ReservationResponse } from "@/validation/schemas/Reservations"
import CheckOutDialog from "../components/dialogs/CheckOutDialog"
import CheckInCheckoutDialog from "@/components/dialogs/CheckInCheckOutDialog"

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
}

const HotelReservationCalendar: React.FC<HotelReservationCalendarProps> = ({ pageTitle }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
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
  console.log('dialogReservation', dialogReservation)
  // Get Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms();
        setRooms(response.data);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response: ReservationResponse = await getReservations(weekStart, weekEnd);
        const apiReservations = response.data.reservations;

        const flattened: UIReservation[] = apiReservations.flatMap((reservation) =>
          reservation.Room.flatMap((room) =>
            (room.reservations ?? []).map((resv) => ({
              id: resv.id,
              resourceId: room.id,
              guestName: reservation.name,
              bookingId: reservation.id,
              start: new Date(resv.checkIn),
              end: new Date(resv.checkOut),
              status: String(resv.status),
              rate: reservation.baseRate,
              specialRequests: reservation.description,
            }))
          )
        );

        setReservations(flattened)
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
      }
    };

    fetchReservations();
  }, [weekStart, weekEnd]);

  const roomsByType = useMemo(() => {
    const grouped: Record<string, Room[]> = {};
    rooms.forEach((room) => {
      const typeName = room.roomType?.name ?? "Unknown";
      if (!grouped[typeName]) grouped[typeName] = [];
      grouped[typeName].push(room);
    });
    return grouped;
  }, [rooms]);

  const flattenedRooms = useMemo(() => {
    const flattened: (Room | { type: "header"; name: string })[] = [];
    Object.entries(roomsByType).forEach(([type, typeRooms]) => {
      flattened.push({ type: "header", name: type });
      flattened.push(...typeRooms);
    });
    return flattened;
  }, [roomsByType]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch =
        !searchTerm ||
        reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.bookingId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === "all" || reservation.status.toLowerCase() === filterStatus;

      const overlapsWithWeek = reservation.start <= weekEnd && reservation.end >= weekStart;

      return matchesSearch && matchesStatus && overlapsWithWeek;
    });
  }, [reservations, searchTerm, filterStatus, weekStart, weekEnd]);

  // Map reservations to grid
  const gridEvents = useMemo(() => {
    return filteredReservations.map((reservation) => {
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
  }, [filteredReservations, flattenedRooms, weekStart, weekEnd]);

  const getStatusColor = (status: string) => {
    const colors = {
      reserved: "bg-chart-1/20 border-l-4 border-chart-1",
      occupied: "bg-chart-2/20 border-l-4 border-chart-2",
      "checked-in": "bg-chart-3/20 border-l-4 border-chart-3",
      "checked-out": "bg-chart-4/20 border-l-4 border-chart-4",
      blocked: "bg-chart-5/20 border-l-4 border-chart-5",
    };
    return colors[status.toLowerCase() as keyof typeof colors] || colors.reserved;
  };

  return (
    <TooltipProvider>
      <div className="px-4">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2 text-sm w-full">
              <div className="flex items-center bg-chart-1/20 border-l-chart-1 border-l-4 pl-1 rounded py-0.5 font-semibold w-1/5 ">
                <span className="text-xs">Reserved</span>
              </div>
              <div className="flex items-center bg-chart-2/20 border-l-chart-2 border-l-4 pl-1 rounded py-0.5 font-semibold w-1/5 ">
                <span className="text-xs">Occupied</span>
              </div>
              <div className="flex items-center bg-chart-3/20 border-l-chart-3 border-l-4 pl-1 rounded py-0.5 font-semibold w-1/5 ">
                <span className="text-xs">Checked-in</span>
              </div>
              <div className="flex items-center bg-chart-4/20 border-l-chart-4 border-l-4 pl-1 rounded py-0.5 font-semibold w-1/5 ">
                <span className="text-xs">Checked-out</span>
              </div>
              <div className="flex items-center bg-chart-5/20 border-l-chart-5 border-l-4 pl-1 rounded py-0.5 font-semibold w-1/5 ">
                <span className="text-xs">Blocked</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Search Text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-fit"
              />

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div
              className="grid border-collapse"
              style={{
                gridTemplateColumns: `130px repeat(${weekDates.length}, minmax(145px, 5fr))`,
                gridTemplateRows: flattenedRooms
                  .map((item) => ("type" in item && item.type === "header" ? "40px" : "80px"))
                  .join(" "),
              }}
            >
              {flattenedRooms.map((item, index) => (
                <div
                  key={`room-${index}`}
                  className={`border-b border-gray-200 flex items-center justify-between sticky left-0 z-10 ${"type" in item && item.type === "header"
                    ? "bg-hms-accent/15 font-bold text-gray-700 px-3 py-1"
                    : "bg-gray-50 border-r p-1"
                    }`}
                  style={{
                    gridColumn: 1,
                    gridRow: index + 1,
                  }}
                >
                  {"type" in item && item.type === "header" ? (
                    <div className="font-bold text-xs uppercase tracking-wide">{item.name}</div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="font-semibold text-sm">{(item as Room).roomNumber}</div>
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
                <Tooltip key={event.id}>
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
                      }}
                      onClick={() => { console.log(event.status); event.status == 'CHECKED_IN' ? setCheckOutDialog(true) : setCheckInCheckOutDialog(true); setDialogReservation(event) }}
                    >
                      <div className="truncate font-medium">{event.guestName}</div>
                      <div className="truncate text-xs opacity-75">{event.status}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <div className="font-medium">{event.guestName}</div>
                      <div className="text-sm">
                        {format(event.start, "MMM d")} - {format(event.end, "MMM d")}
                      </div>
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
      </div>
      <CheckInCheckoutDialog open={checkInCheckOutDialog} setOpen={setCheckInCheckOutDialog} reservationId={dialogReservation?.id} reservationData={dialogReservation} />
      <CheckOutDialog open={checkOutDialog} setOpen={setCheckOutDialog} reservationId={dialogReservation?.id} />
    </TooltipProvider>
  );
};

export default HotelReservationCalendar;
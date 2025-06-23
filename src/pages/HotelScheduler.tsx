import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { format, addDays, startOfWeek, differenceInDays, isToday } from "date-fns"
import { ChevronLeft, ChevronRight, BrushCleaning } from 'lucide-react'
import type { Room, Reservation } from "../types/reservation"
import { sampleRooms, sampleReservations } from "../data/data"
import { Button } from "../components/atoms/Button"
import { Input } from "../components/atoms/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/molecules/Select"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../components/atoms/Tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/molecules/AlertDialog"
import { ScrollArea } from "@/components/atoms/ScrollArea"

interface HotelReservationCalendarProps {
  modalContext?: {
    openReservationModal: (data: {
      room?: Room
      reservation?: Reservation
      dateRange?: { start: Date; end: Date }
    }) => void
  }
  pageTitle?: string
}

const HotelReservationCalendar: React.FC<HotelReservationCalendarProps> = ({ modalContext, pageTitle }) => {
  const [rooms] = useState<Room[]>(sampleRooms)
  const [reservations, setReservations] = useState<Reservation[]>(sampleReservations)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    reservationId?: string
  }>({ open: false })

  // Get week dates - consistently 7 days only
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = addDays(weekStart, 6) // 7 days total (0-6 = 7 days)
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Group rooms by type
  const roomsByType = useMemo(() => {
    const grouped = rooms.reduce(
      (acc, room) => {
        if (!acc[room.type]) {
          acc[room.type] = []
        }
        acc[room.type].push(room)
        return acc
      },
      {} as Record<string, Room[]>,
    )
    return grouped
  }, [rooms])

  // Create flattened room list with type headers for grid positioning
  const flattenedRooms = useMemo(() => {
    const flattened: (Room | { type: "header"; name: string })[] = []
    Object.entries(roomsByType).forEach(([type, typeRooms]) => {
      flattened.push({ type: "header", name: type })
      flattened.push(...typeRooms)
    })
    return flattened
  }, [roomsByType])

  // Filter reservations
  const filteredReservations = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Start of today

    return reservations.filter((reservation) => {
      // Existing filters
      const matchesSearch =
        !searchTerm ||
        reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.bookingId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === "all" || reservation.status === filterStatus

      // Date range filtering - only show reservations that overlap with the 7-day week
      const overlapsWithWeek = reservation.start <= weekEnd && reservation.end >= weekStart

      return matchesSearch && matchesStatus && overlapsWithWeek
    })
  }, [reservations, searchTerm, filterStatus, weekStart, weekEnd])

  // Convert reservations to grid-positioned events - CONSTRAINED TO 7 DAYS
  const gridEvents = useMemo(() => {
    return filteredReservations.map((reservation) => {
      // Constrain the reservation display to only the visible 7-day week
      const startDate = reservation.start > weekStart ? reservation.start : weekStart
      const endDate = reservation.end < weekEnd ? reservation.end : weekEnd

      const startDayIndex = differenceInDays(startDate, weekStart)
      const endDayIndex = differenceInDays(endDate, weekStart)

      // Ensure we don't go beyond the 7-day boundary
      const constrainedStartIndex = Math.max(0, Math.min(startDayIndex, 6))
      const constrainedEndIndex = Math.max(constrainedStartIndex, Math.min(endDayIndex, 6))

      const duration = constrainedEndIndex - constrainedStartIndex + 1

      // Find the actual room in the flattened array (skip headers)
      const roomGridIndex = flattenedRooms.findIndex((item) => "id" in item && item.id === reservation.resourceId)

      return {
        ...reservation,
        gridColumnStart: constrainedStartIndex + 2, // +2 because first column is room names
        gridColumnEnd: constrainedStartIndex + duration + 1,
        gridRowStart: roomGridIndex + 1, // +1 because grid is 1-indexed
        gridRowEnd: roomGridIndex + 2,
      }
    })
  }, [filteredReservations, flattenedRooms, weekStart, weekEnd])

  const handleCellClick = useCallback(
    (date: Date, room: Room) => {
      if (modalContext) {
        modalContext.openReservationModal({
          room,
          dateRange: { start: date, end: addDays(date, 1) },
        })
      }
    },
    [modalContext],
  )

  const handleReservationClick = useCallback(
    (reservation: Reservation) => {
      const room = rooms.find((r) => r.id === reservation.resourceId)
      if (room && modalContext) {
        modalContext.openReservationModal({
          reservation,
          room,
        })
      }
    },
    [rooms, modalContext],
  )

  const handleDeleteReservation = useCallback((reservationId: string) => {
    setReservations((prev) => prev.filter((res) => res.id !== reservationId))
    setDeleteDialog({ open: false })
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      reserved: "bg-chart-1/20 border-l-4 border-chart-1",
      occupied: "bg-chart-2/20 border-l-4 border-chart-2",
      "checked-in": "bg-chart-3/20 border-l-4 border-chart-3",
      "checked-out": "bg-chart-4/20 border-l-4 border-chart-4",
      blocked: "bg-chart-5/20 border-l-4 border-chart-5",
    }
    return colors[status as keyof typeof colors] || colors.reserved
  }

  return (
    <TooltipProvider>
      <div className="px-4">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          </div>

          {/* Controls */}
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

        {/* Calendar Header - Rooms and Dates */}
        <div className="bg-white border-b border-gray-300 mb-5">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `130px repeat(${weekDates.length}, minmax(145px, 5fr))`,
              gridTemplateRows: `auto auto auto`,
            }}
          >
            {/* Rooms header */}
            <div className="border-x border-gray-300 p-4 flex items-center" style={{ gridColumn: 1, gridRow: "1 / 4" }}>
              <span className="font-semibold">Rooms</span>
            </div>

            {/* Month navigation - spans all date columns */}
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

            {/* Day names row - all 7 days */}
            {weekDates.map((date, index) => {
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <div
                  key={`day-${date.toISOString()}`}
                  className={`border-r border-gray-300 text-start px-2 text-xs text-muted-foreground font-medium ${isToday(date)
                    ? "bg-blue-50 text-blue-700"
                    : isWeekend
                      ? "bg-hms-accent/15"
                      : ""
                    }`}
                  style={{ gridColumn: index + 2, gridRow: 2 }}
                >
                  {format(date, "EEE").toUpperCase()}
                </div>
              )
            })}

            {/* Date numbers row - all 7 days */}
            {weekDates.map((date, index) => {
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <div
                  key={`date-${date.toISOString()}`}
                  className={`border-r border-gray-300 text-start px-2 text-lg font-semibold ${isToday(date)
                    ? "bg-blue-50 text-blue-700"
                    : isWeekend
                      ? "bg-hms-accent/15"
                      : ""
                    }`}
                  style={{ gridColumn: index + 2, gridRow: 3 }}
                >
                  {format(date, "d")}
                </div>
              )
            })}
          </div>
        </div>

        {/* Calendar Grid - Rooms and Reservations */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[34rem]">
            <div
              className="grid border-collapse"
              style={{
                gridTemplateColumns: `130px repeat(${weekDates.length}, minmax(145px, 5fr))`,
                gridTemplateRows: flattenedRooms
                  .map((item) => ("type" in item && item.type === "header" ? "40px" : "80px"))
                  .join(" "),
              }}
            >
              {/* Room Labels and Type Headers */}
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
                      {"needsHousekeeping" in item && item.needsHousekeeping && (
                        <div className="">
                          <BrushCleaning className="p-1 rounded-full border border-green-500 bg-green-500 text-white" />
                        </div>
                      )}
                      <div className="font-semibold text-sm">{item.name}</div>
                    </div>
                  )}
                </div>
              ))}

              {/* Calendar Cells - exactly 7 days for each row, matching the header */}
              {flattenedRooms.map((item, roomIndex) =>
                weekDates.map((date, dateIndex) => {
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  return (
                    <div
                      key={`cell-${roomIndex}-${date.toISOString()}`}
                      className={`border-b border-gray-200 transition-colors ${"type" in item && item.type === "header"
                        ? "bg-hms-accent/15 cursor-default"
                        : `hover:bg-blue-50 cursor-pointer border-r ${isToday(date)
                          ? "bg-blue-50"
                          : isWeekend
                            ? "bg-hms-accent/15"
                            : "bg-white"
                        }`
                        }`}
                      style={{
                        gridColumn: dateIndex + 2,
                        gridRow: roomIndex + 1,
                      }}
                      onClick={() => {
                        if ("id" in item) {
                          handleCellClick(date, item)
                        }
                      }}
                    />
                  )
                }),
              )}

              {/* Events - positioned correctly on actual room rows, constrained to 7 days */}
              {gridEvents.map((event) => (
                <Tooltip key={event.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={`rounded m-1 px-2 py-1 text-xs font-medium cursor-pointer transition-all hover:shadow-lg hover:scale-101 z-30 ${getStatusColor(event.status)}`}
                      style={{
                        gridColumnStart: event.gridColumnStart,
                        gridColumnEnd: event.gridColumnEnd,
                        gridRowStart: event.gridRowStart,
                        gridRowEnd: event.gridRowEnd,
                      }}
                      onClick={() => handleReservationClick(event)}
                    >
                      <div className="truncate font-medium">{event.guestName}</div>
                      <div className="truncate text-xs opacity-75">{event.bookingId}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <div className="font-medium">{event.guestName}</div>
                      <div className="text-sm">
                        {format(event.start, "MMM d")} - {format(event.end, "MMM d")}
                      </div>
                      <div className="text-sm">${event.rate}/night</div>
                      {event.specialRequests && <div className="text-sm text-gray-600">{event.specialRequests}</div>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </ScrollArea>
        </div>

        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Reservation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this reservation? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteDialog.reservationId && handleDeleteReservation(deleteDialog.reservationId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}

export default HotelReservationCalendar
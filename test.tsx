<div className="flex-1 overflow-auto p-4">
    <div className="bg-white rounded-lg shadow-sm border min-w-max">
        {/* Calendar Grid using CSS Grid */}
        <div
            className="grid gap-0 border-collapse"
            style={{
                gridTemplateColumns: `200px repeat(${weekDates.length}, minmax(140px, 1fr))`,
                gridTemplateRows: `60px repeat(${rooms.length}, 80px)`
            }}
        >
            {/* Header Row */}
            <div className="border-b border-r border-gray-200 bg-gray-50 flex items-center px-4 font-semibold text-sm">
                Rooms
            </div>


            {/* Room Rows */}
            {gridData.map((rowData, rowIndex) => (
                <React.Fragment key={rowData.room.id}>
                    {/* Room Name Cell */}
                    <div className="border-b border-r border-gray-200 bg-gray-50 p-3 flex flex-col justify-center">
                        <div className="font-semibold text-sm">{rowData.room.name}</div>
                        <div className="text-xs text-gray-600">{rowData.room.type}</div>
                        <div className="text-xs text-green-600 font-medium">${rowData.room.rate}/night</div>
                    </div>

                    {/* Day Cells */}
                    {rowData.days.map((dayData, dayIndex) => {
                        if (dayData.cellType === 'occupied' && !dayData.isStart) {
                            return null; // Skip cells that are part of a span
                        }

                        return (
                            <div
                                key={`${rowData.room.id}-${dayData.date.toISOString()}`}
                                className={`
                                                border-b border-r border-gray-200 relative cursor-pointer transition-colors
                                                ${dayData.cellType === 'empty' ? 'hover:bg-blue-50' : ''}
                                                ${isToday(dayData.date) && dayData.cellType === 'empty' ? 'bg-blue-25' : ''}
                                            `}
                                style={dayData.isStart ? { gridColumn: `span ${dayData.spanDays}` } : {}}
                                onClick={() => handleCellClick(dayData.date, rowData.room)}
                            >
                                {dayData.cellType === 'occupied' && dayData.reservation && (
                                    <div
                                        className={`
                                                        absolute inset-1 rounded px-3 py-2 text-white text-xs font-medium 
                                                        flex flex-col justify-center overflow-hidden
                                                        ${getStatusColor(dayData.reservation.status)}
                                                        hover:shadow-lg transition-shadow
                                                    `}
                                        title={`${dayData.reservation.guestName} - ${dayData.reservation.bookingId}`}
                                    >
                                        <div className="truncate font-medium">{dayData.reservation.guestName}</div>
                                        <div className="truncate text-xs opacity-90">{dayData.reservation.bookingId}</div>
                                        {dayData.spanDays > 1 && (
                                            <div className="text-xs opacity-75">
                                                {format(dayData.reservation.start, 'M/d')} - {format(dayData.reservation.end, 'M/d')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </React.Fragment>
            ))}
        </div>
    </div>
</div>
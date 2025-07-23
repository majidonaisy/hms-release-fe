import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { GetCurrentGuestsResponse, Guest, RoomType } from "@/validation"
import { getRoomTypes } from "@/services/RoomTypes"
import DataTable, { type ActionMenuItem, defaultRenderers, type TableColumn } from "@/components/Templates/DataTable"
import { getCurrentGuests } from "@/services/Reservation"

type CurrentGuestData = {
    id: string
    name: string
    firstName?: string
    lastName?: string
    email: string
    phoneNumber: string
    preferences?: {
        roomType?: string
        smoking?: boolean
    }
    type: 'individual'
    isGroup: false
    originalData: Guest
}

const CurrentGuestList = () => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [currentGuests, setCurrentGuests] = useState<GetCurrentGuestsResponse["data"]>([])
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
    const [combinedData, setCombinedData] = useState<CurrentGuestData[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handleGetCurrentGuests = async () => {
            setLoading(true)
            try {
                const response = await getCurrentGuests()
                setCurrentGuests(response.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        const handleGetRoomTypes = async () => {
            setLoading(true)
            try {
                const response = await getRoomTypes()
                setRoomTypes(response.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        Promise.all([
            handleGetCurrentGuests(),
            handleGetRoomTypes(),
        ])
    }, [])

    useEffect(() => {
        const transformedGuests: CurrentGuestData[] = currentGuests.map(guest => ({
            id: guest.id,
            name: `${guest.firstName} ${guest.lastName}`,
            firstName: guest.firstName,
            lastName: guest.lastName,
            email: guest.email,
            phoneNumber: guest.phoneNumber,
            preferences: guest.preferences,
            type: 'individual' as const,
            isGroup: false,
            originalData: guest
        }))

        setCombinedData(transformedGuests)
    }, [currentGuests])

    const roomTypeMap = roomTypes.reduce(
        (map, roomType) => {
            map[roomType.id] = roomType.name
            return map
        },
        {} as Record<string, string>,
    )

    const guestColumns: TableColumn<CurrentGuestData>[] = [
        {
            key: "name",
            label: "Name",
            render: (item) => defaultRenderers.avatar(item as any),
        },
        {
            key: "type",
            label: "Type",
            render: (item) => (
                <span className='px-2 py-1 rounded-full text-xs font-medium'>
                    INDIVIDUAL
                </span>
            ),
        },
        {
            key: "email",
            label: "Email",
            className: "font-medium text-gray-900",
        },
        {
            key: "preferences",
            label: "Preferred Room",
            render: (item) => (
                <span className="text-gray-600">
                    {(item.preferences?.roomType && roomTypeMap[item.preferences.roomType]) || "Unknown"}
                </span>
            ),
        },
        {
            key: "smoking",
            label: "Other Requests",
            render: (item) => defaultRenderers.smoking(item, item.preferences?.smoking ?? false),
        },
        {
            key: "phoneNumber",
            label: "Contact Info",
            className: "text-gray-600",
        },
    ]

    const guestActions: ActionMenuItem<CurrentGuestData>[] = [
        {
            label: "Edit",
            onClick: (item, e) => {
                e.stopPropagation()
                navigate(`/guests-profile/${item.id}`)
            },
            action: "update",
            subject: "Guest"
        },
    ]

    const handleRowClick = (item: CurrentGuestData) => {
        navigate(`/guests-profile/${item.id}/view`)
    }

    return (
        <DataTable
            data={combinedData}
            loading={loading}
            columns={guestColumns}
            title="Current Guests List"
            actions={guestActions}
            onRowClick={handleRowClick}
            getRowKey={(item) => `current-guest-${item.id}`}
            filter={{
                searchPlaceholder: "Search current guests...",
                searchFields: ["name", "email"],
            }}
            pagination={{
                currentPage,
                totalPages: Math.ceil(combinedData.length / 10),
                totalItems: combinedData.length,
                onPageChange: setCurrentPage,
                showPreviousNext: true,
                maxVisiblePages: 7,
            }}
        />
    )
}

export default CurrentGuestList
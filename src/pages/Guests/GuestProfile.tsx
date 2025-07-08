import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteGuest, getGuests } from "@/services/Guests"
import type { GetGuestsResponse, Guest, RoomType } from "@/validation"
import { getRoomTypes } from "@/services/RoomTypes"
import DataTable, { type ActionMenuItem, defaultRenderers, type TableColumn } from "@/components/Templates/DataTable"

const GuestProfile = () => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [guests, setGuests] = useState<GetGuestsResponse["data"]>([])
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handleGetGuests = async () => {
            setLoading(true)
            try {
                const response = await getGuests()
                setGuests(response.data)
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

        handleGetGuests()
        handleGetRoomTypes()
    }, [])

    const roomTypeMap = roomTypes.reduce(
        (map, roomType) => {
            map[roomType.id] = roomType.name
            return map
        },
        {} as Record<string, string>,
    )

    const guestColumns: TableColumn[] = [
        {
            key: "name",
            label: "Name",
            render: defaultRenderers.avatar,
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
            render: (item) => defaultRenderers.smoking(item, item.preferences?.smoking),
        },
        {
            key: "phoneNumber",
            label: "Contact Info",
            className: "text-gray-600",
        },
    ]

    const guestActions: ActionMenuItem[] = [
        {
            label: "Edit",
            onClick: (guest, e) => {
                e.stopPropagation()
                navigate(`/guests-profile/${guest.id}`)
            },
            action: "update",
            subject: "Guest"
        },
    ]

    const handleDeleteGuest = async (guest: Guest) => {
        await deleteGuest(guest.id)
        const response = await getGuests()
        setGuests(response.data)
    }

    return (
        <DataTable
            data={guests}
            loading={loading}
            columns={guestColumns}
            title="Guests Profile"
            actions={guestActions}
            primaryAction={{
                label: "New Guest Profile",
                onClick: () => navigate("/guests-profile/new"),
                action: "create",
                subject: "Guest",
            }}
            onRowClick={(guest) => navigate(`/guests-profile/${guest.id}/view`)}
            getRowKey={(guest) => guest.id}
            filter={{
                searchPlaceholder: "Search guests...",
                searchFields: ["firstName", "lastName", "email"],
            }}
            pagination={{
                currentPage,
                totalPages: Math.ceil(300 / 10),
                onPageChange: setCurrentPage,
                showPreviousNext: true,
                maxVisiblePages: 7,
            }}
            deleteConfig={{
                onDelete: handleDeleteGuest,
                getDeleteTitle: () => "Delete Guest",
                // getDeleteDescription: (guest) =>
                //     `Are you sure you want to delete guest ${guest.firstName} ${guest.lastName}? This action cannot be undone.`,
                // getItemName: (guest) => `${guest.firstName} ${guest.lastName}`,
                action: "delete",
                subject: "Guest"
            }}
        />
    )
}

export default GuestProfile
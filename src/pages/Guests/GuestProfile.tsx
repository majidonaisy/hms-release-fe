import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteGroupProfile, deleteGuest, getGroupProfiles, getGuests } from "@/services/Guests"
import { searchGuests, searchGroupProfiles } from "@/services/Guests"
import type { GetGuestsResponse, Guest, RoomType, GetGroupProfilesResponse } from "@/validation"
import { getRoomTypes } from "@/services/RoomTypes"
import DataTable, { type ActionMenuItem, defaultRenderers, type TableColumn } from "@/components/Templates/DataTable"
import NewDialogsWithTypes from "@/components/dialogs/NewDialogWIthTypes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/Avatar"

type CombinedGuestData = {
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
    type: 'individual' | 'CORPORATE' | 'TRAVEL_AGENCY' | 'EVENT_PLANNER' | 'GOVERNMENT' | 'OTHER'
    isGroup: boolean
    originalData: Guest | GetGroupProfilesResponse['data'][0]
}

const GuestProfile = () => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5); // Default page size
    const [searchTerm, setSearchTerm] = useState("");
    const [guests, setGuests] = useState<GetGuestsResponse["data"]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [groupProfiles, setGroupProfiles] = useState<GetGroupProfilesResponse["data"]>([]);
    const [combinedData, setCombinedData] = useState<CombinedGuestData[]>([]);
    const [pagination, setPagination] = useState<{
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        hasNext: boolean;
        hasPrevious: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [openGuestDialog, setOpenGuestDialog] = useState(false);

    useEffect(() => {
        const handleGetGuests = async () => {
            setLoading(true);
            try {
                const response = searchTerm
                    ? (await searchGuests({ q: searchTerm, page: currentPage, limit: pageSize }) as GetGuestsResponse)
                    : await getGuests({ page: currentPage, limit: pageSize });
                setGuests(response.data);
                if (response.pagination) {
                    setPagination({
                        totalItems: response.pagination.total,
                        totalPages: response.pagination.totalPages,
                        currentPage: response.pagination.page,
                        pageSize: response.pagination.pageSize,
                        hasNext: response.pagination.hasNextPage,
                        hasPrevious: response.pagination.hasPreviousPage,
                    });
                } else {
                    setPagination({
                        totalItems: response.data.length,
                        totalPages: 1,
                        currentPage,
                        pageSize,
                        hasNext: false,
                        hasPrevious: false,
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
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

        const handleGetGroupProfiles = async () => {
            setLoading(true);
            try {
                const response = searchTerm
                    ? (await searchGroupProfiles({ q: searchTerm, page: currentPage, limit: pageSize }) as GetGroupProfilesResponse)
                    : await getGroupProfiles({ page: currentPage, limit: pageSize });
                setGroupProfiles(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        Promise.all([
            handleGetGuests(),
            handleGetRoomTypes(),
            handleGetGroupProfiles(),
        ])
    }, [searchTerm, currentPage])

    useEffect(() => {
        const transformedGuests: CombinedGuestData[] = guests.map(guest => ({
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

        const transformedGroups: CombinedGuestData[] = groupProfiles.map(group => ({
            id: group.id,
            name: group.name,
            email: group.email,
            phoneNumber: group.phone,
            type: group.businessType,
            isGroup: true,
            originalData: group
        }))

        setCombinedData([...transformedGuests, ...transformedGroups])
    }, [guests, groupProfiles])

    const roomTypeMap = roomTypes.reduce(
        (map, roomType) => {
            map[roomType.id] = roomType.name
            return map
        },
        {} as Record<string, string>,
    )

    const guestColumns: TableColumn<CombinedGuestData>[] = [
        {
            key: "name",
            label: "Name",
            render: (item) => {
                if (item.isGroup) {
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage />
                                <AvatarFallback>
                                    {item.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="font-medium text-gray-900">
                                {item.name}
                            </div>
                        </div>
                    )
                } else {
                    return defaultRenderers.avatar(item as any)
                }
            },
        },
        {
            key: "type",
            label: "Type",
            render: (item) => (
                <span className='px-2 py-1 rounded-full text-xs font-medium'>
                    {item.type === 'individual' ? 'INDIVIDUAL' : item.type.replace('_', ' ')}
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
            render: (item) => {
                if (item.isGroup) {
                    return <span className="text-gray-600">N/A</span>
                }
                return (
                    <span className="text-gray-600">
                        {(item.preferences?.roomType && roomTypeMap[item.preferences.roomType]) || "Unknown"}
                    </span>
                )
            },
        },
        {
            key: "smoking",
            label: "Other Requests",
            render: (item) => {
                if (item.isGroup) {
                    const groupData = item.originalData as GetGroupProfilesResponse['data'][0]
                    return (
                        <span className="text-gray-600">
                            {groupData.specialRequirements || "None"}
                        </span>
                    )
                }
                return defaultRenderers.smoking(item, item.preferences?.smoking ?? false)
            },
        },
        {
            key: "phoneNumber",
            label: "Contact Info",
            className: "text-gray-600",
        },
    ]

    const guestActions: ActionMenuItem<CombinedGuestData>[] = [
        {
            label: "Edit",
            onClick: (item, e) => {
                e.stopPropagation()
                if (item.isGroup) {
                    console.log(`Navigate to group edit: /guests-profile/group/${item.id}`)
                } else {
                    navigate(`/guests-profile/${item.id}`)
                }
            },
            action: "update",
            subject: "Guest"
        },
    ]

    const handleDeleteGuest = async (item: CombinedGuestData) => {
        try {
            setLoading(true);
            if (item.isGroup) {
                await deleteGroupProfile(item.id);
                const groupResponse = await getGroupProfiles({ page: currentPage, limit: pageSize });
                setGroupProfiles(groupResponse.data);
            } else {
                await deleteGuest(item.id);
                const guestResponse = await getGuests({ page: currentPage, limit: pageSize });
                setGuests(guestResponse.data);
            }
        } catch (error) {
            console.error("Error deleting:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (item: CombinedGuestData) => {
        if (item.isGroup) {
            navigate(`/group-profile/${item.id}/view`)
        } else {
            navigate(`/guests-profile/${item.id}/view`)
        }
    }

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Search guests..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ padding: 8, width: 300 }}
                />
            </div>
            <DataTable
                data={combinedData}
                loading={loading}
                columns={guestColumns}
                title="Guests Profile"
                actions={guestActions}
                primaryAction={{
                    label: "New Guest Profile",
                    onClick: () => setOpenGuestDialog(true),
                    action: "create",
                    subject: "Guest",
                }}
                onRowClick={handleRowClick}
                getRowKey={(item) => `${item.isGroup ? 'group' : 'guest'}-${item.id}`}
                filter={{
                    searchPlaceholder: "Search guests...",
                    searchFields: ["name", "email"],
                }}
                pagination={pagination ? {
                    currentPage: pagination.currentPage,
                    totalPages: pagination.totalPages,
                    totalItems: pagination.totalItems,
                    onPageChange: setCurrentPage,
                    showPreviousNext: true,
                    maxVisiblePages: 7,
                } : undefined}
                deleteConfig={{
                    onDelete: handleDeleteGuest,
                    getDeleteTitle: (item) => item ? (item.isGroup ? "Delete Group Profile" : "Delete Guest") : "Delete Item",
                    getDeleteDescription: (item) =>
                        item ? `Are you sure you want to delete ${item.isGroup ? 'group profile' : 'guest'} ${item.name}? This action cannot be undone.` : "Are you sure you want to delete this item?",
                    getItemName: (item) => item ? item.name : "Unknown",
                    action: "delete",
                    subject: "Guest"
                }}
            />
            <NewDialogsWithTypes
                open={openGuestDialog}
                setOpen={setOpenGuestDialog}
                description='Select Guest Type'
                textOne='For personal bookings and solo travelers.'
                textTwo='For company accounts and business reservations.'
                title='New Guest'
                groupRoute='/guests-profile/new-group'
                individualRoute='/guests-profile/new-individual'
            />
        </>
    )
}

export default GuestProfile
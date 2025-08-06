import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteGroupProfile, deleteGuest } from "@/services/Guests"
import type { Guest, RoomType, GetGroupProfilesResponse, GetCurrentGroupProfilesResponse, GetCurrentGuestsResponse } from "@/validation"
import { getRoomTypes } from "@/services/RoomTypes"
import NewDialogsWithTypes from "@/components/dialogs/NewDialogWIthTypes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/Avatar"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Search, Plus, EllipsisVertical } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Organisms/Table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/DropdownMenu"
import DeleteDialog from "@/components/molecules/DeleteDialog"
import TableSkeleton from "@/components/Templates/TableSkeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/molecules/Tabs"
import { useDebounce } from "@/hooks/useDebounce"
import { getCurrentGroupProfiles, getCurrentGuests } from "@/services/Reservation"

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
  type: "individual" | "CORPORATE" | "TRAVEL_AGENCY" | "EVENT_PLANNER" | "GOVERNMENT" | "OTHER"
  isGroup: boolean
  originalData: Guest | GetGroupProfilesResponse["data"][0]
}

const CurrentGuestList = () => {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5)

  const [searchTerm, setSearchTerm] = useState("")
  const [individualSearchTerm, setIndividualSearchTerm] = useState("")
  const [groupSearchTerm, setGroupSearchTerm] = useState("")

  const [guests, setGuests] = useState<GetCurrentGuestsResponse["data"]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [groupProfiles, setGroupProfiles] = useState<GetCurrentGroupProfilesResponse["data"]>([])
  const [loading, setLoading] = useState(false)
  const [openGuestDialog, setOpenGuestDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("individuals")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<CombinedGuestData | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false);
  const debouncedIndividualSearch = useDebounce(individualSearchTerm, 500)
  const debouncedGroupSearch = useDebounce(groupSearchTerm, 500)

  const roomTypeMap = roomTypes.reduce(
    (map, roomType) => {
      map[roomType.id] = roomType.name
      return map
    },
    {} as Record<string, string>,
  )

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    if (activeTab === "individuals") {
      setIndividualSearchTerm(value)
    } else if (activeTab === "groups") {
      setGroupSearchTerm(value)
    } else {
      setIndividualSearchTerm(value)
      setGroupSearchTerm(value)
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setIndividualSearchTerm("")
    setGroupSearchTerm("")
  }

  useEffect(() => {
    const handleGetGuests = async () => {
      if (activeTab === "groups") return

      setSearchLoading(true)
      try {
        const response = ((await getCurrentGuests({
          q: debouncedIndividualSearch,

        })) as GetCurrentGuestsResponse)
        setGuests(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setSearchLoading(false)
      }
    }
    handleGetGuests()
  }, [debouncedIndividualSearch, currentPage, activeTab, pageSize])

  useEffect(() => {
    const handleGetGroupProfiles = async () => {
      if (activeTab === "individuals") return

      setSearchLoading(true)
      try {
        const response = ((await getCurrentGroupProfiles({
          q: debouncedGroupSearch,
        })) as GetCurrentGroupProfilesResponse)
        setGroupProfiles(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setSearchLoading(false)
      }
    }
    handleGetGroupProfiles()
  }, [debouncedGroupSearch, currentPage, activeTab, pageSize])

  useEffect(() => {
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
    handleGetRoomTypes()
  }, [])

  const getCombinedData = (): CombinedGuestData[] => {
    const transformedGuests: CombinedGuestData[] = guests.map((guest) => ({
      id: guest.id,
      name: `${guest.firstName} ${guest.lastName}`,
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phoneNumber: guest.phoneNumber,
      preferences: guest.preferences,
      type: "individual" as const,
      isGroup: false,
      originalData: guest,
    }))

    const transformedGroups: CombinedGuestData[] = groupProfiles.map((group) => ({
      id: group.id,
      name: group.name,
      email: group.email,
      phoneNumber: group.phone,
      type: group.businessType,
      isGroup: true,
      originalData: group,
    }))

    switch (activeTab) {
      case "individuals":
        return transformedGuests
      case "groups":
        return transformedGroups
      default:
        return [...transformedGuests, ...transformedGroups]
    }
  }

  const combinedData = getCombinedData()

  // Handle delete
  const handleDeleteClick = (item: CombinedGuestData, e: React.MouseEvent) => {
    e.stopPropagation()
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return
    setDeleteLoading(true)
    try {
      if (itemToDelete.isGroup) {
        await deleteGroupProfile(itemToDelete.id)
        const groupResponse = await getCurrentGroupProfiles({ q: "" })
        setGroupProfiles(groupResponse.data)
        if (groupResponse.data.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      } else {
        await deleteGuest(itemToDelete.id)
        const guestResponse = await getCurrentGuests({ q: "" })
        setGuests(guestResponse.data)
      }
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleRowClick = (item: CombinedGuestData) => {
    if (item.isGroup) {
      navigate(`/group-profile/${item.id}/view`)
    } else {
      navigate(`/guests-profile/${item.id}/view`)
    }
  }

  const handleEdit = (item: CombinedGuestData, e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.isGroup) {
      console.log(`Navigate to group edit: /guests-profile/group/${item.id}`)
    } else {
      navigate(`/guests-profile/${item.id}`)
    }
  }

  // Reset pagination when switching tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSearchTerm("")
    setIndividualSearchTerm("")
    setGroupSearchTerm("")
  }

  // Get total count for display
  const getTotalCount = () => {
    switch (activeTab) {
      case "individuals":
        return guests.length
      case "groups":
        return groupProfiles.length
      default:
        return guests.length + groupProfiles.length
    }
  }

  if (loading && combinedData.length === 0) {
    return <TableSkeleton title="Current Guests" />
  }

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="mb-6">
          {/* Title with Count */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-3 ">
              <h1 className="text-2xl font-semibold text-gray-900">Current Guests</h1>
              <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {getTotalCount()} {getTotalCount() === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          {/* Search Bar and Actions */}
          <div className="flex items-center gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3">
              <Input
                type="text"
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-85 h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 mr-2 text-sm font-medium"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              <Search className="h-4 w-4 text-gray-400" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
              <Button onClick={() => setOpenGuestDialog(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Guest Profile
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individuals">Individuals</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>

            <TabsContent value="individuals" className="mt-6">
              <div className="bg-white rounded-lg">
                <Table>
                  <TableHeader className="bg-hms-accent/15">
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Name</TableHead>
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Type</TableHead>
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">
                        Email
                      </TableHead>
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Preferred Room</TableHead>
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Other Requests</TableHead>
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">
                        Contact Info
                      </TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchLoading || loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-10 text-center text-gray-600">
                          Loading guests...
                        </TableCell>
                      </TableRow>
                    ) : combinedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-10 text-center text-gray-600">
                          No individual guests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      combinedData.map((item) => (
                        <TableRow
                          key={`guest-${item.id}`}
                          onClick={() => handleRowClick(item)}
                          className="border-b-2 hover:bg-accent cursor-pointer"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage />
                                <AvatarFallback>
                                  {item.firstName?.charAt(0).toUpperCase()}
                                  {item.lastName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-gray-900">
                                {item.firstName} {item.lastName}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium">INDIVIDUAL</span>
                          </TableCell>
                          <TableCell className="px-6 py-4 font-medium text-gray-900">{item.email}</TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="text-gray-600">
                              {(item.preferences?.roomType && roomTypeMap[item.preferences.roomType]) || "Unknown"}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="text-gray-600">
                              {item.preferences?.smoking ? "Smoking" : "No Smoking"}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600">{item.phoneNumber}</TableCell>
                          <TableCell className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="bg-inherit shadow-none p-0 text-hms-accent font-bold text-xl border hover:border-hms-accent hover:bg-hms-accent/15"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <EllipsisVertical />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="shadow-lg border-hms-accent">
                                <DropdownMenuItem onClick={(e) => handleEdit(item, e)}>Edit</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => handleDeleteClick(item, e)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="groups" className="mt-6">
              <div className="bg-white rounded-lg">
                <Table>
                  <TableHeader className="bg-hms-accent/15">
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Name</TableHead>
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Type</TableHead>
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">
                        Email
                      </TableHead>
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Preferred Room</TableHead>
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Other Requests</TableHead>
                      <TableHead className="text-left font-medium text-gray-900 px-6 py-2">
                        Contact Info
                      </TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchLoading || loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-10 text-center text-gray-600">
                          Loading guests...
                        </TableCell>
                      </TableRow>
                    ) : combinedData.length === 0 ? (<TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-gray-600">
                        No group profiles found
                      </TableCell>
                    </TableRow>
                    ) : (
                      combinedData.map((item) => (
                        <TableRow
                          key={`group-${item.id}`}
                          onClick={() => handleRowClick(item)}
                          className="border-b-2 hover:bg-accent cursor-pointer"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage />
                                <AvatarFallback>{item.name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-gray-900">{item.name}</div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium">
                              {item.type.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 font-medium text-gray-900">{item.email}</TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="text-gray-600">N/A</span>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="text-gray-600">
                              {(item.originalData as GetGroupProfilesResponse["data"][0]).specialRequirements || "None"}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-gray-600">{item.phoneNumber}</TableCell>
                          <TableCell className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="bg-inherit shadow-none p-0 text-hms-accent font-bold text-xl border hover:border-hms-accent hover:bg-hms-accent/15"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <EllipsisVertical />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="shadow-lg border-hms-accent">
                                <DropdownMenuItem onClick={(e) => handleEdit(item, e)}>Edit</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => handleDeleteClick(item, e)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title={itemToDelete ? (itemToDelete.isGroup ? "Delete Group Profile" : "Delete Guest") : "Delete Item"}
        description={
          itemToDelete
            ? `Are you sure you want to delete ${itemToDelete.isGroup ? "group profile" : "guest"} ${itemToDelete.name}? This action cannot be undone.`
            : "Are you sure you want to delete this item?"
        }
      />

      <NewDialogsWithTypes
        open={openGuestDialog}
        setOpen={setOpenGuestDialog}
        description="Select Guest Type"
        textOne="For personal bookings and solo travelers."
        textTwo="For company accounts and business reservations."
        title="New Guest"
        groupRoute="/guests-profile/new-group"
        individualRoute="/guests-profile/new-individual"
      />
    </>
  )
}

export default CurrentGuestList

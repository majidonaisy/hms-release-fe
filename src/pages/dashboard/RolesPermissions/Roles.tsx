import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { AddRoleRequest, Role } from "@/validation/schemas/Roles"
import { addRole, deleteRole, getRoles } from "@/services/Role"
import NewRoleDialog from "@/components/dialogs/NewRoleDialog"
import { useDebounce } from "@/hooks/useDebounce"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { Search, Plus, EllipsisVertical, ChevronLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Organisms/Table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/atoms/DropdownMenu"
import DeleteDialog from "@/components/molecules/DeleteDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/molecules/Tabs"
import { Can, CanAny } from "@/context/CASLContext"

const Roles = () => {
    const [newRoleDialogOpen, setNewRoleDialogOpen] = useState<boolean>(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [customRoles, setCustomRoles] = useState<Role[]>([])
    const [templateRoles, setTemplateRoles] = useState<Role[]>([])
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [customSearchTerm, setCustomSearchTerm] = useState("")
    const [templateSearchTerm, setTemplateSearchTerm] = useState("")
    const debouncedCustomSearch = useDebounce(customSearchTerm, 500)
    const debouncedTemplateSearch = useDebounce(templateSearchTerm, 500)
    const [searchLoading, setSearchLoading] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<Role | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("custom")

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        if (activeTab === "custom") {
            setCustomSearchTerm(value)
        } else if (activeTab === "templates") {
            setTemplateSearchTerm(value)
        } else {
            setCustomSearchTerm(value)
            setTemplateSearchTerm(value)
        }
    }

    const clearSearch = () => {
        setSearchTerm("")
        setCustomSearchTerm("")
        setTemplateSearchTerm("")
    }

    const fetchRoles = async () => {
        try {
            setSearchLoading(true)
            const params: any = {}

            if (activeTab === "custom" && debouncedCustomSearch.trim()) {
                params.q = debouncedCustomSearch
            } else if (activeTab === "templates" && debouncedTemplateSearch.trim()) {
                params.q = debouncedTemplateSearch
            }

            const response = await getRoles(params)

            // Separate custom roles from template roles
            const custom = response.data?.filter(role => !role.isTemplate) || []
            const templates = response.data?.filter(role => role.isTemplate) || []

            if (activeTab === "custom") {
                setCustomRoles(custom)
            } else if (activeTab === "templates") {
                setTemplateRoles(templates)
            } else {
                setCustomRoles(custom)
                setTemplateRoles(templates)
            }
        } catch (error) {
            console.error(error)
            setCustomRoles([])
            setTemplateRoles([])
        } finally {
            setSearchLoading(false)
        }
    }

    useEffect(() => {
        fetchRoles()
    }, [debouncedCustomSearch, debouncedTemplateSearch, activeTab])

    const handleDeleteRole = async (role: Role) => {
        await deleteRole(role.id)
        await fetchRoles() // Refresh the roles list
    }

    const handleDeleteClick = (role: Role, e: React.MouseEvent) => {
        e.stopPropagation()
        setItemToDelete(role)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return
        setDeleteLoading(true)
        try {
            await handleDeleteRole(itemToDelete)
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

    const handleEdit = (role: Role, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingRole(role)
        setNewRoleDialogOpen(true)
    }

    const handleCreateRole = async (data: AddRoleRequest) => {
        try {
            await addRole(data)
            await fetchRoles() // Refresh the roles list
            setNewRoleDialogOpen(false)
        } catch (error: any) {
            console.error("Error creating role:", error)
            throw error
        }
    }

    const handleDialogClose = () => {
        setNewRoleDialogOpen(false)
        setEditingRole(null)
        fetchRoles()
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        setSearchTerm("")
        setCustomSearchTerm("")
        setTemplateSearchTerm("")
    }

    const getCurrentData = () => {
        switch (activeTab) {
            case "custom":
                return customRoles
            case "templates":
                return templateRoles
            default:
                return [...customRoles, ...templateRoles]
        }
    }

    const currentData = getCurrentData()

    const renderRoleTable = (data: Role[], showActions: boolean = true) => (
        <div className="bg-white rounded-lg">
            <Table>
                <TableHeader className="bg-hms-accent/15">
                    <TableRow className="border-b border-gray-200">
                        <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Name</TableHead>
                        <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Permissions</TableHead>
                        {showActions && <TableHead className="w-[100px]"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {searchLoading ? (
                        <TableRow>
                            <TableCell colSpan={showActions ? 3 : 2} className="py-10 text-center text-gray-600">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={showActions ? 3 : 2} className="py-10 text-center text-gray-600">
                                {activeTab === "custom" ? "No custom roles found" : activeTab === "templates" ? "No template roles found" : "No roles found"}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((role) => (
                            <TableRow key={role.id} className="border-b-2 hover:bg-accent">
                                <TableCell className="px-6 py-4 font-medium text-gray-900">
                                    {role.name}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-600">
                                    <div>
                                        {role.permissions.map((p: { id: string; action: string; subject: string }, i: number) => (
                                            <p key={i}>
                                                {p.action.charAt(0).toUpperCase() + p.action.slice(1)}{" "}
                                                {p.subject.charAt(0).toUpperCase() + p.subject.slice(1)}
                                            </p>
                                        ))}
                                    </div>
                                </TableCell>
                                {showActions && (
                                    <CanAny permissions={[
                                        { action: 'delete', subject: !role.isTemplate ? "Role" : "" },
                                        { action: 'update', subject: !role.isTemplate ? "Role" : "" },
                                    ]}>
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
                                                    <Can action="update" subject={!role.isTemplate ? "Role" : ""}>
                                                        <DropdownMenuItem onClick={(e) => handleEdit(role, e)}>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                    </Can>
                                                    <Can action="delete" subject={!role.isTemplate ? "Role" : ""}>
                                                        <DropdownMenuItem
                                                            onClick={(e) => handleDeleteClick(role, e)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </Can>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </CanAny>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="mb-6">
                    {/* Title with Count and Back Button */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-3">
                            {/* Back Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-2"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
                            <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {currentData.length} {currentData.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                    </div>

                    {/* Search Bar and Actions */}
                    <div className="flex items-center gap-4 mb-6">
                        {/* Search Bar */}
                        <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3">
                            <Input
                                type="text"
                                placeholder="Search roles..."
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

                        <Can action="create" subject="Role">
                            <div className="flex gap-2 ml-auto">
                                <Button
                                    onClick={() => {
                                        setEditingRole(null)
                                        setNewRoleDialogOpen(true)
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    New Role
                                </Button>
                            </div>
                        </Can>
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className={`grid w-full grid-cols-2`}>
                            <TabsTrigger value="custom">Custom Roles</TabsTrigger>
                            <TabsTrigger value="templates">Template Roles</TabsTrigger>
                        </TabsList>

                        <TabsContent value="custom" className="mt-6">
                            {renderRoleTable(customRoles, true)}
                        </TabsContent>

                        <TabsContent value="templates" className="mt-6">
                            {renderRoleTable(templateRoles, false)}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* New Role Dialog */}
            <NewRoleDialog
                isOpen={newRoleDialogOpen}
                onCancel={handleDialogClose}
                onConfirm={handleCreateRole}
                editingRole={editingRole}
            />

            {/* Delete Dialog */}
            <DeleteDialog
                isOpen={deleteDialogOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                title="Delete Role"
                description={
                    itemToDelete
                        ? `Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`
                        : "Are you sure you want to delete this role? This action cannot be undone."
                }
            />
        </>
    )
}

export default Roles
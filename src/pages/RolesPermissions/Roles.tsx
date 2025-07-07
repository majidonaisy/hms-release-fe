import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Plus, ChevronDown, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Badge } from '@/components/atoms/Badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Label } from '@/components/atoms/Label';
import { Textarea } from '@/components/atoms/Textarea';
import { Checkbox } from '@/components/atoms/Checkbox';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/atoms/ScrollArea';
import { Role, RoleResponse } from '@/validation/schemas/Roles';
import { getRoles } from '@/services/Role';

const Roles = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [newRoleDialogOpen, setNewRoleDialogOpen] = useState<boolean>(false);
    const [newRoleData, setNewRoleData] = useState({
        name: '',
        description: '',
        assignedUsers: [],
        selectedPermissions: [] as string[]
    });
    const [roles, setRoles] = useState<RoleResponse['data']>();

    useEffect(() => {
        const handleGetRoles = async () => {
            try {
                const response = await getRoles();
                setRoles(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        handleGetRoles()
    }, [])

    const filteredRoles = useMemo(() => {
        if (!searchText.trim()) {
            return roles;
        }

        const searchTerm = searchText.toLowerCase().trim();

        return roles?.filter((member) => {
            return (
                member.name.toLowerCase().includes(searchTerm)
            );
        });
    }, [searchText, roles]);

    const clearSearch = (): void => {
        setSearchText('');
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'Inactive':
                return 'bg-red-100 text-red-700 hover:bg-red-100';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
            default:
                return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, roleId: string): void => {
        e.stopPropagation();
        // Handle delete logic here
        console.log('Delete role:', roleId);
    };

    const handleCloseNewRoleDialog = (): void => {
        setNewRoleData({
            name: '',
            description: '',
            assignedUsers: [],
            selectedPermissions: []
        });
    };

    const handlePermissionToggle = (permission: string): void => {
        setNewRoleData(prev => ({
            ...prev,
            selectedPermissions: prev.selectedPermissions.includes(permission)
                ? prev.selectedPermissions.filter(p => p !== permission)
                : [...prev.selectedPermissions, permission]
        }));
    };

    const handleCreateRole = (): void => {
        // Handle role creation logic here
        console.log('Creating role:', newRoleData);
        handleCloseNewRoleDialog();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
                    <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {roles?.length} roles
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3">
                        <Input
                            type="text"
                            placeholder="Search roles"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-85 h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
                        />
                        {searchText && (
                            <button
                                onClick={clearSearch}
                                className="text-gray-400 hover:text-gray-600 ml-2 text-sm font-medium"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                        <Search className="h-4 w-4 text-gray-400 ml-2" />
                    </div>

                    {/* Filter Button */}
                    <Button
                        variant="outline"
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 px-3 py-2 border-2 border-gray-300 hover:border-gray-400"
                    >
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-auto">
                        <Button onClick={() => setNewRoleDialogOpen(true)}>
                            <Plus className="h-4 w-4" />
                            New Role
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader className='bg-hms-accent/15'>
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">
                                <div className="flex items-center gap-1">
                                    Name
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Status</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Department</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Level</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Assigned</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Permissions</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRoles?.length === 0 && searchText ? (
                            <TableRow>
                                <TableCell colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8 text-gray-300" />
                                        <p>No roles found matching your search.</p>
                                        <p className="text-sm">Try adjusting your search terms or <button onClick={clearSearch} className="text-blue-600 hover:text-blue-800 underline">clear the search</button>.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredRoles?.map((role) => (
                            <TableRow
                                key={role.id}
                                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                            >
                                <TableCell className="px-6 py-4 font-medium text-gray-900 flex gap-1">
                                    <div className='grid'>
                                        <p>{role.name}</p>
                                        {/* <p className='text-xs'>{role.code}</p> */}
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    {/* <Badge className={`${getStatusColor(role.status)} border-0`}>
                                        • {role.status}
                                    </Badge> */}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-600">
                                    {/* {role.department} */}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-600">
                                    {/* {role.level} */}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-600">
                                    {/* {role.assignedCount} */}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-gray-600">
                                    {
                                        role.permissions.map((permission) => (
                                            <p>
                                                {permission.action} {permission.subject}
                                            </p>
                                        ))
                                    }
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    className='bg-inherit shadow-none p-0 text-hms-accent font-bold text-xl border hover:border-hms-accent hover:bg-hms-accent/15'
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <EllipsisVertical className="" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className='shadow-lg border-hms-accent'>
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={(e) => handleDeleteClick(e, role.id)}
                                                >
                                                    <div className="w-full flex items-center gap-2">
                                                        Delete
                                                    </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                >
                                                    <div className="w-full flex items-center gap-2">
                                                        Edit
                                                    </div>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <Button variant="outline" className="flex items-center gap-2">
                        ← Previous
                    </Button>

                    <div className="flex items-center gap-2">
                        {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
                            <Button
                                key={index}
                                variant={page === 1 ? "foreground" : "primaryOutline"}
                                size="sm"
                                className={`h-8 w-8 `}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <Button variant="outline" className="flex items-center gap-2">
                        Next →
                    </Button>
                </div>
            </div>

            <Dialog open={newRoleDialogOpen} onOpenChange={setNewRoleDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>New Role</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Role Name */}
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Role Name
                            </Label>
                            <Input
                                type="text"
                                placeholder="e.g. Single Room"
                                value={newRoleData.name}
                                onChange={(e) => setNewRoleData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </Label>
                            <Textarea
                                placeholder="Describe this role's responsibilities and access level (e.g. Manages guest check-in/out and reservation updates)"
                                value={newRoleData.description}
                                onChange={(e) => setNewRoleData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full resize-none"
                                rows={4}
                            />
                        </div>

                        {/* Assign to Users */}
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign to Users
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        Select team members
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
                                    <ScrollArea className='h-[10rem]'>
                                        {/* {teamMembersData.map((user) => (
                                            <DropdownMenuItem className='w-full'>{user.name}</DropdownMenuItem>
                                        ))} */}
                                    </ScrollArea>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Permissions */}
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 mb-3">
                                Permissions
                            </Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {newRoleData.selectedPermissions.length > 0
                                            ? `${newRoleData.selectedPermissions.length} permission${newRoleData.selectedPermissions.length > 1 ? 's' : ''} selected`
                                            : 'Select permissions'
                                        }
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
                                    <ScrollArea className='h-[10rem]    '>
                                        {/* {permissionsList.map((permission, index) => (
                                            <DropdownMenuItem
                                                key={index}
                                                onSelect={(e) => e.preventDefault()}
                                                className="flex items-start gap-3 cursor-pointer"
                                            >
                                                <Checkbox
                                                    id={`permission-${index}`}
                                                    checked={newRoleData.selectedPermissions.includes(permission)}
                                                    onCheckedChange={() => handlePermissionToggle(permission)}
                                                    className={cn("data-[state=checked]:bg-hms-primary ")}
                                                />
                                                <Label
                                                    htmlFor={`permission-${index}`}
                                                    className="text-sm cursor-pointer leading-5 flex-1"
                                                >
                                                    {permission}
                                                </Label>
                                            </DropdownMenuItem>
                                        ))} */}
                                    </ScrollArea>

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={handleCreateRole}
                            className='w-full'
                        >
                            Create Role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div >
    );
};

export default Roles;
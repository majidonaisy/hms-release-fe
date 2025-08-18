import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { toast } from 'sonner';
import { AddRoleRequest, AddRoleRequestSchema, PermissionsResponse, Role, UpdateRoleRequest } from '@/validation/schemas/Roles';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/atoms/Checkbox';
import { getPermissions, getRoleBId, updateRole } from '@/services/Role';
import { ZodError } from 'zod/v4';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/Accordion';
import { ScrollArea } from '../atoms/ScrollArea';

interface NewRoleDialogProps {
    isOpen: boolean;
    onConfirm: (data: AddRoleRequest) => Promise<void>;
    onCancel: () => void;
    editingRole?: Role | null;
}

const PAGE_SIZE = 20;
const GROUPS_PER_PAGE = 5;

const NewRoleDialog: React.FC<NewRoleDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    editingRole = null
}) => {
    const [formData, setFormData] = useState<AddRoleRequest>({
        name: '',
        permissionIds: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isRoleLoading, setIsRoleLoading] = useState(false);
    const [permissions, setPermissions] = useState<PermissionsResponse['data'] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [groupsPage, setGroupsPage] = useState(1); // New state for groups pagination
    const [pagination, setPagination] = useState<{
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    } | null>(null);

    const subjects = [
        "User",
        "Role",
        "Hotel",
        "Room",
        "RoomType",
        "Guest",
        "Amenity",
        "Reservation",
        "ExchangeRate",
        "Folio",
        "RatePlan",
        "HouseKeeping",
        "Maintenance",
        "GroupProfile",
        "GroupBooking",
        "FolioItem",
        "Area",
    ];
    const [searchBySubject, setSearchBySubject] = useState("all");
    const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]); // Track open accordion items

    const isEditing = editingRole !== null;

    const handleInputChange = (field: keyof AddRoleRequest, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const validatedData = AddRoleRequestSchema.parse(formData);
            setIsLoading(true);
            if (isEditing && editingRole) {
                await updateRole(editingRole.id, validatedData as UpdateRoleRequest);
                toast("Success!", {
                    description: "Role was updated successfully.",
                });
            } else {
                await onConfirm(validatedData);
                toast("Success!", {
                    description: "Role was created successfully.",
                });
            }

            setFormData({
                name: '',
                permissionIds: [],
            });
            onCancel();
        } catch (error: any) {
            let description = isEditing ? "Failed to update role." : "Failed to create role.";

            if (error instanceof ZodError) {
                const errorMessages = error.issues.map(issue => issue.message).join(", ");
                description = errorMessages;
            }

            toast("Error!", {
                description,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (isLoading) return;

        setFormData({
            name: '',
            permissionIds: [],
        });
        setOpenAccordionItems([]); // Reset accordion state
        onCancel();
    };

    const handlePermissionsChange = (permissionId: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            permissionIds: checked
                ? [...(prev.permissionIds || []), permissionId]
                : (prev.permissionIds || []).filter(id => id !== permissionId)
        }));
    };

    const fetchPermissions = async (subject: string = "all") => {
        setIsLoading(true);
        try {
            const params: { page: number; limit: number; subject?: string } = {
                page: currentPage,
                limit: PAGE_SIZE
            };

            if (subject !== "all") {
                params.subject = subject;
            }

            const response = await getPermissions(params);
            setPermissions(response.data);
            if (response.pagination) {
                setPagination(response.pagination);
            } else {
                setPagination({
                    totalItems: response.data.length,
                    totalPages: 1,
                    currentPage,
                    pageSize: PAGE_SIZE,
                });
            }
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
            toast.error('Failed to load permissions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccordionChange = (values: string[]) => {
        setOpenAccordionItems(values);

        // Find newly opened items
        const newlyOpened = values.filter(value => !openAccordionItems.includes(value));

        if (newlyOpened.length > 0) {
            const latestValue = newlyOpened[0];
            if (latestValue !== searchBySubject) {
                setSearchBySubject(latestValue);
                setCurrentPage(1);
                fetchPermissions(latestValue);
            }
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        fetchPermissions(searchBySubject);
    }, [currentPage, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setCurrentPage(1);
            setGroupsPage(1); // Reset groups page
            setSearchBySubject("all");
            setOpenAccordionItems([]); // Reset accordion state
        }
    }, [isOpen]);

    useEffect(() => {
        const loadRoleData = async () => {
            if (isEditing && editingRole && isOpen) {
                setIsRoleLoading(true)
                try {
                    const response = await getRoleBId(editingRole.id);
                    const roleData = response.data;
                    setFormData({
                        name: roleData.name,
                        permissionIds: roleData.permissions.map(p => p.id),
                    });
                } catch (error) {
                    console.error('Failed to fetch role data:', error);
                    toast.error('Failed to load role data');
                } finally {
                    setIsRoleLoading(false)
                }
            } else if (!isEditing && isOpen) {
                setFormData({
                    name: '',
                    permissionIds: [],
                });
            }
        };

        loadRoleData();
    }, [isEditing, editingRole, isOpen]);

    if (isLoading && !permissions) {
        return (
            <Dialog open={isOpen} onOpenChange={handleCancel}>
                <DialogContent className="max-w-md">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">
                            {isEditing ? 'Edit Role' : 'New Role'}
                        </DialogTitle>
                    </DialogHeader>
                    <Skeleton className='h-10 w-full' />
                </DialogContent>
            </Dialog>
        );
    }

    const renderPaginationControls = () => {
        if (!pagination || pagination.totalPages <= 1) return null;

        return (
            <div className="flex justify-between mt-2">
                <Button
                    variant="defaultLint"
                    disabled={currentPage === 1 || isLoading}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    type='button'
                >
                    <ArrowLeft />
                </Button>

                <span className="flex items-center text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                </span>

                <Button
                    variant="defaultLint"
                    disabled={currentPage === pagination.totalPages || isLoading}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    type='button'
                >
                    <ArrowRight />
                </Button>
            </div>
        );
    };

    // Group pagination controls for subjects
    const renderGroupsPaginationControls = () => {
        const totalGroupsPages = Math.ceil(subjects.length / GROUPS_PER_PAGE);
        if (totalGroupsPages <= 1) return null;

        return (
            <div className="flex justify-between items-center mt-2 pt-2 border-t">
                <Button
                    variant="defaultLint"
                    disabled={groupsPage === 1}
                    onClick={() => setGroupsPage(prev => Math.max(prev - 1, 1))}
                    type='button'
                    size="sm"
                >
                    <ArrowLeft />
                </Button>

                <span className="flex items-center text-xs text-gray-500">
                    Groups {groupsPage} of {totalGroupsPages}
                </span>

                <Button
                    variant="defaultLint"
                    disabled={groupsPage === totalGroupsPages}
                    onClick={() => setGroupsPage(prev => Math.min(prev + 1, totalGroupsPages))}
                    type='button'
                    size="sm"
                >
                    <ArrowRight />
                </Button>
            </div>
        );
    };

    // Get subjects for current page
    const getCurrentPageSubjects = () => {
        const startIndex = (groupsPage - 1) * GROUPS_PER_PAGE;
        const endIndex = startIndex + GROUPS_PER_PAGE;
        return subjects.slice(startIndex, endIndex);
    };

    // Group permissions by subject for display
    const groupedPermissions = permissions?.reduce((acc, permission) => {
        const subject = permission.subject;
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(permission);
        return acc;
    }, {} as Record<string, typeof permissions>);

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="max-w-2xl">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl font-semibold">
                        {isEditing ? 'Edit Role' : 'New Role'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="roleName">Role Name</Label>
                        {isRoleLoading ? (
                            <Skeleton className='h-10' />
                        ) : (
                            <Input
                                id="roleName"
                                placeholder="e.g. Admin"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                disabled={isLoading}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Permissions</Label>
                        <p className='text-muted-foreground text-sm px-4'>The "Manage" permission allows you to perform all operations (read, create, delete, and update) on the selected subject</p>
                        {isLoading ? (
                            <Skeleton className='h-40 w-full' />
                        ) : (
                            <>
                                <Accordion
                                    type="multiple"
                                    className="w-full px-4"
                                    value={openAccordionItems}
                                    onValueChange={handleAccordionChange}
                                >
                                    {/* All Subjects Option */}
                                    <AccordionItem value="all">
                                        <AccordionTrigger className="text-left">
                                            All Permissions
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {searchBySubject === "all" && groupedPermissions && (
                                                <div className="grid grid-cols-1 gap-3">
                                                    <ScrollArea className='h-[100px]'>

                                                        {Object.entries(groupedPermissions).map(([subject, subjectPermissions]) => (
                                                            <div key={subject} className="border-l-2 border-gray-200 pl-3">
                                                                <h4 className="font-medium text-sm text-gray-700 mb-2">
                                                                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                                                </h4>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {subjectPermissions?.map((permission) => (
                                                                        <div key={permission.id} className="flex items-center space-x-2">
                                                                            <Checkbox
                                                                                id={permission.id}
                                                                                className={cn("data-[state=checked]:bg-hms-primary")}
                                                                                checked={(formData.permissionIds || []).includes(permission.id)}
                                                                                onCheckedChange={(checked: any) => handlePermissionsChange(permission.id, checked as boolean)}
                                                                                disabled={isRoleLoading}
                                                                            />
                                                                            <Label htmlFor={permission.id} className="text-sm">
                                                                                {permission.action.charAt(0).toUpperCase() + permission.action.slice(1)}
                                                                            </Label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </ScrollArea>
                                                </div>
                                            )}
                                            {searchBySubject === "all" && renderPaginationControls()}
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Individual Subject Options - Show only 5 at a time */}
                                    {getCurrentPageSubjects().map((subject) => (
                                        <AccordionItem key={subject} value={subject}>
                                            <AccordionTrigger className="text-left">
                                                {subject}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {searchBySubject === subject && (
                                                    <>
                                                        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                                                            {permissions?.map((permission) => (
                                                                <div key={permission.id} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={permission.id}
                                                                        className={cn("data-[state=checked]:bg-hms-primary")}
                                                                        checked={(formData.permissionIds || []).includes(permission.id)}
                                                                        onCheckedChange={(checked: any) => handlePermissionsChange(permission.id, checked as boolean)}
                                                                        disabled={isRoleLoading}
                                                                    />
                                                                    <Label htmlFor={permission.id} className="text-sm">
                                                                        {permission.action.charAt(0).toUpperCase() + permission.action.slice(1)} {permission.subject.charAt(0).toUpperCase() + permission.subject.slice(1)}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {renderPaginationControls()}
                                                    </>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>

                                {/* Groups pagination controls */}
                                {renderGroupsPaginationControls()}
                            </>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full text-white mt-6"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? (isEditing ? 'Updating...' : 'Creating...')
                            : (isEditing ? 'Update Role' : 'Create Role')
                        }
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewRoleDialog;
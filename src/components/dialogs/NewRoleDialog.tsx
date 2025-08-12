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

interface NewRoleDialogProps {
    isOpen: boolean;
    onConfirm: (data: AddRoleRequest) => Promise<void>;
    onCancel: () => void;
    editingRole?: Role | null; // Add editing role prop
}

const PAGE_SIZE = 20;

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
    const [pagination, setPagination] = useState<{
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    } | null>(null);

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

    useEffect(() => {
        if (!isOpen) return;

        const fetchPermissions = async () => {
            setIsLoading(true);
            try {
                const response = await getPermissions({ page: currentPage, limit: PAGE_SIZE });
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

        fetchPermissions();
    }, [currentPage, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setCurrentPage(1);
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

    if (isLoading) {
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
            <div className="flex justify-center space-x-4 mt-2">
                <Button
                    variant="outline"
                    disabled={currentPage === 1 || isLoading}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    type='button'
                >
                    Prev
                </Button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                    <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? 'foreground' : 'outline'}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isLoading}
                        type='button'
                    >
                        {pageNum}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    disabled={currentPage === pagination.totalPages || isLoading}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    type='button'
                >
                    Next
                </Button>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="max-w-md">
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
                        {isLoading ? (
                            <Skeleton className='h-40 w-full' />
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
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
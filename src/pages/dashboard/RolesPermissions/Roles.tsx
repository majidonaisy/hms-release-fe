import { useEffect, useState } from 'react';
import { AddRoleRequest, Role, RoleResponse } from '@/validation/schemas/Roles';
import { addRole, deleteRole, getRoles } from '@/services/Role';
import DataTable, { ActionMenuItem, TableColumn } from '@/components/Templates/DataTable';
import NewRoleDialog from '@/components/dialogs/NewRoleDialog';

const Roles = () => {
    const [newRoleDialogOpen, setNewRoleDialogOpen] = useState<boolean>(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [roles, setRoles] = useState<RoleResponse['data']>();
    const fetchRoles = async () => {
        try {
            const response = await getRoles();
            setRoles(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleDeleteRole = async (role: Role) => {
        await deleteRole(role.id);
        await fetchRoles(); // Refresh the roles list
    };

    const roleColumns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true, className: 'font-medium text-gray-900' },
        {
            key: 'permissions', label: 'Permissions', render: (item) => (
                <div>{item.permissions.map((p: { id: string, action: string, subject: string }, i: number) =>
                    <p key={i}>
                        {p.action.charAt(0).toUpperCase() + p.action.slice(1)} {p.subject.charAt(0).toUpperCase() + p.subject.slice(1)}
                    </p>
                )}
                </div>
            ), className: 'text-gray-600'
        }
    ];

    const roleActions: ActionMenuItem[] = [
        {
            label: 'Edit',
            onClick: (role, e) => {
                e.stopPropagation();
                setEditingRole(role as Role);
                setNewRoleDialogOpen(true);
            }
        },
    ];

    const handleCreateRole = async (data: AddRoleRequest) => {
        try {
            await addRole(data);
            await fetchRoles(); // Refresh the roles list
            setNewRoleDialogOpen(false);
        } catch (error: any) {
            console.error('Error creating role:', error);
            throw error;
        }
    };

    const handleDialogClose = () => {
        setNewRoleDialogOpen(false);
        setEditingRole(null);
        fetchRoles(); 
    };


    return (
        <>

            <DataTable
                data={roles || []}
                loading={!roles}
                columns={roleColumns}
                title="Roles"
                actions={roleActions}
                primaryAction={{
                    label: 'New Role',
                    onClick: () => {
                        setEditingRole(null);
                        setNewRoleDialogOpen(true);
                    }
                }}
                getRowKey={role => role.id}
                filter={{
                    searchPlaceholder: 'Search roles',
                    searchFields: ['name']
                }}
                emptyStateMessage="No roles found."
                deleteConfig={{
                    onDelete: handleDeleteRole,
                    getDeleteTitle: () => 'Delete Role',
                    getItemName: (item: Role ) => item ? item?.name : 'this role',
  }}
            />
            <NewRoleDialog
                isOpen={newRoleDialogOpen}
                onCancel={handleDialogClose}
                onConfirm={handleCreateRole}
                editingRole={editingRole}
            />
        </>
    );
};

export default Roles;
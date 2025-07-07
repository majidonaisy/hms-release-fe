import { useEffect, useMemo, useState } from 'react';
import { Role, RoleResponse } from '@/validation/schemas/Roles';
import { deleteRole, getRoles } from '@/services/Role';
import DataTable, { ActionMenuItem, TableColumn } from '@/components/Templates/DataTable';

const Roles = () => {
    const [searchText, setSearchText] = useState<string>('');
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

    const handleDeleteRole = async (role: Role) => {
        await deleteRole(role.id);
        // Refresh data
        const response = await getRoles();
        setRoles(response.data);
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

    const roleColumns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true, className: 'font-medium text-gray-900' },
        {
            key: 'permissions', label: 'Permissions', render: (item) => (
                <div>{item.permissions.map((p: { id: string, action: string, subject: string }, i: number) => <p key={i}>{p.action} {p.subject}</p>)}</div>
            ), className: 'text-gray-600'
        }
    ];

    const roleActions: ActionMenuItem[] = [
        {
            label: 'Edit',
            onClick: (role, e) => {
                e.stopPropagation();
                setNewRoleDialogOpen(true);
            }
        },
    ];

    return (
        <DataTable
            data={filteredRoles || []}
            loading={!roles}
            columns={roleColumns}
            title="Roles"
            actions={roleActions}
            primaryAction={{
                label: 'New Role',
                onClick: () => setNewRoleDialogOpen(true)
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
            }}
        />
    );
};

export default Roles;
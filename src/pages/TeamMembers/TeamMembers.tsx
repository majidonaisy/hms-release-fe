import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetEmployeesResponse, Pagination } from '@/validation/schemas/Employees';
import { getEmployees } from '@/services/Employees';
import { Badge } from '@/components/atoms/Badge';
import DataTable, { ActionMenuItem, defaultRenderers, TableColumn } from '@/components/Templates/DataTable';
import { getRoles } from '@/services/Role';
import { useDebounce } from '@/hooks/useDebounce';

interface Role {
    id: string;
    name: string;
    hotelId: string;
    permissions: Array<{
        id: string;
        subject: string;
        action: string;
    }>;
}

const TeamMembers = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<GetEmployeesResponse['data']>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const getStatusColor = (status: boolean): string => {
        switch (status) {
            case true:
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            case false:
                return 'bg-red-100 text-red-700 hover:bg-red-100';
        }
    };

    const teamMembersStatusOptions = [
        { value: 'online', label: 'Online', color: 'bg-chart-1/20 text-chart-1' },
        { value: 'offline', label: 'Offline', color: 'bg-chart-4/20 text-chart-4' },
    ];

    const handleSearch = (search: string) => {
        setSearchTerm(search);
        setCurrentPage(1);
    };

    const handleStatusFilter = (status: string) => {
        setSelectedStatus(status);
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchTeamMembers = async () => {
            setSearchLoading(true);
            try {
                const params: any = {
                    page: currentPage,
                    limit: pageSize
                };

                if (debouncedSearchTerm.trim()) {
                    params.q = debouncedSearchTerm;
                }

                if (selectedStatus !== 'all') {
                    params.status = selectedStatus;
                }

                const response = await getEmployees(params);
                setEmployees(response.data);

                if (response.pagination) {
                    setPagination(response.pagination);
                } else {
                    setPagination(null);
                }
            } catch (error) {
                console.error("Error occurred:", error);
            } finally {
                setSearchLoading(false);
            }
        };

        fetchTeamMembers();
    }, [debouncedSearchTerm, currentPage, pageSize, selectedStatus]);

    useEffect(() => {
        const handleGetRoles = async () => {
            setSearchLoading(true)
            try {
                const rolesResponse = await getRoles();
                setRoles(rolesResponse.data);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
            } finally {
                setLoading(false)
            }
        };

        handleGetRoles();
    }, []);

    const roleMap = roles.reduce(
        (map, role) => {
            map[role.id] = role.name;
            return map;
        },
        {} as Record<string, string>
    );

    const teamColumns: TableColumn[] = [
        {
            key: 'name',
            label: 'Name',
            render: defaultRenderers.avatar
        },
        {
            key: 'email',
            label: 'Email',
            className: 'font-medium text-gray-900'
        },
        {
            key: 'username',
            label: 'Username',
            className: 'text-gray-600'
        },
        {
            key: 'isOnline',
            label: 'Status',
            render: (item) => (
                <Badge className={`${getStatusColor(item.online)}`}>
                    • {item.online ? 'Online' : 'Offline'}
                </Badge>
            )
        },
        {
            key: 'role',
            label: 'Role',
            render: (item) => (
                <span className="text-gray-600">
                    {item.role?.name || roleMap[item.roleId] || 'Unknown Role'}
                </span>
            )
        }
    ];

    const teamActions: ActionMenuItem[] = [];

    const handleRowClick = (member: any) => {
        navigate(`/team-members/profile/${member.id}`, { state: { teamMember: member } });
    };

    return (
        <DataTable
            data={employees}
            loading={loading}
            columns={teamColumns}
            title="Team Members"
            actions={teamActions}
            searchLoading={searchLoading}
            primaryAction={{
                label: 'New Team Member',
                onClick: () => { navigate("/team-members/new") }
            }}
            onRowClick={handleRowClick}
            getRowKey={(member) => member.id}
            filter={{
                searchPlaceholder: "Search team members...",
                showFilter: true,
                selectFilters: [
                    {
                        key: 'status',
                        label: 'Status',
                        options: teamMembersStatusOptions,
                        defaultLabel: "All Statuses",
                        onFilterChange: handleStatusFilter
                    }
                ]
            }}
            onSearch={handleSearch}
            pagination={pagination ? {
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                totalItems: pagination.totalItems,
                onPageChange: setCurrentPage,
                showPreviousNext: true,
                maxVisiblePages: 7
            } : undefined}
            emptyStateMessage="No team members found"
        />
    );
};

export default TeamMembers;
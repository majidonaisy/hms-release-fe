import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee, GetEmployeesResponse, Pagination } from '@/validation/schemas/Employees';
import { deleteEMployee, getEmployees } from '@/services/Employees';
import { Badge } from '@/components/atoms/Badge';
import DataTable, { ActionMenuItem, defaultRenderers, TableColumn } from '@/components/Templates/DataTable';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';

const TeamMembers = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<GetEmployeesResponse['data']>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 400);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setError(null)
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
            } catch (error: any) {
                console.error("Error occurred:", error);
                setError(error.userMessage || "Failed to get team members")
            } finally {
                setSearchLoading(false);
            }
        };

        fetchTeamMembers();
    }, [debouncedSearchTerm, currentPage, pageSize, selectedStatus]);

    const handleDeleteEmployee = async (employee: Employee) => {
        try {
            await deleteEMployee(employee.id);

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
                if (response.data.length === 0 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } else {
                setPagination(null);
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            toast.error('Failed to delete employee');
        }
    };

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
            key: 'department',
            label: 'Department',
            render: (item) => (
                <span className="text-gray-600">
                    {item.department.name || 'No Department'}
                </span>
            )
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
                    {item.role?.name || 'Unknown Role'}
                </span>
            )
        }
    ];

    const teamActions: ActionMenuItem[] = [
        {
            label: 'Edit',
            onClick: (employee, e) => {
                e.stopPropagation();
                navigate(`/team-members/update/${employee.id}`);
            },
            action: "update",
            subject: "User"
        }
    ];
    const handleRowClick = (member: any) => {
        navigate(`/team-members/profile/${member.id}`, { state: { teamMember: member } });
    };

    return (
        <DataTable
            data={employees}
            columns={teamColumns}
            title="Team Members"
            errorMessage={error || undefined}
            actions={teamActions}
            searchLoading={searchLoading}
            primaryAction={{
                label: 'New Team Member',
                onClick: () => { navigate("/team-members/new") },
                action: "create",
                subject: "User"
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
            deleteConfig={{
                onDelete: handleDeleteEmployee,
                getDeleteTitle: () => 'Delete Employee',
                action: "delete",
                subject: "User"
            }}
        />
    );
};

export default TeamMembers;
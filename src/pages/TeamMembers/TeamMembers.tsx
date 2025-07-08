import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetEmployeesResponse, Pagination } from '@/validation/schemas/Employees';
import { getEmployees } from '@/services/Employees';
import { Badge } from '@/components/atoms/Badge';
import DataTable, { ActionMenuItem, defaultRenderers, TableColumn } from '@/components/Templates/DataTable';

const TeamMembers = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<GetEmployeesResponse['data']>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10); // Default page size
    const [pagination, setPagination] = useState<Pagination | null>(null);

    const getStatusColor = (status: boolean): string => {
        switch (status) {
            case true:
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            case false:
                return 'bg-red-100 text-red-700 hover:bg-red-100';
        }
    };

    useEffect(() => {
        const handleGetEmployees = async () => {
            setLoading(true);
            try {
                const response = await getEmployees({
                    page: currentPage,
                    limit: pageSize
                });
                setEmployees(response.data);

                // Set pagination if available in response
                if (response.pagination) {
                    setPagination(response.pagination);
                } else {
                    setPagination(null);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        handleGetEmployees();
    }, [currentPage, pageSize]);

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
            key: 'isActive',
            label: 'Status',
            render: (_item, value) => (
                <Badge className={`${getStatusColor(value)}`}>
                    • {value ? 'Active' : 'Inactive'}
                </Badge>
            )
        },
        {
            key: 'role',
            label: 'Role',
            render: (item) => <span className="text-gray-600">{item.role.name}</span>
        }
    ];

    const teamActions: ActionMenuItem[] = [
        {
            label: 'Edit',
            onClick: () => {

            }
        }
    ];

    return (
        <DataTable
            data={employees}
            loading={loading}
            columns={teamColumns}
            title="Team Members"
            actions={teamActions}
            primaryAction={{
                label: 'New Team Member',
                onClick: () => {/* Handle new team member */ }
            }}
            onRowClick={(member) => {
                navigate(`/team-members/profile/${member.id}`, { state: { teamMember: member } });
            }}
            getRowKey={(member) => member.id}
            filter={{
                searchPlaceholder: "Search team members...",
                searchFields: ['firstName', 'lastName', 'email']
            }}
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
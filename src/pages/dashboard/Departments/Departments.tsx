import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDialog } from '@/context/useDialog';
import DataTable, { TableColumn } from '@/components/Templates/DataTable';
import { useNavigate } from 'react-router-dom';
import { deleteDepartment, getDepartments } from '@/services/Departments';
import { useDebounce } from '@/hooks/useDebounce';

const Departments = () => {
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { openDialog } = useDialog();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError(null)
            const params: any = {};
            if (debouncedSearchTerm.trim()) {
                params.q = debouncedSearchTerm;
            }

            const response = await getDepartments(params);

            setDepartments(response.data);
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to load departments');
            setDepartments([]);
            setError(error.userMessage || "Failed to get departments")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [debouncedSearchTerm]);

    const handleAddDepartment = () => {
        openDialog('departments', {
            onConfirm: async () => {
                try {
                    await fetchDepartments();
                    return Promise.resolve();
                } catch (error) {
                    console.error('Error refreshing departments:', error);
                    return Promise.reject(error);
                }
            }
        });
    };

    const handleEditDepartment = (department: any) => {
        openDialog('departments', {
            editData: department,
            onConfirm: async () => {
                try {
                    await fetchDepartments();
                    return Promise.resolve();
                } catch (error) {
                    console.error('Error refreshing departments:', error);
                    return Promise.reject(error);
                }
            }
        });
    };

    const handleDeleteDepartment = async (department: any): Promise<void> => {
        try {
            await deleteDepartment(department.id);
            toast.success('Department deleted successfully');
            await fetchDepartments();
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to delete department');
            throw error;
        }
    };

    const departmentColumns: TableColumn<any>[] = [
        {
            key: 'name',
            label: 'Name',
        },
    ];

    const actions = [
        {
            label: 'Edit',
            onClick: (item: any, e: React.MouseEvent) => {
                e.stopPropagation();
                handleEditDepartment(item);
            },
        }
    ];

    return (
        <DataTable
            data={departments}
            onSearch={handleSearch}
            searchLoading={loading}
            columns={departmentColumns}
            title="Department"
            getRowKey={(item: any) => item.id}
            actions={actions}
            primaryAction={{
                label: 'Add Department',
                onClick: handleAddDepartment
            }}
            deleteConfig={{
                onDelete: handleDeleteDepartment,
                getDeleteTitle: () => 'Delete Department',
                getDeleteDescription: (item: any | null) => item ? `Are you sure you want to delete "${item.name}"? This action cannot be undone.` : 'Are you sure you want to delete this department? This action cannot be undone.',
                getItemName: (item: any | null) => item ? item.name : 'this department',
            }}
            showBackButton
            onBackClick={() => navigate(-1)}
        />
    );
};

export default Departments;
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDialog } from '@/context/useDialog';
import DataTable, { TableColumn } from '@/components/Templates/DataTable';
import { useNavigate } from 'react-router-dom';
import { deleteArea, getAllAreas } from '@/services/Area';
import { useDebounce } from '@/hooks/useDebounce';

const Areas = () => {
    const [areas, setAreas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { openDialog } = useDialog();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const getStatusLabel = (status: string) => {
        switch (status?.toUpperCase()) {
            case "AVAILABLE":
                return "Available";
            case "IN_USE":
                return "In Use";
            case "MAINTENANCE":
                return "Maintenance";
            case "OUT_OF_SERVICE":
                return "Out of Service";
            default:
                return status;
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const fetchAreas = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (debouncedSearchTerm.trim()) {
                params.q = debouncedSearchTerm;
            }

            const response = await getAllAreas(params);

            setAreas(response.data);
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to load areas');
            setAreas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAreas();
    }, [debouncedSearchTerm]);

    const handleAddArea = () => {
        openDialog('area', {
            onConfirm: async () => {
                try {
                    await fetchAreas();
                    return Promise.resolve();
                } catch (error) {
                    console.error('Error refreshing areas:', error);
                    return Promise.reject(error);
                }
            }
        });
    };

    const handleEditArea = (Area: any) => {
        openDialog('area', {
            editData: Area,
            onConfirm: async () => {
                try {
                    await fetchAreas();
                    return Promise.resolve();
                } catch (error) {
                    console.error('Error refreshing areas:', error);
                    return Promise.reject(error);
                }
            }
        });
    };

    const handleDeleteArea = async (area: any): Promise<void> => {
        try {
            await deleteArea(area.id);
            toast.success('Area deleted successfully');
            await fetchAreas();
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to delete area');
            throw error;
        }
    };

    const AreaColumns: TableColumn<any>[] = [
        {
            key: 'name',
            label: 'Name',
        },
        {
            key: 'status',
            label: 'Status',
            render: (item) => (
                <div>{getStatusLabel(item.status)}</div>
            ),
        }
    ];

    const actions = [
        {
            label: 'Edit',
            onClick: (item: any, e: React.MouseEvent) => {
                e.stopPropagation();
                handleEditArea(item);
            },
            action: "update",
            subject: "Area"
        }
    ];

    return (
        <DataTable
            data={areas}
            onSearch={handleSearch}
            searchLoading={loading}
            columns={AreaColumns}
            title="Area"
            getRowKey={(item: any) => item.id}
            actions={actions}
            primaryAction={{
                label: 'Add Area',
                onClick: handleAddArea,
                action: 'create',
                subject: "Area"
            }}
            deleteConfig={{
                onDelete: handleDeleteArea,
                getDeleteTitle: () => 'Delete Area',
                getDeleteDescription: (item: any | null) => item ? `Are you sure you want to delete "${item.name}"? This action cannot be undone.` : 'Are you sure you want to delete this area? This action cannot be undone.',
                getItemName: (item: any | null) => item ? item.name : 'this area',
                action: "delete",
                subject: 'Area'
            }}
            showBackButton
            onBackClick={() => navigate(-1)}
        />
    );
};

export default Areas;
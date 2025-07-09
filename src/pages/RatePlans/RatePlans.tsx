import { useEffect, useState } from 'react';
import { getRatePlans, addRatePlan, deleteRatePlan, updateRatePlan } from '@/services/RatePlans';
import DataTable, { ActionMenuItem, TableColumn } from '@/components/Templates/DataTable';
import { format } from 'date-fns';
import NewRatePlanDialog from './NewRatePlanDialog';
import { RatePlan } from '@/validation/schemas/RatePlan';

const RatePlans = () => {
    const [newRatePlanDialogOpen, setNewRatePlanDialogOpen] = useState<boolean>(false);
    const [editingRatePlan, setEditingRatePlan] = useState<RatePlan | null>(null);
    const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchRatePlans = async () => {
        try {
            setLoading(true);
            const response = await getRatePlans();
            setRatePlans(response.data || []);
        } catch (error: any) {
            console.error('Error fetching rate plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRatePlans();
    }, []);

    const handleDeleteRatePlan = async (ratePlan: RatePlan) => {
        try {
            await deleteRatePlan(ratePlan.id);
            await fetchRatePlans(); // Refresh the rate plans list
        } catch (error) {
            console.error('Error deleting rate plan:', error);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return 'Invalid date';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const ratePlanColumns: TableColumn[] = [
        { key: 'name', label: 'Name', sortable: true, className: 'font-medium text-gray-900' },
        {
            key: 'basePrice',
            label: 'Base Price',
            render: (item) => formatCurrency(item.basePrice),
            className: 'text-gray-600'
        },
        {
            key: 'description',
            label: 'Description',
            className: 'text-gray-600'
        },
        {
            key: 'createdAt',
            label: 'Created On',
            render: (item) => formatDate(item.createdAt),
            className: 'text-gray-600'
        },
    ];

    const ratePlanActions: ActionMenuItem[] = [
        {
            label: 'Edit',
            onClick: (ratePlan, e) => {
                e.stopPropagation();
                setEditingRatePlan(ratePlan as RatePlan);
                setNewRatePlanDialogOpen(true);
            }
        },
        {
            label: 'Delete',
            onClick: (ratePlan, e) => {
                e.stopPropagation();
                // The delete action is handled by the deleteConfig in DataTable
            }
        }
    ];

    const handleSaveRatePlan = async (data: {
        name: string,
        code: string,
        basePrice: number,
        baseAdjType: 'PERCENT' | 'FIXED',
        baseAdjVal: string,
        currencyId: string,
        description: string
    }) => {
        try {
            if (editingRatePlan) {
                // Update existing rate plan
                await updateRatePlan(editingRatePlan.id, data);
            } else {
                // Add new rate plan
                await addRatePlan(data);
            }
            setNewRatePlanDialogOpen(false);
            setEditingRatePlan(null);
            fetchRatePlans();
        } catch (error: any) {
            console.error('Error saving rate plan:', error);
            throw error;
        }
    };

    const handleDialogClose = () => {
        setNewRatePlanDialogOpen(false);
        setEditingRatePlan(null);
    };

    return (
        <>
            <DataTable
                data={ratePlans}
                loading={loading}
                columns={ratePlanColumns}
                title="Rate Plans"
                actions={ratePlanActions}
                primaryAction={{
                    label: 'New Rate Plan',
                    onClick: () => {
                        setEditingRatePlan(null);
                        setNewRatePlanDialogOpen(true);
                    }
                }}
                getRowKey={ratePlan => ratePlan.id}
                filter={{
                    searchPlaceholder: 'Search rate plans',
                    searchFields: ['name', 'description']
                }}
                emptyStateMessage="No rate plans found."
                deleteConfig={{
                    onDelete: handleDeleteRatePlan,
                    getDeleteTitle: () => 'Delete Rate Plan',
                    getDeleteDescription: (ratePlan) => {
                        const ratePlanName = ratePlan && (ratePlan as RatePlan).name;
                        return `Are you sure you want to delete "${ratePlanName || 'this rate plan'}"? This action cannot be undone.`;
                    },
                    getItemName: (ratePlan) => (ratePlan as RatePlan)?.name || 'Rate Plan'
                }}
            />
            <NewRatePlanDialog
                isOpen={newRatePlanDialogOpen}
                onCancel={handleDialogClose}
                onConfirm={handleSaveRatePlan}
                editingRatePlan={editingRatePlan}
            />
        </>
    );
};

export default RatePlans;

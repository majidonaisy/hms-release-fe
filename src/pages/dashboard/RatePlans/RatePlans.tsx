import { useState, useEffect } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { toast } from 'sonner';
import { getRatePlans, deleteRatePlan } from '@/services/RatePlans';
import DataTable, { TableColumn } from '@/components/Templates/DataTable';
import { useDialog } from '@/context/useDialog';

interface RatePlan {
  id: string;
  hotelId: string;
  code: string;
  name: string;
  baseAdjType: "PERCENT" | "FIXED";
  baseAdjVal: string; // Note: This comes as string from API
  currencyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
  roomType?: {
    name: string;
  };
  [key: string]: any;
}

const RatePlans = () => {
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { openDialog } = useDialog();

  const fetchRatePlans = async () => {
    try {
      setLoading(true);
      const response = await getRatePlans();
      // Map the response to include isFeatured if not present
      const mappedData = (response.data || []).map((plan: any) => ({
        ...plan,
        isFeatured: plan.isFeatured || false
      }));
      setRatePlans(mappedData);
    } catch (error: any) {
      toast.error(error.userMessage || 'Failed to load rate plans');
      console.error(error);
      setRatePlans([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatePlans();
  }, []);

  const handleAddRatePlan = () => {
    openDialog('ratePlan', {
      onRatePlanAdded: async () => {
        try {
          const response = await fetchRatePlans();
          console.log('response :>> ', response);
          return Promise.resolve();
        } catch (error) {
          console.error('Error refreshing rate plans:', error);
          return Promise.reject(error);
        }
      }
    });
  };

  const handleEditRatePlan = (ratePlan: RatePlan) => {
    openDialog('ratePlan', {
      editData: ratePlan,
      onRatePlanAdded: async () => {
        try {
          await fetchRatePlans();
          return Promise.resolve();
        } catch (error) {
          console.error('Error refreshing rate plans:', error);
          return Promise.reject(error);
        }
      }
    });
  };

  const handleDeleteRatePlan = async (ratePlan: RatePlan): Promise<void> => {
    try {
      await deleteRatePlan(ratePlan.id);
      toast.success('Rate plan deleted successfully');
      await fetchRatePlans();
    } catch (error: any) {
      toast.error(error.userMessage || 'Failed to delete rate plan');
      throw error; // Re-throw to let DataTable handle the error state
    }
  };

  const formatAdjustmentValue = (adjType: string, adjVal: string, currencyId: string): string => {
    const value = parseFloat(adjVal);
    if (adjType === "PERCENT") {
      return `${value}%`;
    } else {
      return `${value} ${currencyId}`;
    }
  };

  const ratePlanColumns: TableColumn<RatePlan>[] = [
    {
      key: 'name',
      label: 'Name',
    },
    {
      key: 'code',
      label: 'Code',
    },
    {
      key: 'baseAdjType',
      label: 'Adjustment Type',
      render: (item: RatePlan) => (
        <Badge className={item.baseAdjType === 'PERCENT' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
          {item.baseAdjType === 'PERCENT' ? 'Percentage' : 'Fixed Amount'}
        </Badge>
      ),
    },
    {
      key: 'baseAdjVal',
      label: 'Adjustment Value',
      render: (item: RatePlan) => formatAdjustmentValue(item.baseAdjType, item.baseAdjVal, item.currencyId),
    },
    {
      key: 'currencyId',
      label: 'Currency',
      render: (item: RatePlan) => (
        <Badge variant="outline">{item.currencyId}</Badge>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (item: RatePlan) => (
        <Badge className={item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (item: RatePlan, e: React.MouseEvent) => {
        e.stopPropagation();
        handleEditRatePlan(item);
      },
    }
  ];

  return (
    <div className="p-6">
      <DataTable<RatePlan>
        data={ratePlans}
        loading={loading}
        columns={ratePlanColumns}
        title="Rate Plans"
        actions={actions}
        primaryAction={{
          label: 'Add Rate Plan',
          onClick: handleAddRatePlan
        }}
        getRowKey={(item: RatePlan) => item.id}
        deleteConfig={{
          onDelete: handleDeleteRatePlan,
          getDeleteTitle: () => 'Delete Rate Plan',
          getDeleteDescription: (item: RatePlan | null) => item ? `Are you sure you want to delete "${item.name}"? This action cannot be undone.` : 'Are you sure you want to delete this rate plan? This action cannot be undone.',
          getItemName: (item: RatePlan | null) => item ? item.name : 'this rate plan',
        }}
      />
    </div>
  );
};

export default RatePlans;
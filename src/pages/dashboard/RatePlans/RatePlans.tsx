import { useState, useEffect } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { toast } from 'sonner';
import { getRatePlans, deleteRatePlan } from '@/services/RatePlans';
import DataTable, { TableColumn } from '@/components/Templates/DataTable';
import { useDialog } from '@/context/useDialog';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';

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
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const fetchRatePlans = async () => {
    try {
      setLoading(true);
      setError(null)
      const params: any = {};
      if (debouncedSearchTerm.trim()) {
        params.q = debouncedSearchTerm;
      }

      const response = await getRatePlans(params);

      const mappedData: RatePlan[] = (response.data || []).map((plan: any) => ({
        ...plan,
        isFeatured: plan.isFeatured ?? false,
        currencyId: plan.currencyId ?? '',
      }));

      setRatePlans(mappedData);
    } catch (error: any) {
      toast.error(error.userMessage || 'Failed to load rate plans');
      setRatePlans([]);
      setError(error.userMessage || "Failed to get rate plans")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatePlans();
  }, [debouncedSearchTerm]);

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
      action: "update",
      subject: "RatePlan"
    }
  ];

  return (
    <DataTable<RatePlan>
      data={ratePlans}
      onSearch={handleSearch}
      searchLoading={loading}
      columns={ratePlanColumns}
      title="Rate Plans"
      errorMessage={error || undefined}
      actions={actions}
      primaryAction={{
        label: 'Add Rate Plan',
        onClick: handleAddRatePlan,
        action: "create",
        subject: "RatePlan"
      }}
      getRowKey={(item: RatePlan) => item.id}
      deleteConfig={{
        onDelete: handleDeleteRatePlan,
        getDeleteTitle: () => 'Delete Rate Plan',
        getDeleteDescription: (item: RatePlan | null) => item ? `Are you sure you want to delete "${item.name}"? This action cannot be undone.` : 'Are you sure you want to delete this rate plan? This action cannot be undone.',
        getItemName: (item: RatePlan | null) => item ? item.name : 'this rate plan',
        action: "delete",
        subject: "RatePlan"
      }}
      showBackButton
      onBackClick={() => navigate(-1)}
    />
  );
};

export default RatePlans;
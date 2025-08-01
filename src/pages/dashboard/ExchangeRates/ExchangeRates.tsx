import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import DataTable, { TableColumn } from '@/components/Templates/DataTable';
import { useDialog } from '@/context/useDialog';
import { ExchangeRate, ExchangeRateRequest } from '@/validation/schemas/ExchangeRates';
import { addExchangeRate, getExchangeRates, updateExchangeRate } from '@/services/ExchangeRates';

const ExchangeRates = () => {
    const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
    const [loading, setLoading] = useState(true);
    const { openDialog } = useDialog();

    const fetchExchangeRates = async () => {
        try {
            setLoading(true);
            const response = await getExchangeRates();
            setExchangeRates(response.data);
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to load exchange rates');
            console.error(error);
            setExchangeRates([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExchangeRates();
    }, []);

    const handleAddExchangeRate = () => {
        openDialog('exchangeRate', {
            onConfirm: async (data: ExchangeRateRequest) => {
                try {
                    await addExchangeRate(data);
                    toast.success('Exchange Rates added successfully');
                    await fetchExchangeRates();
                    return Promise.resolve();
                } catch (error: any) {
                    toast.error(error.userMessage || 'Failed to add exchange rate');
                    return Promise.reject(error);
                }
            }
        });
    };

    const handleUpdateExchangeRate = (exchangeRate: ExchangeRate) => {
        openDialog('exchangeRate', {
            editingExchangeRate: exchangeRate,
            onConfirm: async (data: ExchangeRateRequest) => {
                try {
                    await updateExchangeRate(exchangeRate.id, data);
                    toast.success('Exchange Rate updated successfully');
                    await fetchExchangeRates();
                    return Promise.resolve();
                } catch (error: any) {
                    toast.error(error.userMessage || 'Failed to update exchange rate');
                    return Promise.reject(error);
                }
            }
        });
    };

    const exchangeRateColumns: TableColumn<ExchangeRate>[] = [
        {
            key: 'baseCurrency',
            label: 'Base Currency',
        },
        {
            key: 'targetCurrency',
            label: 'Target Currency',
        },
        {
            key: 'rate',
            label: 'Exchange Rate',
        },
    ];

    const actions = [
        {
            label: 'Edit',
            onClick: (item: ExchangeRate, e: React.MouseEvent) => {
                e.stopPropagation();
                handleUpdateExchangeRate(item);
            },
        }
    ];

    return (
        <div className="p-6">
            <DataTable
                data={exchangeRates}
                loading={loading}
                columns={exchangeRateColumns}
                title="Exchange Rates"
                actions={actions}
                primaryAction={{
                    label: 'Add Exchange Rate',
                    onClick: handleAddExchangeRate
                }}
                getRowKey={(item: ExchangeRate) => item.id}
            />
        </div>
    );
};

export default ExchangeRates;
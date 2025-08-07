import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { toast } from 'sonner';
import { ExchangeRate, ExchangeRateRequest, ExchangeRateRequestSchema } from '@/validation/schemas/ExchangeRates';
import { Currency } from '@/validation/schemas/Currency';
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from '../molecules/Select';
import { getExchangeRateCurrencies, updateExchangeRate } from '@/services/ExchangeRates';
import { Skeleton } from '../atoms/Skeleton';

interface NewExchangeRateDialogProps {
    isOpen: boolean;
    onConfirm: (data: ExchangeRateRequest) => Promise<void>;
    onCancel: () => void;
    editingExchangeRate?: ExchangeRate | null;
}

const NewExchangeRateDialog: React.FC<NewExchangeRateDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    editingExchangeRate
}) => {
    const [formData, setFormData] = useState<ExchangeRateRequest>({
        baseCurrency: '',
        rate: 0,
        targetCurrency: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const isEditing = !!editingExchangeRate;

    const fetchCurrencies = async () => {
        try {
            setIsLoading(true);
            const response = await getExchangeRateCurrencies();
            const currenciesData = response.data || [];
            setCurrencies(currenciesData);
        } catch (error: any) {
            console.error('Failed to fetch currencies:', error);
            toast.error(error.userMessage || 'Failed to fetch currencies');
            setCurrencies([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (editingExchangeRate) {
                setFormData({
                    baseCurrency: editingExchangeRate.baseCurrency,
                    targetCurrency: editingExchangeRate.targetCurrency,
                    rate: Number(editingExchangeRate.rate)
                });

            } else {
                setFormData({
                    baseCurrency: '',
                    targetCurrency: '',
                    rate: 0
                });
            }
            console.log("useEffect running: editingExchangeRate =", editingExchangeRate);
            console.log("FormData will be set to:", {
                baseCurrency: editingExchangeRate?.baseCurrency,
                targetCurrency: editingExchangeRate?.targetCurrency,
                rate: editingExchangeRate?.rate
            });

        }
    }, [isOpen, editingExchangeRate]);

    const handleInputChange = (field: keyof ExchangeRateRequest, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const validatedData = ExchangeRateRequestSchema.parse(formData);
            setIsLoading(true);

            if (isEditing && editingExchangeRate) {
                await updateExchangeRate(editingExchangeRate.id, validatedData as ExchangeRateRequest);
                toast("Success!", {
                    description: "Exchange rate was updated successfully.",
                });
            } else {
                await onConfirm(validatedData);
            }
            setFormData({
                baseCurrency: '',
                rate: 0,
                targetCurrency: ''
            });
            setErrors({});
            onCancel();

        } catch (error: any) {
            if (error.errors) {
                const fieldErrors: Record<string, string> = {};
                error.errors.forEach((err: any) => {
                    if (err.path && err.path.length > 0) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(fieldErrors);
                toast.error('Please fix the validation errors');
            } else {
                toast.error('Failed to create exchange rate');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (isLoading) return;

        setFormData({
            baseCurrency: '',
            rate: 0,
            targetCurrency: ''
        });
        setErrors({});
        onCancel();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl font-semibold">{isEditing ? 'Edit Exchange Rate' : "New Exchange Rate"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="baseCurrency">Base Currency</Label>
                        {isLoading ? (
                            <Skeleton className='h-10' />
                        ) :
                            currencies.length > 0 && (
                                <Select
                                    value={formData.baseCurrency}
                                    onValueChange={(code) => handleInputChange('baseCurrency', code)}
                                    disabled={isEditing}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select base currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem key={currency.code} value={currency.code}>
                                                {currency.code} - {currency.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        {errors.baseCurrency && (
                            <p className="text-red-500 text-sm">{errors.baseCurrency}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="targetCurrency">Target Currency</Label>
                        {isLoading ? (
                            <Skeleton className='h-10' />
                        ) : currencies.length > 0 && (
                            <Select
                                value={formData.targetCurrency}
                                onValueChange={(code) => handleInputChange('targetCurrency', code)}
                                disabled={isEditing}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select target currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map((currency) => (
                                        <SelectItem key={currency.code} value={currency.code}>
                                            {currency.code} - {currency.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {errors.targetCurrency && (
                            <p className="text-red-500 text-sm">{errors.targetCurrency}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rate">Rate</Label>
                        <Input
                            id="rate"
                            type="number"
                            min="0"
                            placeholder="1000"
                            value={formData.rate || ''}
                            onChange={(e) => handleInputChange('rate', parseFloat(e.target.value) || 0)}
                            className={errors.rate ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {errors.rate && <p className="text-red-500 text-sm">{errors.rate}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-white mt-6"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? (isEditing ? 'Updating...' : 'Creating...')
                            : (isEditing ? 'Update Exchange Rate' : 'Create Exchange Rate')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewExchangeRateDialog;

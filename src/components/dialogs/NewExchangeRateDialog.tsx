import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Organisms/Dialog';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { toast } from 'sonner';
import { ExchangeRateRequest, ExchangeRateRequestSchema } from '@/validation/schemas/ExchangeRates';

interface NewExchangeRateDialogProps {
    isOpen: boolean;
    onConfirm: (data: ExchangeRateRequest) => Promise<void>;
    onCancel: () => void;
}

const NewExchangeRateDialog: React.FC<NewExchangeRateDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel
}) => {
    const [formData, setFormData] = useState<ExchangeRateRequest>({
        baseCurrency: '',
        rate: 0,
        targetCurrency: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

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

            await onConfirm(validatedData);

            setFormData({
                baseCurrency: "",
                rate: 0,
                targetCurrency: ""
            });
            setErrors({});
            onCancel()
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
            baseCurrency: "",
            rate: 0,
            targetCurrency: ""
        });
        setErrors({});
        onCancel();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl font-semibold">New Exchange Rate</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="baseRate">Base Currency</Label>
                        <Input
                            id="baseRate"
                            placeholder="USD"
                            value={formData.baseCurrency}
                            onChange={(e) => handleInputChange('baseCurrency', e.target.value)}
                            className={errors.baseCurrency ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {errors.baseCurrency && <p className="text-red-500 text-sm">{errors.baseCurrency}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="targetCurrency">Target Currency</Label>
                        <Input
                            id="targetCurrency"
                            placeholder="IQR"
                            value={formData.targetCurrency || ''}
                            onChange={(e) => handleInputChange('targetCurrency', e.target.value)}
                            className={errors.targetCurrency ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {errors.targetCurrency && <p className="text-red-500 text-sm">{errors.targetCurrency}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rate">Rate</Label>
                        <Input
                            id="rate"
                            type="number"
                            min="0"
                            placeholder="e.g. 2"
                            value={formData.rate}
                            onChange={(e) => handleInputChange('rate', parseInt(e.target.value) || 0)}
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
                        {isLoading ? 'Creating...' : 'Create Exchange Rate'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewExchangeRateDialog;
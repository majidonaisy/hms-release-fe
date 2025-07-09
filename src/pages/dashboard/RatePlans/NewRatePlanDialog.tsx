import { Button } from '@/components/atoms/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/Organisms/Dialog';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { useState, useEffect } from 'react';
import { addRatePlan } from '@/services/RatePlans';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface NewRatePlanDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onRatePlanAdded: () => void;
}

export const NewRatePlanDialog = ({ isOpen, onOpenChange, onRatePlanAdded }: NewRatePlanDialogProps) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [baseAdjType, setBaseAdjType] = useState<'PERCENT' | 'FIXED'>('FIXED');
    const [baseAdjVal, setBaseAdjVal] = useState<string>('0');
    const [currencyId, setCurrencyId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        code?: string;
        baseAdjType?: string;
        baseAdjVal?: string;
        currencyId?: string;
        form?: string;
    }>({});

    // Reset form when dialog opens
    useEffect(() => {
        if (isOpen) {
            setName('');
            setCode('');
            setBaseAdjType('FIXED');
            setBaseAdjVal('0');
            setCurrencyId('');
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors: {
            name?: string;
            code?: string;
            baseAdjType?: string;
            baseAdjVal?: string;
            currencyId?: string;
        } = {};
        let isValid = true;

        if (!name.trim()) {
            newErrors.name = 'Rate plan name is required';
            isValid = false;
        }

        if (!code.trim()) {
            newErrors.code = 'Code is required';
            isValid = false;
        }

        if (!baseAdjType) {
            newErrors.baseAdjType = 'Adjustment type must be either PERCENT or FIXED';
            isValid = false;
        }

        if (!baseAdjVal) {
            newErrors.baseAdjVal = 'Adjustment value is required';
            isValid = false;
        }

        if (!currencyId.trim()) {
            newErrors.currencyId = 'Currency is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await addRatePlan({
                name: name.trim(),
                code: code.trim(),
                basePrice: 0, // Default value since field is removed
                baseAdjType: baseAdjType,
                baseAdjVal: baseAdjVal,
                currencyId: currencyId,
                description: '' // Default value since field is removed
            });
            toast.success('Rate plan added successfully');
            onRatePlanAdded();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.userMessage || 'Failed to add rate plan');
            setErrors({
                ...errors,
                form: error.userMessage || 'Failed to add rate plan. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onOpenChange(open)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Rate Plan</DialogTitle>
                    <DialogDescription>
                        Create a new rate plan for room pricing and availability.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2" id="new-rate-plan-form">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rate-plan-name" className="text-sm font-medium">
                                Rate Plan Name *
                            </Label>
                            <Input
                                id="rate-plan-name"
                                placeholder="Enter rate plan name (e.g., Standard)"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) {
                                        setErrors({ ...errors, name: undefined });
                                    }
                                }}
                                disabled={isSubmitting}
                                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                                autoFocus
                            />
                            {errors.name && (
                                <div className="text-red-500 text-sm flex items-center mt-1">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rate-plan-code" className="text-sm font-medium">
                                Code *
                            </Label>
                            <Input
                                id="rate-plan-code"
                                placeholder="Enter rate plan code (e.g., STD)"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    if (errors.code) {
                                        setErrors({ ...errors, code: undefined });
                                    }
                                }}
                                disabled={isSubmitting}
                                className={errors.code ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.code && (
                                <div className="text-red-500 text-sm flex items-center mt-1">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.code}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rate-plan-adj-type" className="text-sm font-medium">
                                Adjustment Type *
                            </Label>
                            <Select
                                value={baseAdjType}
                                onValueChange={(value: 'PERCENT' | 'FIXED') => {
                                    setBaseAdjType(value);
                                    if (errors.baseAdjType) {
                                        setErrors({ ...errors, baseAdjType: undefined });
                                    }
                                }}
                            >
                                <SelectTrigger
                                    id="rate-plan-adj-type"
                                    className={errors.baseAdjType ? "border-red-500 focus-visible:ring-red-500" : ""}
                                >
                                    <SelectValue placeholder="Select adjustment type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                                    <SelectItem value="PERCENT">Percentage</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.baseAdjType && (
                                <div className="text-red-500 text-sm flex items-center mt-1">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.baseAdjType}
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rate-plan-adj-value" className="text-sm font-medium">
                                Adjustment Value *
                            </Label>
                            <Input
                                id="rate-plan-adj-value"
                                type="text"
                                placeholder={baseAdjType === 'PERCENT' ? "Enter percentage (e.g., 10)" : "Enter amount (e.g., 20.00)"}
                                value={baseAdjVal}
                                onChange={(e) => {
                                    setBaseAdjVal(e.target.value);
                                    if (errors.baseAdjVal) {
                                        setErrors({ ...errors, baseAdjVal: undefined });
                                    }
                                }}
                                disabled={isSubmitting}
                                className={errors.baseAdjVal ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.baseAdjVal && (
                                <div className="text-red-500 text-sm flex items-center mt-1">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.baseAdjVal}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rate-plan-currency" className="text-sm font-medium">
                            Currency *
                        </Label>
                        <Input
                            id="rate-plan-currency"
                            placeholder="Enter currency ID (e.g., USD)"
                            value={currencyId}
                            onChange={(e) => {
                                setCurrencyId(e.target.value);
                                if (errors.currencyId) {
                                    setErrors({ ...errors, currencyId: undefined });
                                }
                            }}
                            disabled={isSubmitting}
                            className={errors.currencyId ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.currencyId && (
                            <div className="text-red-500 text-sm flex items-center mt-1">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {errors.currencyId}
                            </div>
                        )}
                    </div>

                    {errors.form && (
                        <div className="text-red-500 text-sm flex items-center mt-1">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.form}
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        <Button
                            variant="background"
                            type="button"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="min-w-[100px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Add Rate Plan
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewRatePlanDialog;
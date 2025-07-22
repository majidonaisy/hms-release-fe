import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getHotelSettings, updateHotelSettings } from '@/services/Hotel';
import { getAllCurrencies } from '@/services/Currency';
import { HotelSettings, UpdateHotelSettingsRequest, LateFeeType } from '@/validation/schemas/Hotel';
import { Currency } from '@/validation/schemas/Currency';

const HotelSettingsPage: React.FC = () => {
    const navigate = useNavigate();

    const [settings, setSettings] = useState<HotelSettings | null>(null);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<UpdateHotelSettingsRequest>({
        baseCurrency: '',
        checkInTime: '',
        checkOutTime: '',
        lateFeeType: LateFeeType.FIXED,
        lateFeeAmount: 0,
    });

    // Generate time options for check-in/out
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                times.push(timeString);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [settingsResponse, currenciesResponse] = await Promise.all([
                    getHotelSettings(),
                    getAllCurrencies()
                ]);
                console.log('settingsResponse', settingsResponse)
                setSettings(settingsResponse.data);
                setCurrencies(currenciesResponse.data || []);

                // Initialize form with current settings, handling null values with defaults
                setFormData({
                    baseCurrency: settingsResponse.data.baseCurrency || 'USD',
                    checkInTime: settingsResponse.data.checkInTime || '15:00',
                    checkOutTime: settingsResponse.data.checkOutTime || '11:00',
                    lateFeeType: settingsResponse.data.lateFeeType || LateFeeType.FIXED,
                    lateFeeAmount: settingsResponse.data.lateFeeAmount || 0,
                });
            } catch (error: any) {
                console.error('Failed to fetch data:', error);
                toast.error(error.userMessage || 'Failed to load hotel settings');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (field: keyof UpdateHotelSettingsRequest, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.baseCurrency || !formData.checkInTime || !formData.checkOutTime) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSaving(true);
            await updateHotelSettings(formData);
            toast.success('Hotel settings updated successfully');

            // Refresh settings data
            const updatedSettings = await getHotelSettings();
            setSettings(updatedSettings.data);
        } catch (error: any) {
            console.error('Failed to update settings:', error);
            toast.error(error.userMessage || 'Failed to update hotel settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600">Loading hotel settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/dashboard')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
                <h1 className="text-3xl font-bold">Hotel Settings</h1>
                <p className="text-gray-600 mt-2">Configure your hotel's general settings and policies</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Base Currency */}
                            <div className="space-y-2">
                                <Label htmlFor="baseCurrency" className="text-sm font-medium">
                                    Base Currency *
                                </Label>
                                <Select
                                    value={formData.baseCurrency}
                                    onValueChange={(value) => handleInputChange('baseCurrency', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select base currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Show current base currency first if it exists */}
                                        {settings?.baseCurrency && (
                                            <SelectItem value={settings.baseCurrency} key={settings.baseCurrency}>
                                                {settings.baseCurrency} - {currencies.find(c => c.code === settings.baseCurrency)?.name || 'Current Currency'}
                                            </SelectItem>
                                        )}
                                        {/* Show other currencies, filtered to exclude the current base currency */}
                                        {currencies
                                            .filter(currency => currency.code !== settings?.baseCurrency)
                                            .map((currency) => (
                                                <SelectItem key={currency.code} value={currency.code}>
                                                    {currency.code} - {currency.name}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Check-in Time */}
                            <div className="space-y-2">
                                <Label htmlFor="checkInTime" className="text-sm font-medium">
                                    Check-in Time *
                                </Label>
                                <Select
                                    value={formData.checkInTime}
                                    onValueChange={(value) => handleInputChange('checkInTime', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select check-in time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeOptions.map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Check-out Time */}
                            <div className="space-y-2">
                                <Label htmlFor="checkOutTime" className="text-sm font-medium">
                                    Check-out Time *
                                </Label>
                                <Select
                                    value={formData.checkOutTime}
                                    onValueChange={(value) => handleInputChange('checkOutTime', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select check-out time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeOptions.map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Late Fee Type */}
                            <div className="space-y-2">
                                <Label htmlFor="lateFeeType" className="text-sm font-medium">
                                    Late Fee Type *
                                </Label>
                                <Select
                                    value={formData.lateFeeType}
                                    onValueChange={(value) => handleInputChange('lateFeeType', value as LateFeeType)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={LateFeeType.FIXED}>Fixed Amount</SelectItem>
                                        <SelectItem value={LateFeeType.PERCENTAGE}>Percentage</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Late Fee Amount */}
                            <div className="space-y-2">
                                <Label htmlFor="lateFeeAmount" className="text-sm font-medium">
                                    Late Fee Amount *
                                    <span className="text-xs text-gray-500 ml-1">
                                        ({formData.lateFeeType === LateFeeType.PERCENTAGE ? '%' : formData.baseCurrency || 'Currency'})
                                    </span>
                                </Label>
                                <Input
                                    id="lateFeeAmount"
                                    type="number"
                                    min="0"
                                    step={formData.lateFeeType === LateFeeType.PERCENTAGE ? "0.01" : "1"}
                                    value={formData.lateFeeAmount}
                                    onChange={(e) => handleInputChange('lateFeeAmount', parseFloat(e.target.value) || 0)}
                                    placeholder={`Enter ${formData.lateFeeType === LateFeeType.PERCENTAGE ? 'percentage' : 'amount'}`}
                                />
                            </div>
                        </div>

                        {/* Current Settings Display */}
                        {settings && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Settings</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Base Currency:</span>
                                        <p className="font-medium">{settings.baseCurrency || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Check-in:</span>
                                        <p className="font-medium">{settings.checkInTime || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Check-out:</span>
                                        <p className="font-medium">{settings.checkOutTime || 'Not set'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Late Fee:</span>
                                        <p className="font-medium">
                                            {settings.lateFeeAmount !== null && settings.lateFeeType ?
                                                `${settings.lateFeeAmount} ${settings.lateFeeType === LateFeeType.PERCENTAGE ? '%' : settings.baseCurrency}`
                                                : 'Not set'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="min-w-32"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Settings
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default HotelSettingsPage;

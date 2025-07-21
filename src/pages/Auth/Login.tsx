import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { login } from '@/services/Auth';
import { login as loginAction } from '@/redux/slices/authSlice';
import { LoginRequest } from '@/validation/schemas';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the intended destination from location state
    const from = location.state?.from?.pathname || '/';

    const [credentials, setCredentials] = useState<LoginRequest>({
        username: 'majid',
        password: 'StrongPassword123!'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await login(credentials);

            dispatch(loginAction({
                accessToken: response.data.accessToken,
                permissions: response.data.permissions,
                refreshToken: response.data.refreshToken,
            }));

            // Navigate to intended destination or home
            navigate(from, { replace: true });
        } catch (error: any) {
            setError(error.userMessage || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Welcome back! Please enter your credentials.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-2">
                        <Mail size={18} />
                        Username
                    </Label>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={credentials.username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        className="w-full"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                        <Lock size={18} />
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={credentials.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        'Sign in'
                    )}
                </Button>
            </form>
        </div>
    );
};

export default Login;
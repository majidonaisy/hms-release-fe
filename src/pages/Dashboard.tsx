import React, { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { LoginRequest } from '@/validation/schemas';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { login } from '@/services/Auth';
import { login as loginAction } from '@/redux/slices/authSlice';

interface DashboardProps {
  modalContext?: any;
  pageTitle?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ pageTitle }) => {
  const dispatch = useDispatch();
  // Form state
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: 'majid',
    password: 'StrongPassword123!'
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await login(credentials);
      console.log('response', response)
      setSuccess(`Login successful! Welcome back!`);
      dispatch(loginAction({
        accessToken: response.accessToken.token,
        permissions: response.accessToken.permissions // Ensure permissions are included
      }));
    } catch (error: any) {
      console.error('Login Error:', error);
      setError(error.userMessage || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{pageTitle || 'Dashboard'}</h2>

      {/* Login Form Card */}
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-6">Test Microservices Login</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2">
              <Mail size={18} />
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="admin"
              value={credentials.username}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock size={18} />
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>




          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </Button>

          {/* Service Info */}
          <div className="text-xs text-gray-500 mt-4">
            <p>This form uses the Auth Service to test your microservices setup.</p>
            <p>Check the console for detailed API responses.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
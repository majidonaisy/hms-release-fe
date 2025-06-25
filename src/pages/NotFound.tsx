import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 bg-hms-primary/15 rounded-full flex items-center justify-center mb-6">
            <Search className="w-16 h-16 text-hms-primary" />
          </div>
          <h1 className="text-6xl font-bold text-hms-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2"

          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={handleGoHome}
            variant="primaryOutline"
            className="w-full flex items-center justify-center gap-2 hover:bg-hms-accent hover:border-inherit hover:text-hms-primary"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Need help?</h3>
          <p className="text-xs text-gray-600">
            If you believe this is an error, please contact support or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
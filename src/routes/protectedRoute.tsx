import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAuth = true
}) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (requireAuth && !isAuthenticated) {
        // Redirect to login with the current location
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (!requireAuth && isAuthenticated) {
        // Redirect authenticated users away from auth pages
        return <Navigate to="/homepage" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
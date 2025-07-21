import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">HMS</h1>
                    <p className="text-gray-600 mt-2">Hotel Management System</p>
                </div>
                
                <div className="bg-white py-8 px-6 shadow rounded-lg">
                    <Outlet />
                </div>
                
                <div className="text-center text-sm text-gray-500">
                    © 2025 HMS. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
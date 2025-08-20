import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import AuthLayout from "@/layout/AuthLayout";
import ProtectedRoute from "@/routes/protectedRoute";
import Login from "@/pages/Auth/Login";
import RoutesList from "./routes";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const HomeRoutes: React.FC = () => {
    const HomeRoutesList = RoutesList();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Flatten all routes including subroutes for proper routing
    const getAllRoutes = (routes: any[]): any[] => {
        const allRoutes: any[] = [];

        routes.forEach(route => {
            allRoutes.push(route);
            if (route.subRoutes && route.subRoutes.length > 0) {
                allRoutes.push(...getAllRoutes(route.subRoutes));
            }
        });

        return allRoutes;
    };

    const allRoutes = getAllRoutes(HomeRoutesList);

    const renderProtectedRoutes = (routes: any[]) => {
        return routes.map((route: any, index: number) => (
            <Route
                key={index}
                path={route.path}
                element={<route.component />}
            />
        ));
    };

    return (
        <Routes>
            {/* Redirect root "/" to /auth/login if not authenticated */}
            <Route
                path="/"
                element={
                    isAuthenticated
                        ? <ProtectedRoute requireAuth={true}><MainLayout routes={HomeRoutesList} /></ProtectedRoute>
                        : <Navigate to="/auth/login" replace />
                }
            >
                {/* Only show this if authenticated */}
                {isAuthenticated && <Route index element={<Navigate to="/homepage" replace />} />}
                {isAuthenticated && renderProtectedRoutes(allRoutes)}
            </Route>

            {/* Auth Routes */}
            <Route path="/auth" element={
                <ProtectedRoute requireAuth={false}>
                    <AuthLayout />
                </ProtectedRoute>
            }>
                <Route path="login" element={<Login />} />
                <Route index element={<Navigate to="login" replace />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
    );
};

export default HomeRoutes;
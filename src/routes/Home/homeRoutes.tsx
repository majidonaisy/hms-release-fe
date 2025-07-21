import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { NotFound } from "@/pages";
import MainLayout from "@/layout/MainLayout";
import AuthLayout from "@/layout/AuthLayout";
import ProtectedRoute from "@/routes/protectedRoute";
import Login from "@/pages/Auth/Login";
import RoutesList from "./routes";

const HomeRoutes: React.FC = () => {
    const HomeRoutesList = RoutesList();

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
            {/* Auth Routes - Only accessible when not authenticated */}
            <Route path="/auth" element={
                <ProtectedRoute requireAuth={false}>
                    <AuthLayout />
                </ProtectedRoute>
            }>
                <Route path="login" element={<Login />} />
                <Route index element={<Navigate to="login" replace />} />
            </Route>

            {/* Protected Routes - Only accessible when authenticated */}
            <Route path="/" element={
                <ProtectedRoute requireAuth={true}>
                    <MainLayout routes={HomeRoutesList} />
                </ProtectedRoute>
            }>
                {/* Default redirect to home */}
                <Route index element={<Navigate to="/rooms" replace />} />
                {renderProtectedRoutes(allRoutes)}
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default HomeRoutes;
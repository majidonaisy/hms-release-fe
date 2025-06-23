import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { NotFound } from "@/pages";
import MainLayout from "@/layout/MainLayout";
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

    const renderRoutes = (routes: any[]) => {
        return routes.map((route: any, index: number) => {
            const isAuthenticated = route.isAuthenticated !== false;

            return (
                <Route
                    key={index}
                    path={route.path}
                    element={
                        isAuthenticated ? (
                            <route.component />
                        ) : (
                            <Navigate to="/home" />
                        )
                    }
                />
            );
        });
    };

    return (
        <Routes>
            <Route path="/" element={<MainLayout routes={HomeRoutesList} />}>
                {/* Add index route to redirect to /home */}
                <Route index element={<Navigate to="/home" replace />} />
                {renderRoutes(allRoutes)}
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default HomeRoutes;
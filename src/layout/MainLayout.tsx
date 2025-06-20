import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/Organisms/Sidebar'
import { routes } from '@/routes';

const MainLayout: React.FC = () => {
    const location = useLocation();

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden ">
                <Sidebar collapsible="icon" className='font-bold'>
                    <SidebarHeader className='group-data-[collapsible=icon]:px-2 transition-all duration-300 ease-in-out'>
                        <div className="flex items-center justify-center min-h-[3rem]">
                            <h2 className="text-lg font-semibold py-2 group-data-[collapsible=icon]:text-base transition-all duration-300 ease-in-out relative">
                                <span className="group-data-[collapsible=icon]:scale-0 group-data-[collapsible=icon]:opacity-0 transition-all duration-200 ease-in-out origin-center">
                                    HMS
                                </span>
                                <span className="absolute inset-0 flex items-center justify-center scale-0 opacity-0 group-data-[collapsible=icon]:scale-100 group-data-[collapsible=icon]:opacity-100 transition-all duration-200 ease-in-out delay-100 origin-center">
                                    H
                                </span>
                            </h2>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {routes.map((route) => (
                                        <SidebarMenuItem key={route.path}>
                                            <SidebarMenuButton
                                                tooltip={route.title}
                                                asChild
                                                isActive={location.pathname === route.path}
                                            >
                                                <Link to={route.path}>
                                                    <route.icon className="!w-5 !h-5" />
                                                    <span className='group-data-[collapsible=icon]:hidden'>{route.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter>
                        <div className="px-4 py-2 text-sm text-hms-primary group-data-[collapsible=icon]:hidden">
                            Hotel Management System
                        </div>
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset className="flex flex-col flex-1 min-w-0">
                    {/* Fixed Header */}
                    <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-white sticky top-0 z-10">
                        <SidebarTrigger />
                        <h1 className="text-xl font-semibold">
                            {routes.find(route => route.path === location.pathname)?.title || 'Dashboard'}
                        </h1>
                    </header>
                    
                    {/* Content Area - This is the only space available for children */}
                    <main className="flex-1 overflow-auto bg-white">
                        <Routes>
                            {routes.map((route) => (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={route.component ? <route.component /> : <div className="p-4">Page not found</div>}
                                />
                            ))}
                        </Routes>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;
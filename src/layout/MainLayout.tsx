import React, { useState } from 'react';
import { useLocation, Link, Outlet, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, } from '@/components/Organisms/Sidebar'
import { Button } from '@/components/atoms/Button';
import { LogOut, Plus } from 'lucide-react';
import NewDialogsWithTypes from '@/components/dialogs/NewDialogWIthTypes';
import { useRole } from '@/context/CASLContext';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';

interface MainLayoutProps {
    routes: any[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ routes }) => {
    const location = useLocation();
    const [openTabs, setOpenTabs] = useState<string[]>([]);
    const [openReservationDialog, setOpenReservationDialog] = useState(false);
    const { filterRoutesByPermissions } = useRole();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Get current active route
    const activeRouteSeg = location.pathname.split('/').pop() || '';
    const activeRoute = decodeURIComponent(activeRouteSeg);

    // Handle toggle for subroutes
    const handleToggle = (path: string) => {
        setOpenTabs((prevOpenTabs) =>
            prevOpenTabs.includes(path)
                ? prevOpenTabs.filter((tab) => tab !== path)
                : [...prevOpenTabs, path]
        );
    };

    // Render menu items with subroute support
    const renderMenuItems = (routes: any[], parentPath = "") => {
        return routes
            .filter((route: any) => route.isAuthenticated !== false && route.isShown !== false)
            .map((route: any) => {
                const fullPath = route.path;
                const isOpen = openTabs.includes(fullPath);

                // Filter subroutes by permissions if they exist
                const filteredSubroutes = route.subRoutes
                    ? filterRoutesByPermissions(route.subRoutes.filter((subRoute: any) => subRoute.isShown !== false))
                    : [];

                const hasVisibleSubroutes = filteredSubroutes.length > 0;

                const isActive = location.pathname === fullPath ||
                    location.pathname.startsWith(fullPath + '/') ||
                    (route.subRoutes && route.subRoutes.some((subRoute: any) => {
                        return location.pathname === subRoute.path;
                    }));

                return (
                    <React.Fragment key={fullPath}>
                        <SidebarMenuItem>
                            {hasVisibleSubroutes ? (
                                <div className="flex items-center w-full">
                                    <SidebarMenuButton asChild isActive={isActive} className="flex-1">
                                        <Link to={fullPath} className="flex items-center">
                                            {typeof route.icon === 'function' ?
                                                <route.icon className="h-4 w-4 shrink-0" /> :
                                                <span className="h-4 w-4 shrink-0 flex items-center justify-center">{route.icon}</span>
                                            }
                                            <span className={`group-data-[collapsible=icon]:hidden text-lg ml-2 ${isActive ? 'font-bold' : 'font-semibold'}`}>
                                                {route.title || route.path}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                    <button
                                        onClick={() => handleToggle(fullPath)}
                                        className="p-2 hover:bg-gray-100 rounded transition-colors duration-200 group-data-[collapsible=icon]:hidden"
                                    >
                                        {isOpen ? (
                                            <ChevronUp className="size-4" />
                                        ) : (
                                            <ChevronDown className="size-4" />
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <SidebarMenuButton
                                    tooltip={route.title}
                                    asChild
                                    isActive={isActive}
                                >
                                    <Link to={fullPath} className="flex items-center justify-start">
                                        {typeof route.icon === 'function' ?
                                            <route.icon className="shrink-0" /> :
                                            <span className=" shrink-0 flex items-center justify-center">{route.icon}</span>
                                        }
                                        <span className={`group-data-[collapsible=icon]:hidden text-lg ${isActive ? 'font-bold' : 'font-semibold'}`}>
                                            {route.title || route.path}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                        {hasVisibleSubroutes && (
                            <div
                                className={`pl-4 overflow-hidden transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <SidebarMenu>
                                    {renderMenuItems(filteredSubroutes)}
                                </SidebarMenu>
                            </div>
                        )}
                    </React.Fragment>
                );
            });
    };

    const getSidebarRoutes = () => {
        if (!routes || !Array.isArray(routes)) return [];

        // Filter routes by permissions first, then by visibility
        const filteredByPermissions = filterRoutesByPermissions(routes);
        return filteredByPermissions.filter(route => route.isShown === true);
    };
    const menuItems = React.useMemo(() => renderMenuItems(getSidebarRoutes()), [routes, openTabs, location.pathname]);

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden ">
                <Sidebar collapsible="icon">
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
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {menuItems}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Log Out" asChild>
                                    <Button className="w-full transition-all duration-200" onClick={() => { dispatch(logout()); navigate("/auth/login"); }}>
                                        <LogOut className="!size-4" />
                                        <span className="group-data-[collapsible=icon]:hidden text-md font-semibold">Log Out</span>
                                    </Button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset className="flex flex-col flex-1 min-w-0">
                    {/* Fixed Header */}
                    <header className="flex h-16 shrink-0 items-center px-4 border-b sticky top-0 z-10 justify-between ">
                        <div className='flex gap-1'>
                            <SidebarTrigger />
                        </div>
                        <div className='flex items-center gap-1'>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant='primaryOutline'
                                    onClick={() => setOpenReservationDialog(true)}
                                    className='h-7'
                                >
                                    <Plus size={18} className="mr-2" />
                                    New Reservation
                                </Button>
                            </div>
                            <p className='text-sm font-bold'>{format(new Date(), 'MMMM dd, yyyy')}</p>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto">
                        <Outlet />
                    </main>
                </SidebarInset>
                <NewDialogsWithTypes
                    open={openReservationDialog}
                    setOpen={setOpenReservationDialog}
                    description='Select Reservation Type'
                    textOne='Book a room for one guest or party'
                    textTwo='Book multiple rooms under a single reservation'
                    title='New Reservation'
                    groupRoute='/new-reservation/new-group-reservation'
                    individualRoute='/new-reservation/new-individual-reservation'
                />
            </div>
        </SidebarProvider >
    );
};

export default MainLayout;
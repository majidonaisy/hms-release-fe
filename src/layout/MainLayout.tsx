import React, { useState } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/Organisms/Sidebar'
import { Button } from '@/components/atoms/Button';
import { LogOut, Plus } from 'lucide-react';
import ReservationModal from '../components/Templates/ReservationModal';
import { Room, Reservation } from '../types/reservation';
import { sampleRooms } from '../data/data';

interface MainLayoutProps {
    routes: any[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ routes }) => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();
    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
    const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | undefined>();
    const [openTabs, setOpenTabs] = useState<string[]>([]); // Add this for collapsible subroutes

    const defaultRoom = sampleRooms[0];

    const handleOpenNewReservation = () => {
        setSelectedRoom(defaultRoom);
        setSelectedDateRange({
            start: new Date(),
            end: addDays(new Date(), 1),
        });
        setSelectedReservation(undefined);
        setIsModalOpen(true);
    };

    const handleOpenReservationModal = (data: {
        room?: Room;
        reservation?: Reservation;
        dateRange?: { start: Date; end: Date };
    }) => {
        setSelectedRoom(data.room);
        setSelectedReservation(data.reservation);
        setSelectedDateRange(data.dateRange);
        setIsModalOpen(true);
    };

    const handleSaveReservation = () => {
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReservation(undefined);
        setSelectedRoom(undefined);
        setSelectedDateRange(undefined);
    };

    const modalContext = {
        openReservationModal: handleOpenReservationModal,
    };

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
                // For subroutes, use the full path directly, for main routes use as is
                const fullPath = route.path;
                const isOpen = openTabs.includes(fullPath);

                // Check if there are any visible subroutes
                const hasVisibleSubroutes = route.subRoutes && route.subRoutes.some((subRoute: any) => subRoute.isShown !== false);

                // Check if route is active
                const isActive = location.pathname === fullPath ||
                    location.pathname.startsWith(fullPath + '/') ||
                    (route.subRoutes && route.subRoutes.some((subRoute: any) => {
                        return location.pathname === subRoute.path;
                    }));

                return (
                    <React.Fragment key={fullPath}>
                        <SidebarMenuItem>
                            {hasVisibleSubroutes ? (
                                // Parent with visible subroutes - show chevron
                                <div className="flex items-center w-full">
                                    <SidebarMenuButton asChild isActive={isActive} className="flex-1">
                                        <Link to={fullPath} className="flex items-center">
                                            {typeof route.icon === 'function' ?
                                                <route.icon className="!size-4" /> :
                                                <span className="!size-4">{route.icon}</span>
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
                                // Regular route link (no visible subroutes or no subroutes at all)
                                <SidebarMenuButton
                                    tooltip={route.title}
                                    asChild
                                    isActive={isActive}
                                >
                                    <Link to={fullPath}>
                                        {typeof route.icon === 'function' ?
                                            <route.icon className="!size-4" /> :
                                            <span className="!size-4">{route.icon}</span>
                                        }
                                        <span className={`group-data-[collapsible=icon]:hidden text-lg ${isActive ? 'font-bold' : 'font-semibold'}`}>
                                            {route.title || route.path}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>

                        {/* Render subroutes only if there are visible ones */}
                        {hasVisibleSubroutes && (
                            <div
                                className={`pl-4 overflow-hidden transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <SidebarMenu>
                                    {renderMenuItems(route.subRoutes)}
                                </SidebarMenu>
                            </div>
                        )}
                    </React.Fragment>
                );
            });
    };

    const getSidebarRoutes = () => {
        if (!routes || !Array.isArray(routes)) return [];
        return routes.filter(route => route.isShown === true);
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
                                    <Button className="w-full transition-all duration-200">
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
                                    onClick={handleOpenNewReservation}
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
                        <Outlet context={modalContext} />
                    </main>
                </SidebarInset>

                {/* Reservation Modal */}
                {selectedRoom && (
                    <ReservationModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSave={handleSaveReservation}
                        reservation={selectedReservation}
                        room={selectedRoom}
                        selectedDateRange={selectedDateRange}
                    />
                )}
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;
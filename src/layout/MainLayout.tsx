import React, { useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { addDays, format } from 'date-fns';
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
import { routes } from '@/routes';
import { Button } from '@/components/atoms/Button';
import { LogOut, Plus } from 'lucide-react';
import ReservationModal from '../components/Templates/ReservationModal';
import { Room, Reservation } from '../types/reservation';
import { sampleRooms } from '../data/data';

const MainLayout: React.FC = () => {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();
    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
    const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | undefined>();

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
                                    {routes.map((route) => (
                                        <SidebarMenuItem key={route.path}>
                                            <SidebarMenuButton
                                                tooltip={route.title}
                                                asChild
                                                isActive={location.pathname === route.path}
                                            >
                                                <Link to={route.path} className='transition-all duration-200'>
                                                    <route.icon className="!size-4" />
                                                    <span className={`group-data-[collapsible=icon]:hidden text-lg ${location.pathname === route.path ? 'font-bold' : 'font-semibold'}`}>{route.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
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
                        <Routes>
                            {routes.map((route) => {
                                const Component = route.component;
                                return (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={Component ?
                                            <Component
                                                modalContext={modalContext}
                                                pageTitle={route.title}
                                            /> :
                                            <div className="p-4">Page not found</div>
                                        }
                                    />
                                );
                            })}
                        </Routes>
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
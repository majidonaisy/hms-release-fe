import React from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

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
import { Home, Users, Calendar, Settings, Building } from 'lucide-react'

// Mock menu items
const menuItems = [
    { title: 'Dashboard', icon: Home },
    { title: 'Guests', icon: Users },
    { title: 'Reservations', icon: Calendar },
    { title: 'Rooms', icon: Building },
    { title: 'Settings', icon: Settings },
]

function SidebarComponent() {
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon"  >
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
                                {menuItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton tooltip={item.title}>
                                            <item.icon className="!w-5 !h-5" />
                                            <span className='group-data-[collapsible=icon]:hidden'>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <div className="px-4 py-2 text-sm text-gray-500 group-data-[collapsible=icon]:hidden">
                        Hotel Management System
                    </div>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                    <SidebarTrigger />
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                </header>


            </SidebarInset>
        </SidebarProvider>
    )
}


const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                <SidebarComponent />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
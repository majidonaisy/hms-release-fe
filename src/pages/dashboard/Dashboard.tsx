import { addRoomType } from '@/services/RoomTypes';
import { addRole } from '@/services/Role';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '@/components/Templates/DashboardCard';
import HotelSettingsCard from '@/components/Templates/HotelSettingsCard';
import { toast } from 'sonner';
import { useDialog } from '@/context/useDialog';
import { AddRoomTypeRequest } from '@/validation/schemas/RoomType';
import { AddRoleRequest } from '@/validation/schemas/Roles';
import { ExchangeRateRequest } from '@/validation/schemas/ExchangeRates';
import { addExchangeRate } from '@/services/ExchangeRates';
import { Can } from '@/context/CASLContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { openDialog } = useDialog();

    const handleRoomTypeDialog = () => {
        openDialog('roomType', {
            onConfirm: async (data: AddRoomTypeRequest) => {
                try {
                    await addRoomType(data);
                    toast.success('Room type created successfully');
                    return Promise.resolve();
                } catch (error: any) {
                    toast.error(error.userMessage || 'Error creating room type');
                    return Promise.reject(error);
                }
            }
        });
    };

    const handleAmenityDialog = () => {
        openDialog('amenity', {
            onAmenityAdded: async () => {
                try {
                    return Promise.resolve();
                } catch (error) {
                    console.error('Error refreshing amenities:', error);
                    return Promise.reject(error);
                }
            }
        });
    };

    const handleRatePlanDialog = () => {
        openDialog('ratePlan', {
            onRatePlanAdded: async () => {
                try {
                    return Promise.resolve();
                } catch (error) {
                    console.error('Error refreshing rate plans:', error);
                    return Promise.reject(error);
                }
            }
        });
    };

    const handleRoleDialog = () => {
        openDialog('role', {
            onConfirm: async (data: AddRoleRequest) => {
                try {
                    await addRole(data);
                    return true;
                } catch (error: any) {
                    toast.error(error.userMessage || 'Error creating role');
                    throw error;
                }
            }
        });
    };

    const handleExchangeRatesDialog = () => {
        openDialog('exchangeRate', {
            onConfirm: async (data: ExchangeRateRequest) => {
                try {
                    await addExchangeRate(data);
                    return true;
                } catch (error: any) {
                    toast.error(error.userMessage || 'Error creating exchange rate');
                    throw error;
                }
            }
        });
    };

    const handleDepartmentsDialog = () => {
        openDialog('departments', {
            onConfirm: async () => {
                try {
                    return true;
                } catch (error: any) {
                    console.error('Error refreshing departments:', error);
                    throw error;
                }
            }
        });
    };

    const handleAreasDialog = () => {
        openDialog('area', {
            onConfirm: async () => {
                try {
                    return true;
                } catch (error: any) {
                    console.error('Error refreshing areas:', error);
                    throw error;
                }
            }
        });
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">Hotel Setup</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Can action="read" subject="RoomType">
                    <DashboardCard
                        title="Room Types"
                        description="Manage the types of rooms offered to guests, like standard, deluxe, or suite."
                        imageSrc="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                        imageAlt="Hotel Room Types"
                        onCreateClick={handleRoomTypeDialog}
                        onViewClick={() => navigate('/roomTypes')}
                        createButtonText="New Room Type"
                        viewButtonText="View Room Types"
                        createPermissions={{ action: "create", subject: "RoomType" }}
                        viewPermissions={{ action: "read", subject: "RoomType" }}
                    />
                </Can>

                <Can action="read" subject="Amenity">
                    <DashboardCard
                        title="Amenities"
                        description="Set the services and features available in guest rooms."
                        imageSrc="https://images.unsplash.com/photo-1597817109745-c418f4875230?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        imageAlt="Hotel Amenities"
                        onCreateClick={handleAmenityDialog}
                        onViewClick={() => navigate('/amenities')}
                        createButtonText="New Amenity"
                        viewButtonText="View Amenities"
                        createPermissions={{ action: "create", subject: "Amenity" }}
                        viewPermissions={{ action: "read", subject: "Amenity" }}
                    />
                </Can>

                <Can action="read" subject="RatePlan">
                    <DashboardCard
                        title="Rate Plans"
                        description="Manage pricing rules, packages, and seasonal rates."
                        imageSrc="https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074"
                        imageAlt="Hotel Rate Plans"
                        onCreateClick={handleRatePlanDialog}
                        onViewClick={() => navigate('/rate-plans')}
                        createButtonText="New Rate Plan"
                        viewButtonText="View Rate Plans"
                        createPermissions={{ action: "create", subject: "RatePlan" }}
                        viewPermissions={{ action: "read", subject: "RatePlan" }}
                    />
                </Can>

                <Can action="read" subject="Role">
                    <DashboardCard
                        title="Roles"
                        description="Define staff roles and their system permissions."
                        imageSrc="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070"
                        imageAlt="Hotel Staff Roles"
                        onCreateClick={handleRoleDialog}
                        onViewClick={() => navigate('/roles-permissions')}
                        createButtonText="New Role"
                        viewButtonText="View Roles"
                        createPermissions={{ action: "create", subject: "Role" }}
                        viewPermissions={{ action: "read", subject: "Role" }}
                    />
                </Can>

                <Can action="read" subject="ExchangeRate">
                    <DashboardCard
                        title="Exchange Rates"
                        description="Configure currency exchange rates used across the system for accurate financial transactions."
                        imageSrc="https://plus.unsplash.com/premium_photo-1661611260273-4312872f53da?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        imageAlt="Exchange Rates"
                        onCreateClick={handleExchangeRatesDialog}
                        onViewClick={() => navigate('/exchangeRates')}
                        createButtonText="New Exchange Rate"
                        viewButtonText="View Exchange Rates"
                        createPermissions={{ action: "create", subject: "ExchangeRate" }}
                        viewPermissions={{ action: "read", subject: "ExchangeRate" }}
                    />
                </Can>

                <Can action="read" subject="Departments">
                    <DashboardCard
                        title="Departments"
                        description="Organize your staff into departments to manage responsibilities and reporting structures."
                        imageSrc="https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        imageAlt="Departments"
                        onCreateClick={handleDepartmentsDialog}
                        onViewClick={() => navigate('/departments')}
                        createButtonText="New Department"
                        viewButtonText="View Departments"
                        createPermissions={{ action: "create", subject: "Departments" }}
                        viewPermissions={{ action: "read", subject: "Departments" }}
                    />
                </Can>

                <Can action="read" subject="Area">
                    <DashboardCard
                        title="Areas"
                        description="Configure sections of the hotel such as the lobby, dining, and recreational facilities."
                        imageSrc="https://images.unsplash.com/photo-1711906439107-9c4f08e8c526?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        imageAlt="Areas"
                        onCreateClick={handleAreasDialog}
                        onViewClick={() => navigate('/areas')}
                        createButtonText="New Area"
                        viewButtonText="View Areas"
                        createPermissions={{ action: "create", subject: "Area" }}
                        viewPermissions={{ action: "read", subject: "Area" }}
                    />
                </Can>

                <Can action="manage" subject="Hotel">
                    <HotelSettingsCard
                        title="Hotel Settings"
                        description="Configure general hotel settings like currency, check-in/out times, and late fees."
                        imageSrc="https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=2070"
                        imageAlt="Hotel Settings"
                        onManageClick={() => navigate('/hotel-settings')}
                        manageButtonText="Manage Settings"
                    />
                </Can>
            </div>
        </div>
    );
};

export default Dashboard;
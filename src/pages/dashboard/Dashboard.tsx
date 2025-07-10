import { useEffect, useState } from 'react';
import { addRoomType, getRoomTypes } from '@/services/RoomTypes';
import { getAmenities } from '@/services/Amenities';
import { addRole, getRoles } from '@/services/Role';
import { getRatePlans } from '@/services/RatePlans';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '@/components/Templates/DashboardCard';
import { toast } from 'sonner';
import { useDialog } from '@/context/useDialog';
import {
    GetRoomTypesResponse,
    AddRoomTypeRequest
} from '@/validation/schemas/RoomType';
import { AmenityResponse } from '@/validation/schemas/amenity';
import { GetRatePlansResponse } from '@/validation/schemas/RatePlan';
import {
    AddRoleRequest,
    RoleResponse
} from '@/validation/schemas/Roles';

const Dashboard = () => {
    const navigate = useNavigate();
    const { openDialog } = useDialog();

    const [roomTypes, setRoomTypes] = useState<GetRoomTypesResponse>({ status: 0, data: [] });
    const [amenities, setAmenities] = useState<AmenityResponse>({ status: 0, data: [] });
    const [ratePlans, setRatePlans] = useState<GetRatePlansResponse>({ status: 0, data: [] });
    const [roles, setRoles] = useState<RoleResponse>({ status: 0, data: [] });
    const [loading, setLoading] = useState<boolean>(true);

    const fetchRoomTypes = async () => {
        try {
            const response = await getRoomTypes();
            if (response && response.status === 200) {
                setRoomTypes(response);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("Error fetching room types:", error);
            toast.error(error.userMessage || "Failed to fetch room types");
            // Set an empty data array to prevent undefined errors
            setRoomTypes({ status: 0, data: [] });
        }
    }

    const fetchAmenities = async () => {
        try {
            const response = await getAmenities();
            if (response && response.status === 200) {
                setAmenities(response);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("Error fetching amenities:", error);
            toast.error(error.userMessage || "Failed to fetch amenities");
            // Set an empty data array to prevent undefined errors
            setAmenities({ status: 0, data: [] });
        }
    }

    const fetchRoles = async () => {
        try {
            const response = await getRoles();
            if (response && response.status === 200) {
                setRoles(response);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("Error fetching roles:", error);
            toast.error(error.userMessage || "Failed to fetch roles");
            // Set an empty data array to prevent undefined errors
            setRoles({ status: 0, data: [] });
        }
    }

    const fetchRatePlans = async () => {
        try {
            const response = await getRatePlans();
            if (response && response.status === 200) {
                setRatePlans(response);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            console.error("Error fetching rate plans:", error);
            toast.error(error.userMessage || "Failed to fetch rate plans");
            // Set an empty data array to prevent undefined errors
            setRatePlans({ status: 0, data: [] });
        }
    }

    const handleRoomTypeDialog = () => {
        openDialog('roomType', {
            onConfirm: async (data: AddRoomTypeRequest) => {
                try {
                    await addRoomType(data);
                    toast.success('Room type created successfully');
                    await fetchRoomTypes();
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
                    await fetchAmenities();
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
                    await fetchRatePlans();
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
                    await fetchRoles();
                    return true;
                } catch (error: any) {
                    toast.error(error.userMessage || 'Error creating role');
                    throw error;
                }
            }
        });
    };

    useEffect(() => {
        setLoading(true);

        Promise.all([
            fetchRoomTypes().catch(err => console.error('Room types fetch error:', err)),
            fetchAmenities().catch(err => console.error('Amenities fetch error:', err)),
            fetchRoles().catch(err => console.error('Roles fetch error:', err)),
            fetchRatePlans().catch(err => console.error('Rate plans fetch error:', err))
        ])
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">Hotel Setup</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard
                    title="Room Types"
                    description="Manage the types of rooms offered to guests, like standard, deluxe, or suite."
                    totalItems={roomTypes.data?.length || 0}
                    imageSrc="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                    imageAlt="Hotel Room Types"
                    onCreateClick={handleRoomTypeDialog}
                    onViewClick={() => navigate('/roomTypes')}
                    createButtonText="New room type"
                    viewButtonText="View room types"
                />

                <DashboardCard
                    title="Amenities"
                    description="Set the services and features available in guest rooms."
                    totalItems={amenities.data?.length || 0}
                    imageSrc="https://images.unsplash.com/photo-1600629677883-abc09ccfc4c9?q=80&w=1974"
                    imageAlt="Hotel Amenities"
                    onCreateClick={handleAmenityDialog}
                    onViewClick={() => navigate('/amenities')}
                    createButtonText="New amenity"
                    viewButtonText="View amenities"
                />

                <DashboardCard
                    title="Rate Plans"
                    description="Manage pricing rules, packages, and seasonal rates."
                    totalItems={ratePlans.data?.length || 0}
                    imageSrc="https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074"
                    imageAlt="Hotel Rate Plans"
                    onCreateClick={handleRatePlanDialog}
                    onViewClick={() => navigate('/rate-plans')}
                    createButtonText="New rate plan"
                    viewButtonText="View rate plans"
                />

                <DashboardCard
                    title="Roles"
                    description="Define staff roles and their system permissions."
                    totalItems={roles.data?.length || 0}
                    imageSrc="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070"
                    imageAlt="Hotel Staff Roles"
                    onCreateClick={handleRoleDialog}
                    onViewClick={() => navigate('/roles-permissions')}
                    createButtonText="New role"
                    viewButtonText="View roles"
                />
            </div>
        </div>
    );
};

export default Dashboard;
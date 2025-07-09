// Import only what we need
import { useEffect, useState } from 'react';
import { getRoomTypes } from '@/services/RoomTypes';
import { getAmenities } from '@/services/Amenities'; // Updated import
import { getRoles } from '@/services/Role';
import { getRatePlans } from '@/services/RatePlans';
import { useNavigate } from 'react-router-dom';
import { ViewAmenitiesDialog } from './Amenities/ViewAmenitiesDialog';
import { NewAmenityDialog } from './Amenities/NewAmenityDialog';
import { DashboardCard } from '@/components/Templates/DashboardCard';

const Dashboard = () => {
    const navigate = useNavigate();
    // Current date for display
    const [roomTypes, setRoomTypes] = useState<any>([]);
    const [amenities, setAmenities] = useState<any>([]);
    const [ratePlans, setRatePlans] = useState<any>([]);
    const [roles, setRoles] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Dialog state variables
    const [viewAmenitiesOpen, setViewAmenitiesOpen] = useState(false);
    const [newAmenityOpen, setNewAmenityOpen] = useState(false);

    const fetchRoomTypes = async () => {
        try {
            const response = await getRoomTypes();
            setRoomTypes(response);
        } catch (error) {
            console.error("Error fetching room types:", error);
        }
    }

    const fetchAmenities = async () => {
        try {
            // Use pagination to get amenities
            const response = await getAmenities({ page: 1, limit: 10 });
            setAmenities(response);
        } catch (error) {
            console.error("Error fetching amenities:", error);
        }
    }

    const fetchRoles = async () => {
        try {
            const response = await getRoles();
            setRoles(response);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }

    const fetchRatePlans = async () => {
        try {
            const response = await getRatePlans();
            setRatePlans(response);
        } catch (error) {
            console.error("Error fetching rate plans:", error);
        }
    }

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetchRoomTypes(),
            fetchAmenities(),
            fetchRoles(),
            fetchRatePlans()
        ]).then(() => {
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
            {/* Main heading */}
            <h1 className="text-2xl font-bold mb-6">Hotel Setup</h1>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Room Types Card */}
                <DashboardCard
                    title="Room Types"
                    description="Manage the types of rooms offered to guests, like standard, deluxe, or suite."
                    totalItems={roomTypes.pagination?.totalItems || 0}
                    imageSrc="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                    imageAlt="Hotel Room Types"
                    onCreateClick={() => { }}
                    onViewClick={() => { }}
                    createButtonText="New room type"
                    viewButtonText="View room types"
                />

                {/* Amenities Card */}
                <DashboardCard
                    title="Amenities"
                    description="Set the services and features available in guest rooms."
                    totalItems={amenities.data?.length || 0}
                    imageSrc="https://images.unsplash.com/photo-1600629677883-abc09ccfc4c9?q=80&w=1974"
                    imageAlt="Hotel Amenities"
                    onCreateClick={() => setNewAmenityOpen(true)}
                    onViewClick={() => setViewAmenitiesOpen(true)}
                    createButtonText="New amenity"
                    viewButtonText="View amenities"
                />

                {/* Rate Plans Card */}
                <DashboardCard
                    title="Rate Plans"
                    description="Manage pricing rules, packages, and seasonal rates."
                    totalItems={ratePlans.pagination?.totalItems || 0}
                    imageSrc="https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074"
                    imageAlt="Hotel Rate Plans"
                    onCreateClick={() => { }}
                    onViewClick={() => { }}
                    createButtonText="New rate plan"
                    viewButtonText="View rate plans"
                />

                {/* Roles Card */}
                <DashboardCard
                    title="Roles"
                    description="Define staff roles and their system permissions."
                    totalItems={roles.pagination?.totalItems || 0}
                    imageSrc="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070"
                    imageAlt="Hotel Staff Roles"
                    onCreateClick={() => { }}
                    onViewClick={() => navigate('/roles-permissions')}
                    createButtonText="New role"
                    viewButtonText="View roles"
                />
            </div>

            {/* Dialogs */}
            <ViewAmenitiesDialog
                isOpen={viewAmenitiesOpen}
                onOpenChange={setViewAmenitiesOpen}
                onAmenityDeleted={fetchAmenities}
            />
            <NewAmenityDialog
                isOpen={newAmenityOpen}
                onOpenChange={setNewAmenityOpen}
                onAmenityAdded={fetchAmenities}
            />
        </div>
    );
};

export default Dashboard;
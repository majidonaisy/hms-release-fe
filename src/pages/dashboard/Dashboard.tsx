import { Button } from '@/components/atoms/Button';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/Organisms/Card';
import { useEffect, useState } from 'react';
import { getRoomTypes } from '@/services/RoomTypes';
import { getAmenities } from '@/services/Rooms';
import { getRoles } from '@/services/Role';
import { getRatePlans } from '@/services/RatePlans';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    // Current date for display
    const [roomTypes, setRoomTypes] = useState<any>([]);
    const [amenities, setAmenities] = useState<any>([]);
    const [ratePlans, setRatePlans] = useState<any>([]);
    const [roles, setRoles] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);

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
            const response = await getAmenities();
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
                <Card className="bg-hms-accent-35">
                    <CardContent className="p-6">
                        <div className="flex">
                            <div className="mr-4">
                                <div className="h-32 w-44 rounded overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
                                        alt="Hotel Reception"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">Room Types</h3>
                                <p className="text-gray-600 mb-2">Manage the types of rooms offered to guests, like standard, deluxe, or suite.</p>
                                <div className="text-sm text-gray-500 mb-2">
                                    <span>Total: {roomTypes.pagination.totalItems || 0} Types</span>
                                </div>

                                <div className="flex gap-2">
                                    <Button >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        New room type
                                    </Button>
                                    <Button variant="background">
                                        View room types
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Amenities Card */}
                <Card className="bg-hms-accent-35">
                    <CardContent className="p-6">
                        <div className="flex">
                            <div className="mr-4">
                                <div className="h-32 w-44 rounded overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1600629677883-abc09ccfc4c9?q=80&w=1974"
                                        alt="Hotel Staff"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">Amenities</h3>
                                <p className="text-gray-600 mb-2">"Set the services and features available in guest rooms."</p>
                                <div className="text-sm text-gray-500 mb-2">
                                    {/* <span>Total: {amenities.pagination.totalItems || 0} Amenities</span> */}
                                </div>
                                <div className="text-sm text-gray-400 mb-4">
                                </div>
                                <div className="flex gap-2">
                                    <Button >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        New amenities
                                    </Button>
                                    <Button variant="background">
                                        View amenities
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Rate Plans Card */}
                <Card className="bg-hms-accent-35">
                    <CardContent className="p-6">
                        <div className="flex">
                            <div className="mr-4">
                                <div className="h-32 w-44 rounded overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1600629677883-abc09ccfc4c9?q=80&w=1974"
                                        alt="Hotel Staff"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">Rate Plans</h3>
                                <p className="text-gray-600 mb-2">"Manage pricing rules, packages, and seasonal rates."</p>
                                <div className="text-sm text-gray-500 mb-2">
                                    <span>Total: {ratePlans.pagination.totalItems || 0} Plans</span>
                                </div>

                                <div className="flex gap-2">
                                    <Button >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        New rate plans
                                    </Button>
                                    <Button variant="background">
                                        View rate plans
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Roles Card */}
                <Card className="bg-hms-accent-35">
                    <CardContent className="p-6">
                        <div className="flex">
                            <div className="mr-4">
                                <div className="h-32 w-44 rounded overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1600629677883-abc09ccfc4c9?q=80&w=1974"
                                        alt="Hotel Staff"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">Roles</h3>
                                <p className="text-gray-600 mb-2">"Define staff roles and their system permissions."</p>
                                <div className="text-sm text-gray-500 mb-2">
                                    {/* <span>Total: {roles.pagination.totalItems || 0} Roles</span> */}
                                </div>
                                <div className="flex gap-2">
                                    <Button >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        New roles
                                    </Button>
                                    <Button variant="background" onClick={() => {
                                        navigate('/roles-permissions');
                                    }} >
                                        View roles
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { deleteEMployee, getEmployeeById, updateEmployee } from '@/services/Employees';
import { GetEmployeeByIdResponse, UpdateTeamMemberRequest } from '@/validation/schemas/Employees';
import { getRoles } from '@/services/Role';
import EditingSkeleton from '@/components/Templates/EditingSkeleton';
import { toast } from 'sonner';
import DeleteDialog from '@/components/molecules/DeleteDialog';
import { Role } from '@/validation/schemas/Roles';

const TeamMemberProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [teamMember, setTeamMember] = useState<GetEmployeeByIdResponse['data'] | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<GetEmployeeByIdResponse['data'] | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<UpdateTeamMemberRequest>({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        roleId: ''
    });

    useEffect(() => {
        const fetchTeamProfile = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [employeeResponse, rolesResponse] = await Promise.all([
                    getEmployeeById(id),
                    getRoles()
                ]);

                setTeamMember(employeeResponse.data);
                setRoles(rolesResponse.data);

                // Initialize form data
                setFormData({
                    email: employeeResponse.data.email,
                    username: employeeResponse.data.username,
                    firstName: employeeResponse.data.firstName,
                    lastName: employeeResponse.data.lastName,
                    roleId: employeeResponse.data.roleId
                });
            } catch (error: any) {
                console.error('Failed to fetch team member:', error);
                setTeamMember(null);
                toast("Error!", {
                    description: "Failed to load team member data.",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchTeamProfile();
    }, [id]);

    const getStatusColor = (status: boolean): string => {
        switch (status) {
            case true:
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            case false:
                return 'bg-red-100 text-red-700 hover:bg-red-100';
        }
    };

    const handleInputChange = (field: keyof UpdateTeamMemberRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveEdit = async () => {
        if (!id) return;

        setLoading(true);
        try {
            // Remove password if empty to keep current password
            const updateData = { ...formData };
            await updateEmployee(id, updateData);
            toast("Success!", {
                description: "Team member was updated successfully.",
            });

            // Refresh team member data
            const employeeResponse = await getEmployeeById(id);
            setTeamMember(employeeResponse.data);
            setIsEditMode(false);
        } catch (error: any) {
            const err = error?.userMessage || "Failed to update team member.";
            toast("Error!", {
                description: err,
            });
            console.error("Failed to update team member:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        if (teamMember) {
            // Reset form data to original values
            setFormData({
                email: teamMember.email,
                username: teamMember.username,
                firstName: teamMember.firstName,
                lastName: teamMember.lastName,
                roleId: teamMember.roleId
            });
        }
        setIsEditMode(false);
    };

    const handleDeleteEmployee = async () => {
        setLoading(true);
        if (employeeToDelete) {
            try {
                await deleteEMployee(employeeToDelete.id);
                setDeleteDialogOpen(false);
                setEmployeeToDelete(null);
                navigate('/team-members');
                toast("Success!", {
                    description: "Employee was deleted successfully.",
                });
            } catch (error) {
                if (error instanceof Error && 'userMessage' in error) {
                    console.error("Failed to delete employee:", (error as any).userMessage);
                } else {
                    console.error("Failed to delete employee:", error);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    // Get role name from role ID
    const getRoleName = (roleId: string): string => {
        const role = roles.find(r => r.id === roleId);
        return role?.name || 'Unknown Role';
    };

    return (
        <>
            {loading ? (
                <EditingSkeleton />
            ) : !teamMember ? (
                <div className='text-muted-foreground text-center'>Team Member not found</div>
            ) : (
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="p-1"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-bold">
                            {isEditMode ? 'Edit Staff Profile' : 'Staff Profile'}
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="bg-white rounded-lg shadow p-6">
                                
                                <p className='text-center font-semibold'>
                                    {isEditMode ? `${formData.firstName} ${formData.lastName}` : `${teamMember.firstName} ${teamMember.lastName}`}
                                </p>
                                <div className="text-center">
                                    <Badge className={`${getStatusColor(teamMember.isActive)} border-0 mb-2`}>
                                        • {teamMember.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className='flex gap-2 text-center justify-center'>
                                    {isEditMode ? (
                                        <>
                                            <Button
                                                onClick={handleSaveEdit}
                                                disabled={loading}
                                            >
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                            <Button
                                                variant='primaryOutline'
                                                onClick={handleCancelEdit}
                                                disabled={loading}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => setIsEditMode(true)}>
                                                Edit Profile
                                            </Button>
                                            <Button
                                                variant="primaryOutline"
                                                onClick={() => {
                                                    setEmployeeToDelete(teamMember);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                Delete Account
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-3">
                                <CardHeader className='p-0'>
                                    <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                                        Personal Info
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-0 space-y-3">
                                    <div className='flex justify-between items-center'>
                                        <Label className="font-semibold">First Name</Label>
                                        {isEditMode ? (
                                            <Input
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                className='w-40 h-8 text-sm'
                                                placeholder='John'
                                            />
                                        ) : (
                                            <p className="">{teamMember.firstName}</p>
                                        )}
                                    </div>

                                    <div className='flex justify-between items-center'>
                                        <Label className="font-semibold">Last Name</Label>
                                        {isEditMode ? (
                                            <Input
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                className='w-40 h-8 text-sm'
                                                placeholder='Doe'
                                            />
                                        ) : (
                                            <p className="">{teamMember.lastName}</p>
                                        )}
                                    </div>

                                    <div className='flex justify-between items-center'>
                                        <Label className="font-semibold">Email</Label>
                                        {isEditMode ? (
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className='w-40 h-8 text-sm'
                                                placeholder='john.doe@example.com'
                                            />
                                        ) : (
                                            <p className="">{teamMember.email}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="p-3">
                                <CardHeader className='p-0'>
                                    <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                                        Account Info
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-0 space-y-3">
                                    <div className='flex justify-between items-center'>
                                        <Label className="font-semibold">Username</Label>
                                        {isEditMode ? (
                                            <Input
                                                value={formData.username}
                                                onChange={(e) => handleInputChange('username', e.target.value)}
                                                className='w-40 h-8 text-sm'
                                                placeholder='johndoe'
                                            />
                                        ) : (
                                            <p className="">{teamMember.username}</p>
                                        )}
                                    </div>
                                </CardContent>

                                {!isEditMode && (
                                    <CardFooter className='p-0 flex justify-end'>
                                        <Button size="sm" className='h-6 rounded-full'>
                                            Reset Password
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </div>

                        <Card className="p-3">
                            <CardHeader className='p-0'>
                                <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                                    Job Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 space-y-3">
                                <div className='flex justify-between items-center'>
                                    <Label className="font-semibold">Assigned Role</Label>
                                    {isEditMode ? (
                                        <Select
                                            value={formData.roleId}
                                            onValueChange={(value) => handleInputChange('roleId', value)}
                                        >
                                            <SelectTrigger className='w-40 h-8 text-sm'>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="">{getRoleName(teamMember.roleId)}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="p-3">
                            <CardHeader className='p-0'>
                                <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>Activity Logs</CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center rounded-lg border px-1">
                                        <Input
                                            type="text"
                                            placeholder="Search here"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            className="border-none outline-none focus-visible:ring-0 bg-transparent text-sm h-5"
                                        />
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Button variant="outline" className='h-6'>
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <p className='text-sm text-muted-foreground'>Filter</p>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="text-center text-gray-500 py-8">
                                    <div className="w-12 h-12 bg-hms-primary/15 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <p className="text-sm">No activity logs available</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onCancel={() => { setEmployeeToDelete(null); setDeleteDialogOpen(false) }}
                onConfirm={handleDeleteEmployee}
                loading={loading}
                title="Delete Employee"
                description={`Are you sure you want to delete employee ${employeeToDelete?.firstName} ${employeeToDelete?.lastName}? This action cannot be undone.`}
            />
        </>
    );
};

export default TeamMemberProfile;
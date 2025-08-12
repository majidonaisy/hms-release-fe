import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { deleteEMployee, getEmployeeById, updateEmployee } from '@/services/Employees';
import { GetEmployeeByIdResponse, UpdateTeamMemberRequest } from '@/validation/schemas/Employees';
import { getRoles } from '@/services/Role';
import EditingSkeleton from '@/components/Templates/EditingSkeleton';
import { toast } from 'sonner';
import DeleteDialog from '@/components/molecules/DeleteDialog';
import { Role } from '@/validation/schemas/Roles';
import { Departments } from '@/validation/schemas/Departments';
import { getDepartments } from '@/services/Departments';

const TeamMemberProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
        roleId: '',
        departmentId: ''
    });
    const [departments, setDepartments] = useState<Departments['data']>([]);

    useEffect(() => {
        const fetchTeamProfile = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [employeeResponse, rolesResponse, departmentsResponse] = await Promise.all([
                    getEmployeeById(id),
                    getRoles(),
                    getDepartments()
                ]);

                setTeamMember(employeeResponse.data);
                setRoles(rolesResponse.data);
                setDepartments(departmentsResponse.data)

                // Initialize form data
                setFormData({
                    email: employeeResponse.data.email,
                    username: employeeResponse.data.username,
                    firstName: employeeResponse.data.firstName,
                    lastName: employeeResponse.data.lastName,
                    roleId: employeeResponse.data.roleId,
                    departmentId: employeeResponse.data.department.id
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
                roleId: teamMember.roleId,
                departmentId: teamMember.department.id
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

    const formatDate = (date: Date): string => {
        const today = new Date();
        const sessionDate = new Date(date);

        // Check if it's today
        if (sessionDate.toDateString() === today.toDateString()) {
            return 'Today';
        }

        // Check if it's yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (sessionDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }

        // Return formatted date
        return sessionDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (date: Date): string => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    const getActivityDescription = (session: any): string => {
        if (session.isActive) {
            return 'Logged in';
        } else {
            return 'Logged out';
        }
    };

    // Group sessions by date
    const groupSessionsByDate = (sessions: any[]) => {
        const grouped: { [key: string]: any[] } = {};

        sessions
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .forEach((session) => {
                const dateKey = formatDate(new Date(session.createdAt));
                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                grouped[dateKey].push(session);
            });

        return grouped;
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
                                    <div className='flex justify-between items-center'>
                                        <Label className="font-semibold">Department</Label>
                                        {isEditMode ? (
                                            <Select
                                                value={formData.departmentId}
                                                onValueChange={(value) => handleInputChange('departmentId', value)}
                                            >
                                                <SelectTrigger className='w-40 h-8 text-sm'>
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {departments.map((department) => (
                                                        <SelectItem key={department.id} value={department.id}>
                                                            {department.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="">{teamMember.department.name}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="p-3">
                            <CardHeader className='p-0'>
                                <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>
                                    Sessions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-4">
                                    {teamMember.Session.length === 0 ? (
                                        <div className="text-center text-muted-foreground text-sm py-8">
                                            No sessions found
                                        </div>
                                    ) : (
                                        (() => {
                                            const groupedSessions = groupSessionsByDate(teamMember.Session);

                                            return Object.entries(groupedSessions).map(([dateKey, sessions]) => (
                                                <div key={dateKey} className="space-y-3">
                                                    {/* Date Header */}
                                                    <div className="text-sm font-medium bg-hms-primary/15 px-2 py-1 mb-5 rounded">
                                                        {dateKey}
                                                    </div>

                                                    {/* Sessions for this date */}
                                                    <div className="space-y-3 pl-4">
                                                        {sessions.map((session) => {
                                                            return (
                                                                <div key={session.id} className="ml-10">
                                                                    <div className="right-30 relative -top-5" >
                                                                        <div className="flex-shrink-0">
                                                                            <div className="w-px h-10 bg-hms-primary mt-1 absolute left-20">
                                                                                <div className='w-10 bg-hms-primary h-px relative top-9'></div>
                                                                                <div className='w-2 h-2 rounded-full bg-hms-primary relative top-8 -left-1'></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between ml-2 bg-hms-accent/15 p-2 rounded-lg">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-sm font-medium">
                                                                                {getActivityDescription(session)}
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-xs flex flex-col text-gray-500">
                                                                            <p className='text-end'>{formatTime(new Date(session.lastActivity || session.createdAt))}</p>
                                                                            {session.isActive && (
                                                                                <span className="text-xs text-green-600">Currently active</span>
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ));
                                        })()
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="p-3">
                            <CardHeader className='p-0'>
                                <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>Activity Logs</CardTitle>

                            </CardHeader>
                            <div className="text-center text-muted-foreground text-sm py-8">
                                No activity logs found
                            </div>
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
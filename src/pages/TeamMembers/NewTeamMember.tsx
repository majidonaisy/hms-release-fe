import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { ChevronLeft, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogDescription, DialogTitle } from '@/components/Organisms/Dialog';
import { getRoles } from '@/services/Role';
import { addTeamMember, getEmployeeById, updateEmployee } from '@/services/Employees';
import EditingSkeleton from '@/components/Templates/EditingSkeleton';
import { AddEmployeeRequest } from '@/validation/schemas/Employees';
import { getDepartments } from '@/services/Departments';
import { Departments } from '@/validation/schemas/Departments';

interface Role {
    id: string;
    name: string;
    hotelId: string;
    permissions: Array<{
        id: string;
        subject: string;
        action: string;
    }>;
    isTemplate: boolean
}

const NewTeamMember = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [employeeLoading, setEmployeeLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Departments['data']>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<AddEmployeeRequest>({
        departmentId: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        roleId: '',
        username: ''
    });
    const [teamMemberCreatedDialog, setTeamMemberCreatedDialog] = useState(false);

    // Check if in edit mode and fetch employee data
    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            const fetchEmployee = async () => {
                setEmployeeLoading(true);
                try {
                    const employee = await getEmployeeById(id);
                    setFormData({
                        email: employee.data.email,
                        username: employee.data.username,
                        password: employee.data.password,
                        firstName: employee.data.firstName,
                        lastName: employee.data.lastName,
                        roleId: employee.data.roleId,
                        departmentId: employee.data.department.id || ''
                    });
                } catch (error) {
                    console.error("Failed to fetch employee:", error);
                    toast("Error!", {
                        description: "Failed to load employee data.",
                    });
                } finally {
                    setEmployeeLoading(false);
                }
            };
            fetchEmployee();
        }
    }, [id]);

    useEffect(() => {
        const handleGetRoles = async () => {
            try {
                const rolesResponse = await getRoles();
                setRoles(rolesResponse.data);
            } catch (error) {
                console.error('Failed to fetch roles:', error);
                toast("Error!", {
                    description: "Failed to load roles.",
                });
            }
        };

        const handleGetDepartments = async () => {
            try {
                const response = await getDepartments();
                setDepartments(response.data);
                console.log(response)
            } catch (error) {
                console.error('Failed to fetch departments:', error);
                toast("Error!", {
                    description: "Failed to load departments.",
                });
            }
        };

        handleGetRoles();
        handleGetDepartments();
    }, []);

    const handleInputChange = (field: keyof AddEmployeeRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const requiredFields = ['email', 'username', 'password', 'firstName', 'lastName', 'roleId'];

        const missingFields = requiredFields.filter(field => !formData[field as keyof AddEmployeeRequest]);

        if (missingFields.length > 0) {
            toast("Error!", {
                description: "Please fill in all required fields.",
            });
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                if (id) {
                    const updateData = { ...formData };

                    await updateEmployee(id, updateData);
                    toast("Success!", {
                        description: "Team member was updated successfully.",
                    });
                } else {
                    console.error("Employee ID is undefined.");
                    return;
                }
            } else {
                await addTeamMember(formData);
                toast("Success!", {
                    description: "Team member was created successfully.",
                });
            }

            setTeamMemberCreatedDialog(true);
        } catch (error: any) {
            const err = error?.userMessage || `Failed to ${isEditMode ? 'update' : 'create'} team member.`;
            toast("Error!", {
                description: err,
            });
            console.error(`Failed to ${isEditMode ? 'update' : 'create'} team member:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = () => {
        console.log('Draft saved:', formData);
        toast("Draft Saved!", {
            description: "Your progress has been saved as a draft.",
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            {employeeLoading && (
                <EditingSkeleton />
            )}
            <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="p-0"
                    >
                        <ChevronLeft className="" />
                    </Button>
                    <h1 className="text-xl font-bold">
                        {isEditMode ? 'Edit Team Member' : 'New Team Member'}
                    </h1>
                </div>
                <form onSubmit={handleSubmit} className='px-7 grid grid-cols-2 gap-8'>
                    <div className='space-y-8'>
                        <div className='space-y-5'>
                            <h2 className='text-lg font-bold'>Personal Information</h2>

                            <div className='space-y-1'>
                                <Label>First Name *</Label>
                                <Input
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    className='border border-slate-300'
                                    placeholder='John'
                                    required
                                />
                            </div>

                            <div className='space-y-1'>
                                <Label>Last Name *</Label>
                                <Input
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    className='border border-slate-300'
                                    placeholder='Doe'
                                    required
                                />
                            </div>

                            <div className='space-y-1'>
                                <Label>Email *</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className='border border-slate-300'
                                    placeholder='john.doe@example.com'
                                    required
                                />
                            </div>
                        </div>

                        <div className='space-y-5'>
                            <h2 className='text-lg font-bold'>Account Details</h2>

                            <div className='space-y-1'>
                                <Label>Username *</Label>
                                <Input
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className='border border-slate-300'
                                    placeholder='johndoe'
                                    required
                                />
                            </div>

                            <div className='space-y-1'>
                                <Label>
                                    Password
                                </Label>
                                <Input
                                    type='password'
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className='border border-slate-300'
                                    placeholder='••••••••'
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className='space-y-5'>
                        <h2 className='text-lg font-bold'>Job Details</h2>

                        <div className='space-y-1'>
                            <Label>Role *</Label>
                            <Select
                                value={formData.roleId}
                                onValueChange={(value) => handleInputChange('roleId', value)}
                            >
                                <SelectTrigger className='w-full border border-slate-300'>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name} {role.isTemplate && (
                                                <p className='text-xs text-muted-foreground'>(Template Role)</p>
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-1'>
                            <Label>Department</Label>
                            <Select
                                value={formData.departmentId}
                                onValueChange={(value) => handleInputChange('departmentId', value)}
                            >
                                <SelectTrigger className='w-full border border-slate-300'>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(departments) && departments.map((department) => (
                                        <SelectItem key={department.id} value={department.id}>
                                            {department.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-center gap-3 pt-6 col-span-2">
                        <Button
                            type="button"
                            variant='background'
                            className='px-8'
                            onClick={handleSaveDraft}
                        >
                            Save Draft
                        </Button>
                        <Button
                            type="submit"
                            variant="foreground"
                            className="px-8"
                            disabled={loading}
                        >
                            {loading
                                ? isEditMode
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditMode
                                    ? "Update Team Member"
                                    : "Create Team Member"}
                        </Button>
                    </div>
                </form>

                <Dialog open={teamMemberCreatedDialog} onOpenChange={() => setTeamMemberCreatedDialog(false)}>
                    <DialogContent className='w-fit flex flex-col items-center text-center'>
                        <DialogHeader>
                            <DialogTitle className="flex flex-col items-center gap-2">
                                <Check className="bg-green-500 text-white rounded-full p-1 w-6 h-6" />
                                Team member has been {isEditMode ? 'updated' : 'created'} successfully
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            {isEditMode
                                ? "The team member's information has been updated."
                                : "The new team member can now log in with their credentials."
                            }
                        </DialogDescription>
                        <DialogFooter>
                            <Button
                                onClick={() => {
                                    setTeamMemberCreatedDialog(false);
                                    navigate('/team-members');
                                }}
                                variant='background'
                            >
                                Back to Team Members
                            </Button>
                            {!isEditMode && (
                                <Button onClick={() => {
                                    navigate('/team-members/new');
                                    setTeamMemberCreatedDialog(false);
                                    setFormData({
                                        email: '',
                                        firstName: '',
                                        lastName: '',
                                        password: '',
                                        roleId: '',
                                        username: '',
                                        departmentId: ''
                                    });
                                }}>
                                    Add Another Member
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default NewTeamMember;
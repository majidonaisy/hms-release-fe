import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { ChevronLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogDescription, DialogTitle } from '@/components/Organisms/Dialog';
import { getRoles } from '@/services/Role';
import { addTeamMember } from '@/services/Employees';

interface Role {
    id: string;
    name: string;
    hotelId: string;
    permissions: Array<{
        id: string;
        subject: string;
        action: string;
    }>;
}

interface CreateTeamMemberRequest {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId: string;
}

const NewTeamMember = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [formData, setFormData] = useState<CreateTeamMemberRequest>({
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        roleId: ''
    });
    const [teamMemberCreatedDialog, setTeamMemberCreatedDialog] = useState(false);

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
        handleGetRoles();
    }, []);

    const handleInputChange = (field: keyof CreateTeamMemberRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.email || !formData.username || !formData.password || 
            !formData.firstName || !formData.lastName || !formData.roleId) {
            toast("Error!", {
                description: "Please fill in all required fields.",
            });
            return;
        }

        setLoading(true);
        try {
            console.log('Creating team member:', formData);
            
            await addTeamMember(formData)
            
            toast("Success!", {
                description: "Team member was created successfully.",
            });
            
            setTeamMemberCreatedDialog(true);
        } catch (error) {
            toast("Error!", {
                description: "Failed to create team member.",
            });
            console.error("Failed to create team member:", error);
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
            <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="p-0"
                    >
                        <ChevronLeft className="" />
                    </Button>
                    <h1 className="text-xl font-bold">New Team Member</h1>
                </div>
                <form onSubmit={handleSubmit} className='px-7 grid grid-cols-2 gap-8'>
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
                            <Label>Password *</Label>
                            <Input
                                type='password'
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className='border border-slate-300'
                                placeholder='••••••••'
                                required
                            />
                        </div>

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
                                            {role.name}
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
                            {loading ? "Creating..." : "Create Team Member"}
                        </Button>
                    </div>
                </form>

                <Dialog open={teamMemberCreatedDialog} onOpenChange={() => setTeamMemberCreatedDialog(false)}>
                    <DialogContent className='w-fit flex flex-col items-center text-center'>
                        <DialogHeader>
                            <DialogTitle className="flex flex-col items-center gap-2">
                                <Check className="bg-green-500 text-white rounded-full p-1 w-6 h-6" />
                                Team member has been created successfully
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            The new team member can now log in with their credentials.
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
                            <Button onClick={() => navigate('/team-members/new')}>
                                Add Another Member
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default NewTeamMember;
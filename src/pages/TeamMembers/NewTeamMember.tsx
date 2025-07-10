import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/molecules/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { ChevronLeft, CloudUpload, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface FormData {
  photo: File | null;
  name: string;
  email: string;
  phoneNumber: string;
  accountEmail: string;
  loginId: string;
  password: string;
  department: string;
  role: string;
  shift: string;
  supervisor: string;
  performanceNotes: string;
}

const NewTeamMember = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    photo: null,
    name: '',
    email: '',
    phoneNumber: '',
    accountEmail: '',
    loginId: '',
    password: '',
    department: '',
    role: '',
    shift: '',
    supervisor: '',
    performanceNotes: ''
  });

  // Data for select options
  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Support',
    'Product Management'
  ];

  const roles = [
    'Software Engineer',
    'Senior Software Engineer',
    'Team Lead',
    'Manager',
    'Director',
    'Analyst',
    'Specialist',
    'Coordinator',
    'Associate',
    'Intern'
  ];

  const shifts = [
    'Day Shift (9 AM - 5 PM)',
    'Evening Shift (2 PM - 10 PM)',
    'Night Shift (10 PM - 6 AM)',
    'Flexible Hours',
    'Remote',
    'Part-time Morning',
    'Part-time Afternoon'
  ];

  const supervisors = [
    'John Smith',
    'Sarah Johnson',
    'Michael Brown',
    'Emily Davis',
    'David Wilson',
    'Lisa Anderson',
    'Robert Garcia',
    'Jennifer Martinez'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
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
      <form onSubmit={handleSubmit} className='px-7 grid grid-cols-2'>
        <div className=''>
          <div className='space-y-5'>
            <h2 className='text-lg font-bold'>Personal Info</h2>
            <div className='space-y-1'>
              <Label className=''>Photo</Label>
              <div className="border border-slate-300 rounded-lg w-1/3 p-5 text-center">
                <div className='flex justify-center'>
                  <CloudUpload className="" />
                </div>
                <p className="text-muted-foreground text-sm">Drag & drop or click to choose file</p>
                <Label htmlFor="photo-upload" className="cursor-pointer justify-center">
                  <Button type="button" variant="foreground" className='px-3'>
                    <Plus />
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>
            </div>

            <div className='space-y-1'>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className='border border-slate-300'
              />
            </div>

            <div className='space-y-1'>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className='border border-slate-300'
              />
            </div>

            <div className='space-y-1'>
              <Label>Phone Number</Label>
              <Input
                type='number'
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className='border border-slate-300'
              />
            </div>
          </div>

          <div className='space-y-5'>
            <h2 className='text-lg font-bold'>Account Info</h2>

            <div className='space-y-1'>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.accountEmail}
                onChange={(e) => handleInputChange('accountEmail', e.target.value)}
                className='border border-slate-300'
              />
            </div>

            <div className='space-y-1'>
              <Label>Login ID</Label>
              <Input
                value={formData.loginId}
                onChange={(e) => handleInputChange('loginId', e.target.value)}
                className='border border-slate-300'
              />
            </div>

            <div className='space-y-1'>
              <Label>Password</Label>
              <Input
                type='password'
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className='border border-slate-300'
              />
            </div>
          </div>
        </div>

        <div className='px-5 space-y-3'>
          <h2 className='text-lg font-bold'>Job Details</h2>
          <div className='space-y-5'>
            <div className='space-y-1'>
              <Label>Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger className='w-full border border-slate-300'>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-1'>
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className='w-full border border-slate-300'>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-1'>
              <Label>Shift</Label>
              <Select value={formData.shift} onValueChange={(value) => handleInputChange('shift', value)}>
                <SelectTrigger className='w-full border border-slate-300'>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift} value={shift}>
                      {shift}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-1'>
              <Label>Supervisor</Label>
              <Select value={formData.supervisor} onValueChange={(value) => handleInputChange('supervisor', value)}>
                <SelectTrigger className='w-full border border-slate-300'>
                  <SelectValue placeholder="Select supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {supervisors.map((supervisor) => (
                    <SelectItem key={supervisor} value={supervisor}>
                      {supervisor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-1'>
              <Label>Performance Notes</Label>
              <Textarea
                className='h-full border border-slate-300'
                value={formData.performanceNotes}
                onChange={(e) => handleInputChange('performanceNotes', e.target.value)}
              />
            </div>
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
            className='px-8'
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTeamMember;
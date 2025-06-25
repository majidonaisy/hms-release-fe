import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { teamMembersData, teamProfilesData } from '@/data/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/Organisms/Card';
import { Label } from '@/components/atoms/Label';

interface TeamMember {
    id: number;
    name: string;
    username: string;
    status: string;
    type: string;
    floor: string;
    occupancy: string;
    logs: string;
    email: string;
    imageUrl: string;
}

interface TeamProfile {
    accountId: number;
    phoneNumber: string;
    loginId: string;
    password: string;
    department: string;
    assignedRole: string;
    permissions: string | null;
    shift: string;
    supervisor: string;
    dateJoined: string;
    performanceNotes: string[];
    activityLogs: Array<{
        date: string;
        time: string;
        description: string;
    }>;
}

interface GroupedActivityLog {
    date: string;
    logs: Array<{
        date: string;
        time: string;
        description: string;
    }>;
}

const TeamMemberProfile = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
    const [teamProfile, setTeamProfile] = useState<TeamProfile | null>(null);

    useEffect(() => {
        // Get team member from navigation state or find by ID
        const memberFromState = location.state?.teamMember;
        const editMode = location.state?.mode === 'edit';

        if (memberFromState) {
            setTeamMember(memberFromState);
            setIsEditing(editMode);
        } else if (id) {
            const foundMember = teamMembersData.find(member => member.id === parseInt(id));
            if (foundMember) {
                setTeamMember(foundMember);
            }
        }

        // Find corresponding profile data
        if (id) {
            const foundProfile = teamProfilesData.find(profile => profile.accountId === parseInt(id));
            if (foundProfile) {
                setTeamProfile(foundProfile);
            }
        }
    }, [id, location.state]);

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'Inactive':
                return 'bg-red-100 text-red-700 hover:bg-red-100';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
            default:
                return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    };

    const formatTime = (timeString: string): string => {
        const [time, period] = timeString.split(' ');
        return `${time} ${period}`;
    };

    const isToday = (dateString: string): boolean => {
        const today = new Date();
        const logDate = new Date(dateString);
        return today.toDateString() === logDate.toDateString();
    };

    const isYesterday = (dateString: string): boolean => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const logDate = new Date(dateString);
        return yesterday.toDateString() === logDate.toDateString();
    };

    const formatDateLabel = (dateString: string): string => {
        const logDate = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return logDate.toLocaleDateString('en-GB', options);
    };

    const groupLogsByDate = (logs: TeamProfile['activityLogs']): GroupedActivityLog[] => {
        const grouped: Record<string, TeamProfile['activityLogs']> = {};

        logs.forEach(log => {
            const date = log.date;
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(log);
        });

        // Sort dates in descending order (most recent first)
        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        return sortedDates.map(date => ({
            date,
            logs: grouped[date].sort((a, b) => {
                // Sort logs within each day by time (most recent first)
                const timeA = new Date(`${date} ${a.time}`);
                const timeB = new Date(`${date} ${b.time}`);
                return timeB.getTime() - timeA.getTime();
            })
        }));
    };

    if (!teamMember || !teamProfile) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="p-1"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-semibold text-gray-900">Team Member Not Found</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="p-1"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">Staff Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-center">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={teamMember.imageUrl} alt={teamMember.name} />
                                <AvatarFallback className="text-2xl">
                                    {teamMember.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="text-center">
                            <Badge className={`${getStatusColor(teamMember.status)} border-0 mb-2`}>
                                • {teamMember.status}
                            </Badge>
                            <p className="text-sm text-gray-500">Created by {teamMember.username}</p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant='foreground'
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Save Profile' : 'Edit Profile'}
                            </Button>
                            <Button variant="primaryOutline">
                                Delete Account
                            </Button>
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
                                <Label className="font-semibold">Full Name</Label>
                                <p className="">{teamMember.name}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Email</Label>
                                <p className="">{teamMember.email}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Phone Number</Label>
                                <p className="">{teamProfile.phoneNumber}</p>
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
                                <Label className="font-semibold">Email</Label>
                                <p className="">{teamMember.email}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Login ID</Label>
                                <p className="">{teamProfile.loginId}</p>
                            </div>
                            <div className='flex justify-between items-center'>
                                <Label className="font-semibold">Password</Label>
                                <p className="">••••••••••••</p>
                            </div>
                        </CardContent>
                        <CardFooter className='p-0 flex justify-end'>
                            <Button size="sm" className='h-6 rounded-full'>
                                Reset Password
                            </Button>
                        </CardFooter>
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
                            <Label className="font-semibold">Department</Label>
                            <p className="">{teamProfile.department}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <Label className="font-semibold">Assigned Role</Label>
                            <p className="">{teamProfile.assignedRole}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <Label className="font-semibold">Permissions</Label>
                            <p className="">{teamProfile.permissions ? teamProfile.performanceNotes : '-'}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <Label className="font-semibold">Shift</Label>
                            <p className="">{teamProfile.shift}</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <Label className="font-semibold">Date Joined</Label>
                            <p className="">{formatDate(teamProfile.dateJoined)}</p>
                        </div>
                        {teamProfile.performanceNotes.length > 0 && (
                            <div className="mt-6">
                                <label className="font-semibold">Performance Notes</label>
                                <div className="space-y-1">
                                    {teamProfile.performanceNotes.map((note, index) => (
                                        <div key={index} className="p-3 pb-0 rounded text-sm">
                                            • {note}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="p-3">
                    <CardHeader className='p-0'>
                        <CardTitle className='font-bold text-lg p-0 pb-1 border-b'>Activity Logs</CardTitle>
                        <div className="flex items-center gap-2">
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

                    {teamProfile.activityLogs.length > 0 ? (
                        <CardContent className="p-0">
                            <div className="space-y-4">
                                {groupLogsByDate(teamProfile.activityLogs)
                                    .filter((group: GroupedActivityLog) => {
                                        if (!searchText) return true;
                                        return group.logs.some((log: TeamProfile['activityLogs'][0]) =>
                                            log.description.toLowerCase().includes(searchText.toLowerCase())
                                        );
                                    })
                                    .map((group: GroupedActivityLog, groupIndex: number) => (
                                        <div key={groupIndex}>
                                            <div className='bg-hms-primary/15 text-xs font-medium px-3 py-1 rounded-full mb-3 inline-block'>
                                                {isToday(group.date)
                                                    ? 'Today'
                                                    : isYesterday(group.date)
                                                        ? 'Yesterday'
                                                        : formatDateLabel(group.date)
                                                }
                                            </div>

                                            <div className="space-y-3">
                                                {group.logs
                                                    .filter((log: TeamProfile['activityLogs'][0]) =>
                                                        !searchText ||
                                                        log.description.toLowerCase().includes(searchText.toLowerCase())
                                                    )
                                                    .map((log: TeamProfile['activityLogs'][0], logIndex: number) => (
                                                        <div key={logIndex} className="flex items-start gap-3">
                                                            <div className="flex flex-col items-center">
                                                                <div className='w-2 h-2 rounded-full bg-hms-primary'></div>
                                                                <div className="w-px h-6 bg-hms-primary"></div>
                                                                <div className=" ml-6 w-6 h-px bg-hms-primary"></div>
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start bg-hms-accent/15 rounded-lg py-2 px-3">
                                                                    <p className="text-sm text-gray-900 flex-1 pr-4">
                                                                        {log.description}
                                                                    </p>
                                                                    <span className="text-xs text-gray-500 ">
                                                                        {formatTime(log.time)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}

                                {/* Load more button */}
                                <div className="text-center pt-4 border-t border-gray-200">
                                    <Button variant="outline" size="sm" className="text-xs px-4 py-2">
                                        Load more
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    ) : (
                        <CardContent className="p-0">
                            <div className="text-center text-gray-500 py-8">
                                <div className="w-12 h-12 bg-hms-primary/15 rounded-full flex items-center justify-center">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <p className="text-sm">No activity logs available</p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div >
    );
};

export default TeamMemberProfile;
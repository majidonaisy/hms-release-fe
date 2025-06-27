import { useMemo, useState } from 'react';
import { Search, Filter, Plus, ChevronDown, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Badge } from '@/components/atoms/Badge';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';
import { teamMembersData } from '@/data/data';
import posthog from 'posthog-js';

export interface TeamMember {
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

const TeamMembers = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>('');
    const [showFilter, setShowFilter] = useState<boolean>(false);

    const filteredTeamMembers = useMemo(() => {
        if (!searchText.trim()) {
            return teamMembersData;
        }

        const searchTerm = searchText.toLowerCase().trim();

        return teamMembersData.filter((member) => {
            return (
                member.name.toLowerCase().includes(searchTerm) ||
                member.username.toLowerCase().includes(searchTerm) ||
                member.email.toLowerCase().includes(searchTerm)
            );
        });
    }, [searchText]);

    const clearSearch = (): void => {
        setSearchText('');
    };

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

    const handleRowClick = (teamMember: TeamMember): void => {
        posthog.capture('team_member_profile_viewed', {
            member_id: teamMember.id,
            member_name: teamMember.name,
            member_type: teamMember.type
        });
        navigate(`/team-members/profile/${teamMember.id}`, {
            state: { teamMember }
        });
    };

    const handleEditClick = (e: React.MouseEvent, teamMember: TeamMember): void => {
        e.stopPropagation();
        navigate(`/team-members/profile/${teamMember.id}`, {
            state: { teamMember, mode: 'edit' }
        });
    };

    const handleDeleteClick = (e: React.MouseEvent, teamMemberId: number): void => {
        e.stopPropagation();
        // Handle delete logic here
        console.log('Delete team member:', teamMemberId);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
                    <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {filteredTeamMembers.length} {filteredTeamMembers.length === 1 ? 'member' : 'members'}
                        {searchText && ` (filtered from ${teamMembersData.length})`}
                    </span>
                </div>

                    <div className="flex items-center gap-4">
                    <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3">
                        <Input
                            type="text"
                            placeholder="Search text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-85 h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
                        />
                        {searchText && (
                            <button
                                onClick={clearSearch}
                                className="text-gray-400 hover:text-gray-600 ml-2 text-sm font-medium"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                        <Search className="h-4 w-4 text-gray-400 ml-2" />
                    </div>

                    {/* Filter Button */}
                    <Button
                        variant="outline"
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 px-3 py-2 border-2 border-gray-300 hover:border-gray-400"
                    >
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-auto">
                        <Button onClick={() => navigate('/team-members/new')}>
                            <Plus className="h-4 w-4" />
                            New Team Member
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader className='bg-hms-accent/15'>
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">
                                <div className="flex items-center gap-1">
                                    Name
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Status</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Type</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Floor</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Occupancy</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Logs</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTeamMembers.length === 0 && searchText ? (
                            <TableRow>
                                <TableCell colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8 text-gray-300" />
                                        <p>No team members found matching your search.</p>
                                        <p className="text-sm">Try adjusting your search terms or <button onClick={clearSearch} className="text-blue-600 hover:text-blue-800 underline">clear the search</button>.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTeamMembers.map((teamMember) => (
                                <TableRow
                                    key={teamMember.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(teamMember)}
                                >
                                    <TableCell className="px-6 py-4 font-medium text-gray-900 flex gap-1">
                                        <Avatar>
                                            <AvatarImage src={teamMember.imageUrl} alt="pfp" />
                                            <AvatarFallback>{teamMember.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className='grid'>
                                            <p>{teamMember.name}</p>
                                            <p className='text-xs'>{teamMember.username}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <Badge className={`${getStatusColor(teamMember.status)} border-0`}>
                                            • {teamMember.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-600">
                                        {teamMember.type}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-600">
                                        {teamMember.floor}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-600">
                                        {teamMember.occupancy}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-600">
                                        {teamMember.logs}
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        className='bg-inherit shadow-none p-0 text-hms-accent font-bold text-xl border hover:border-hms-accent hover:bg-hms-accent/15'
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <EllipsisVertical className="" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className='shadow-lg border-hms-accent'>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={(e) => handleDeleteClick(e, teamMember.id)}
                                                    >
                                                        <div className="w-full flex items-center gap-2">
                                                            Delete
                                                        </div>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={(e) => handleEditClick(e, teamMember)}
                                                    >
                                                        <div className="w-full flex items-center gap-2">
                                                            Edit
                                                        </div>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <Button variant="outline" className="flex items-center gap-2">
                        ← Previous
                    </Button>

                    <div className="flex items-center gap-2">
                        {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
                            <Button
                                key={index}
                                variant={page === 1 ? "foreground" : "primaryOutline"}
                                size="sm"
                                className={`h-8 w-8 `}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <Button variant="outline" className="flex items-center gap-2">
                        Next →
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default TeamMembers;
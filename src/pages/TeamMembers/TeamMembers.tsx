import { useState } from 'react';
import { Search, Filter, Plus, ChevronDown, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Badge } from '@/components/atoms/Badge';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';

const TeamMembers = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    const teamMembersData = [
        {
            id: 1,
            name: "Olivia RHye",
            username: "@olivia",
            status: "Active",
            type: "Front Desk",
            floor: "Receptionist",
            occupancy: "Product Designer",
            logs: "olivia@untitledui.com",
            email: "olivia@untitledui.com",
            imageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 2,
            name: "Phoenix Baker",
            username: "@phoenix",
            status: "Inactive",
            type: "Housekeeping",
            floor: "Supervisor",
            occupancy: "Product Manager",
            logs: "phoenix@untitledui.com",
            email: "phoenix@untitledui.com",
            imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 3,
            name: "Lana Steiner",
            username: "@lana",
            status: "Active",
            type: "IT",
            floor: "Frontend Developer",
            occupancy: "Frontend Developer",
            logs: "lana@untitledui.com",
            email: "lana@untitledui.com",
            imageUrl: "https://randomuser.me/api/portraits/women/68.jpg"
        },
        {
            id: 4,
            name: "Demi Wilkinson",
            username: "@demi",
            status: "Active",
            type: "Management",
            floor: "Backend Developer",
            occupancy: "Backend Developer",
            logs: "demi@untitledui.com",
            email: "demi@untitledui.com",
            imageUrl: "https://randomuser.me/api/portraits/women/47.jpg"
        },
        {
            id: 5,
            name: "Candice Wu",
            username: "@candice",
            status: "Pending",
            type: "Security",
            floor: "Fullstack Developer",
            occupancy: "Fullstack Developer",
            logs: "candice@untitledui.com",
            email: "candice@untitledui.com",
            imageUrl: "https://randomuser.me/api/portraits/women/65.jpg"
        },
        {
            id: 6,
            name: "Natali Craig",
            username: "@natali",
            status: "Active",
            type: "UX Designer",
            floor: "UX Designer",
            occupancy: "UX Designer",
            logs: "natali@untitledui.com",
            email: "natali@untitledui.com",
            imageUrl: "https://randomuser.me/api/portraits/women/56.jpg"
        },
        {
            id: 7,
            name: "Drew Cano",
            username: "@drew",
            status: "Inactive",
            type: "UX Copywriter",
            floor: "UX Copywriter",
            occupancy: "UX Copywriter",
            logs: "drew@untitledui.com",
            email: "drew@untitledui.com",
            imageUrl: "https://randomuser.me/api/portraits/men/45.jpg"
        },
        {
            id: 8,
            name: "Orlando Diggs",
            username: "@orlando",
            status: "Pending",
            type: "UI Designer",
            floor: "UI Designer",
            occupancy: "UI Designer",
            logs: "orlando@untitledui.com",
            email: "orlando@untitledui.com",
            imageUrl: "https://randomuser.me/api/portraits/men/48.jpg"
        },
        {
            id: 9,
            name: "Andi Lane",
            username: "@andi",
            status: "Active",
            type: "Product Manager",
            floor: "Product Manager",
            occupancy: "Product Manager",
            logs: "andi@untitledui.com",
            email: "andi@untitledui.com",
            imageUrl: "https://randomuser.me/api/portraits/women/62.jpg"
        },
        {
            id: 10,
            name: "Kate Morrison",
            username: "@kate",
            status: "Pending",
            type: "QA Engineer",
            floor: "QA Engineer",
            occupancy: "QA Engineer",
            logs: "kate@untitledui.com",
            email: "kate@untitledui.com",
            imageUrl: "https://randomuser.me/api/portraits/women/38.jpg"
        }
    ];

    const getStatusColor = (status: string) => {
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
                    <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        100 members
                    </span>
                </div>

                {/* Search Bar and Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3">
                        <Input
                            type="text"
                            placeholder="Search text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-85 h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
                        />
                        <Search className="h-4 w-4 text-gray-400 " />
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
                        {teamMembersData.map((teamMember) => (
                            <TableRow key={teamMember.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <TableCell className="px-6 py-4 font-medium text-gray-900 flex gap-1">
                                    <Avatar>
                                        <AvatarImage src={teamMember.imageUrl} alt="pfp" />
                                        <AvatarFallback>{teamMember.name.charAt(1).toUpperCase()}</AvatarFallback>
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
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Edit className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
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
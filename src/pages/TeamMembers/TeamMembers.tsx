import { useEffect, useState } from 'react';
import { Search, Filter, Plus, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';
import posthog from 'posthog-js';
import { GetEmployeesResponse } from '@/validation/schemas/Employees';
import { getEmployees } from '@/services/Employees';
import Pagination from '@/components/atoms/Pagination';
import { Badge } from '@/components/atoms/Badge';
import TableSkeleton from '@/components/Templates/TableSkeleton';

const TeamMembers = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>('');
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [employees, setEmployees] = useState<GetEmployeesResponse['data']>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const totalPages = Math.ceil(100 / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredTeamMembers = employees.filter(employee =>
        employee.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const clearSearch = (): void => {
        setSearchText('');
    };

    const getStatusColor = (status: boolean): string => {
        switch (status) {
            case true:
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            case false:
                return 'bg-red-100 text-red-700 hover:bg-red-100';
        }
    };

    useEffect(() => {
        const handleGetEmployees = async () => {
            setLoading(true);
            try {
                const response = await getEmployees();
                setEmployees(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        handleGetEmployees();
    }, []);

    const handleRowClick = (teamMember: GetEmployeesResponse['data'][number]): void => {
        posthog.capture('team_member_profile_viewed', {
            member_id: teamMember.id,
            member_name: teamMember.firstName,
        });
        navigate(`/team-members/profile/${teamMember.id}`, {
            state: { teamMember }
        });
    };

    return (
        <>
            {loading ? (
                <TableSkeleton title="Team Members" />
            ) : (
                <div className="p-6 bg-gray-50 min-h-screen">
                    <div className="mb-6">
                        {/* Current members Title with Count */}
                        <div className="flex items-center gap-2 mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
                            <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {employees.length} profiles
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
                                {searchText && (
                                    <button
                                        onClick={clearSearch}
                                        className="text-gray-400 hover:text-gray-600 mr-2 text-sm font-medium"
                                        aria-label="Clear search"
                                    >
                                        ✕
                                    </button>
                                )}
                                <Search className="h-4 w-4 text-gray-400" />
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
                            <div className="flex gap-2 ml-auto">

                                <Button >
                                    <Plus className="h-4 w-4" />
                                    New Team Member
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg ">
                        <Table>
                            <TableHeader className='bg-hms-accent/15'>
                                <TableRow className="border-b border-gray-200">
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Name</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Email</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Status</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Role</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTeamMembers && filteredTeamMembers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-10 text-center text-gray-600">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) :
                                    filteredTeamMembers.map((member) => (
                                        <TableRow key={member.id} onClick={() => handleRowClick(member)} className="border-b-2 col-span-7 hover:bg-accent cursor-pointer">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage />
                                                        <AvatarFallback>{member.firstName.charAt(0).toUpperCase()}{member.lastName.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-6 py-4 font-medium text-gray-900">{member.email}</TableCell>
                                            <TableCell className={`px-6 py-4 text-gray-600`}>
                                                <Badge className={` ${getStatusColor(member.isActive)}`}>• {member.isActive ? 'Active' : 'Inactive'}</Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-gray-600">{member.role.name}</TableCell>
                                            {/* <TableCell className="px-6 py-4 text-gray-600">{member.phoneNumber}</TableCell> */}
                                            <TableCell className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu modal={false}>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="bg-inherit shadow-none p-0 text-hms-accent font-bold text-xl border hover:border-hms-accent hover:bg-hms-accent/15"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <EllipsisVertical />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="shadow-lg border-hms-accent">
                                                        <DropdownMenuItem >Edit</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        showPreviousNext={true}
                        maxVisiblePages={7}
                    />
                </div >
            )}
        </>
    );
};

export default TeamMembers;
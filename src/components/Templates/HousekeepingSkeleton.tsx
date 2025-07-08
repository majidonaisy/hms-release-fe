import { Skeleton } from '@/components/atoms/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { CheckCircle2, Search, Plus } from 'lucide-react';

const HousekeepingSkeleton = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-hms-primary" />
                    <h1 className="text-2xl font-semibold text-gray-900">Housekeeping</h1>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3 min-w-80">
                        <Skeleton className="h-7 flex-1" />
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-40" />
                    <div className="flex gap-2 ml-auto">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Room</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Room Type</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Floor</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Status</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Priority</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Notes</TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">Assigned To</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 7 }).map((_, index) => (
                            <TableRow key={index} className="border-b border-gray-100">
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-4 w-16" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-4 w-8" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-2 w-2 rounded-full" />
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-6 w-14 rounded-full" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-8 w-8 rounded" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-center gap-2 py-4">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    );
};

export default HousekeepingSkeleton;

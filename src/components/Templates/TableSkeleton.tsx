import { Skeleton } from '@/components/atoms/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';

const TableSkeleton: React.FC<{title: string}> = ({
    title
}) => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section Skeleton */}
            <div className="mb-6">
                {/* Title and Count Skeleton */}
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    <Skeleton className="h-8 w-24" />
                </div>

                {/* Search and Filter Section Skeleton */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full">
                        <Skeleton className="h-7 w-85" />
                    </div>
                    <Skeleton className="h-10 w-20" />

                    {/* Action Buttons Skeleton */}
                    <div className="flex gap-2 ml-auto">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-28" />
                    </div>
                </div>
            </div>

            {/* Table Section Skeleton */}
            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-gray-200">
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">
                                <Skeleton className="h-4 w-12" />
                            </TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">
                                <Skeleton className="h-4 w-10" />
                            </TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">
                                <Skeleton className="h-4 w-12" />
                            </TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">
                                <Skeleton className="h-4 w-20" />
                            </TableHead>
                            <TableHead className="text-left font-medium text-gray-900 px-6 py-4">
                                <Skeleton className="h-4 w-24" />
                            </TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Skeleton Rows */}
                        {Array.from({ length: 10 }).map((_, index) => (
                            <TableRow key={index} className="border-b border-gray-100">
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-4 w-16" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-4 w-20 rounded-full" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-4 w-8" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-4 w-32" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-4 w-12" />
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Skeleton className="h-8 w-8 rounded" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-between px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableSkeleton;

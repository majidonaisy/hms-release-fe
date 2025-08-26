import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Organisms/Table";
import { getPayouts } from "@/services/Payout";
import { useEffect, useState } from "react";
import Pagination from "@/components/atoms/Pagination";
import { toast } from "sonner";

const Payouts = () => {
    const [payouts, setPayouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 5);

    const formatDate = (d: Date) => {
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const year = d.getFullYear();
        return `${month}-${day}-${year}`;
    };

    const formatDateTime = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            console.log('Fetching payouts for page:', currentPage);

            const response = await getPayouts({
                from: formatDate(fromDate),
                to: formatDate(today),
                page: currentPage,
                limit: pageSize,
            });

            console.log('API Response:', response);

            setPayouts(response.data);
            setPagination(response.pagination);

        } catch (error: any) {
            console.error('Error fetching payouts:', error);
            toast.error(error.userMessage || "Failed to fetch payouts");
            setPayouts([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, [currentPage]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-semibold mb-4">Payouts</h1>

            <div className="bg-white rounded-lg">
                <Table>
                    <TableHeader className="bg-hms-accent/15">
                        <TableRow>
                            <TableHead className="px-6 py-2 text-left">Amount</TableHead>
                            <TableHead className="px-6 py-2 text-left">Currency</TableHead>
                            <TableHead className="px-6 py-2 text-left">Status</TableHead>
                            <TableHead className="px-6 py-2 text-left">Created At</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="py-10 text-center text-gray-600">
                                    Loading payouts...
                                </TableCell>
                            </TableRow>
                        ) : payouts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="py-10 text-center text-gray-600">
                                    No payouts found
                                </TableCell>
                            </TableRow>
                        ) : (
                            payouts.map((p) => (
                                <TableRow key={p.id} className="border-b hover:bg-accent cursor-pointer">
                                    <TableCell className="px-6 py-4 font-medium">{p.amount}</TableCell>
                                    <TableCell className="px-6 py-4">{p.currencyId}</TableCell>
                                    <TableCell className="px-6 py-4">{p.status}</TableCell>
                                    <TableCell className="px-6 py-4">{formatDateTime(p.createdAt)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                        showPreviousNext
                        maxVisiblePages={5}
                    />
                </div>
            )}
        </div>
    );
};

export default Payouts;
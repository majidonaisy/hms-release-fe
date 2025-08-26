import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Organisms/Table";
import { getPayouts } from "@/services/Payout";
import { useEffect, useState } from "react";
import Pagination from "@/components/atoms/Pagination";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/molecules/Popover";
import { Calendar } from "@/components/molecules/Calendar";
import { Button } from "@/components/atoms/Button";
import { format } from "date-fns";
import { PaymentsResponse } from "@/validation/schemas/Payouts";

type PaymentItem = PaymentsResponse["data"][number];

const Payouts = () => {
    const [payouts, setPayouts] = useState<PaymentItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Filters used in API
    const [filterFromDate, setFilterFromDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 3)));
    const [filterToDate, setFilterToDate] = useState<Date>(new Date());

    // Temporary selections in calendar
    const [tempFromDate, setTempFromDate] = useState<Date>(filterFromDate);
    const [tempToDate, setTempToDate] = useState<Date>(filterToDate);

    const formatDate = (d: Date) => format(d, "yyyy-MM-dd");

    const formatDateTime = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            const toDateWithEndTime = new Date(filterToDate);
            toDateWithEndTime.setHours(23, 59, 59, 999);

            const response = await getPayouts({
                from: formatDate(filterFromDate),
                to: formatDate(toDateWithEndTime),
                page: currentPage,
                limit: pageSize,
            });

            setPayouts(response.data);
            setPagination(response.pagination);
        } catch (error: any) {
            console.error("Error fetching payouts:", error);
            toast.error(error.userMessage || "Failed to fetch payouts");
            setPayouts([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, [currentPage, filterFromDate, filterToDate]);

    const applyFilters = () => {
        setFilterFromDate(tempFromDate);
        setFilterToDate(tempToDate);
        setCurrentPage(1); // reset page
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-semibold mb-4">Payouts</h1>

            {/* Date Filter */}
            <div className="flex gap-4 mb-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">{`From: ${format(tempFromDate, "MMM dd, yyyy")}`}</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <Calendar mode="single" selected={tempFromDate} onSelect={(date) => date && setTempFromDate(date)} />
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">{`To: ${format(tempToDate, "MMM dd, yyyy")}`}</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <Calendar mode="single" selected={tempToDate} onSelect={(date) => date && setTempToDate(date)} />
                    </PopoverContent>
                </Popover>

                <Button onClick={applyFilters}>Apply</Button>
            </div>

            <div className="bg-white rounded-lg">
                <Table>
                    <TableHeader className="bg-hms-accent/15">
                        <TableRow>
                            <TableHead className="px-6 py-2 text-left">Amount</TableHead>
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
                                    <TableCell className="px-6 py-4 font-medium">{p.amount} {p.currencyId}</TableCell>
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

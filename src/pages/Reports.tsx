import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Organisms/Table"
import { getReports, Report as ReportType } from "@/services/Reports";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Organisms/Dialog";
import { Button } from "@/components/atoms/Button";
import { DialogDescription } from "@radix-ui/react-dialog";

const Reports = () => {
    const [reports, setReports] = useState<ReportType[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewFile, setPreviewFile] = useState<string | null>(null);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await getReports();
            setReports(response);
        } catch (error: any) {
            console.error("Failed to get reports");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handlePreviewFile = (url: string) => {
        if (!url) {
            toast.error("File URL not found");
            return;
        }
        setPreviewFile(url);
    };

    const formatDate = (dateString: undefined | Date) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
                    </div>

                    <div className="bg-white rounded-lg">
                        <Table>
                            <TableHeader className="bg-hms-accent/15">
                                <TableRow className="border-b-2 hover:bg-inherit">
                                    <TableHead colSpan={2} className="text-center font-medium text-gray-900 py-2">
                                        Created At
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center font-medium text-gray-900 py-2">
                                        Link
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    <TableRow className="">
                                        <TableCell
                                            colSpan={3}
                                            className="py-10 text-center text-gray-600"
                                        >
                                            Loading reports...
                                        </TableCell>
                                    </TableRow>
                                ) :
                                    reports?.map((report) => (
                                        <TableRow
                                            key={`report-${report.id}`}
                                            className="border-b-2 hover:bg-inherit"
                                        >
                                            <TableCell colSpan={2} className="py-4 text-center font-medium text-gray-900">
                                                {formatDate(report.date)}
                                            </TableCell>
                                            <TableCell colSpan={2} className="py-4 text-center text-gray-600">
                                                <Button
                                                    variant="link"
                                                    onClick={() => handlePreviewFile(report.link)}
                                                    className="underline hover:text-gray-500 cursor-pointer transition-all duration-200 p-0"
                                                >
                                                    Open Report
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {previewFile && (
                <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
                    <DialogContent className="max-w-[90vw] w-[90vw] sm:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Report Preview</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <iframe
                            src={previewFile}
                            className="w-full h-[80vh] border"
                            title="PDF Preview"
                        />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default Reports;
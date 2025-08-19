import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Organisms/Table"

const Reports = () => {

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header Section */}
                <div className="mb-6">
                    {/* Title with Count and Back Button */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-3">

                            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
                         </div>
                    </div>
                    <div className="bg-white rounded-lg">
                        <Table>
                            <TableHeader className="bg-hms-accent/15">
                                <TableRow className="border-b border-gray-200">
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Created At</TableHead>
                                    <TableHead className="text-left font-medium text-gray-900 px-6 py-2">Link</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="border-b-2 hover:bg-accent">
                                    <TableCell className="px-6 py-4 font-medium text-gray-900">

                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-gray-600">
                                        <div>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Reports
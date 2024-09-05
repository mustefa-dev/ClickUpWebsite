import { Api } from "@/Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CustomDialog from "@/components/Dialog";
import UpdateTicketPage from "@/pages/ticket/update-ticket";
import AddTicketPage from "@/pages/ticket/add-ticket";
import TicketDialog from "@/components/TicketDialog";
import { useParams } from "react-router-dom";
import { Edit, Trash } from "lucide-react";

export default function TicketPage() {
    const { id } = useParams<{ id: string }>();
    const { ref, inView } = useInView();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddTicketDialogOpen, setIsAddTicketDialogOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(id || null);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

    const fetchTickets = async (page: number): Promise<any[]> => {
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        const { data } = await Api.get<any[]>("tickets", {
            params: {
                skip: skip,
                limit: limit,
                query: search,
            },
        });
        return data;
    };

    const { data, status, refetch } = useQuery({
        queryKey: ["tickets", search, currentPage],
        queryFn: () => fetchTickets(currentPage),
        keepPreviousData: true,
    });

    useEffect(() => {
        if (inView) {
            refetch();
        }
    }, [inView, refetch]);

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleEdit = (ticketId: string) => {
        setSelectedTicketId(ticketId);
        setIsDialogOpen(true);
    };

    const handleDelete = async (ticketId: string) => {
        try {
            await Api.delete(`tickets/${ticketId}`);
            refetch();
        } catch (err) {
            console.error("Error deleting ticket:", err);
        }
    };

    const handleAddTicket = () => {
        setIsAddTicketDialogOpen(true);
    };

    const handleRowClick = (ticket: any) => {
        setSelectedTicket(ticket);
    };

    return (
        <div className="p-5 bg-secondary">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
                <Input
                    placeholder="بحث..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-[30%] p-2 border border-gray-300 rounded-md"
                />
                <div className="flex space-x-2 mt-2 md:mt-0">
                    <Button variant="outline" className="border-green-500" onClick={handleAddTicket}>
                        إضافة تذكرة
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-secondary shadow-md rounded-lg">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-300 dark:from-secondary dark:to-gray-800 border-b-4 border-gray-300 shadow-md">
                    <tr>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300">
                            عنوان التذكرة
                        </th>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300">
                            الحالة
                        </th>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300">
                            آخر تحديث
                        </th>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300">
                            الإجراءات
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {status === "loading" && (
                        <tr>
                            <td colSpan={4} className="text-center py-4">
                                جاري التحميل...
                            </td>
                        </tr>
                    )}
                    {data && data.length > 0 ? (
                        data.map((ticket) => (
                            <tr key={ticket.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => handleRowClick(ticket)}>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {ticket.ticketTitle}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {ticket.currentStatus}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {new Date(ticket.lastUpdated).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 flex space-x-3">
                                    <Button onClick={() => handleEdit(ticket.id)} variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button onClick={() => handleDelete(ticket.id)} variant="outline" size="sm">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center py-4">
                                لا توجد بيانات.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between mt-4">
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    السابق
                </Button>
                <Button onClick={handleNextPage} disabled={data && data.length < 10}>
                    التالي
                </Button>
            </div>
            <div className="flex justify-center" ref={ref}>
                {status === "loading" ? "جاري التحميل..." : ""}
            </div>

            {selectedTicketId !== null && (
                <CustomDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="تحديث التذكرة">
                    <UpdateTicketPage ticketId={selectedTicketId} />
                </CustomDialog>
            )}

            {isAddTicketDialogOpen && (
                <CustomDialog
                    isOpen={isAddTicketDialogOpen}
                    onClose={() => setIsAddTicketDialogOpen(false)}
                    title="إضافة تذكرة"
                >
                    <AddTicketPage isOpen={isAddTicketDialogOpen} onClose={() => setIsAddTicketDialogOpen(false)} />
                </CustomDialog>
            )}

            {selectedTicket && (
                <TicketDialog
                    isOpen={!!selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    ticket={selectedTicket}
                />
            )}
        </div>
    );
}
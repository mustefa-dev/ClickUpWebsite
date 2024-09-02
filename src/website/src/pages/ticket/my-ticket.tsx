import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Api } from "@/Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomDialog from "@/components/Dialog";
import UpdateTicketPage from "@/pages/ticket/update-ticket";
import AddTicketPage from "@/pages/ticket/add-ticket";
import { AuthStore } from "@/utils/authStore";
import TicketDialog from "@/components/TicketDialog";

export default function MyTicketPage() {
    const { id } = useParams<{ id: string }>();
    const { ref, inView } = useInView();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddTicketDialogOpen, setIsAddTicketDialogOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(id || null);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

    const fetchMyTickets = async (page: number): Promise<any[]> => {
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        const { data } = await Api.get<any[]>("tickets/my", {
            params: {
                skip: skip,
                limit: limit,
                query: search,
            },
        });
        return data;
    };

    const { data, status, refetch } = useQuery({
        queryKey: ["myTickets", search, currentPage],
        queryFn: () => fetchMyTickets(currentPage),
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

    const handleEdit = async (ticket: any) => {
        const newStatus = ticket.currentStatus === "Solved" ? "InProgress" : "Solved";
        try {
            const token = AuthStore.getAccessToken();
            if (!token) {
                throw new Error("No access token found");
            }

            const response = await Api.patch(`tickets/status/${ticket.id}`, {
                newStatus
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                refetch();
            } else {
                console.error("Failed to update ticket status");
            }
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
    };

    const handleDelete = async (ticketId: string) => {
        if (window.confirm("هل أنت متأكد أنك تريد حذف هذه التذكرة؟")) {
            await Api.delete(`tickets/${ticketId}`);
            refetch();
        }
    };

    const handleAddTicket = () => {
        setIsAddTicketDialogOpen(true);
    };

    const handleRowClick = (ticket: any) => {
        setSelectedTicket(ticket);
        setIsDialogOpen(true);
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
                            <tr key={ticket.ticketNumber} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => handleRowClick(ticket)}>
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
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(ticket);
                                        }}
                                        variant="outline"
                                        size="sm"
                                        className={ticket.currentStatus === "Solved" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                                    >
                                        {ticket.currentStatus === "Solved" ? (
                                            <FaCheckCircle className="h-4 w-4"/>
                                        ) : (
                                            <FaTimesCircle className="h-4 w-4"/>
                                        )}
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
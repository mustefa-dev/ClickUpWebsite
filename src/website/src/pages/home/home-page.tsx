import { Api } from "@/Api";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { Company, SubscriptionStatusTranslate } from "@/types/company";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { FaSort, FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

const HomePage = () => {
    const { ref, inView } = useInView();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
    const navigate = useNavigate();

    const fetchCompanies = async ({ pageParam }): Promise<Company[]> => {
        const pageSize = 10;
        const skip = (pageParam - 1) * pageSize;
        const { data } = await Api.get<Company[]>("companies", { params: { skip, limit: pageSize } });
        return data;
    };

    const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["companies"],
        queryFn: fetchCompanies,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => lastPage.length ? allPages.length + 1 : undefined,
    });

    const handleSort = (key: string) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
    };

    const sortedData = () => {
        if (!data) return [];
        const sorted = [...data.pages.flat()];
        if (sortConfig.key) {
            sorted.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                return aValue < bValue ? (sortConfig.direction === "asc" ? -1 : 1) : aValue > bValue ? (sortConfig.direction === "asc" ? 1 : -1) : 0;
            });
        }
        return sorted;
    };

    const filteredData = sortedData().filter(company => company.name.toLowerCase().includes(searchQuery.toLowerCase()));

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    //const handleEdit  make it open UpdateCompanyPage
    const handleEdit = (companyId: string) => {
        navigate(`/companies/${companyId}/update`);
    };


    const handleDelete = async (companyId: string) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            await Api.delete(`companies/${companyId}`);
            fetchNextPage();
        }
    };

    return (
        <div className="p-5 h-screen bg-secondary">
            <div className="mb-4 flex justify-between items-center">
                <Input
                    placeholder="بحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-[30%] p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className="overflow-hidden">
                <table className="min-w-full bg-white dark:bg-secondary shadow-md rounded-lg">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-300 dark:from-secondary dark:to-gray-800 border-b-4 border-gray-300 shadow-md">
                    <tr>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort("name")}>
                            <div className="flex items-center">
                                <span className="flex-grow text-start">اسم الشركة</span>
                                <FaSort className="text-sm" />
                            </div>
                        </th>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort("subscriptionInfo.status")}>
                            <div className="flex items-center">
                                <span className="flex-grow text-start">حالة الإشتراك</span>
                                <FaSort className="text-sm" />
                            </div>
                        </th>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort("subscriptionInfo.subscriptionStartDate")}>
                            <div className="flex items-center">
                                <span className="flex-grow text-start">تاريخ البدء</span>
                                <FaSort className="text-sm" />
                            </div>
                        </th>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300 cursor-pointer" onClick={() => handleSort("subscriptionInfo.subscriptionEndDate")}>
                            <div className="flex items-center">
                                <span className="flex-grow text-start">تاريخ الانتهاء</span>
                                <FaSort className="text-sm" />
                            </div>
                        </th>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300">إجراءات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {status === "loading" && (
                        <tr>
                            <td colSpan={5} className="text-center py-4">Loading...</td>
                        </tr>
                    )}
                    {filteredData.length > 0 ? (
                        filteredData.map((company) => (
                            <tr key={company.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{company.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                        <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded", {
                                            "text-green-700 bg-green-100 dark:text-green-200 dark:bg-green-800": company.subscriptionInfo.status === "Active",
                                            "text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-800": company.subscriptionInfo.status === "Disabled",
                                            "text-yellow-700 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-800": company.subscriptionInfo.status === "Expired",
                                            "text-blue-700 bg-blue-100 dark:text-blue-200 dark:bg-blue-800": company.subscriptionInfo.status === "NotActiveYet",
                                        })}>
                                            {SubscriptionStatusTranslate[company.subscriptionInfo.status]}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{format(company.subscriptionInfo.subscriptionStartDate, "yyyy/MM/dd")}</td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{format(company.subscriptionInfo.subscriptionEndDate, "yyyy/MM/dd")}</td>
                                <td className="px-6 py-4 flex space-x-3">
                                    <Button variant="outline" onClick={() => handleEdit(company.id)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" onClick={() => handleDelete(company.id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-4">No data found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center" ref={ref}>
                {isFetchingNextPage ? "Loading..." : ""}
            </div>
        </div>
    );
};

export default HomePage;

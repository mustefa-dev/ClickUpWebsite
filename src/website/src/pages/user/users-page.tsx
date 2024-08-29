import { Api } from "@/Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import User, { RoleTranslate } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Filter, FilterX, Edit, Trash } from "lucide-react";
import CustomDialog from "@/components/Dialog";
import UpdateUserPage from "@/pages/user/update-user-page";
import AddUserPage from "@/pages/user/add-user-page";

export default function UsersPage() {
    const { ref, inView } = useInView();
    const [search, setSearch] = useState("");
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const fetchUsers = async (page: number): Promise<User[]> => {
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        const { data } = await Api.get<User[]>("users", {
            params: {
                skip: skip,
                limit: limit,
                query: search,
                includeDeleted: includeDeleted,
            },
        });
        return data;
    };

    const { data, status, refetch } = useQuery({
        queryKey: ["users", search, includeDeleted, currentPage],
        queryFn: () => fetchUsers(currentPage),
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

    const handleEdit = (userId: string) => {
        setSelectedUserId(userId);
        setIsDialogOpen(true);
    };

    const handleDelete = async (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            await Api.delete(`users/${userId}`);
            refetch();
        }
    };

    const handleAddUser = () => {
        setIsAddUserDialogOpen(true);
    };

    return (
        <div className="p-5 bg-secondary">
            <div className="mb-4 flex justify-between items-center">
                <Input
                    placeholder="بحث..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-[30%] p-2 border border-gray-300 rounded-md"
                />
                <Button onClick={() => setIncludeDeleted(!includeDeleted)} variant="outline">
                    {includeDeleted ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Filter />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>اخفاء المستخدمين المحذوفين</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <FilterX />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>إظهار المستخدمين المحذوفين</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </Button>
                <Button variant="outline" className="border-green-500" onClick={handleAddUser}>
                    إضافة مستخدم
                </Button>
            </div>

            <div className="overflow-hidden">
                <table className="min-w-full bg-white dark:bg-secondary shadow-md rounded-lg">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-300 dark:from-secondary dark:to-gray-800 border-b-4 border-gray-300 shadow-md">
                    <tr>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300">
                            اسم المستخدم
                        </th>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300">
                            نوع المستخدم
                        </th>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300">
                            رقم الهاتف
                        </th>
                        <th className="px-6 py-4 text-start font-bold text-sm text-gray-700 dark:text-gray-300">
                            إجراءات
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {status === "loading" && (
                        <tr>
                            <td colSpan={4} className="text-center py-4">
                                Loading...
                            </td>
                        </tr>
                    )}
                    {data && data.length > 0 ? (
                        data.map((user) => (
                            <tr key={user.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {user.username}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {RoleTranslate[user.role]}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                                    {user.phoneNumber}
                                </td>
                                <td className="px-6 py-4 flex space-x-3">
                                    <Button onClick={() => handleEdit(user.id)} variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button onClick={() => handleDelete(user.id)} variant="outline" size="sm">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center py-4">
                                No data found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between mt-4">
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </Button>
                <Button onClick={handleNextPage} disabled={data && data.length < 10}>
                    Next
                </Button>
            </div>
            <div className="flex justify-center" ref={ref}>
                {status === "loading" ? "loading..." : ""}
            </div>

            {selectedUserId && (
                <CustomDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Update User">
                    <UpdateUserPage userId={selectedUserId} />
                </CustomDialog>
            )}

            {isAddUserDialogOpen && (
                <CustomDialog
                    isOpen={isAddUserDialogOpen}
                    onClose={() => setIsAddUserDialogOpen(false)}
                    title="Add User"
                >
                    <AddUserPage isOpen={isAddUserDialogOpen} onClose={() => setIsAddUserDialogOpen(false)} />
                </CustomDialog>
            )}
        </div>
    );
}

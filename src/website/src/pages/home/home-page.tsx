// src/website/src/pages/home/home-page.tsx
import { Api } from "@/Api";
import { Input } from "@/components/ui/input";
import { Section } from "@/types/section";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaFolder } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddSectionPage from "@/pages/section/add-section-page";

const HomePage = () => {
    const { ref, inView } = useInView();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    const navigate = useNavigate();

    const fetchSections = async ({ pageParam = 1 }): Promise<Section[]> => {
        const pageSize = 10;
        const skip = (pageParam - 1) * pageSize;
        const { data } = await Api.get<Section[]>("sections", { params: { skip, limit: pageSize } });
        return data;
    };

    const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["sections"],
        queryFn: fetchSections,
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

    const filteredData = sortedData().filter(section => section.name.toLowerCase().includes(searchQuery.toLowerCase()));

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    const handleEdit = (section: Section) => {
        setSelectedSection(section);
        setIsEditDialogOpen(true);
    };

    const handleDelete = (section: Section) => {
        setSelectedSection(section);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedSection) {
            await Api.delete(`sections/${selectedSection.id}`);
            fetchNextPage();
            setIsDeleteDialogOpen(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSection) {
            try {
                await Api.patch(`sections/${selectedSection.id}`, { name: selectedSection.name });
                fetchNextPage();
                setIsEditDialogOpen(false);
                window.location.reload();
            } catch (err) {
                console.error("Error updating section:", err);
            }
        }
    };

    return (
        <div className="p-5 h-screen bg-secondary rtl">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
                <Input
                    placeholder="بحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-[30%] p-2 border border-gray-300 rounded-md mb-4 md:mb-0"
                />
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-500 text-white p-2 rounded-md">
                    إضافة قسم
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {status === "loading" && (
                    <div className="col-span-full text-center py-4 text-lg font-semibold text-gray-500">
                        جار التحميل...
                    </div>
                )}
                {filteredData.length > 0 ? (
                    filteredData.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white dark:bg-secondary shadow-md rounded-lg p-4 border-r-4 border-blue-500 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                            onClick={() => navigate(`/sections/${section.id}/users`)}
                        >
                            <div className="flex items-center mb-2">
                                <FaFolder className="text-blue-500 ml-2"/>
                                <h3 className="text-md sm:text-lg font-bold text-gray-800 dark:text-gray-200">{section.name}</h3>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{format(new Date(section.creationDate), "yyyy/MM/dd")}</p>
                            <div className="flex space-x-3 mt-4">
                                <Button variant="outline" onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(section);
                                }}>
                                    <FaEdit className="h-4 w-4 text-green-500"/> تعديل
                                </Button>
                                <Button variant="outline" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(section);
                                }}>
                                    <FaTrash className="h-4 w-4 text-red-500"/> حذف
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-4 text-lg font-semibold text-gray-500">
                        لا توجد بيانات.
                    </div>
                )}
            </div>


            <div className="flex justify-center" ref={ref}>
                {isFetchingNextPage ? "جار التحميل..." : ""}
            </div>

            <AddSectionPage isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}/>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>تعديل القسم</DialogTitle>
                        <DialogDescription>قم بتحديث اسم القسم أدناه.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <Input
                            type="text"
                            placeholder="اسم القسم"
                            value={selectedSection?.name || ""}
                            onChange={(e) => setSelectedSection({...selectedSection, name: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                        <DialogFooter>
                            <Button type="submit" className="bg-blue-500 text-white p-2 rounded-md">تحديث</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>حذف القسم</DialogTitle>
                        <DialogDescription>هل أنت متأكد أنك تريد حذف هذا القسم؟</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={confirmDelete} className="bg-red-500 text-white p-2 rounded-md">حذف</Button>
                        <Button onClick={() => setIsDeleteDialogOpen(false)}
                                className="bg-gray-500 text-white p-2 rounded-md">إلغاء</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HomePage;
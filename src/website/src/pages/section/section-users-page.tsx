import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/Api";
import User from "@/types/user";
import { Section } from "@/types/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import uploadMedia from "@/utils/uploadMedia";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function SectionUsersPage() {
    const { sectionId } = useParams<{ sectionId: string }>();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [ticketTitle, setTicketTitle] = useState("");
    const [imageGallery, setImageGallery] = useState<File[]>([]);
    const [assignedUserId, setAssignedUserId] = useState("");
    const [error, setError] = useState("");

    const { data: section, error: sectionError, isLoading: sectionLoading } = useQuery<Section>({
        queryKey: ["section", sectionId],
        queryFn: async () => {
            const { data } = await Api.get<Section>(`sections/${sectionId}`);
            return data;
        }
    });

    const { data: users, error: usersError, isLoading: usersLoading } = useQuery<User[]>({
        queryKey: ["users", sectionId],
        queryFn: async () => {
            const { data } = await Api.get<User[]>(`sections/${sectionId}/users`);
            return data;
        }
    });

    const createTicket = async (ticket) => {
        const { data } = await Api.post('tickets', ticket, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return data;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const uploadedImages = await Promise.all(imageGallery.map(file => uploadMedia(file)));
            const ticket = { ticketTitle, imageGallery: uploadedImages.flat(), assignedUserId };
            const response = await createTicket(ticket);
            if (response) {
                setIsDialogOpen(false);
                navigate("/"); // Navigate back to the home page
            }
        } catch (err) {
            setError("فشل في إضافة التذكرة. حاول مرة أخرى.");
            console.error("Error adding ticket:", err);
        }
    };

    if (sectionLoading || usersLoading) {
        return <div className="p-5 h-screen bg-secondary flex items-center justify-center">جار التحميل...</div>;
    }

    if (sectionError || usersError) {
        return <div className="p-5 h-screen bg-secondary flex items-center justify-center text-red-500">حدث خطأ أثناء تحميل البيانات. حاول مرة أخرى.</div>;
    }

    return (

        <div className="p-5 h-screen bg-secondary rtl">
            <div className="flex justify-between items-center">
                <Button onClick={() => navigate(-1)} variant="outline" size="sm"
                        className="bg-blue-500 text-white p-2 rounded-md">
                    رجوع
                </Button>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-500 text-white p-2 rounded-md">
                    إضافة تذكرة جديدة
                </Button>

            </div>

            <h1 className="text-2xl mb-4">المستخدمين في القسم: {section?.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users?.map(user => (
                    <div key={user.id} className="bg-white dark:bg-secondary shadow-md rounded-lg p-4">
                        <h1 className="text-sm "><p>الاسم:</p> {user.username}</h1>
                    </div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>إضافة تذكرة جديدة</DialogTitle>
                        <DialogDescription>أدخل تفاصيل التذكرة أدناه.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <div className="mb-4">
                            <Input
                                type="text"
                                placeholder="عنوان التذكرة"
                                value={ticketTitle}
                                onChange={(e) => setTicketTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                type="file"
                                multiple
                                onChange={(e) => setImageGallery(Array.from(e.target.files))}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <Select onValueChange={setAssignedUserId} value={assignedUserId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر المستخدم المعين"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {users?.map(user => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="bg-blue-500 text-white p-2 rounded-md">إضافة</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
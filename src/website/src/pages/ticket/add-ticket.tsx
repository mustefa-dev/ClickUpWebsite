import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "@/Api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import uploadMedia from "@/utils/uploadMedia";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const AddTicketPage = ({ isOpen, onClose }) => {
    const [ticketTitle, setTicketTitle] = useState("");
    const [imageGallery, setImageGallery] = useState<File[]>([]);
    const [assignedUserId, setAssignedUserId] = useState("");
    const [error, setError] = useState("");
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await Api.get("users");
                setUsers(data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, []);

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
                navigate("/"); // Navigate back to the home page
                onClose();
            }
        } catch (err) {
            setError("فشل في إضافة التذكرة. حاول مرة أخرى.");
            console.error("Error adding ticket:", err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
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
                        <Select onValueChange={setAssignedUserId}>
                            <SelectTrigger>
                                <SelectValue placeholder="اختر المستخدم المعين" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map(user => (
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
    );
};

export default AddTicketPage;
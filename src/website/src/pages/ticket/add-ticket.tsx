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
    const [ticketDescription, setTicketDescription] = useState("");
    const [ticketDateTime, setTicketDateTime] = useState("");
    const [imageGallery, setImageGallery] = useState<File[]>([]);
    const [assignedUserIds, setAssignedUserIds] = useState<string[]>([""]);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const uploadedImages = await Promise.all(imageGallery.map(file => uploadMedia(file)));
            const ticket = {
                ticketTitle,
                ticketDescription,
                ticketDateTime,
                imageGallery: uploadedImages.flat(),
                assignedUserIds
            };
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

    const handleAddUser = () => {
        setAssignedUserIds([...assignedUserIds, ""]);
    };

    const handleUserChange = (index, value) => {
        const newAssignedUserIds = [...assignedUserIds];
        newAssignedUserIds[index] = value;
        setAssignedUserIds(newAssignedUserIds);
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
                            type="text"
                            placeholder="وصف التذكرة"
                            value={ticketDescription}
                            onChange={(e) => setTicketDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            type="datetime-local"
                            value={ticketDateTime}
                            onChange={(e) => setTicketDateTime(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
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
                        {assignedUserIds.map((userId, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <Select onValueChange={(value) => handleUserChange(index, value)} value={userId}>
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
                        ))}
                        <Button onClick={handleAddUser} className="mt-2">إضافة مستخدم آخر</Button>
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
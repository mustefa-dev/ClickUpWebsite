// src/website/src/pages/section/add-section-page.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "@/Api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const AddSectionPage = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await Api.post("sections", { name });
            if (response.status === 201) {
                navigate("/"); // Navigate back to the home page
                onClose();
            }
        } catch (err) {
            setError("فشل في إضافة القسم. حاول مرة أخرى.");
            console.error("Error adding section:", err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>إضافة قسم جديد</DialogTitle>
                    <DialogDescription>أدخل اسم القسم أدناه.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-4">
                        <Input
                            type="text"
                            placeholder="اسم القسم"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-blue-500 text-white p-2 rounded-md">إضافة</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddSectionPage;
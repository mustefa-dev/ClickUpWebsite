// src/website/src/pages/user/add-user-page.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "@/Api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RoleList, RoleTranslate } from "@/types/user";
import { Section } from "@/types/section";

const AddUserPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [sectionId, setSectionId] = useState(""); // Changed to sectionId
    const [sections, setSections] = useState<Section[]>([]);
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSections = async () => {
            const { data } = await Api.get<Section[]>("sections");
            setSections(data);
        };
        fetchSections();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        try {
            await Api.post("users", { username, email, phoneNumber, address, password, role, sectionId }); // Changed to sectionId
            window.location.reload();
        } catch (error) {
            console.error("Error adding user:", error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="p-5 bg-secondary">
            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <Input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Select onValueChange={setRole} value={role} required>
                    <SelectTrigger>
                        <SelectValue placeholder="اختر نوع المستخدم" />
                    </SelectTrigger>
                    <SelectContent>
                        {RoleList.map((value) => (
                            <SelectItem key={value} value={value}>
                                {RoleTranslate[value]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select onValueChange={setSectionId} value={sectionId} required> {/* Changed to setSectionId */}
                    <SelectTrigger>
                        <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent>
                        {sections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                                {section.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "جارٍ الإضافة..." : "إضافة المستخدم"}
                </Button>
            </form>
        </div>
    );
};

export default AddUserPage;
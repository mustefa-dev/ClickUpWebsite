import { Api } from "@/Api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import User, { Role, RoleList, RoleTranslate } from "@/types/user";
import { Section } from "@/types/section";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

export default function AddUserPage() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role>("User");
    const [sectionId, setSectionId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const { data: sections, isLoading: isSectionsLoading } = useQuery<Section[]>({
        queryKey: ["sections"],
        queryFn: async () => {
            const { data } = await Api.get<Section[]>("sections");
            return data;
        }
    });

    const addUser = async () => {
        if (username === "") {
            toast.error("اسم المستخدم مطلوب");
            return;
        }
        if (password === "") {
            toast.error("الباسوورد مطلوب");
            return;
        }
        if (firstName === "") {
            toast.error("الاسم الاول مطلوب");
            return;
        }

        const payload = {
            firstName,
            lastName,
            username,
            email,
            address,
            phoneNumber,
            password,
            passwordConfirmation: password,
            role,
            sectionId,
        };

        setIsLoading(true);
        const response = await Api.post<User>("users", payload);
        setIsLoading(false);

        if (response.status === 409) {
            toast.error("اسم المستخدم تم اخذه مسبقا");
            return;
        }
        if (response.status !== 201) {
            toast.error("حدث خطأ");
            return;
        }

        if (response.status === 201) {
            toast.success("تم انشاء المستخدم");
            navigate(-1);
        }
    };

    return (
        <div>
            <Card className="mx-auto max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl flex flex-row gap-7">
                        إضافة مستخدم
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>القسم</Label>
                        <div className="col-span-2">
                            <Select value={sectionId} onValueChange={(v) => setSectionId(v as string)}>
                                <SelectTrigger id="section">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {
                                        sections?.map(section => (
                                            <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>اسم المستخدم</Label>
                        <Input
                            placeholder="اسم المستخدم..."
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>الهاتف</Label>
                        <Input
                            placeholder="الهاتف..."
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>الباسوورد</Label>
                        <Input
                            placeholder="الباسوورد..."
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>نوع المستخدم</Label>
                        <div className="col-span-2">
                            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {
                                        RoleList.map(value => (
                                            <SelectItem key={value} value={value}>{RoleTranslate[value]}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full flex flex-row gap-10" onClick={addUser}>
                        {isLoading ? (
                            <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-400 border-t-secondary" />
                        ) : (
                            "إضافة مستخدم"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
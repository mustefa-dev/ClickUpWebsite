// src/pages/user/add-user-page.tsx
import { Api } from "@/Api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import User, { Role, RoleList, RoleTranslate } from "@/types/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";

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

    const { mutate, isPending } = useMutation({
        mutationKey: ["addUser"],
        mutationFn: async () => {
            if (username === "") {
                toast.error("اسم المستخدم مطلوب");
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
                role,
            };
            await Api.post<User>("users", payload);
        },
        onSuccess: () => {
            toast.success("تم إضافة المستخدم");
            navigate(-1);
        },
        onError: (err) => {
            toast.error(err.message || "حدث خطأ");
        },
    });

    return (
        <Card className="mx-auto max-w-md mt-20">
            <CardHeader>
                <CardTitle className="text-2xl flex flex-row gap-7">
                    إضافة مستخدم
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>الاسم الاول</Label>
                    <Input
                        placeholder="الاسم الاول..."
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>الاسم الثاني</Label>
                    <Input
                        placeholder="الاسم الثاني..."
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>اسم المستخدم</Label>
                    <Input
                        placeholder="اسم المستخدم..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>الايميل</Label>
                    <Input
                        placeholder="الايميل..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>الهاتف</Label>
                    <Input
                        placeholder="الهاتف..."
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>الموقع</Label>
                    <Input
                        placeholder="الموقع..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>الباسوورد</Label>
                    <Input
                        placeholder="الباسوورد..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                                {RoleList.map((value) => (
                                    <SelectItem key={value} value={value}>
                                        {RoleTranslate[value]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full flex flex-row gap-10" onClick={() => mutate()}>
                    {isPending ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-400 border-t-secondary" />
                    ) : (
                        "إضافة المستخدم"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}

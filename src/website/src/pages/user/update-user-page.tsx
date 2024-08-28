// src/pages/user/update-user-page.tsx
import { Api } from "@/Api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import User, { Role, RoleList, RoleTranslate } from "@/types/user";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import CustomDialog from "@/components/Dialog";

interface UpdateUserPageProps {
    userId: string;
}

export default function UpdateUserPage({ userId }: UpdateUserPageProps) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role>("User");

    const fetchUser = async (): Promise<User> => {
        let url = `users/${userId}`;
        const { data } = await Api.get<User>(url);
        return data;
    }

    const { data, status, error, refetch } = useQuery({
        queryKey: ["users", userId],
        queryFn: fetchUser,
    });

    useEffect(() => {
        if (data !== undefined) {
            setUsername(data.username);
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmail(data.email);
            setAddress(data.address);
            setPhoneNumber(data.phoneNumber);
            setRole(data.role);
        }
    }, [data, status])

    const { mutate, isPending } = useMutation({
        mutationKey: ["users", userId],
        mutationFn: async () => {
            if (username === "") {
                toast.error("اسم المستخدم مطلوب")
                return;
            }
            if (firstName === "") {
                toast.error("الاسم الاول مطلوب");
                return;
            }

            var payload = {
                firstName,
                lastName,
                username,
                email,
                address,
                phoneNumber,
                password: password.length <= 0 ? null : password,
                role,
            }
            await Api.patch<User>(`users/${userId}`, payload);
        },
        onSuccess: () => {
            toast.success("تم انشاء المستخدم")
            navigate(-1);
        },
        onError: (err) => {
            toast.error(err.message || "حدث خطأ");
        },
    })

    return (
        <Card className="mx-auto max-w-md mt-20">
            <CardHeader>
                <CardTitle className="text-2xl flex flex-row gap-7">
                    تعديل المستخدم
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>الاسم الاول</Label>
                    <Input
                        placeholder="الاسم الاول..."
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>الاسم الثاني</Label>
                    <Input
                        placeholder="الاسم الثاني..."
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />
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
                    <Label>الايميل</Label>
                    <Input
                        placeholder="الايميل..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
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
                    <Label>الموقع</Label>
                    <Input
                        placeholder="الموقع..."
                        value={address}
                        onChange={e => setAddress(e.target.value)}
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
                        <Select value={role} onValueChange={(v) => setRole(v as Role)}  >
                            <SelectTrigger id="source">
                                        <Button className="w-full flex  flex-row gap-10" onClick={() => mutate()}>
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
                    {
                        isPending ?
                            <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-400 border-t-secondary" />
                            :
                            "تعديل المستخدم"
                    }
                </Button>
            </CardFooter>
        </Card>
    )
}
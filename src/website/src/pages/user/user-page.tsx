// src/pages/user/user-page.tsx
import { Api } from "@/Api";
import { Button } from "@/components/ui/button";
import User, { RoleTranslate } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import CustomDialog from "@/components/Dialog";

export default function UserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    const fetchUser = async (): Promise<User> => {
        let url = `users/${id}`;
        const { data } = await Api.get<User>(url);
        return data;
    }

    const { data, status, error, refetch } = useQuery({
        queryFn: fetchUser,
        queryKey: ["users", id]
    })

    const deleteUser = async () => {
        await Api.delete(`/users/${id}`);
        navigate(-1);
    }

    if (status === "pending") {
        return <div>Loading...</div>
    }

    return (
        <CustomDialog isOpen={isOpen} onClose={() => navigate(-1)} title="User Details">
            <div className="mb-6 mt-4 rounded-lg bg-secondary p-6 shadow-md">
                <div className="grid grid-cols-2 gap-4 text-right">
                    <div className="text-red-300">
                        {data.isDeleted ? "المستخدم تم حذفه" : " "}
                    </div>
                    <div>
                        <span className="font-bold"></span>
                        {" "}
                    </div>
                    <div>
                        <span className="font-bold">الاسم: </span>
                        {data.firstName + " " + data.lastName}
                    </div>
                    <div>
                        <span className="font-bold">اسم المستخدم: </span>
                        {data.username}
                    </div>
                    <div>
                        <span className="font-bold">الهاتف: </span>
                        {data.phoneNumber}
                    </div>
                    <div>
                        <span className="font-bold">الايميل: </span>
                        {data.email}
                    </div>
                    <div>
                        <span className="font-bold">الموقع: </span>
                        {data.address}
                    </div>
                    <div>
                        <span className="font-bold">نوع المستخدم: </span>
                        {RoleTranslate[data.role]}
                    </div>
                </div>
            </div>
        </CustomDialog>
    )
}
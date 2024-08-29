import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/Api";
import User from "@/types/user";
import { Section } from "@/types/section";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SectionUsersPage() {
    const { sectionId } = useParams<{ sectionId: string }>();
    const navigate = useNavigate();

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

    if (sectionLoading || usersLoading) {
        return <div className="p-5 h-screen bg-secondary flex items-center justify-center">جار التحميل...</div>;
    }

    if (sectionError || usersError) {
        return <div className="p-5 h-screen bg-secondary flex items-center justify-center text-red-500">حدث خطأ أثناء تحميل البيانات. حاول مرة أخرى.</div>;
    }

    return (
        <div className="p-5 h-screen bg-secondary rtl">
            <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="bg-blue-500 text-white p-2 rounded-md mb-4">
                رجوع
            </Button>
            <h1 className="text-2xl mb-4">المستخدمين في القسم: {section?.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users?.map(user => (
                    <div key={user.id} className="bg-white dark:bg-secondary shadow-md rounded-lg p-4">
                        <h1 className="text-sm "><p>الاسم:</p> {user.username}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}
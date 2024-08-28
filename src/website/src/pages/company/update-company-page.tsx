import { Api } from "@/Api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Company } from "@/types/company";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function UpdateCompanyPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [subDomain, setSubDomain] = useState("");
    const [hasBlog, setHasBlog] = useState(false);

    const fetchCompany = async (): Promise<Company> => {
        let url = `companies/${id}`;
        const { data } = await Api.get<Company>(url);
        return data;
    }

    const { data, status, error, refetch } = useQuery({
        queryKey: ["company", id],
        queryFn: fetchCompany,
    });

    useEffect(() => {
        if (data !== undefined) {
            setName(data.name);
            setSubDomain(data.subDomain);
            setHasBlog(data.hasBlog);
        }
    }, [data, status])

    const { mutate, isPending } = useMutation({
        mutationKey: ["company", id],
        mutationFn: async () => {
            if (subDomain === "") {
                toast.error("السب دومين مطلوب")
                return;
            }
            if (name === "") {
                toast.error("الاسم مطلوب")
                return;
            }

            var payload = {
                name,
                subDomain,
                hasBlog,
            }
            await Api.patch<Company>(`companies/${id}`, payload);
            
        },
        onSuccess: () => {
            toast.success("تم تحديث معلومات الشركة")
            navigate(-1);
        },
        onError: (err:AxiosError) => {
            if (err.response.status === 409) {
                toast.error("السب دومين مأخوذ");
            } else {
                toast.error(err.message || "حدث خطأ");
            }
        },
    })

    return (
        <div>
            <div className="mt-8 flex flex-row gap-4 justify-between">
                <Button onClick={() => navigate(-1)} variant="outline" size="sm">
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                    رجوع
                </Button>
            </div>

            <Card className="mx-auto max-w-md  ">
                <CardHeader>
                    <CardTitle className="text-2xl flex flex-row gap-7">
                        تعديل المستخدم
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>اسم الشركة</Label>
                        <Input
                            placeholder="اسم الشركة..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>السب دومين</Label>
                        <Input
                            value={subDomain}
                            onChange={e => setSubDomain(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>المدونة</Label>
                        <div className="col-span-2">
                            <Select defaultValue={hasBlog.toString()} onValueChange={(v) => v === "true" ? setHasBlog(true) : setHasBlog(false)}  >
                                <SelectTrigger id="source">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value={"true"}>مفعلة</SelectItem>
                                    <SelectItem value={"false"}>غير مفعلة</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full flex flex-row gap-10" onClick={() => mutate()}>
                        {
                            isPending ?
                                <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-400 border-t-secondary" />
                                :
                                "تحديث المعلومات"
                        }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
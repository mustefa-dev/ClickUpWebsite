import { Api } from "@/Api";
import { Company, PaymentMethodTranslation, SubscriptionStatusTranslate } from "@/types/company";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function CompanyPage() {
    const { id } = useParams();
    const navigate = useNavigate();


    const fetchCompany = async (): Promise<Company> => {
        let url = `companies/${id}`;
        const { data } = await Api.get<Company>(url);
        return data;
    }

    const { data, status, error, refetch } = useQuery({
        queryFn: fetchCompany,
        queryKey: ["company", id]
    })


    if (status === "pending") {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="mt-8 flex flex-row gap-4 justify-between">
                <Button onClick={() => navigate(-1)} variant="outline" size="sm">
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                    رجوع
                </Button>
                <div className="flex flex-row gap-3">
                    <Link to={`/companies/${id}/subscription`}>
                        <Button variant="outline" className="border-blue-500">
                            الاشتراك
                        </Button>
                    </Link>
                    <Link to={``}>
                        <Button variant="outline" className="border-yellow-500">
                            تعديل الموقع
                        </Button>
                    </Link>
                    <Link to={`/companies/${id}/update`}>
                        <Button variant="outline" className="border-green-500">
                            تعديل
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="mb-6 mt-4 rounded-lg bg-secondary p-6 shadow-md">
                <h2 className="mb-4 text-right text-2xl font-bold">معلومات الشركة</h2>
                <div className="grid grid-cols-2 gap-4 text-right">
                    <div>
                        <span className="font-bold">الاسم: </span>
                        {data.name}
                    </div>
                    <div>
                        <span className="font-bold">السب دومين: </span>
                        {data.subDomain}
                    </div>
                    <div>
                        <span className="font-bold">المدونة: </span>
                        {
                            data.hasBlog ? 
                                "مفعلة" : "غير مفعلة"
                        }
                    </div>
                    <div>
                        <span className="font-bold">مملوكة بواسطة: </span>
                        <Link to={`/user/${data.user.id}`} className=" underline hover:text-red-400">
                            {data.user.firstName + " " + data.user.lastName}
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mb-6 rounded-lg bg-secondary p-6 shadow-md">
                <h2 className="mb-4 text-right text-2xl font-bold">معلومات الاشتراك</h2>
                <div className="grid grid-cols-2 gap-4 text-right">
                    {
                        data.subscriptionInfo.status === "NotActiveYet" ?
                            "" :
                            <>
                                <div>
                                    <span className="font-bold">تاريخ البدء: </span>
                                    {format(data.subscriptionInfo.subscriptionStartDate, "yyyy-MM-dd")}
                                </div>
                                <div>
                                    <span className="font-bold">تاريخ الانتهاء: </span>
                                    {format(data.subscriptionInfo.subscriptionEndDate, "yyyy-MM-dd")}
                                </div>
                                <div>
                                    <span className="font-bold">طريقة الدفع: </span>
                                    {PaymentMethodTranslation[data.subscriptionInfo.paymentMethod]}
                                </div>
                                <div>
                                    <span className="font-bold">الملاحظة: </span>
                                    {data.subscriptionInfo.note}
                                </div>
                                <div>
                                    <span className="font-bold">المبلغ: </span>
                                    {data.subscriptionInfo.price}
                                </div>
                            </>
                    }
                    <div>
                        <span className="font-bold">حالة الاشتراك: </span>
                        {SubscriptionStatusTranslate[data.subscriptionInfo.status]}
                    </div>
                    {
                        data.activatedBy === null ? "" :
                            <div>
                                <span className="font-bold">الاشتراك مفعل بواسطة: </span>
                                <Link to={`/user/${data.activatedBy.id}`} className=" underline hover:text-red-400">
                                    {data.activatedBy.firstName + " " + data.activatedBy.lastName}
                                </Link>
                            </div>
                    }
                </div>
            </div>

        </div>
    )

}
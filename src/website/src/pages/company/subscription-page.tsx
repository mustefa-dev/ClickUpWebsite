import { Api } from "@/Api";
import { Button } from "@/components/ui/button";
import { Company, PaymentMethod, PaymentMethodList, PaymentMethodTranslation, SubscriptionStatusTranslate } from "@/types/company";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function SubscriptionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [price, setPrice] = useState(0);
    const [note, setNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
    const [disableOpen, setDisableOpen] = useState(false);

    const fetchCompany = async (): Promise<Company> => {
        let url = `companies/${id}`;
        const { data } = await Api.get<Company>(url);
        return data;
    }

    const { data, status, error, refetch } = useQuery({
        queryFn: fetchCompany,
        queryKey: ["company", id]
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ["company", id],
        mutationFn: async () => {
            if (data.subscriptionInfo.status === "Active" || data.subscriptionInfo.status === "Disabled") {
                await Api.post(`companies/${id}/disable`);
            } else {
                if (price <= 0) {
                    toast.error("السعر يجب ان يكون عدد موجب اكبر من صفر")
                    throw("");
                }
                if (note.length <= 0) {
                    toast.error("يجب وضع ملاحظة");
                    throw("");
                }
                var payload = {
                    price,
                    paymentMethod,
                    note,
                }
                await Api.post(`companies/${id}/renew`, payload);
            }
        },
        onSuccess: () => {
            var message = data.subscriptionInfo.status === "Active" ? "تم التعطيل" : data.subscriptionInfo.status === "Disabled" ? "تم الغاء التعطيل" : "تم التفعيل"
            toast.success(message)
            navigate(-1);
        },
        onError: (err) => {
            if (err.message) {
                toast.error(err.message || "حدث خطأ")
            }

        },
    })

    const activateDialog = () => {
        return (
            <Dialog>
                <DialogTrigger>
                    <Button variant="sccuss">
                        تفعيل
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <div className="flex flex-col gap-4">
                        <div className="text-center text-2xl font-bold">
                            تفعيل الاشتراك
                        </div>
                        <div className="text-center text-gray-400">
                            سوف يتم تفعيل الاشتراك لمدة سنة
                        </div>
                        <div>
                            <Label>السعر بالدينار العراقي</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>طريقة الدفع</Label>
                            <div className="col-span-2">
                                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}  >
                                    <SelectTrigger id="source">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        {
                                            PaymentMethodList.map(value => (
                                                <SelectItem key={value} value={value}>{PaymentMethodTranslation[value]}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>ملاحظة</Label>
                            <Input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row justify-center">
                            <Button className="w-full flex flex-row gap-10" variant="sccuss" onClick={() => mutate()}>
                                {
                                    isPending ?
                                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-400 border-t-secondary" />
                                        :
                                        "تفعيل"
                                }
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }


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
            </div>
            <div className="mb-6 mt-9 rounded-lg bg-secondary p-6 shadow-md">
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
            <div className="w-full flex flex-row justify-center">
                {
                    data.subscriptionInfo.status === "NotActiveYet" ?
                        activateDialog()
                        :
                        data.subscriptionInfo.status === "Expired" ?
                            activateDialog()
                            :
                            data.subscriptionInfo.status === "Disabled" ?
                                <Dialog open={disableOpen} onOpenChange={setDisableOpen}>
                                    <DialogTrigger>
                                        <Button variant="sccuss">
                                            إلغاء التعطيل
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <div className="flex flex-col gap-5 items-center">
                                            <div>
                                                هل انت متأكد من إلغاء تعطيل
                                            </div>
                                            <div className="flex flex-row gap-4">
                                                <Button variant="sccuss" onClick={() => mutate()}>
                                                    إلغاء التعطيل
                                                </Button>
                                                <Button variant="danger-outline" onClick={() => setDisableOpen(false)}>
                                                    تجاهل
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                :
                                data.subscriptionInfo.status === "Active" ?
                                    <Dialog open={disableOpen} onOpenChange={setDisableOpen}>
                                        <DialogTrigger>
                                            <Button variant="danger-outline">
                                                تعطيل
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <div className="flex flex-col gap-5 items-center">
                                                <div>
                                                    هل انت متأكد من تعطيل الموقع
                                                </div>
                                                <div className="flex flex-row gap-4">
                                                    <Button variant="danger-outline" onClick={() => mutate()}>
                                                        تعطيل
                                                    </Button>
                                                    <Button variant="sccuss" onClick={() => setDisableOpen(false)}>
                                                        تجاهل
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    : ""
                }
            </div>
        </div>
    )
}



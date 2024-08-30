import { Api } from "@/Api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";

interface UpdateTicketPageProps {
    ticketId: string;
}

export default function UpdateTicketPage({ ticketId }: UpdateTicketPageProps) {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Open");

    const fetchTicket = async (): Promise<any> => {
        const { data } = await Api.get(`tickets/${ticketId}`);
        return data;
    }

    const { data, status: queryStatus } = useQuery({
        queryKey: ["tickets", ticketId],
        queryFn: fetchTicket,
    });

    useEffect(() => {
        if (data !== undefined) {
            setTitle(data.title);
            setDescription(data.description);
            setStatus(data.status);
        }
    }, [data, queryStatus]);

    const { mutate, isPending } = useMutation({
        mutationKey: ["tickets", ticketId],
        mutationFn: async () => {
            if (title === "") {
                toast.error("Title is required");
                return;
            }
            if (description === "") {
                toast.error("Description is required");
                return;
            }

            const payload = {
                newStatus: status
            };
            await Api.patch(`tickets/status/${ticketId}`, payload);
        },
        onSuccess: () => {
            toast.success("Ticket updated successfully");
            navigate(-1);
        },
        onError: (err) => {
            toast.error(err.message || "An error occurred");
        },
    });

    return (
        <Card className="mx-auto max-w-md mt-20">
            <CardHeader>
                <CardTitle className="text-2xl">Update Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                        placeholder="Title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                        placeholder="Description..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="InProgress">In Progress</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full flex flex-row gap-10" onClick={() => mutate()}>
                    {isPending ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-400 border-t-secondary" />
                    ) : (
                        "Update ticket"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
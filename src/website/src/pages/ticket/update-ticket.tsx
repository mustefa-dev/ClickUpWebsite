// src/pages/ticket/update-ticket-page.tsx
import { Api } from "@/Api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthStore } from "@/utils/authStore";
import uploadMedia from "@/utils/uploadMedia";

interface UpdateTicketPageProps {
    ticketId: string;
}

export default function UpdateTicketPage({ ticketId }: UpdateTicketPageProps) {
    const [ticketTitle, setTicketTitle] = useState("");
    const [imageGallery, setImageGallery] = useState<string[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await Api.get(`tickets/${ticketId}`);
                setTicketTitle(response.data.title);
                setImageGallery(response.data.imageGallery || []);
            } catch (err) {
                setError("Failed to fetch ticket. Please try again.");
                console.error("Error fetching ticket:", err);
            }
        };
        if (ticketId) {
            fetchTicket();
        } else {
            setError("Ticket ID is not defined.");
        }
    }, [ticketId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        try {
            const token = AuthStore.getAccessToken();
            if (!token) {
                throw new Error("No access token found");
            }

            const response = await fetch(`http://192.168.23.137:5194/tickets/${ticketId}`, {
                method: 'PATCH',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ticketTitle: ticketTitle,
                    imageGallery: imageGallery
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                throw new Error(`Request failed with status ${response.status}`);
            }

            toast.success("Ticket updated successfully!");
            navigate("/tickets");
        } catch (error) {
            toast.error("Failed to update ticket.");
            console.error("Error updating ticket:", error);
        } finally {
            setIsPending(false);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        try {
            const uploadedUrls = await Promise.all(files.map(file => uploadMedia(file)));
            setImageGallery(uploadedUrls.flat());
        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Failed to upload images.");
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <Card className="mx-auto max-w-md mt-20">
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <Label htmlFor="ticketTitle">Ticket Title</Label>
                    <Input
                        id="ticketTitle"
                        value={ticketTitle}
                        onChange={(e) => setTicketTitle(e.target.value)}
                        required
                    />
                    <Label htmlFor="imageGallery">Image Gallery</Label>
                    <Input
                        id="imageGallery"
                        type="file"
                        multiple
                        onChange={handleImageChange}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Updating..." : "Update Ticket"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
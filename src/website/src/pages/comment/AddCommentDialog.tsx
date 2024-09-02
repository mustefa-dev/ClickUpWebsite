import React, { useState } from "react";
import CustomDialog from "@/components/Dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Api } from "@/Api";
import { AuthStore } from "@/utils/authStore";
import uploadMedia from "@/utils/uploadMedia";
import LocationPickerDialog from "@/components/LocationPickerDialog";

interface AddCommentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: string;
}

const AddCommentDialog: React.FC<AddCommentDialogProps> = ({ isOpen, onClose, ticketId }) => {
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageUrl = "";
            if (imageFile) {
                const uploadResponse = await uploadMedia(imageFile);
                imageUrl = uploadResponse[0];
            }

            const response = await Api.post("/comments", {
                content,
                ticketId,
                imageUrl,
                lat: location?.lat,
                lan: location?.lng
            }, {
                headers: {
                    'Authorization': `Bearer ${AuthStore.getAccessToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                onClose();
            } else {
                setError("Failed to add comment. Please try again.");
            }
        } catch (err) {
            setError("Failed to add comment. Please try again.");
            console.error("Error adding comment:", err);
        }
    };

    return (
        <CustomDialog isOpen={isOpen} onClose={onClose} title="Add Comment">
            <form onSubmit={handleSubmit}>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <Input
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <Button
                        type="button"
                        onClick={() => setIsLocationPickerOpen(true)}
                        className="bg-blue-500 text-white p-2 rounded-md"
                    >
                        Choose Location
                    </Button>
                </div>
                <div className="flex justify-end">
                    <Button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Add Comment</Button>
                </div>
            </form>
            {isLocationPickerOpen && (
                <LocationPickerDialog
                    isOpen={isLocationPickerOpen}
                    onClose={() => setIsLocationPickerOpen(false)}
                    onSelectLocation={(location) => {
                        setLocation(location);
                        setIsLocationPickerOpen(false);
                    }}
                />
            )}
        </CustomDialog>
    );
};

export default AddCommentDialog;
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { TicketStatusTranslate } from "@/types/ticket";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import uploadMedia from "@/utils/uploadMedia";
import { Api } from "@/Api";
import { AuthStore } from "@/utils/authStore";

interface TicketDialogProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: {
        id: string;
        ticketTitle: string;
        currentStatus: string;
        lastUpdated: string;
        description: string;
        imageGallery: string[];
        ticketNumber: number;
        creator: {
            name: string;
            avatarUrl: string;
        } | null;
        assignedUser: {
            name: string;
        } | null;
        creationDate: string;
    } | null;
}

export default function TicketDialog({ isOpen, onClose, ticket }: TicketDialogProps) {
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!ticket) return null;

    const handleSendComment = async () => {
        // Validate input
        if (!content.trim() && !imageFile) {
            setError("Please enter a comment or attach an image.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const getLocation = () => {
                return new Promise<{ lat: number | null, lng: number | null }>((resolve, reject) => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                resolve({
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                });
                            },
                            (err) => {
                                console.error("Error getting location:", err);
                                // Optionally, resolve with nulls or handle as needed
                                resolve({ lat: null, lng: null });
                            },
                            {
                                enableHighAccuracy: true,
                                timeout: 10000,
                                maximumAge: 0
                            }
                        );
                    } else {
                        console.error("Geolocation not supported");
                        resolve({ lat: null, lng: null });
                    }
                });
            };

            const location = await getLocation();

            // Upload image if any
            let imageUrl = "";
            if (imageFile) {
                const uploadResponse = await uploadMedia(imageFile);
                imageUrl = uploadResponse[0]; // Assuming uploadMedia returns an array of URLs
            }

            // Send comment to server
            const response = await Api.post(
                "/comments",
                {
                    content,
                    ticketId: ticket.id,
                    imageUrl,
                    lat: location.lat,
                    lng: location.lng,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${AuthStore.getAccessToken()}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.status === 201) {
                setContent("");
                setImageFile(null);
                // Optionally, trigger a refresh of comments or notify parent component
            } else {
                setError("Failed to add comment. Please try again.");
            }
        } catch (err) {
            setError("Failed to add comment. Please try again.");
            console.error("Error adding comment:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-hidden" onClose={onClose}>
                <div className="flex items-center justify-center min-h-screen p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Panel className="w-full max-w-4xl bg-secondary rounded-lg shadow-xl p-8 overflow-y-auto max-h-screen flex flex-col">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <Dialog.Title as="h2" className="text-2xl font-bold text-gray-900">
                                    تفاصيل التذكرة
                                </Dialog.Title>
                                <button
                                    type="button"
                                    aria-label="Close dialog"
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-6 flex-1 overflow-y-auto">
                                <p><strong>عنوان التذكرة:</strong> {ticket.ticketTitle}</p>
                                <p><strong>الحالة:</strong> {TicketStatusTranslate[ticket.currentStatus]}</p>
                                <p><strong>آخر تحديث:</strong> {new Date(ticket.lastUpdated).toLocaleDateString()}</p>
                                <p><strong>تاريخ الإنشاء:</strong> {new Date(ticket.creationDate).toLocaleDateString()}</p>
                                <p><strong>رقم التذكرة:</strong> {ticket.ticketNumber}</p>
                                <p><strong>تم إنشاؤها بواسطة:</strong> {ticket.creator?.name || "N/A"}</p>
                                <p><strong>تم تعيينها إلى:</strong> {ticket.assignedUser?.name || "N/A"}</p>
                                <p><strong>وصف:</strong> {ticket.description}</p>
                                <div className="grid grid-cols-1 gap-4">
                                    {ticket.imageGallery.map((image, index) => (
                                        <div key={index} className="overflow-hidden rounded-lg">
                                            <img
                                                src={`http://192.168.134.137:5194/media/${image}`}
                                                alt={`Ticket Image ${index + 1}`}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <div className="flex items-center space-x-2">
                                    {/* Attachment Button */}
                                    <label htmlFor="commentFileInput" className="cursor-pointer text-gray-500 hover:text-gray-700">
                                        <PaperClipIcon className="w-5 h-5" />
                                    </label>
                                    <input
                                        type="file"
                                        id="commentFileInput"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />

                                    {/* Emoji Button */}
                                    <button
                                        type="button"
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={() => console.log("Emoji Picker Clicked")} // Implement emoji picker as needed
                                    >
                                    </button>

                                    {/* Comment Input */}
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none"
                                    />

                                    {/* Send Button */}
                                    <button
                                        onClick={handleSendComment}
                                        className={`px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {/* Error Message */}
                                {error && <p className="text-red-500 mt-2">{error}</p>}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

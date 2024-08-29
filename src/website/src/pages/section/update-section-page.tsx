// src/website/src/pages/sections/update-section-page.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Api } from "@/Api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UpdateSectionPage = () => {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSection = async () => {
            try {
                const response = await Api.get(`sections/${id}`);
                setName(response.data.name);
            } catch (err) {
                setError("Failed to fetch section. Please try again.");
                console.error("Error fetching section:", err);
            }
        };
        fetchSection();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await Api.patch(`sections/${id}`, { name });
            if (response.status === 200) {
                navigate("/");
            }
        } catch (err) {
            setError("Failed to update section. Please try again.");
            console.error("Error updating section:", err);
        }
    };

    return (
        <div className="p-5 h-screen bg-secondary flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-secondary shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Update Section</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Section Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <Button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
                    Update Section
                </Button>
            </form>
        </div>
    );
};

export default UpdateSectionPage;
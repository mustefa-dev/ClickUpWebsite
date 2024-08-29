// src/components/Sidebar.tsx
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
    const handleLinkClick = () => {
        onClose();
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-32 bg-secondary shadow-lg border-l border-gray-200 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <p className="text-2xl font-semibold text-primary">Sidebar</p>
                <Button variant="ghost" onClick={onClose} aria-label="Close sidebar">
                    <X className="h-6 w-6 text-primary" />
                </Button>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
                <ul className="space-y-4">
                    <li className="border-b border-gray-200 pb-2">
                        <Link to="/sections" className="text-lg font-medium text-primary hover:text-accent transition-colors" onClick={handleLinkClick}>الأقسام</Link>
                    </li>
                    <li className="pt-2">
                        <Link to="/users" className="text-lg font-medium text-primary hover:text-accent transition-colors" onClick={handleLinkClick}>المستخدمين</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
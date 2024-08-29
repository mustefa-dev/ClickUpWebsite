import React from "react";
import { HiOutlineCog, HiOutlineUser } from "react-icons/hi";
import { Link } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    const direction = document.documentElement.getAttribute("dir") || "ltr";

    return (
        <div
            className={`fixed inset-y-0 ${direction === "ltr" ? "left-0" : "right-0"} transform ${
                isOpen ? "translate-x-0" : direction === "ltr" ? "-translate-x-full" : "translate-x-full"
            } transition-transform duration-300 bg-secondary text-gray-200 h-screen w-64 shadow-lg z-40 custom-border`}
        >
            <div className="flex flex-col h-full">
                <div className="p-4 mt-16 border-b border-gray-700 bg-secondary">
                    <h2 className="text-2xl font-bold text-gray-100"></h2>
                </div>

                <ul className="flex-1">
                    <li className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200 rounded-md">
                        <HiOutlineCog className="mr-3 text-xl text-gray-400" />
                        <Link to="/" className="text-lg font-medium text-gray-100">الاقسام</Link>
                    </li>
                    <li className="flex items-center p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200 rounded-md">
                        <HiOutlineUser className="mr-3 text-xl text-gray-400" />
                        <Link to="/users" className="text-lg font-medium text-gray-100">المستخدمين</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
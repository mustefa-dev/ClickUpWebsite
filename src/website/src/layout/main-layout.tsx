// src/layout/main-layout.tsx
import Header from "@/components/Header";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const direction = document.documentElement.getAttribute("dir") || "ltr";

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prevState => !prevState);
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="fixed left-0 right-0 top-0 z-50 h-16 bg-secondary text-secondary-foreground">
                <Header
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />
            </header>
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col transition-margin duration-300 ${isSidebarOpen ? (direction === "ltr" ? "ml-64" : "mr-64") : ""}`}>
                <ErrorBoundary
                    fallback={
                        <p className="h-full py-40 text-center text-xl">
                            <span className="font-bold text-primary">Error</span>, Something went wrong on the <span className="text-primary">frontend</span> side!
                        </p>
                    }
                >
                    <main className="flex-grow pt-16">
                        <Outlet />
                    </main>
                    <footer className="w-full bg-secondary py-2 text-center text-sm">
                        جميع الحقوق محفوظة لشركة المربع للحلول البرمجية ©
                    </footer>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default MainLayout;
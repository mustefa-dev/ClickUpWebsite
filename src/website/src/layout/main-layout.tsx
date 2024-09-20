
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const MainLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className={`flex min-h-screen flex-col bg-background ${isSidebarOpen ? "mr-32" : ""}`}>
            <header className="fixed left-0 right-0 top-0 z-50 h-16 bg-secondary text-secondary-foreground">
                <Header toggleSidebar={toggleSidebar} />
            </header>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <div className="flex-1 flex flex-col">
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
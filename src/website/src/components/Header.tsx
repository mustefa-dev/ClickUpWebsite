// src/components/Header.tsx
import { useTheme } from "@/context/theme-provider";
import { LucideLogOut, Moon, Sidebar as SidebarIcon, SunMedium } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback } from "react";
import { AuthStore } from "@/utils/authStore";

interface HeaderProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const userInfo = AuthStore.State.getState().userInfo;

    const handleChangeTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [setTheme, theme]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4 bg-secondary text-secondary-foreground shadow-sm custom-border">
            <div className="flex items-center justify-between">
                <p className="text-xl text-primary ml-4">الدعم الفني</p>
                <div className={`flex items-center transition-transform duration-300 ${isSidebarOpen ? "translate-x-[250px]" : ""}`}>
                    {/* Removed the <p> element */}
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" onClick={handleChangeTheme} aria-label="Toggle theme">
                        {theme === "light" ? <SunMedium /> : <Moon />}
                    </Button>
                    {userInfo && (
                        <Button onClick={() => AuthStore.onLogout()} variant="ghost" aria-label="Log out" className="ml-4">
                            <LucideLogOut />
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;
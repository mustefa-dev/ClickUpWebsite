// src/components/Header.tsx
import { useTheme } from "@/context/theme-provider";
import { LucideLogOut, Moon, SunMedium, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback, useState } from "react";
import { AuthStore } from "@/utils/authStore";

function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    const { theme, setTheme } = useTheme();
    const userInfo = AuthStore.State.getState().userInfo;

    const handleChangeTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [setTheme, theme]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4 bg-secondary text-secondary-foreground shadow-sm custom-border">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={toggleSidebar} aria-label="Toggle sidebar">
                    <Menu />
                </Button>
                <p className="text-xl text-primary ml-4">الدعم الفني</p>
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

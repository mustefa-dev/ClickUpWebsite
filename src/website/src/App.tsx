import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "./context/theme-provider";
import { AuthStore } from "@/utils/authStore";
import AuthRoutes from "@/routes/auth-routes";
import UnAuthRoutes from "./routes/un-auth-routes";
import NotificationComponent from "@/components/NotificationComponent";

function App() {
    const [isLogin, setIslogin] = useState(AuthStore.getAccessToken());

    useEffect(() => {
        const t = AuthStore.State.getState().userInfo;
        if (!t) {
            setIslogin(null);
        }
        console.log(isLogin);
    }, [isLogin]);

    const client = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    });

    return (
        <>
            <QueryClientProvider client={client}>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <div className="relative h-full font-cairo">
                        <BrowserRouter>
                            {isLogin ? (
                                <>
                                    <AuthRoutes />
                                    <NotificationComponent />
                                </>
                            ) : (
                                <UnAuthRoutes />
                            )}
                        </BrowserRouter>
                    </div>
                </ThemeProvider>
                <ToastContainer />
            </QueryClientProvider>
        </>
    );
}

export default App;
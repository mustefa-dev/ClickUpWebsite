import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/theme-provider";
import { AuthStore } from "@/utils/authStore";
import AuthRoutes from "@/routes/auth-routes";
import UnAuthRoutes from "./routes/un-auth-routes";
import NotificationComponent from "@/components/NotificationComponent";

function App() {
    const [connection, setConnection] = useState(null);
    const [isLogin, setIslogin] = useState(AuthStore.getAccessToken());

    const client = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    });

    return (
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
        </QueryClientProvider>
    );
}

export default App;

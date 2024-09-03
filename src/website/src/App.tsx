import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import * as signalR from "@microsoft/signalr";

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

    useEffect(() => {
        const requestNotificationPermission = async () => {
            if (Notification.permission !== "granted") {
                await Notification.requestPermission();
            }
        };

        requestNotificationPermission();

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5194/ticketsHub", { withCredentials: true })
            .build();

        connection.start()
            .then(() => {
                console.log("Connected to the SignalR hub");
            })
            .catch(err => {
                console.error("Error connecting to the SignalR hub:", err);
            });

        connection.on("NewTicket", (ticket) => {
            if (Notification.permission === "granted") {
                new Notification("New Ticket", {
                    body: JSON.stringify(ticket),
                });
            }
        });

        return () => {
            connection.stop().then(() => console.log("Disconnected from the SignalR hub"));
        };
    }, []);

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
            </QueryClientProvider>
        </>
    );
}
export default App;

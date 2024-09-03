import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
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

    useEffect(() => {
        const userInfo = AuthStore.State.getState().userInfo;
        setIslogin(userInfo);

        if (userInfo) {
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5194/ticketsHub", { withCredentials: true })
                .build();

            newConnection.start()
                .then(() => {
                    console.log("Connected to the SignalR hub");

                    // Join the group with the user's ID
                    if (userInfo.id) {
                        newConnection.invoke("JoinGroup", userInfo.id);
                    }

                    setConnection(newConnection);
                })
                .catch(err => {
                    console.error("Error connecting to the SignalR hub:", err);
                });

            newConnection.on("NewTicket", (ticket) => {
                if (Notification.permission === "granted") {
                    new Notification("New Ticket", {
                        body: JSON.stringify(ticket),
                    });
                }
            });
        }

        return () => {
            if (connection) {
                connection.stop().then(() => console.log("Disconnected from the SignalR hub"));
            }
        };
    }, [isLogin]);

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

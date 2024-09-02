import React, { useEffect } from "react";
import { AuthStore } from "@/utils/authStore";

const NotificationComponent: React.FC = () => {
    const userId = AuthStore.State.getState().userInfo.id;

    useEffect(() => {
        const socket = new WebSocket(`ws://192.168.230.137:5194/ws?userId=${userId}`);

        socket.onmessage = (event) => {
            const notificationData = JSON.parse(event.data);
            if (Notification.permission === "granted") {
                new Notification(notificationData.title, {
                    body: notificationData.message,
                });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then((permission) => {
                    if (permission === "granted") {
                        new Notification(notificationData.title, {
                            body: notificationData.message,
                        });
                    }
                });
            }
        };

        return () => {
            socket.close();
        };
    }, [userId]);

    return ;
};

export default NotificationComponent;
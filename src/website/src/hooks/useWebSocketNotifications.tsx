import { useEffect } from "react";

const useWebSocketNotifications = (userId: string) => {
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
};

export default useWebSocketNotifications;
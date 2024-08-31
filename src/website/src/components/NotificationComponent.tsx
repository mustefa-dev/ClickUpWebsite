import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { AuthStore } from '@/utils/authStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Notification {
    title: string;
    message: string;
}

const NotificationComponent: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const accessToken = AuthStore.getAccessToken();

    useEffect(() => {
        if (!accessToken) {
            console.error('User not authenticated');
            return;
        }

        const connect = async () => {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl('http://192.168.86.137:5194/notifications', {
                    accessTokenFactory: () => accessToken,
                })
                .withAutomaticReconnect()
                .build();

            connection.on('ReceiveNotification', (notification: Notification) => {
                setNotifications((prevNotifications) => [...prevNotifications, notification]);
                toast(`${notification.title}: ${notification.message}`);
            });

            connection.on('TicketAssigned', (event: { TicketTitle: string }) => {
                const notification: Notification = {
                    title: 'New Ticket Assigned',
                    message: `You have been assigned a new ticket: ${event.TicketTitle}`
                };
                setNotifications((prevNotifications) => [...prevNotifications, notification]);
                toast(`${notification.title}: ${notification.message}`);
            });

            connection.onclose((error) => {
                console.error('SignalR Connection Error: ', error);
                setTimeout(connect, 5000); // Retry connection after 5 seconds
            });

            try {
                await connection.start();
                console.log('SignalR Connection Established');
            } catch (err) {
                console.error('SignalR Connection Error: ', err);
                setTimeout(connect, 5000); // Retry connection after 5 seconds
            }
        };

        connect();

        return () => {
            connection.stop().catch((err) => console.error('SignalR Disconnection Error: ', err));
        };
    }, [accessToken]);

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>
                        <strong>{notification.title}</strong>: {notification.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationComponent;
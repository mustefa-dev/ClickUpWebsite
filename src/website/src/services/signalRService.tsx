import { AuthStore } from "@/utils/authStore";

class WebSocketService {
    private socket: WebSocket | null = null;
    private url: string = "ws://192.168.86.137:5194/ws";
    private reconnectInterval: number = 5000;

    public startConnection = () => {
        const userInfo = AuthStore.getUserInfo();
        if (!userInfo) {
            console.error("User not logged in");
            return;
        }

        const userId = userInfo.id;
        this.socket = new WebSocket(`${this.url}?userId=${userId}`);

        this.socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleNotification(data.title, data.message);
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed, attempting to reconnect...");
            setTimeout(this.startConnection, this.reconnectInterval);
        };
    };

    private handleNotification = (title: string, message: string) => {
        // Implement your notification handling logic here
        console.log(`Notification received: ${title} - ${message}`);
    };

    public addNotificationListener = (callback: (title: string, message: string) => void) => {
        this.handleNotification = callback;
    };
}

export default new WebSocketService();
// src/website/src/services/TaskService.ts
import axios from 'axios';

class TaskService {
    private static API_BASE_URL = 'http://localhost:5272/api/clickup';

    static async fetchTasks(accessToken: string) {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/fetchtasks`, {
                params: { accessToken },
                headers: { 'accept': '*/*' }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }
}

export default TaskService;
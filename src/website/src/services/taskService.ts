// src/services/TaskService.ts
import axios, { AxiosRequestConfig } from 'axios';
import {BASE_URL} from "../../../config";

class TaskService {
    static async fetchTasks(accessToken: string) {
        try {
            const response = await axios.get(`${BASE_URL}/fetchtasks`, {
                params: { accessToken },
                headers: { 'accept': '*/*' }
            } as AxiosRequestConfig);
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }
}

export default TaskService;
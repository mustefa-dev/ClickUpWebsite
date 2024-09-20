// apiService.ts
import axios from 'axios';
import { Task } from '@/types/types';

interface AuthResponse {
    accessToken: string;
    tasks: Task[];
}

export const fetchAccessTokenAndTasks = async (code: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/api/auth', { code });
    return response.data;
};
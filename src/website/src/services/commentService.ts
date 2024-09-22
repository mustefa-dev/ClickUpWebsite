// src/services/CommentService.ts
import axios from 'axios';
import { BASE_URL } from '../../../config';

class CommentService {
    static async fetchComments(taskId: string) {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Access token not found');
            const response = await axios.get(`${BASE_URL}/getcomments`, {
                params: { taskId, accessToken }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    }

    static async addComment(taskId: string, commentText: string) {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Access token not found');
            const response = await axios.post(`${BASE_URL}/addcomment`,
                { commentText },
                {
                    params: { taskId, accessToken },
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json-patch+json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    }
}

export default CommentService;
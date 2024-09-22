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

    static async addComment(taskId: string, commentText: string, attachment?: File) {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) throw new Error('Access token not found');

            const formData = new FormData();
            if (attachment) {
                formData.append('attachment', attachment);
            }

            const response = await axios.post(`${BASE_URL}/addcomment`, formData, {
                params: { taskId, accessToken, commentText },
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 400) {
                return { validationErrors: error.response.data.errors };
            }
            console.error('Error adding comment:', error);
            throw error;
        }
    }
}

export default CommentService;
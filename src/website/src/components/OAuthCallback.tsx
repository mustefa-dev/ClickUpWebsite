// src/components/OAuthCallback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/authStore';
import {BASE_URL} from "../../../config";

const OAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const { setAccessToken, setTasks } = useAuthStore();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');

        if (code) {
            fetchAccessTokenAndTasks(code);
        } else {
            navigate('/');
        }
    }, [navigate, setAccessToken, setTasks]);

    const fetchAccessTokenAndTasks = async (code: string) => {
        try {
            const response = await fetch(`${BASE_URL}/Callback?code=${code}`);
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            setAccessToken(data.accessToken);
            setTasks(data.tasks);
            navigate('/tasks');
        } catch (error) {
            console.error(error);
            navigate('/');
        }
    };

    return <div>Loading...</div>;
};

export default OAuthCallback;
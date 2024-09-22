// src/website/src/components/LoginPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/authStore';
import {BASE_URL} from "../../../config";

const CLIENT_ID = 'SHBUK5OCBOJ4AH44XUUTJNFH5Y66BYWB';
const REDIRECT_URI = 'http://localhost:3002/oauth/callback';
// const API_BASE_URL = 'https://mustefa.co/api/ClickUp';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { accessToken, setAccessToken, setTasks } = useAuthStore();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');

        if (code) {
            fetchAccessTokenAndTasks(code);
        } else if (accessToken) {
            navigate('/tasks');
        }
    }, [accessToken, navigate, setAccessToken, setTasks]);

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
        }
    };

    const handleSignIn = () => {
        const authUrl = `https://app.clickup.com/api?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = authUrl;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-6">ClickUp OAuth Example</h1>
            {accessToken ? (
                <p>Welcome! You are logged in.</p>
            ) : (
                <button onClick={handleSignIn} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Sign in with ClickUp
                </button>
            )}
        </div>
    );
};

export default LoginPage;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const CLIENT_ID = 'SHBUK5OCBOJ4AH44XUUTJNFH5Y66BYWB';
const REDIRECT_URI = 'http://localhost:3002/oauth/callback';
const API_BASE_URL = 'http://localhost:5272/api/ClickUp';

const App: React.FC = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionKey, setSessionKey] = useState<string | null>(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');
        if (code) {
            fetchAccessTokenAndTasks(code);
        }
    }, []);

    const fetchAccessTokenAndTasks = async (code: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/Callback?code=${code}`);
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Failed to fetch data");
            }
            const data = await response.json();

            // Log the full response to inspect field names
            console.log("API Response:", data);

            // Update with correct field names (Assuming response contains 'accessToken' and 'tasks')
            setAccessToken(data.accessToken); // Ensure 'accessToken' matches API response field
            setTasks(data.tasks); // Ensure 'tasks' matches API response field
            setSessionKey(data.sessionKey); // Assuming 'sessionKey' is returned from API
        } catch (err: any) {
            setError(err.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = () => {
        const authUrl = `https://app.clickup.com/api?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = authUrl;
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-6">ClickUp OAuth Example</h1>
                {accessToken ? (
                    <div className="container mx-auto p-4">
                        <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
                        <p className="mb-2">You have successfully logged in.</p>
                        <p className="mb-6">Your access token: <span className="font-mono text-blue-600">{accessToken}</span></p>

                        {loading && <p>Loading tasks...</p>}
                        {error && <p className="text-red-500">Error: {error}</p>}

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {tasks.length > 0 ? tasks.map(task => (
                                <div key={task.id} className="bg-white shadow-md rounded-lg p-6">
                                    <h3 className="text-xl font-bold mb-2">{task.name}</h3>
                                    <p className="text-gray-600 mb-4">{task.description || "No description available."}</p>
                                    <p className="text-gray-500">Status: <span className="font-semibold">{task.status?.status}</span></p>
                                </div>
                            )) : <p>No tasks available</p>}
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleSignIn}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign in with ClickUp
                    </button>
                )}
            </div>
        </Router>
    );
};

export default App;

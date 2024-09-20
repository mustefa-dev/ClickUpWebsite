import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

const CLIENT_ID = 'SHBUK5OCBOJ4AH44XUUTJNFH5Y66BYWB';
const REDIRECT_URI = 'http://localhost:5272/api/ClickUp/Callback';

const App: React.FC = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get('access_token');
        if (token) {
            setAccessToken(token);
            localStorage.setItem('access_token', token);
        }
    }, []);

    const handleSignIn = () => {
        const authUrl = `https://app.clickup.com/api?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = authUrl;
    };

    const fetchTasks = async () => {
        if (!accessToken) return;

        setLoading(true);
        try {
            const response = await axios.get('https://api.clickup.com/api/v2/task', {
                headers: {
                    Authorization: accessToken,
                },
            });
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [accessToken]);

    return (
        <Router>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">ClickUp OAuth Example</h1>
                <Routes>
                    <Route path="/" element={accessToken ? <Navigate to="/tasks" /> : <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded">Sign in with ClickUp</button>} />
                    <Route path="/tasks" element={accessToken ? (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
                            {loading ? (
                                <p>Loading tasks...</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {tasks.map(task => (
                                        <div key={task.id} className="bg-white border rounded-lg shadow p-4">
                                            <h3 className="font-bold text-lg">{task.name}</h3>
                                            <p className="text-gray-600">Status: {task.status}</p>
                                            {/* Add more task details as needed */}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <Navigate to="/" />
                    )} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

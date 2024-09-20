import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/authStore';
import LoginPage from '@/components/LoginPage';
import TaskListPage from '@/components/TaskListPage';
import OAuthCallback from "@/components/OAuthCallback";

const ProtectedRoute: React.FC = ({ children }) => {
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        if (!accessToken) {
            navigate('/');
        }
    }, [accessToken, navigate]);

    return <>{children}</>;
};


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/tasks" element={<TaskListPage />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} /> {/* Add this route */}
            </Routes>
        </Router>
    );
};

export default App;


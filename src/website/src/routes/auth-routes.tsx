// src/website/src/routes/auth-routes.tsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from '@/layout/main-layout';
import TaskListPage from '@/components/TaskListPage';

const AuthRoutes = () => {
    return (
        <React.Suspense fallback={<p>Loading...</p>}>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route path="/tasks" element={<TaskListPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </React.Suspense>
    );
};

export default AuthRoutes;
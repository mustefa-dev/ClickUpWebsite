// src/website/src/routes/un-auth-routes.tsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/authStore';
import LoginPage from '@/components/LoginPage';
import OAuthCallback from '@/components/OAuthCallback';

const UnAuthRoutes = () => {
    const accessToken = useAuthStore((state) => state.accessToken);

    return (
        <React.Suspense fallback={<p>Loading...</p>}>
            <Routes>
                {accessToken ? (
                    <Route path="*" element={<Navigate to="/tasks" />} />
                ) : (
                    <>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/oauth/callback" element={<OAuthCallback />} />
                    </>
                )}
            </Routes>
        </React.Suspense>
    );
};

export default UnAuthRoutes;
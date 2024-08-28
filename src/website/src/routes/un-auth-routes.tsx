import LoginView from "@/pages/auth/loginView";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const UnAuthRoutes = () => {
    return (
        <React.Suspense>
            <Routes>
                <Route path="/" element={<LoginView />} />
                <Route path="/login" element={<LoginView />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </React.Suspense>
    );
};

export default UnAuthRoutes;

import MainLayout from "@/layout/main-layout";
import CompanyPage from "@/pages/company/company-page";
import SubscriptionPage from "@/pages/company/subscription-page";
import UpdateCompanyPage from "@/pages/company/update-company-page";
import HomePage from "@/pages/home/home-page";
import AddUserPage from "@/pages/user/add-user-page";
import UpdateUserPage from "@/pages/user/update-user-page";
import UserPage from "@/pages/user/user-page";
import UsersPage from "@/pages/user/users-page";
import React from "react";
import { Navigate ,Route, Routes } from "react-router-dom";
import SectionUsersPage from "@/pages/section/section-users-page";
import TicketPage from "@/pages/ticket/ticket-page";
import MyTicketPage from "@/pages/ticket/my-ticket";
import TicketDetailsPage from "@/pages/ticket/ticket-details";

const AuthRoutes = () => {
    return (
        <React.Suspense fallback={<p>Loading...</p>}>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="/companies/:id" element={<CompanyPage />} />
                    <Route path="/companies/:id/subscription" element={<SubscriptionPage />} />
                    <Route path="/companies/:id/update" element={<UpdateCompanyPage /> } />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/user/:id" element={<UserPage /> } />
                    <Route path="/sections/:sectionId/users" element={<SectionUsersPage />} />
                    <Route path="/users/add" element={<AddUserPage /> } />
                    <Route path="/users/:id/update" element={<UpdateUserPage /> } />
                    <Route path="/tickets" element={<TicketPage /> } />
                    <Route path="/my-tickets" element={<MyTicketPage /> } />

                </Route>
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
        </React.Suspense>
    );
};
export default AuthRoutes;

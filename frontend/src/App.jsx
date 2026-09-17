import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Homepage from "./pages/Homepage.jsx"
import SandBox from "./pages/SandBox.jsx"
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ArtisanDashboard from "./pages/ArtisanDashboard.jsx";
import ArtisanProfilePage from "./pages/ArtisanProfilePage.jsx";
import WalletPage from "./pages/WalletPage.jsx";
import MyRequestsPage from "./pages/MyRequestsPage.jsx";
import AccountSettingsPage from "./pages/AccountSettingsPage.jsx";
import ComplaintsPage from "./pages/ComplaintsPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import CategorySearchResultsPage from "./pages/CategorySearchResultsPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import FlexMatchPage from "./pages/FlexMatchPage.jsx";
import FlexRequestFormPage from "./pages/FlexRequestFormPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import ServiceRequestPage from "./pages/ServiceRequestPage.jsx";
import NotFound from "./pages/NotFound.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import "./styles/global.css"

const App = () => {
    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/provider-dashboard" element={<ArtisanDashboard />} />
                        <Route path="/artisans/:artisanId" element={<ArtisanProfilePage />} />
                        <Route path="/wallet" element={<WalletPage />} />
                        <Route path="/my-requests" element={<MyRequestsPage />} />
                        <Route path="/settings" element={<AccountSettingsPage />} />
                        <Route path="/complaints" element={<ComplaintsPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/search" element={<CategorySearchResultsPage />} />
                        <Route path="/chat/:chatId" element={<ChatPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/flex-match" element={<FlexMatchPage />} />
                        <Route path="flex-request" element={<FlexRequestFormPage />} />
                        <Route path="/review/:artisanId" element={<ReviewPage />} />
                        <Route path="/service-request" element={<ServiceRequestPage />} />
                        <Route path="*" element={<Navigate to="/" replace/>} />

                        {import.meta.env.DEV && (
                            <Route path="/sandbox" element={<SandBox />} />
                        )}
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>

    );
};

export default App;
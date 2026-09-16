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

import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/global.css"

const App = () => {
    return (
        <AuthProvider>
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
                    <Route path="/chat/:chatId" element={<ChatPage/>} />

                    {import.meta.env.DEV && (
                        <Route path="/sandbox" element={<SandBox />} />
                    )}
                </Routes>
            </BrowserRouter>
        </AuthProvider>

    );
};

export default App;
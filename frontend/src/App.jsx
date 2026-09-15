import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css"

import Homepage from "./pages/Homepage.jsx"
import SandBox from "./pages/SandBox.jsx"
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ArtisanDashboard from "./pages/ArtisanDashboard.jsx";
import ArtisanProfilePage from "./pages/ArtisanProfilePage.jsx";
import WalletPage from "./pages/WalletPage.jsx";
import MyRequestsPage from "./pages/MyRequestsPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

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
                    <Route path="/my-requests" element={<MyRequestsPage/>} />

                    {import.meta.env.DEV && (
                        <Route path="/sandbox" element={<SandBox />} />
                    )}
                </Routes>
            </BrowserRouter>
        </AuthProvider>

    );
};

export default App;
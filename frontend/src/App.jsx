import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css"

import Homepage from "./pages/Homepage.jsx"
import SandBox from "./pages/SandBox.jsx"
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ArtisanDashboard from "./pages/ArtisanDashboard.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/provider-dashboard" element={<ArtisanDashboard />} />


                {import.meta.env.DEV && (
                    <Route path="/sandbox" element={<SandBox />} />
                )}
            </Routes>
        </BrowserRouter>
    );
};

export default App;
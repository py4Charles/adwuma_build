import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css"

import ArtisanCard from "./components/ArtisanCard"
import Homepage from "./pages/Homepage.jsx"

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/card" element={<ArtisanCard />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
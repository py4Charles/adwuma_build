import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/components.css";
import { useToast } from "../context/ToastContext.jsx";

const FlexMatchPage = () => {
    const navigate = useNavigate();
    const [matchStatus, setMatchStatus] = useState("searching"); // 'searching' | 'found'
    const { addToast } = useToast();

    useEffect(() => {
        // Simulate finding a match after 4.5 seconds
        const timer = setTimeout(() => {
            setMatchStatus("found");
            addToast("A professional just accepted your request!", "success");
        }, 4500);

        return () => clearTimeout(timer);
    }, []);

    return (

    );
};
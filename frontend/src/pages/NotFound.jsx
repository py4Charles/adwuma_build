import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/components.css";

const NotFound = () => {
    return (
        <div className="page">
            <Navbar />
            <div>
                <h3>Page Not Found</h3>
                <p></p>
            </div>


            <Footer />
        </div>
    );
};

export default NotFound;
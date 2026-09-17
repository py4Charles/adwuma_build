import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/components.css";

const NotFound = () => {
    return (
        <div className="page">
            <Navbar />
            <main className="notfound-container">
                <div className="notfound-content">
                    <h1 className="notfound-code"> 404 </h1>
                    <h3 className="notfound-title"> Page not Found </h3>
                    <p className="notfound-message">
                        Sorry, we couldn't find the page you're searching for... <br />
                        It may have been moved, deleted or never existed
                    </p>

                    <div className="notfound-actions">
                        <Link to={"/"} className="btn-primary">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NotFound;
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import HeroSection from "../components/HeroSection.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import Counter from "../components/common/Counter.jsx";
import "../styles/utils.css"
import "../styles/categories.css"

const Homepage = () => {
    return (
        <div className="page">
            <Navbar />

            <main className="page-content" style={{ maxWidth: '1440px', paddingBottom: '0' }}>
                <HeroSection />

                <section style={{ padding: "80px 20px", textAlign: "center" }}>

                    <h2 style={{ fontSize: "2.5rem", marginBottom: "12px", color: "var(--color-text-main)" }}>
                        How It <span style={{ color: "var(--color-gold)" }}>Works</span>
                    </h2>
                </section>
            </main>
        </div>
    );
};
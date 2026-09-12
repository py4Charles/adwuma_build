import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import engineerHero from "../assets/engineer_hero.png";

const HeroSection = () => {
    return (
        <section className="hero-section">
            <div className="hero-bg-wrapper">
                <img src={engineerHero} alt="Professional Engineer" className="hero-bg-img" />
                <div className="hero-overlay"></div>

                {/* Abstract Background Accents */}
                <div className="hero-blob blob-1"></div>
                <div className="hero-blob blob-2"></div>
                <div className="hero-blob blob-3"></div>
                <div className="hero-grid-pattern"></div>
            </div>
        </section>
    );
};

export default HeroSection;
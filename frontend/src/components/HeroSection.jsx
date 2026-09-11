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
            </div>
        </section>
    );
};

export default HeroSection;
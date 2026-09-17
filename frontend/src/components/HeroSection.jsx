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
            <div className="hero-content">
                <div className="hero-badge-premium">
                    <div className="badge-shimmer"></div>
                    <span className="badge-icon">✨</span>
                    <span className="badge-text">The New Standard for Artisans</span>
                </div>

                <h1 className="hero-title">
                    Connecting Customers with<br />
                    <span className="gold-gradient-text">Skilled Artisans</span>
                </h1>

                <p className="hero-description">
                    Experience the most reliable marketplace for vetted professionals.
                    Post jobs in seconds and hire with confidence.
                </p>

                <div className="hero-buttons">
                    <Link to="/login" className="btn-premium primary">
                        <span>Get Started</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </Link>
                    <Link to="/about" className="btn-premium secondary">
                        Learn More
                    </Link>
                </div>

                {/* Feature Micro-Chips */}
                <div className="feature-chips">
                    <div className="chip">
                        <span className="chip-dot"></span>
                        Verified Pros
                    </div>
                    <div className="chip">
                        <span className="chip-dot"></span>
                        Secure Escrow
                    </div>
                    <div className="chip">
                        <span className="chip-dot"></span>
                        24/7 Support
                    </div>
                </div>
            </div>

            {/* Modern Decor Accents */}
            <div className="hero-visual-accents">
                <div className="accent-line"></div>
                <div className="accent-circle"></div>
            </div>
        </section>
    );
};

export default HeroSection;
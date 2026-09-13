import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import HeroSection from "../components/HeroSection.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import Counter from "../components/common/Counter.jsx";
import logo from "../assets/icon.png"
import "../styles/utils.css"
import "../styles/categories.css"

const Homepage = () => {
    return (
        <div className="page">
            <Navbar />

            <main className="page-content" style={{ maxWidth: '1440px', paddingBottom: '0' }}>
                <HeroSection />

                <section style={{ padding: "80px 20px", textAlign: "center" }}>

                    <h2 style={{ fontSize: "3rem", marginBottom: "12px", color: "var(--color-text-main)" }}>
                        Adwuma <span style={{ color: "var(--color-gold)" }}>works</span> when we come <span style={{ color: "var(--color-gold)" }}>Together.</span>
                    </h2>

                    <p style={{ color: "var(--color-text-muted)", marginBottom: "50px" }}>
                        Getting the <span style={{ color: "var(--color-gold)" }}>right</span> person for the <span style={{ color: "var(--color-gold)" }}>right</span> job becomes simple and fast.
                    </p>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 500px))",
                        maxWidth: "1000px",
                        margin: "0 auto 50px auto",
                        verticalAlign: ""
                    }}>

                        <img src={logo} alt="Adwuma logo" />

                        <p style={{ color: "var(--color-text-dim)", marginLeft: "-100px" }}>
                            <span style={{ fontSize: "50px", }}>A</span>dwuma is an initiative by the Motion group of companies. Mainly made
                            to link customers with very well-known and approved workmen that know
                            what their about Adwuma is an initiative by the Motion group of companies.
                            Adwuma is an initiative by the Motion group of companies. Adwuma is an
                            initiative by the Motion group of companies.Adwuma is an initiative by the
                            Motion group of companies. Adwuma is an initiative by the Motion group of companies.
                            Adwuma is an initiative by the Motion group of companies. Mainly made
                            to link customers with very well-known and approved workmen that know
                            what their about Adwuma is an initiative by the Motion group of companies.
                            Adwuma is an initiative by the Motion group of companies. Adwuma is an
                            initiative by the Motion group of companies.Adwuma is an initiative by the
                            Motion group of companies. Adwuma is an initiative by the Motion group of companies.
                            Adwuma is an initiative by the Motion group of companies. Mainly made
                            to link customers with very well-known and approved workmen that know
                            what their about Adwuma is an initiative by the Motion group of companies.
                            Adwuma is an initiative by the Motion group of companies. Adwuma is an
                            initiative by the Motion group of companies.Adwuma is an initiative by the
                            Motion group of companies. Adwuma is an initiative by the Motion group of companies.
                        </p>
                    </div>

                    <h2 style={{ fontSize: "3rem", marginBottom: "12px", color: "var(--color-text-main)" }}>
                        How It <span style={{ color: "var(--color-gold)" }}>works</span>
                    </h2>

                    <p style={{ color: "var(--color-text-muted)", marginTop: "-10px" }}>
                        Getting the <span style={{ color: "var(--color-gold)" }}>right</span> person for the <span style={{ color: "var(--color-gold)" }}>right</span> job becomes simple and fast.
                    </p>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
                        gap: "30px",
                        maxWidth: "900px",
                        margin: "0 auto"
                    }}>

                        <div className="how-it-works" style={{ background: "var(--color-surface-2)", padding: "30px", borderRadius: "16px" }}>
                            <h3 style={{ marginBottom: "10px" }}>1. Post Your Job</h3>
                            <p style={{ color: "var(--color-text-dim)" }}>
                                Describe the service you need and submit your request.
                            </p>
                        </div>

                        <div className="how-it-works" style={{ background: "var(--color-surface-2)", padding: "30px", borderRadius: "16px" }}>
                            <h3 style={{ marginBottom: "10px" }}>2. Get Matched</h3>
                            <p style={{ color: "var(--color-text-dim)" }}>
                                Skilled artisans near you respond quickly.
                            </p>
                        </div>

                        <div className="how-it-works" style={{ background: "var(--color-surface-2)", padding: "30px", borderRadius: "16px" }}>
                            <h3 style={{ marginBottom: "10px" }}>3. Hire the Best</h3>
                            <p style={{ color: "var(--color-text-dim)" }}>
                                Pick the artisan of your choice for the job.
                            </p>
                        </div>
                    </div>
                </section>

                <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 16px' }}>

                    {/* Overlapping Quick Services Layout (Inspired by Telerik ref) */}
                    <section style={{
                        transform: 'translateY(-100px)',
                        position: 'relative',
                        zIndex: 10,
                        marginBottom: '-40px'
                    }}>

                    </section>

                    {/* Features Section */}
                    <section id="features" className="text-section" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '40px 0', marginBottom: '60px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-main)', marginBottom: '12px' }}>
                                Why Choose <span style={{ color: 'var(--color-gold)' }}>CraftLink?</span>
                            </h2>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
                                We provide the most reliable and seamless marketplace for connecting with top-rated local professionals instanly.
                            </p>
                        </div>

                        <div className="feature-grid">
                            <div className="feature-item" style={{ textAlign: 'center', padding: '32px 24px' }}>
                                <span className="feature-icon" style={{ fontSize: '3rem', margin: '0 auto 20px', background: 'rgba(212, 175, 55, 0.1)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'var(--color-gold)' }}>🛡️</span>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: 'var(--color-text-main)' }}>Vetted Professionals</h3>
                                <p style={{ color: 'var(--color-text-dim)', lineHeight: '1.6' }}>Every artisan undergoes a strict review process to ensure top-tier quality and safety.</p>
                            </div>

                            <div className="feature-item" style={{ textAlign: 'center', padding: '32px 24px' }}>
                                <span className="feature-icon" style={{ fontSize: '3rem', margin: '0 auto 20px', background: 'rgba(212, 175, 55, 0.1)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'var(--color-gold)' }}>⚡</span>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: 'var(--color-text-main)' }}>Instant Booking</h3>
                                <p style={{ color: 'var(--color-text-dim)', lineHeight: '1.6' }}>Request exactly what you need in seconds with our CraftLink Flex engine.</p>
                            </div>

                            <div className="feature-item" style={{ textAlign: 'center', padding: '32px 24px' }}>
                                <span className="feature-icon" style={{ fontSize: '3rem', margin: '0 auto 20px', background: 'rgba(212, 175, 55, 0.1)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'var(--color-gold)' }}>⭐</span>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: 'var(--color-text-main)' }}>Community Driven</h3>
                                <p style={{ color: 'var(--color-text-dim)', lineHeight: '1.6' }}>Make decisions based on honest, verified reviews from real customers near you.</p>
                            </div>
                        </div>

                        {/* TRUST STATS BAR (ANIMATED) */}
                        <div className="stats-bar" style={{ marginTop: '80px', marginBottom: '0' }}>
                            <div className="stat-item">
                                <span className="stat-number">
                                    <Counter end={500} suffix="+" />
                                </span>
                                <span className="stat-label">Vetted Artisans</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">
                                    <Counter end={10000} suffix="+" />
                                </span>
                                <span className="stat-label">Services Done</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">
                                    <Counter end={4.9} duration={2500} suffix="/5" />
                                </span>
                                <span className="stat-label">Average Rating</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Homepage;
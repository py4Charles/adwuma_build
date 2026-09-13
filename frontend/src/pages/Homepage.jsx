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
            </main>

            <Footer />
        </div>
    );
};

export default Homepage;
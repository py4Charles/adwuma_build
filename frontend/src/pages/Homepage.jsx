import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import HeroSection from "../components/HeroSection.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import Counter from "../components/common/Counter.jsx";

import logo from "../assets/icon.png"
import profile01 from "../assets/profile-pics/profile-01.png";
import profile02 from "../assets/profile-pics/profile-02.png";
import profile03 from "../assets/profile-pics/profile-03.png";
import profile04 from "../assets/profile-pics/profile-04.png";
import profile05 from "../assets/profile-pics/profile-05.png";
import profile06 from "../assets/profile-pics/profile-06.png";

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
                        Adwuma <span style={{ color: "var(--color-blue-light)" }}>works</span> when we come <span style={{ color: "var(--color-blue-light)" }}>Together.</span>
                    </h2>

                    <p style={{ color: "var(--color-text-muted)", marginBottom: "50px" }}>
                        Getting the <span style={{ color: "var(--color-blue-light)" }}>right</span> person for the <span style={{ color: "var(--color-blue-light)" }}>right</span> job becomes simple and fast.
                    </p>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))",
                        gap: "2.5rem",                
                        maxWidth: "1200px",
                        margin: "0px 0px 50px 0px",
                    }}>

                        <img src={logo} alt="Adwuma logo" className="homepage-logo"/>

                        <p style={{ color: "var(--color-text-dim)", marginLeft: "20px" }}>
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

                {/* TESTIMONIALS SECTION (ADDED 6 REVIEWS) */}
                <section className="testimonials-section">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text-main)', marginBottom: '12px' }}>
                            Why Trust <span style={{ color: 'var(--color-gold)' }}>Us</span>
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                            Real stories from real customers and professionals on Adwuma.
                        </p>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <img src={profile01} alt="profile-pic-Adobea" style={{ borderRadius: "10px" }} />
                            <div className="testimonial-rating">★★★★</div>
                            <p className="testimonial-content">
                                The best way to find a plumber in Accra. Fast and reliable service every time.
                            </p>
                            <div className="testimonial-author">
                                <div className="author-info">
                                    <h4>Adobea M.</h4>
                                    <p>East Legon, ACC</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <img src={profile02} alt="profile-pic-Kofi" style={{ borderRadius: "10px" }} />
                            <div className="testimonial-rating">★★★★★</div>
                            <p className="testimonial-content">
                                Found an amazing electrician within minutes. CraftLink is a lifesaver for home emergencies!
                            </p>
                            <div className="testimonial-author">
                                <div className="author-info">
                                    <h4>Kofi B.</h4>
                                    <p>Kumasi, ASH</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <img src={profile03} alt="profile-pic-Sarah" style={{ borderRadius: "10px" }} />
                            <div className="testimonial-rating">★★★★★</div>
                            <p className="testimonial-content">
                                Quality artisans are hard to find, but CraftLink makes it easy. I'll never go back to random calls.
                            </p>
                            <div className="testimonial-author">
                                <div className="author-info">
                                    <h4>Sarah E.</h4>
                                    <p>Osu, ACC</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <img src={profile04} alt="profile-pic-John" style={{ borderRadius: "10px" }} />
                            <div className="testimonial-rating">★★★★★</div>
                            <p className="testimonial-content">
                                I used the Flex service for a quick cleaning job and it was perfect. The matching was spot on.
                            </p>
                            <div className="testimonial-author">
                                <div className="author-info">
                                    <h4>John D.</h4>
                                    <p>Cantonments, ACC</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <img src={profile05} alt="profile-pic-Ama" style={{ borderRadius: "10px" }} />
                            <div className="testimonial-rating">★★★★★</div>
                            <p className="testimonial-content">
                                Transparent pricing and verified reviews gave me peace of mind when hiring for my office setup.
                            </p>
                            <div className="testimonial-author">
                                <div className="author-info">
                                    <h4>Ama K.</h4>
                                    <p>Tema, GHA</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <img src={profile06} alt="profile-pic-Emmanuel" style={{ borderRadius: "10px" }} />
                            <div className="testimonial-rating">★★★★★</div>
                            <p className="testimonial-content">
                                A game changer for local professionals. I've grown my business significantly since joining.
                            </p>
                            <div className="testimonial-author">
                                <div className="author-info">
                                    <h4>Emmanuel T.</h4>
                                    <p>Professional Painter</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Homepage;
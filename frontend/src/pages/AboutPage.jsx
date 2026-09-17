import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/utils.css";

const AboutPage = () => {
    return (
        <div className="page">
            <Navbar />
            <main className="page-content" style={{ maxWidth: '1000px', paddingBottom: '80px' }}>
                <div className="text-header" style={{maxWidth: '1200px'}}>
                    <h1>About <span>Adwuma</span></h1>
                    <p>Elevating the standard of service connections.</p>
                </div>

                <section className="text-section">
                    <h2>Our Mission</h2>
                    <p>
                        At CraftLink, our mission is to build a reliable and seamless marketplace where
                        skilled artisans and everyday customers can connect. We believe that finding a reliable
                        plumber, a creative digital marketer, or an expert electrician shouldn't be a gamble.
                    </p>
                    <p>
                        We empower local professionals by providing them with a platform to showcase their
                        talents, while ensuring customers receive premium, fully-vetted service right at their doorstep.
                    </p>
                </section>

                <section className="text-section">
                    <h2>Why Choose Us?</h2>
                    <div className="feature-grid">
                        <div className="feature-item">
                            <span className="feature-icon">🛡️</span>
                            <h3>Vetted Professionals</h3>
                            <p>Every artisan on our platform undergoes a strict review process to ensure top-tier quality.</p>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">⚡</span>
                            <h3>Instant Booking</h3>
                            <p>Use CraftLink Flex to quickly request exactly what you need in seconds.</p>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">⭐</span>
                            <h3>Community Driven</h3>
                            <p>Read honest, verified reviews from real customers in your exact neighborhood.</p>
                        </div>
                    </div>
                </section>

                <section className="text-section">
                    <h2>Get in Touch</h2>
                    <p>
                        Have questions about our platform or want to register your business as a service provider?
                    </p>
                    <a href="mailto:support@craftlink.com" className="btn-primary" style={{ display: 'inline-flex', marginTop: '16px' }}>
                        Contact Support
                    </a>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;
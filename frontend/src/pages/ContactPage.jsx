import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/utils.css";

const ContactPage = () => {
    return (
        <div className="page">
            <Navbar />
            <main className="page-content" style={{ maxWidth: '800px', paddingBottom: '80px' }}>
                <div className="text-header">
                    <h1>Contact <span>Us</span></h1>
                    <p>We're here to help you connecting with the best professionals.</p>
                </div>

                <section className="text-section">
                    <h2>Get in Touch</h2>
                    <p>
                        Have questions about our platform or want to register your business as a service provider?
                        Our support team is available to assist you.
                    </p>

                    <div style={{ marginTop: '32px', display: 'grid', gap: '20px' }}>
                        <div style={{ background: 'var(--color-surface-2)', padding: '24px', borderRadius: '16px' }}>
                            <h3 style={{ marginBottom: '8px' }}>Email Support</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>For general inquiries and support.</p>
                            <a href="mailto:support@craftlink.com" style={{ color: 'var(--color-blue)', textDecoration: 'none', fontWeight: '600', marginTop: '8px', display: 'block' }}>
                                support@adwuma.com
                            </a>
                        </div>

                        <div style={{ background: 'var(--color-surface-2)', padding: '24px', borderRadius: '16px' }}>
                            <h3 style={{ marginBottom: '8px' }}>Call Us</h3>
                            <p style={{ color: 'var(--color-text-muted)' }}>Monday - Friday, 9am - 5pm.</p>
                            <a href="tel:+1234567890" style={{ color: 'var(--color-blue)', textDecoration: 'none', fontWeight: '600', marginTop: '8px', display: 'block' }}>
                                +1 234 567 890
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
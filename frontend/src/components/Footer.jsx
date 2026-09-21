import { Link } from "react-router-dom";
import logo from "../assets/icon.png";

const Footer = () => {
    return (
        <footer className="footer" style={{
            borderTop: 'none',
            padding: '60px 24px 0px 24px',
            background: 'var(--color-surface-2)',
            color: 'var(--color-blue-light)',
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
                <div>
                    <img src={logo} alt="Adwuma Logo" className="footer-logo" />
                    <h3 style={{ color: 'var(--color-text-main)', fontSize: '40px', fontWeight: '800', marginBottom: '-20px', marginTop: '-10px' }}>Adwuma</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>
                        Connecting the best local artisans with people who value quality craftsmanship.
                    </p>
                </div>
                <div>
                    <h4 style={{ color: 'var(--color-blue-light)', marginBottom: '20px', fontWeight: '700' }}>Quick Links</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>Home</Link>
                        <Link to="/about" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>About Us</Link>
                        <Link to="/contact" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>Contact</Link>
                    </div>
                </div>
                <div>
                    <h4 style={{ color: 'var(--color-blue-light)', marginBottom: '20px', fontWeight: '700' }}>Support</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/faq" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>FAQ</Link>
                        <Link to="/terms" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>Terms of Service</Link>
                        <Link to="/privacy" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>Privacy Policy</Link>
                    </div>
                </div>

            </div>
            <div className="footer-rights">
                <p>2026 Adwuma. All rights reserved</p>
                <div className="footer-policy">
                    <p>Privacy Policy</p>
                    <p>Terms of Service</p>
                    <p>Cookie Policy</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
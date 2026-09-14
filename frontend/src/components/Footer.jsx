import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/icon.png";

const Footer = () => {
    return (
        <footer className="footer" style={{
            borderTop: 'none',
            padding: '60px 24px 0px 24px',
            background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dark) 100%)',
            color: 'var(--color-bg)',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
                <div>
                    <img src={logo} alt="Adwuma Logo" className="footer-logo" />
                    <h3 style={{ color: 'var(--color-bg)', marginBottom: '20px', fontSize: '30px', fontWeight: '800' }}>Adwuma</h3>
                    <p style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.95rem', fontWeight: '500' }}>
                        Connecting the best local artisans with people who value quality craftsmanship.
                    </p>
                </div>
                <div>
                    <h4 style={{ color: 'var(--color-bg)', marginBottom: '20px', fontWeight: '700' }}>Quick Links</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/" style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.95rem', fontWeight: '500' }}>Home</Link>
                        <Link to="/about" style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.95rem', fontWeight: '500' }}>About Us</Link>
                        <Link to="/contact" style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.95rem', fontWeight: '500' }}>Contact</Link>
                    </div>
                </div>
                <div>
                    <h4 style={{ color: 'var(--color-bg)', marginBottom: '20px', fontWeight: '700' }}>Support</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/faq" style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.95rem', fontWeight: '500' }}>FAQ</Link>
                        <Link to="/terms" style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.95rem', fontWeight: '500' }}>Terms of Service</Link>
                        <Link to="/privacy" style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.95rem', fontWeight: '500' }}>Privacy Policy</Link>
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
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import RatingStars from "../components/RatingStars.jsx";
import "../styles/component.css";

const ArtisanProfilePage = () => {
    return (
        <div className="page">
            <Navbar />

            <main className="page-content" style={{ maxWidth: '800px' }}>
                <div style={{ padding: '0 0 24px' }}>
                    <Link to="/dashboard" style={{ color: '#d4af37', fontSize: '0.9rem' }}>← Back to Dashboard</Link>
                </div>

                <div className="profile-cover">
                    <div className="profile-avatar">
                        KM
                    </div>
                </div>

                <div className="profile-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '16px' }}>
                        <div>
                            <h1 className="profile-name">Kwame Mensah</h1>
                            <div className="profile-meta">
                                <span style={{ color: '#d4af37', fontWeight: 500 }}>Electrician</span>
                                <span style={{ color: '#888' }}>📍 Accra, East Legon</span>
                                <RatingStars value={4.8} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn-secondary" onClick={() => alert('Contacting Kwame Mensah...')}>Contact</button>
                            <Link to="/service-request?artisan=Kwame+Mensah" className="btn-primary">Send Request</Link>
                        </div>
                    </div>

                    <div className="profile-section" style={{ marginTop: '32px' }}>
                        <h2 className="profile-section-title">About Kwame</h2>
                        <p className="profile-section-text">
                            Certified electrician with over 6 years of experience handling residential and small commercial projects locally. I specialize in full-house wiring, fault finding, and AC installation. Quality work guaranteed.
                        </p>
                    </div>

                    <div className="profile-section" style={{ borderBottom: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 className="profile-section-title" style={{ margin: 0 }}>Recent Reviews</h2>
                            <Link to="/review/1" style={{ color: '#d4af37', fontSize: '0.9rem' }}>Write a review</Link>
                        </div>
                        <div style={{ background: '#0a0a0a', padding: '16px', borderRadius: '12px', border: '1px solid #222' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <strong style={{ color: '#fff' }}>Sarah J.</strong>
                                <RatingStars value={5} />
                            </div>
                            <p className="profile-section-text">
                                "Very professional and on time. Fixed our power issue quickly and cleaned up after himself."
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default ArtisanProfilePage;
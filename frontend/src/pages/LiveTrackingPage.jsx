import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/components.css";

const LiveTrackingPage = ({ isEmbedded, job, onChatClick }) => {
    const navigate = useNavigate();
    const [eta, setEta] = useState(15);
    const [progress, setProgress] = useState(0); // 0 to 100

    // Simulate artisan driving towards user
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2; // Move 2% per tick
            });

            setEta((prev) => {
                if (prev <= 1) return 1;
                // Simple mock countdown sync'd roughly with progress
                return Math.max(1, 15 - Math.floor(progress / (100 / 15)));
            });
        }, 1000); // Ticks every second for demo brevity

        return () => clearInterval(interval);
    }, [progress]);

    return (
        <div className={isEmbedded ? "" : "page"}>
            {!isEmbedded && <Navbar />}
            <main className={isEmbedded ? "" : "page-content"} style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: isEmbedded ? '0 1rem' : '2rem 1rem' }}>

                {!isEmbedded && (
                    <div style={{ marginBottom: "2rem" }}>
                        <Link to="/dashboard" style={{ color: "var(--color-gold)", textDecoration: "none", fontSize: "0.9rem" }}>← Back to Dashboard</Link>
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem" }}>
                    <div>
                        <h1 style={{ fontSize: isEmbedded ? "1.8rem" : "2rem", color: "var(--color-text-main)", margin: "0 0 8px 0" }}>Live Tracking</h1>
                        <p style={{ color: "var(--color-text-muted)", margin: 0 }}>Job #{job?.id || "REQ-1029"} • {job?.service || "Plumber"}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--color-gold)", lineHeight: 1 }}>{eta}</div>
                        <div style={{ color: "var(--color-text-dim)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>Mins Away</div>
                    </div>
                </div>

                {/* MOCK MAP UI */}
                <div style={{
                    height: "350px",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "20px",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "2rem"
                }}>
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: "radial-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
                        backgroundSize: "20px 20px, 40px 40px",
                        backgroundPosition: "0 0, 10px 10px",
                        opacity: 0.8
                    }}></div>

                    <div style={{
                        position: "absolute",
                        width: "70%",
                        height: "4px",
                        background: "var(--color-border)",
                        borderRadius: "4px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            height: "100%",
                            width: `${progress}%`,
                            background: "var(--color-gold)",
                            boxShadow: "0 0 10px var(--color-gold)",
                            transition: "width 1s linear"
                        }}></div>
                    </div>

                    <div style={{
                        position: "absolute",
                        right: "15%",
                        top: "50%",
                        transform: "translate(50%, -50%)",
                        width: "24px",
                        height: "24px",
                        background: "var(--color-gold)",
                        borderRadius: "50%",
                        border: "4px solid var(--color-surface)",
                        boxShadow: "0 0 15px rgba(212, 175, 55, 0.5)",
                        zIndex: 2
                    }}></div>

                    <div style={{
                        position: "absolute",
                        left: `calc(15% + (${progress} * 0.7%))`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "40px",
                        height: "40px",
                        background: "var(--color-surface)",
                        borderRadius: "50%",
                        border: "2px solid #fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
                        zIndex: 3,
                        transition: "left 1s linear"
                    }}>
                        🚙
                    </div>
                </div>

                {/* Artisan Status Card */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-surface), var(--color-gold))', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            DO
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 4px 0', color: 'var(--color-text-main)', fontSize: '1.3rem' }}>David Osei</h3>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Toyota Corolla • GR-1234-24 • 4.9 ★</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button className="btn-secondary" style={{ width: "45px", height: "45px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => alert("Calling David...")}>📞</button>
                        <button className="btn-secondary" style={{ width: "45px", height: "45px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onChatClick}>💬</button>
                    </div>
                </div>
            </main>
            {!isEmbedded && <Footer />}
        </div>
    );
};

export default LiveTrackingPage;
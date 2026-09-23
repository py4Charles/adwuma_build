import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/components.css";
import { useToast } from "../context/ToastContext.jsx";

const FlexMatchPage = () => {
    const navigate = useNavigate();
    const [matchStatus, setMatchStatus] = useState("searching"); // 'searching' | 'found'
    const { addToast } = useToast();

    useEffect(() => {
        // Simulate finding a match after 4.5 seconds
        const timer = setTimeout(() => {
            setMatchStatus("found");
            addToast("A professional just accepted your request!", "success");
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="page" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* <Navbar /> */}

            <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>

                {matchStatus === "searching" && (
                    <div style={{ textAlign: "center" }}>
                        <h1 style={{ color: "var(--color-text-main)", marginBottom: "1rem", fontSize: "3rem" }}>Finding nearby professional...</h1>
                        <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontSize: "1rem" }}>Broadcasting your Flex request to verified artisans within 5km.</p>

                        <div className="radar-container">
                            <div className="radar-pulse"></div>
                            <div className="radar-sweep"></div>
                            <span style={{ position: "absolute", zIndex: 10, fontSize: "2rem" }}>📍</span>
                        </div>

                        <button
                            onClick={() => navigate(-1)}
                            style={{ background: "transparent", border: "1px solid #f44336", color: "#f44336", padding: "10px 24px", borderRadius: "20px", marginTop: "2rem", cursor: "pointer", transition: "all 0.2s" }}
                        >
                            Cancel Search
                        </button>
                    </div>
                )}

            </main>

            {/* Match Found Modal */}
            {matchStatus === "found" && (
                <div className="modal-overlay">
                    <div className="match-modal">
                        <h2 style={{ color: "var(--color-gold)", margin: "0 0 16px 0", fontSize: "2rem" }}>Match Found!</h2>
                        <p style={{ color: "var(--color-text-main)", marginBottom: "24px" }}>A professional has accepted your request and is ready to head over.</p>

                        <div style={{ background: "var(--color-bg)", padding: "20px", borderRadius: "16px", border: "1px solid var(--color-border)", marginBottom: "24px", textAlign: "left" }}>
                            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
                                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--color-gold)", color: "#000", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem", fontWeight: "bold" }}>
                                    DO
                                </div>
                                <div>
                                    <h3 style={{ margin: "0 0 4px 0", color: "var(--color-text-main)" }}>David Osei</h3>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ color: "var(--color-gold)" }}>★ 4.8</span>
                                        <span style={{ color: "var(--color-text-dim)" }}>• Plumber</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed var(--color-border)", paddingTop: "16px", marginTop: "8px" }}>
                                <div>
                                    <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.85rem", marginBottom: "4px" }}>Estimated Time</span>
                                    <strong style={{ color: "var(--color-text-main)", fontSize: "1.1rem" }}>15 mins</strong>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.85rem", marginBottom: "4px" }}>Distance</span>
                                    <strong style={{ color: "var(--color-text-main)", fontSize: "1.1rem" }}>2.4 km away</strong>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
                            <Link to="/chat/REQ-1099" className="btn-primary" style={{ padding: "14px", fontSize: "1.1rem" }}>
                                Message Artisan
                            </Link>
                            <Link to="/dashboard" className="btn-secondary" style={{ padding: "14px" }}>
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Hide footer while searching to make radar centered properly */}
            {matchStatus !== "searching" && <Footer />}
        </div>
    );
};

export default FlexMatchPage;
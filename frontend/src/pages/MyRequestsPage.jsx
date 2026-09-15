import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { requestsApi } from "../lib/supabase.js";
import "../styles/component.css";

const STATUS_COLORS = {
    in_progress: "#d4af37",
    completed: "#4caf50",
    cancelled: "#f44336",
    pending: "#2196f3",
};

const STATUS_LABELS = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
};


const MyRequestsPage = ({isEmbedded}) => {
    const { user } = useAuth();
    const [filter, setFilter] = useState("All");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const fetchRequests = async () => {
            setLoading(true);
            const { data, error } = await requestsApi.listMine(user.id, filter);
            if (!error) setRequests(data || []);
            setLoading(false);
        };
        fetchRequests();
    }, [user, filter]);

    const getStatusColor = (status) => STATUS_COLORS[status] || "#888";

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const artisanName = (req) => {
        if (!req.artisan?.profiles) return "Matching…";
        const p = req.artisan.profiles;
        return p.first_name ? `${p.first_name} ${p.last_name}` : p.username;
    };

    return (
        <div className={isEmbedded ? "" : "page"}>
            {!isEmbedded && <Navbar />}
            <main
                className={isEmbedded ? "" : "page-content"}
                style={{ maxWidth: "900px", margin: "0 auto", width: "100%", padding: isEmbedded ? "0" : "2rem 1rem", minHeight: isEmbedded ? "auto" : "70vh" }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: isEmbedded ? "1.8rem" : "2rem", color: "var(--color-text-main)", margin: 0 }}>
                        My Requests
                    </h1>
                    {!isEmbedded && (
                        <Link to="/service-request" className="btn-primary">
                            New Request
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem", marginBottom: "2rem", overflowX: "auto" }}>
                    {["All", "Pending", "In Progress", "Completed", "Cancelled"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                background: filter === f ? "var(--color-gold)" : "transparent",
                                color: filter === f ? "#000" : "var(--color-text-dim)",
                                border: filter === f ? "1px solid var(--color-gold)" : "1px solid var(--color-border)",
                                padding: "8px 16px",
                                borderRadius: "20px",
                                cursor: "pointer",
                                fontWeight: filter === f ? "600" : "400",
                                transition: "all 0.2s ease",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Request List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--color-text-dim)" }}>
                            Loading requests…
                        </div>
                    ) : requests.length > 0 ? (
                        requests.map((req) => (
                            <div
                                key={req.id}
                                style={{
                                    background: "var(--color-surface)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "12px",
                                    padding: "1.5rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                                    <div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                                            {req.id.slice(0, 8).toUpperCase()} • {formatDate(req.created_at)}
                                        </div>
                                        <h3 style={{ color: "var(--color-text-main)", fontSize: "1.2rem", margin: "0 0 8px 0" }}>
                                            {req.title}
                                        </h3>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ color: "var(--color-text-dim)", fontSize: "0.9rem" }}>Artisan:</span>
                                            <span style={{ color: "var(--color-text-main)", fontWeight: "500" }}>{artisanName(req)}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                                        <span
                                            style={{
                                                background: `${getStatusColor(req.status)}20`,
                                                color: getStatusColor(req.status),
                                                padding: "4px 12px",
                                                borderRadius: "12px",
                                                fontSize: "0.85rem",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {STATUS_LABELS[req.status] || req.status}
                                        </span>
                                        {req.budget_amount && (
                                            <span style={{ color: "var(--color-gold)", fontWeight: "bold", fontSize: "1.1rem" }}>
                                                GHS {Number(req.budget_amount).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {req.status === "in_progress" && (
                                    <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginTop: "0.5rem", display: "flex", gap: "1rem" }}>
                                        <Link
                                            to={`/chat/${req.id}`}
                                            className="btn-secondary"
                                            style={{ padding: "8px 16px", fontSize: "0.9rem", textDecoration: "none" }}
                                        >
                                            Message Artisan
                                        </Link>
                                    </div>
                                )}
                                {req.status === "completed" && (
                                    <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginTop: "0.5rem", display: "flex", gap: "1rem" }}>
                                        <Link
                                            to={`/review/${req.artisan_id || "1"}?request=${req.id}`}
                                            className="btn-secondary"
                                            style={{ padding: "8px 16px", fontSize: "0.9rem", textDecoration: "none" }}
                                        >
                                            Leave Review
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--color-surface)", borderRadius: "12px", border: "1px dashed var(--color-border)" }}>
                            <h3 style={{ color: "var(--color-text-main)", marginBottom: "0.5rem" }}>No requests found</h3>
                            <p style={{ color: "var(--color-text-dim)" }}>
                                {user ? "You don't have any requests matching this filter." : "Please log in to see your requests."}
                            </p>
                        </div>
                    )}
                </div>
            </main>
            {!isEmbedded && <Footer />}
        </div>
    );
};

export default MyRequestsPage;
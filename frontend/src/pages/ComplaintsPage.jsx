import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/components.css";
import { useAuth } from "../context/AuthContext.jsx";
import { ticketsApi, requestsApi } from "../lib/supabase.js";

const STATUS_COLORS = { open: "#2196f3", in_review: "#d4af37", resolved: "#4caf50" };

const ComplaintsPage = ({ isEmbedded }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("new");
    const [tickets, setTickets] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ request_id: "", subject_type: "", description: "" });

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const load = async () => {
            setLoading(true);
            const [{ data: tks }, { data: reqs }] = await Promise.all([
                ticketsApi.listMine(user.id),
                requestsApi.listMine(user.id),
            ]);
            setTickets(tks || []);
            setMyRequests(reqs || []);
            setLoading(false);
        };
        load();
    }, [user]);

    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        const { error } = await ticketsApi.create({
            customerId: user.id,
            requestId: form.request_id || null,
            subjectType: form.subject_type,
            description: form.description,
        });
        setSubmitting(false);
        if (!error) {
            setForm({ request_id: "", subject_type: "", description: "" });
            // Refresh tickets
            const { data } = await ticketsApi.listMine(user.id);
            setTickets(data || []);
            setActiveTab("history");
        } else {
            alert("Failed to submit ticket. Please try again.");
        }
    };

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const getStatusColor = (status) => STATUS_COLORS[status] || "#888";
    const getStatusLabel = (s) => s === "in_review" ? "In Review" : s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <div className={isEmbedded ? "" : "page"}>
            {!isEmbedded && <Navbar />}
            <main
                className={isEmbedded ? "" : "page-content"}
                style={{ maxWidth: "900px", margin: "0 auto", width: "100%", padding: isEmbedded ? "0" : "2rem 1rem", minHeight: isEmbedded ? "auto" : "70vh" }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <div>
                        <h1 style={{ fontSize: isEmbedded ? "1.8rem" : "2rem", color: "var(--color-text-main)", margin: "0 0 4px 0" }}>
                            Support Center
                        </h1>
                        <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
                            Report an issue, dispute a charge, or get help.
                        </p>
                    </div>
                    {!isEmbedded && (
                        <Link to="/dashboard" style={{ color: "var(--color-gold)", textDecoration: "none" }}>
                            ← Back to Dashboard
                        </Link>
                    )}
                </div>

                {/* Tab Navigation */}
                <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--color-border)", marginBottom: "2rem" }}>
                    {[["new", "Submit New Ticket"], ["history", "Ticket History"]].map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            style={{
                                background: "transparent", border: "none", padding: "1rem",
                                color: activeTab === key ? "var(--color-gold)" : "var(--color-text-dim)",
                                borderBottom: activeTab === key ? "2px solid var(--color-gold)" : "2px solid transparent",
                                cursor: "pointer", fontSize: "1.1rem", fontWeight: activeTab === key ? "600" : "400",
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {activeTab === "new" ? (
                    <div style={{ background: "var(--color-surface)", borderRadius: "16px", padding: "2.5rem", border: "1px solid var(--color-border)" }}>
                        <h2 style={{ fontSize: "1.5rem", color: "var(--color-text-main)", marginBottom: "1.5rem" }}>
                            Open a Dispute
                        </h2>
                        <form onSubmit={handleSubmitTicket}>
                            <div className="form-group">
                                <label className="form-label">Related Booking (Optional)</label>
                                <select
                                    className="form-select"
                                    value={form.request_id}
                                    onChange={(e) => setForm({ ...form, request_id: e.target.value })}
                                >
                                    <option value="">Not related to a specific booking</option>
                                    {myRequests.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.id.slice(0, 8).toUpperCase()}: {r.title} ({r.status})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginTop: "1.5rem" }}>
                                <label className="form-label">Subject</label>
                                <select
                                    className="form-select"
                                    value={form.subject_type}
                                    onChange={(e) => setForm({ ...form, subject_type: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select the nature of your issue</option>
                                    <option value="artisan_no_show">Artisan did not show up</option>
                                    <option value="poor_quality">Poor quality of service</option>
                                    <option value="overcharged">I was overcharged or asked to pay outside the app</option>
                                    <option value="unprofessional_behavior">Unprofessional behavior</option>
                                    <option value="app_bug">App bug or technical issue</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginTop: "1.5rem" }}>
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Please provide as much detail as possible about what happened..."
                                    rows={5}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ marginTop: "2rem", width: "100%", padding: "14px", fontSize: "1.1rem", opacity: submitting ? 0.7 : 1 }}
                                disabled={submitting}
                            >
                                {submitting ? "Submitting…" : "Submit Support Ticket"}
                            </button>
                            <p style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.85rem", marginTop: "1rem" }}>
                                Our trust & safety team typically responds within 1-2 hours.
                            </p>
                        </form>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-dim)" }}>Loading…</div>
                        ) : tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", padding: "1.5rem" }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                        <div>
                                            <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                                                {ticket.id.slice(0, 8).toUpperCase()} • {formatDate(ticket.created_at)}
                                            </div>
                                            <h3 style={{ margin: "0 0 4px 0", color: "var(--color-text-main)", fontSize: "1.2rem" }}>
                                                {ticket.subject_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                            </h3>
                                            {ticket.service_requests?.title && (
                                                <span style={{ fontSize: "0.9rem", color: "var(--color-gold)" }}>
                                                    Re: {ticket.service_requests.title}
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            style={{
                                                background: `${getStatusColor(ticket.status)}20`,
                                                color: getStatusColor(ticket.status),
                                                padding: "4px 12px",
                                                borderRadius: "12px",
                                                fontSize: "0.85rem",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {getStatusLabel(ticket.status)}
                                        </span>
                                    </div>
                                    {ticket.last_update && (
                                        <div
                                            style={{
                                                background: "var(--color-bg)", padding: "1rem", borderRadius: "8px",
                                                borderLeft: `3px solid ${getStatusColor(ticket.status)}`,
                                            }}
                                        >
                                            <p style={{ margin: 0, color: "var(--color-text-dim)", fontSize: "0.95rem" }}>
                                                <strong>Latest Update:</strong> {ticket.last_update}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--color-surface)", borderRadius: "12px", border: "1px dashed var(--color-border)" }}>
                                <h3 style={{ color: "var(--color-text-main)", marginBottom: "0.5rem" }}>No Tickets Found</h3>
                                <p style={{ color: "var(--color-text-dim)" }}>You have not submitted any support requests yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
            {!isEmbedded && <Footer />}
        </div>
    );
};

export default ComplaintsPage;
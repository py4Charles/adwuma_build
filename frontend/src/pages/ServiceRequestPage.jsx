import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import { useAuth } from "../context/AuthContext.jsx";
import { requestsApi } from "../lib/supabase.js";
import "../styles/components.css";

const ServiceRequestPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const searchParams = new URLSearchParams(location.search);
    const artisanParam = searchParams.get("artisan");
    const artisanIdParam = searchParams.get("artisanId");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        category: "",
        title: "",
        location: "",
        scheduled_at: "",
        description: "",
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) { setError("You must be logged in to submit a request."); return; }

        setIsSubmitting(true);
        setError("");

        const { error: reqError } = await requestsApi.create({
            customer_id: user.id,
            artisan_id: artisanIdParam || null,
            request_type: "premium",
            category: form.category,
            title: form.title || (artisanParam ? `Service request for ${artisanParam}` : "Service Request"),
            description: form.description,
            location: form.location,
            scheduled_at: form.scheduled_at || null,
            status: "pending",
        });

        setIsSubmitting(false);

        if (reqError) {
            setError(reqError.message);
            return;
        }

        setShowSuccess(true);
        setTimeout(() => navigate("/my-requests"), 3000);
    };

    return (
        <div className="page" style={{ position: "relative" }}>
            <Navbar />
            <main className="page-content" style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                <div className="page-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <h1 className="page-title">
                        {artisanParam ? `Book ${artisanParam}` : "Request a Service"}
                    </h1>
                    <p className="page-subtitle">Provide the details below so we can get your job sorted.</p>
                </div>

                <div className="form-container" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", padding: "3rem" }}>
                    {error && (
                        <div style={{ background: "rgba(244,67,54,0.1)", border: "1px solid #f44336", color: "#f44336", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.9rem" }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        {!artisanParam && (
                            <div className="form-group">
                                <label className="form-label">Service category</label>
                                <select name="category" className="form-select" value={form.category} onChange={handleChange} required>
                                    <option value="" disabled>Select category</option>
                                    <option value="Domestic">Domestic (Plumbing, Electrical, Cleaning)</option>
                                    <option value="Commercial">Commercial (Office setup, CCTV)</option>
                                    <option value="Industrial">Industrial (Welding, Equipment)</option>
                                    <option value="Professional">Professional (Tutors, Marketing)</option>
                                </select>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Specific service needed</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Fix leaking tap in the kitchen"
                                className="form-input"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "24px" }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Location / Address</label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="e.g. East Legon, Accra"
                                    className="form-input"
                                    value={form.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Preferred Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="scheduled_at"
                                    className="form-input"
                                    value={form.scheduled_at}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Additional details</label>
                            <textarea
                                name="description"
                                className="form-textarea"
                                placeholder="Share any extra information to help the artisan understand the job..."
                                rows={4}
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: "100%", marginTop: "24px", padding: "16px", fontSize: "1.1rem", opacity: isSubmitting ? 0.7 : 1 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing Request…" : artisanParam ? "Confirm Booking" : "Submit Request"}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />

            {showSuccess && (
                <div className="modal-overlay">
                    <div className="match-modal" style={{ maxWidth: "400px" }}>
                        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>✅</div>
                        <h2 style={{ color: "var(--color-gold)", margin: "0 0 16px 0" }}>Request Submitted!</h2>
                        <p style={{ color: "var(--color-text-main)", marginBottom: "24px" }}>
                            Your booking has been confirmed. Redirecting you to your requests dashboard…
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceRequestPage;
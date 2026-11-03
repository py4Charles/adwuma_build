import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import { useAuth } from "../context/AuthContext.jsx";
import { profilesApi, requestsApi } from "../lib/supabase.js";
import "../styles/components.css";

const chipStyle = (active) => ({
    padding: "8px 16px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.3s ease",
    background: active ? "rgb(51, 51, 209)" : "var(--color-surface)",
    color: active ? "var(--color-bg)" : "var(--color-text-dim)",
    border: active ? "1px solid var(--color-blue)" : "1px solid var(--color-border)",
});

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
    const [locations, setLocations] = useState([]);
    const [showLocationInput, setShowLocationInput] = useState(false);
    const whenInputRef = useRef(null);

    useEffect(() => {
        async function fetchSavedLocations() {
            if (!user) return;
            const { data } = await profilesApi.get(user.id);
            setLocations(data?.saved_locations || []);
        };
        fetchSavedLocations();
    }, [user])

    const [form, setForm] = useState({
        category: "",
        title: "",
        location: "",
        scheduled_at: "",
        description: "",
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const saveLocation = async (place) => {
        const trimmed = place.trim();
        if (!trimmed) return;
        if (locations.includes(trimmed)) {
            setForm({ ...form, location: trimmed });
            return;
        }
        const next = [...locations, trimmed];
        setLocations(next);
        setForm({ ...form, location: trimmed });
        if (user) {
            const { error: saveError } = await profilesApi.update(user.id, { saved_locations: next });
            if (saveError) setError(saveError.message);
        }
    };

    const openDatePicker = () => {
        whenInputRef.current?.showPicker?.();
    };

    const formatScheduledAt = (value) => {
        if (!value) return "Pick a date and time";
        const [date, time] = value.split("T");
        const [y, m, d] = date.split("-").map(Number);
        const [hh, mm] = (time || "00:00").split(":").map(Number);
        const suffix = hh >= 12 ? "PM" : "AM";
        const hour12 = hh % 12 === 0 ? 12 : hh % 12;
        return `${new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })} · ${hour12}:${String(mm).padStart(2, "0")} ${suffix}`;
    };

    const buildQuickTimes = () => {
        const slots = [];
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const at = (dayOffset, hour) => {
            const d = new Date(startOfToday);
            d.setDate(d.getDate() + dayOffset);
            const pad = (n) => String(n).padStart(2, "0");
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hour)}:00`;
        };

        const nowHour = new Date().getHours();
        if (nowHour < 18) slots.push({ label: "Today, 4 PM", value: at(0, 16) });
        slots.push({ label: "Tomorrow, 9 AM", value: at(1, 9) });
        if (nowHour < 15) slots.push({ label: "Tomorrow, 2 PM", value: at(1, 14) });
        slots.push({ label: "This weekend, 10 AM", value: at(((6 - startOfToday.getDay()) + 7) % 7 || 7, 10) });
        return slots;
    };

    const quickTimes = buildQuickTimes();

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
                            <div style={{ marginBottom: 0 }}>
                                <div className="form-group">
                                    <label className="form-label">Location / Address</label>
                                    {showLocationInput || locations.length === 0 ? (
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="e.g. East Legon, Accra"
                                            className="form-input"
                                            value={form.location}
                                            onChange={handleChange}
                                            onBlur={(e) => saveLocation(e.target.value)}
                                            required
                                        />
                                    ) : (
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => setShowLocationInput(true)}
                                            className="form-input"
                                            style={{
                                                display: "flex", alignItems: "center", cursor: "pointer",
                                                color: form.location ? "var(--color-text-main)" : "var(--color-text-dim)",
                                            }}
                                        >
                                            {form.location || "Choose a saved place or type a new one"}
                                        </div>
                                    )}
                                </div>

                                {locations.length > 0 && (
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "0.5rem" }}>
                                        {locations.map((place) => (
                                            <button
                                                type="button"
                                                key={place}
                                                onClick={() => { setForm({ ...form, location: place }); setShowLocationInput(false); }}
                                                style={chipStyle(form.location === place)}
                                            >
                                                {place}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setShowLocationInput(true)}
                                            style={{ ...chipStyle(false), background: "transparent", border: "1px dashed var(--color-border)" }}
                                        >
                                            + Another
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: 0 }}>
                                <div className="form-group">
                                    <label className="form-label">Preferred Date &amp; Time</label>
                                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "stretch" }}>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={openDatePicker}
                                            className="form-input"
                                            style={{
                                                flex: 1, display: "flex", alignItems: "center", cursor: "pointer", marginBottom: 0,
                                                color: form.scheduled_at ? "var(--color-text-main)" : "var(--color-text-dim)",
                                            }}
                                        >
                                            {formatScheduledAt(form.scheduled_at)}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={openDatePicker}
                                            aria-label="Change date and time"
                                            style={{
                                                width: "52px", minWidth: "52px", borderRadius: "14px", border: "none", cursor: "pointer",
                                                background: "rgb(51, 51, 209)", color: "var(--color-bg)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}
                                        >
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                        </button>
                                    </div>
                                    <input
                                        ref={whenInputRef}
                                        type="datetime-local"
                                        name="scheduled_at"
                                        aria-label="Choose a date and time"
                                        tabIndex={-1}
                                        style={{ position: "absolute", width: "1px", height: "1px", padding: 0, border: "none", opacity: 0, pointerEvents: "none" }}
                                        value={form.scheduled_at}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "0.5rem" }}>
                                    {quickTimes.map((slot) => (
                                        <button
                                            type="button"
                                            key={slot.value}
                                            onClick={() => setForm({ ...form, scheduled_at: slot.value })}
                                            style={chipStyle(form.scheduled_at === slot.value)}
                                        >
                                            {slot.label}
                                        </button>
                                    ))}
                                </div>
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
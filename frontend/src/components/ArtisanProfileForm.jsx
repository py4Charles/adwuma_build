import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { artisansApi } from "../lib/supabase.js";

const REGIONS = ["Greater Accra", "Ashanti", "Western", "Central", "Eastern", "Volta", "Northern"];

const SUBCATEGORIES = [
    "Plumbers", "Electricians", "Carpenters", "Painters", "AC Repair & Maintenance",
    "Laundry & Dry Cleaning", "Automotive Mechanics", "Gardeners & Landscapers",
    "Makeup & Beauty", "Fashion And Tailoring Services", "Teachers/Tutors",
    "Digital Marketer", "Catering Services", "Event Planning", "Interior Designers",
    "Welding & Fabrications", "Generator Plant Repairs", "Machine Servicing",
    "Solar Power Systems", "IT & Networking",
];

const inputStyle = {
    width: "100%",
    background: "#0a0a0a",
    border: "1px solid #222",
    borderRadius: "12px",
    padding: "12px 14px",
    color: "var(--color-text-main)",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
};

const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "var(--color-dim)",
    marginBottom: "6px",
};

/**
 * Create/update the provider's artisan_profiles row.
 * Without this row a provider cannot claim work: `handleAcceptJob` requires
 * an artisanProfile, and the `claim_request` function checks ownership.
 */
const ArtisanProfileForm = ({ onSaved, onCancel }) => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        subcategory: "",
        region: "",
        area: "",
        starting_price: "",
        experience_years: "",
        bio: "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        if (!form.subcategory || !form.region) {
            setError("Pick a service type and a region so customers can find you.");
            return;
        }

        setSaving(true);
        setError("");

        const { data, error: saveError } = await artisansApi.upsert(user.id, {
            subcategory: form.subcategory,
            region: form.region,
            area: form.area || null,
            starting_price: form.starting_price ? Number(form.starting_price) : 0,
            experience_years: form.experience_years ? Number(form.experience_years) : 0,
            bio: form.bio || null,
        });

        setSaving(false);

        if (saveError) {
            setError(saveError.message);
            return;
        }

        onSaved(data);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <p style={{ color: "var(--color-text-dim)", fontSize: "0.9rem", margin: 0 }}>
                This is what customers see, and it is required before you can accept a job.
            </p>

            {error && (
                <div style={{ background: "rgba(244,67,54,0.1)", border: "1px solid #f44336", color: "#f44336", padding: "10px 14px", borderRadius: "10px", fontSize: "0.85rem" }}>
                    {error}
                </div>
            )}

            <div>
                <label style={labelStyle} htmlFor="ap-sub">Service Type</label>
                <select id="ap-sub" name="subcategory" value={form.subcategory} onChange={handleChange} style={inputStyle} required>
                    <option value="" disabled>Select a service</option>
                    {SUBCATEGORIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                    <label style={labelStyle} htmlFor="ap-region">Region</label>
                    <select id="ap-region" name="region" value={form.region} onChange={handleChange} style={inputStyle} required>
                        <option value="" disabled>Select a region</option>
                        {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div>
                    <label style={labelStyle} htmlFor="ap-area">Area (optional)</label>
                    <input id="ap-area" name="area" placeholder="East Legon" value={form.area} onChange={handleChange} style={inputStyle} />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                    <label style={labelStyle} htmlFor="ap-exp">Years of Experience</label>
                    <input id="ap-exp" name="experience_years" type="number" min="0" placeholder="5" value={form.experience_years} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle} htmlFor="ap-price">Starting Price (GHS)</label>
                    <input id="ap-price" name="starting_price" type="number" min="0" placeholder="150" value={form.starting_price} onChange={handleChange} style={inputStyle} />
                </div>
            </div>

            <div>
                <label style={labelStyle} htmlFor="ap-bio">About your work</label>
                <textarea
                    id="ap-bio"
                    name="bio"
                    rows={4}
                    placeholder="Describe your experience, the kinds of jobs you take, and what customers can expect."
                    value={form.bio}
                    onChange={handleChange}
                    style={{ ...inputStyle, resize: "vertical" }}
                />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
                <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary"
                    style={{ flex: 1, padding: "14px", opacity: saving ? 0.7 : 1 }}
                >
                    {saving ? "Saving…" : "Save Profile"}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn-secondary" style={{ padding: "14px 20px" }}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ArtisanProfileForm;

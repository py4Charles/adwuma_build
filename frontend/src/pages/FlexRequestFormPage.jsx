import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components.css";
import { useAuth } from "../context/AuthContext.jsx";
import { requestsApi } from "../lib/supabase.js";

const FlexRequestFormPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [budgetType, setBudgetType] = useState("offers");
  const [selectedService, setSelectedService] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    scheduled_at: "",
    budget_amount: "",
  });

  const flexServices = [
    "Catering Services (Chefs, Cooks Etc.)", "Teachers/Tutors", "Digital Marketer",
    "Fashion And Tailoring Services", "Plumbers", "Electricians", "Carpenters",
    "Painters", "AC Repair & Maintenance", "Laundry & Dry Cleaning", "Makeup & Beauty",
    "Automotive Mechanics", "Event Planning", "Gardeners & Landscapers", "Interior Designers"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { setError("You must be logged in to post a request."); return; }
    if (!selectedService) { setError("Please select a service type."); return; }

    setSubmitting(true);
    setError("");

    const { error: reqError } = await requestsApi.create({
      customer_id: user.id,
      request_type: "flex",
      subcategory: selectedService,
      title: form.title,
      description: form.description,
      location: form.location,
      scheduled_at: form.scheduled_at || null,
      budget_type: budgetType === "offers" ? "open" : "fixed",
      budget_amount: budgetType === "amount" && form.budget_amount ? parseFloat(form.budget_amount) : null,
      status: "pending",
    });

    setSubmitting(false);

    if (reqError) {
      setError(reqError.message);
      return;
    }

    navigate("/flex-match");
  };

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", color: "var(--color-bg)", fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{
        background: "rgb(51, 51, 209)", backdropFilter: "blur(10px)",
        padding: "1.2rem 1.5rem", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: "1px solid var(--color-border)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer", color: "var(--color-bg)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <h2 style={{ fontSize: "1.3rem", margin: 0, fontWeight: "700" }}>Flex Request</h2>
        </div>
        <button onClick={handleSubmit} style={{ background: "none", border: "none", color: "var(--color-bg)", fontWeight: "bold", fontSize: "1.05rem", cursor: "pointer" }}>
          Proceed
        </button>
      </div>

      <main style={{ maxWidth: "550px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {error && (
          <div style={{ background: "rgba(244,67,54,0.1)", border: "1px solid #f44336", color: "#f44336", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Task Title */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div className="form-group">
              <label className="form-label" style={{ color: "var(--color-gold)", fontWeight: "700", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px" }}>Task Title</label>
              <input
                type="text"
                placeholder="e.g. Fix leaking pipe under kitchen sink"
                className="form-input"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "1.2rem" }}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            {/* Service Type */}
            <div className="form-group" style={{ marginTop: "2rem" }}>
              <label className="form-label" style={{ color: "var(--color-text-main)", fontWeight: "700", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px" }}>Service Type</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
                {flexServices.map((service) => (
                  <div
                    key={service}
                    onClick={() => setSelectedService(service)}
                    style={{
                      padding: "10px 18px", borderRadius: "999px", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.3s ease",
                      background: selectedService === service ? "rgb(51, 51, 209)" : "var(--color-surface)",
                      color: selectedService === service ? "var(--color-bg)" : "var(--color-text-dim)",
                      border: selectedService === service ? "1px solid var(--color-blue)" : "1px solid var(--color-border)",
                    }}
                  >
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginTop: "2rem" }}>
              <label className="form-label" style={{ color: "var(--color-text-main)", fontWeight: "700", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px" }}>Task Description</label>
              <textarea
                className="form-textarea"
                placeholder="Describe exactly what needs to be done..."
                rows={4}
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "1.2rem" }}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ height: "1px", background: "var(--color-border)", margin: "2rem 0" }} />

          {/* Budget Section */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", color: "var(--color-text-main)", marginBottom: "1.2rem", fontWeight: "500", letterSpacing: '1px' }}>Budgeted Amount</h3>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "6px", gap: "6px", border: "1px solid var(--color-border)" }}>
              {[["amount", "Set Amount"], ["offers", "Open To Offers"]].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBudgetType(val)}
                  style={{
                    flex: 1, padding: "14px", borderRadius: "12px", border: "none",
                    background: budgetType === val ? "var(--color-blue)" : "transparent",
                    color: budgetType === val ? "var(--color-bg)" : "var(--color-text-muted)",
                    fontWeight: "700", cursor: "pointer", transition: "all 0.3s ease",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {budgetType === "amount" && (
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <span style={{ position: "absolute", left: "1.2rem", color: "var(--color-text-main)", fontWeight: "800", fontSize: "1.1rem" }}>GHS</span>
                  <input
                    type="number"
                    placeholder="Enter your maximum budget"
                    className="form-input"
                    style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "16px", padding: "1.2rem 1.2rem 1.2rem 4rem", fontSize: "1.2rem", fontWeight: "700" }}
                    value={form.budget_amount}
                    onChange={(e) => setForm({ ...form, budget_amount: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ background: "var(--color-surface)", borderRadius: "20px", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--color-border)" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-blue)", fontWeight: "800", marginBottom: "8px", letterSpacing: "1px" }}>Where?</label>
                <input
                  type="text"
                  placeholder="Street address or Landmark"
                  style={{ background: "transparent", border: "none", outline: "none", fontSize: "1.15rem", width: "100%", color: "var(--color-text-main)", padding: 0 }}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
              <div style={{ background: "rgb(51, 51, 209)", width: "45px", height: "45px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-bg)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
          </div>

          {/* When */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ background: "var(--color-surface)", borderRadius: "20px", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--color-border)" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-blue)", fontWeight: "800", marginBottom: "8px", letterSpacing: "1px" }}>When?</label>
                <input
                  type="datetime-local"
                  style={{ background: "var(--color-border)", border: "1px solid var(--color-border)", outline: "1px solid var(--color-border)", fontSize: "1rem", width: "100%", color: "var(--color-text-main)", padding: 0, colorScheme: "dark" }}
                  value={form.scheduled_at}
                  onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                  required
                />
              </div>
              <div style={{ background: "rgb(51, 51, 209)", width: "45px", height: "45px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-bg)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={{ paddingBottom: "2rem" }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{
                width: "100%", padding: "1.2rem", borderRadius: "18px",
                background: "var(--color-blue)", color: "var(--color-bg)", fontSize: "1.15rem",
                fontWeight: "800", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                boxShadow: "0 1px 40px rgb(51, 51, 209, 0.2)", opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Posting…" : "Proceed with request"}
              {!submitting && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default FlexRequestFormPage;
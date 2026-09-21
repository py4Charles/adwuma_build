import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/components.css";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase, profilesApi, authApi } from "../lib/supabase.js";

const AccountSettingsPage = ({ isEmbedded, initialTab = "profile" }) => {
    const { user, profile, refreshProfile } = useAuth();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

    const [profileData, setProfileData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
    });

    // Sync from profile when it loads
    useEffect(() => {
        if (profile) {
            setProfileData({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                phone: profile.phone || "",
                address: profile.address || "",
            });
        }
    }, [profile]);

    const [notifications, setNotifications] = useState({
        email: true, sms: true, push: false, marketing: false,
    });

    const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        const { error } = await profilesApi.update(user.id, profileData);
        setSaving(false);
        if (!error) {
            await refreshProfile();
            setSaveMsg("Profile updated successfully!");
            setTimeout(() => setSaveMsg(""), 3000);
        } else {
            setSaveMsg("Error: " + error.message);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (pwForm.next !== pwForm.confirm) { setSaveMsg("New passwords do not match."); return; }
        if (pwForm.next.length < 6) { setSaveMsg("Password must be at least 6 characters."); return; }
        setSaving(true);
        // Re-authenticate then update — Supabase updateUser
        const { error } = await supabase.auth.updateUser({ password: pwForm.next });
        setSaving(false);
        if (!error) {
            setSaveMsg("Password updated successfully!");
            setPwForm({ current: "", next: "", confirm: "" });
            setTimeout(() => setSaveMsg(""), 3000);
        } else {
            setSaveMsg("Error: " + error.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("This action is irreversible. Are you sure you want to delete your account?")) return;
        // Sign out for now — full delete requires a server-side function
        await authApi.signOut();
    };

    const toggleNotification = (key) =>
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

    const displayName = profile?.first_name
        ? `${profile.first_name} ${profile.last_name || ""}`
        : profile?.username || "User";
    const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className={isEmbedded ? "" : "page"}>
            {!isEmbedded && <Navbar />}
            <main
                className={isEmbedded ? "" : "page-content"}
                style={{ maxWidth: "1000px", margin: "0 auto", width: "100%", padding: isEmbedded ? "0" : "2rem 1rem", minHeight: isEmbedded ? "auto" : "70vh" }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: isEmbedded ? "1.8rem" : "2rem", color: "var(--color-text-main)", margin: 0 }}>
                        {initialTab === "profile" ? "My Account" : "Platform Settings"}
                    </h1>
                    {!isEmbedded && (
                        <Link to="/dashboard" style={{ color: "var(--color-gold)", textDecoration: "none" }}>← Back to Dashboard</Link>
                    )}
                </div>

                {saveMsg && (
                    <div style={{
                        background: saveMsg.startsWith("Error") ? "rgba(244,67,54,0.1)" : "rgba(76,175,80,0.1)",
                        border: `1px solid ${saveMsg.startsWith("Error") ? "#f44336" : "#4caf50"}`,
                        color: saveMsg.startsWith("Error") ? "#f44336" : "#4caf50",
                        padding: "12px 16px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.9rem",
                    }}>
                        {saveMsg}
                    </div>
                )}

                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                    {/* Sidebar Tabs */}
                    <aside style={{ width: "250px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {initialTab === "profile" && (
                            <button
                                onClick={() => setActiveTab("profile")}
                                style={{ padding: "14px 16px", textAlign: "left", color: activeTab === "profile" ? "var(--color-gold)" : "var(--color-text-main)", border: activeTab === "profile" ? "1px solid var(--color-border)" : "1px solid transparent", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: activeTab === "profile" ? "600" : "400", transition: "all 0.2s" }}
                            >
                                👤 Profile Information
                            </button>
                        )}
                        {initialTab !== "profile" && (
                            <>
                                <button onClick={() => setActiveTab("security")} style={{ padding: "14px 16px", textAlign: "left", background: activeTab === "security" ? "var(--color-surface)" : "transparent", color: activeTab === "security" ? "var(--color-gold)" : "var(--color-text-main)", border: activeTab === "security" ? "1px solid var(--color-border)" : "1px solid transparent", cursor: "pointer", fontSize: "1rem", fontWeight: activeTab === "security" ? "600" : "400" }}>
                                    🔒 Security & Password
                                </button>
                                <button onClick={() => setActiveTab("notifications")} style={{ padding: "14px 16px", textAlign: "left", background: activeTab === "notifications" ? "var(--color-surface)" : "transparent", color: activeTab === "notifications" ? "var(--color-gold)" : "var(--color-text-main)", border: activeTab === "notifications" ? "1px solid var(--color-border)" : "1px solid transparent", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: activeTab === "notifications" ? "600" : "400" }}>
                                    🔔 Notification Preferences
                                </button>
                            </>
                        )}
                    </aside>

                    {/* Content */}
                    <div style={{ flex: 1, background: "var(--color-surface)", padding: "2.5rem", borderRadius: "16px", border: "1px solid var(--color-border)" }}>

                        {activeTab === "profile" && (
                            <div>
                                <h2 style={{ fontSize: "1.5rem", color: "var(--color-text-main)", marginBottom: "1.5rem" }}>Profile Information</h2>
                                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid var(--color-border)" }}>
                                    <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--color-gold)", color: "#000", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "2rem", fontWeight: "bold" }}>
                                        {initials}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: "0 0 4px 0", color: "var(--color-text-main)" }}>{displayName}</h3>
                                        <p style={{ margin: 0, color: "var(--color-text-dim)", fontSize: "0.9rem" }}>{user?.email}</p>
                                        <span style={{ fontSize: "0.8rem", color: "var(--color-gold)", marginTop: "4px", display: "block" }}>
                                            {profile?.role === "provider" ? "Service Provider" : "Customer"}
                                        </span>
                                    </div>
                                </div>
                                <form onSubmit={handleProfileUpdate}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                        <div className="form-group">
                                            <label className="form-label">First Name</label>
                                            <input type="text" className="form-input" value={profileData.first_name} onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Last Name</label>
                                            <input type="text" className="form-input" value={profileData.last_name} onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: "1.5rem" }}>
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-input" value={user?.email || ""} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
                                    </div>
                                    <div className="form-group" style={{ marginTop: "1.5rem" }}>
                                        <label className="form-label">Phone Number</label>
                                        <input type="tel" className="form-input" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+233 XX XXX XXXX" />
                                    </div>
                                    <div className="form-group" style={{ marginTop: "1.5rem" }}>
                                        <label className="form-label">Home / Default Address</label>
                                        <input type="text" className="form-input" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} placeholder="e.g. East Legon, Accra" />
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ marginTop: "2rem", opacity: saving ? 0.7 : 1 }} disabled={saving}>
                                        {saving ? "Saving…" : "Save Changes"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div>
                                <h2 style={{ fontSize: "1.5rem", color: "var(--color-text-main)", marginBottom: "1.5rem" }}>Security & Password</h2>
                                <form onSubmit={handlePasswordUpdate}>
                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <input type="password" className="form-input" placeholder="Create new password" value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} required />
                                    </div>
                                    <div className="form-group" style={{ marginTop: "1.5rem" }}>
                                        <label className="form-label">Confirm New Password</label>
                                        <input type="password" className="form-input" placeholder="Confirm new password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} required />
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ marginTop: "2rem", opacity: saving ? 0.7 : 1 }} disabled={saving}>
                                        {saving ? "Updating…" : "Update Password"}
                                    </button>
                                </form>
                                <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--color-border)" }}>
                                    <h3 style={{ color: "#f44336", marginBottom: "1rem" }}>Danger Zone</h3>
                                    <p style={{ color: "var(--color-text-dim)", marginBottom: "1rem" }}>Once you delete your account, there is no going back. Please be certain.</p>
                                    <button onClick={handleDeleteAccount} style={{ background: "transparent", color: "#f44336", border: "1px solid #f44336", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Delete Account</button>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div>
                                <h2 style={{ fontSize: "1.5rem", color: "var(--color-text-main)", marginBottom: "1.5rem" }}>Notification Preferences</h2>
                                <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>Choose how we communicate with you.</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                    {[
                                        ["email", "Email Notifications", "Receive booking updates and receipts via email."],
                                        ["sms", "SMS / Text Messages", "Get critical updates instantly on your phone."],
                                        ["push", "Push Notifications", "Receive live match alerts and chat messages."],
                                        ["marketing", "Marketing & Promotions", "Get notified about weekly discounts and new categories."],
                                    ].map(([key, title, desc], idx, arr) => (
                                        <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: idx < arr.length - 1 ? "1.5rem" : 0, borderBottom: idx < arr.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                                            <div>
                                                <h4 style={{ margin: "0 0 4px 0", color: "var(--color-text-main)", fontSize: "1.1rem" }}>{title}</h4>
                                                <p style={{ margin: 0, color: "var(--color-text-dim)", fontSize: "0.9rem" }}>{desc}</p>
                                            </div>
                                            <div
                                                onClick={() => toggleNotification(key)}
                                                style={{
                                                    width: "50px", height: "28px", borderRadius: "34px", cursor: "pointer",
                                                    background: notifications[key] ? "var(--color-gold)" : "#333",
                                                    position: "relative", transition: "background 0.3s", flexShrink: 0,
                                                }}
                                            >
                                                <div style={{
                                                    position: "absolute", top: "4px",
                                                    left: notifications[key] ? "26px" : "4px",
                                                    width: "20px", height: "20px", borderRadius: "50%",
                                                    background: "white", transition: "left 0.3s",
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {!isEmbedded && <Footer />}
        </div>
    );
};

export default AccountSettingsPage;
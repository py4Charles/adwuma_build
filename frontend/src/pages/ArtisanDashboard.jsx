import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import logo from "../assets/icon.png";
import { useAuth } from "../context/AuthContext.jsx";
import { authApi, artisansApi, requestsApi } from "../lib/supabase.js";

const Icons = {
    Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    Jobs: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>,
    Earnings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    Profile: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
    Star: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
};

const ArtisanDashboard = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState("Overview");
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // Live data
    const [artisanProfile, setArtisanProfile] = useState(null);
    const [openJobs, setOpenJobs] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [acceptedIds, setAcceptedIds] = useState([]);
    const [loading, setLoading] = useState(true);

    const artisanName = profile?.first_name
        ? `${profile.first_name} ${profile.last_name || ""}`
        : profile?.username || "Artisan";

    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const loadData = async () => {
            setLoading(true);
            const [{ data: ap }, { data: jobs }, { data: w }, { data: txns }] = await Promise.all([
                artisansApi.getMine(user.id),
                requestsApi.listOpen(),
                walletApi.get(user.id),
                walletApi.transactions(user.id),
            ]);
            setArtisanProfile(ap);
            setOpenJobs(jobs || []);
            // setWallet(w);
            setTransactions(txns || []);
            setLoading(false);
        };
        loadData();
    }, [user]);

    const handleAcceptJob = async (jobId) => {
        if (!artisanProfile) {
            alert("You need to complete your artisan profile first.");
            setActiveTab("Profile");
            return;
        }
        setAcceptedIds((prev) => [...prev, jobId]);
        const { error } = await requestsApi.update(jobId, {
            artisan_id: artisanProfile.id,
            status: "in_progress",
        });
        if (!error) {
            setOpenJobs((prev) => prev.filter((j) => j.id !== jobId));
            alert("Job accepted! The customer has been notified.");
        } else {
            setAcceptedIds((prev) => prev.filter((id) => id !== jobId));
            alert("Failed to accept job. Please try again.");
        }
    };

    const handleLogout = async () => {
        await authApi.signOut();
        navigate("/");
    };

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const balance = wallet ? Number(wallet.balance) : 0;
    const rating = artisanProfile?.rating || 0;
    const jobsDone = artisanProfile?.jobs_completed || 0;

    const sidebarLinks = [
        { name: "Overview", icon: <Icons.Dashboard /> },
        { name: "Job Pool", icon: <Icons.Jobs /> },
        { name: "Earnings", icon: <Icons.Earnings /> },
        { name: "Profile", icon: <Icons.Profile /> },
    ];

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar" style={{ background: "#0a0a0a" }}>
                <Link to="/" className="sidebar-logo" style={{ textDecoration: "none", marginBottom: "40px" }}>
                    <img src={logo} alt="CraftLink Logo" style={{ width: "32px", height: "32px" }} />
                    <span style={{ color: "var(--color-gold)" }}>Provider Hub</span>
                </Link>

                <nav className="sidebar-menu">
                    {sidebarLinks.map((link) => (
                        <div
                            key={link.name}
                            className={`sidebar-link ${activeTab === link.name ? "active" : ""}`}
                            onClick={() => setActiveTab(link.name)}
                            style={{ color: activeTab === link.name ? "var(--color-gold)" : "#888" }}
                        >
                            <span>{link.icon}</span> {link.name}
                        </div>
                    ))}

                    <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px", position: "relative" }}>
                        <div
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "16px", cursor: "pointer", background: profileMenuOpen ? "rgba(255,255,255,0.05)" : "transparent" }}
                        >
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-gold)", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: "800", fontSize: "1rem" }}>
                                {artisanName.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: "white", fontWeight: "bold", fontSize: "0.9rem" }}>{artisanName}</div>
                                <div style={{ color: "#4caf50", fontSize: "0.75rem" }}>● Online</div>
                            </div>
                            <div style={{ color: "#888", transform: profileMenuOpen ? "rotate(180deg)" : "none", transition: "all 0.3s" }}>▼</div>
                        </div>

                        {profileMenuOpen && (
                            <div style={{ position: "absolute", bottom: "80px", left: "0", width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", padding: "8px", zIndex: 1000 }}>
                                <div className="sidebar-link" onClick={() => { setActiveTab("Profile"); setProfileMenuOpen(false); }} style={{ padding: "10px 14px", color: "#eee" }}>
                                    <Icons.Profile /> My Profile
                                </div>
                                <div className="sidebar-link" onClick={handleLogout} style={{ padding: "10px 14px", color: "#ff4d4d" }}>
                                    <Icons.Logout /> Log Out
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            <main className="dashboard-main" style={{ background: "#050505", minHeight: "100vh", color: "white" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", margin: "0 0 8px 0" }}>
                            Welcome, <span style={{ color: "var(--color-gold)" }}>{artisanName}</span>
                        </h1>
                        <p style={{ color: "#888", margin: 0 }}>
                            You are currently <span style={{ color: "#4caf50", fontWeight: "bold" }}>● Online</span> and visible to clients.
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#111", padding: "5px 15px", borderRadius: "30px", border: "1px solid #222" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#333", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                            {artisanName.substring(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontSize: "0.9rem" }}>{rating.toFixed(1)} <span style={{ color: "var(--color-gold)" }}>★</span></span>
                    </div>
                </header>

                {/* ─── OVERVIEW ─── */}
                {activeTab === "Overview" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                            <div style={{ background: "#111", padding: "2rem", borderRadius: "20px", border: "1px solid #222" }}>
                                <p style={{ color: "#888", marginBottom: "8px" }}>Total Earnings</p>
                                <h2 style={{ fontSize: "2.5rem", color: "var(--color-gold)" }}>GHS {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                                <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "10px" }}>{balance === 0 ? "No earnings yet" : "Available balance"}</p>
                            </div>
                            <div style={{ background: "#111", padding: "2rem", borderRadius: "20px", border: "1px solid #222" }}>
                                <p style={{ color: "#888", marginBottom: "8px" }}>Jobs Completed</p>
                                <h2 style={{ fontSize: "2.5rem" }}>{jobsDone}</h2>
                                <p style={{ color: "var(--color-gold)", fontSize: "0.9rem", marginTop: "10px" }}>{jobsDone === 0 ? "New Artisan Partner" : "Total completed"}</p>
                            </div>
                            <div style={{ background: "#111", padding: "2rem", borderRadius: "20px", border: "1px solid #222" }}>
                                <p style={{ color: "#888", marginBottom: "8px" }}>Open Requests</p>
                                <h2 style={{ fontSize: "2.5rem", color: "#2196f3" }}>{openJobs.length}</h2>
                                <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "10px" }}>Available in Job Pool</p>
                            </div>
                        </div>

                        {/* Job Pool Preview */}
                        <div style={{ background: "#111", padding: "2rem", borderRadius: "20px", border: "1px solid #222" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
                                <h3 style={{ margin: 0 }}>Latest Flex Requests</h3>
                                <span style={{ color: "var(--color-gold)", cursor: "pointer", fontSize: "0.9rem" }} onClick={() => setActiveTab("Job Pool")}>View All</span>
                            </div>
                            {loading ? (
                                <p style={{ color: "#555" }}>Loading…</p>
                            ) : openJobs.length === 0 ? (
                                <p style={{ color: "#555" }}>No open requests nearby right now.</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    {openJobs.slice(0, 3).map((job) => (
                                        <div key={job.id} style={{ background: "#0a0a0a", padding: "1.5rem", borderRadius: "15px", border: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div>
                                                <h4 style={{ margin: "0 0 5px 0" }}>{job.title}</h4>
                                                <p style={{ margin: 0, fontSize: "0.9rem", color: "#888" }}>{job.profiles?.username || "Customer"} · {job.location}</p>
                                                {job.budget_type === "fixed" && job.budget_amount && (
                                                    <span style={{ fontSize: "0.85rem", color: "var(--color-gold)", marginTop: "5px", display: "block" }}>
                                                        Budget: GHS {Number(job.budget_amount).toLocaleString()}
                                                    </span>
                                                )}
                                                {job.budget_type === "open" && (
                                                    <span style={{ fontSize: "0.85rem", color: "#888", marginTop: "5px", display: "block" }}>Open to offers</span>
                                                )}
                                            </div>
                                            <button
                                                style={{ padding: "8px 20px", fontSize: "0.85rem", background: acceptedIds.includes(job.id) ? "#4caf50" : "var(--color-gold)", color: "black", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}
                                                onClick={() => handleAcceptJob(job.id)}
                                                disabled={acceptedIds.includes(job.id)}
                                            >
                                                {acceptedIds.includes(job.id) ? "Accepted ✓" : "Accept"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Performance */}
                        <div style={{ background: "#111", padding: "2rem", borderRadius: "20px", border: "1px solid #222" }}>
                            <h3 style={{ marginBottom: "2rem" }}>Performance Summary</h3>
                            <div style={{ textAlign: "center", padding: "1rem" }}>
                                <div style={{ fontSize: "3rem", fontWeight: "bold", color: rating > 0 ? "var(--color-gold)" : "#333" }}>
                                    {rating.toFixed(1)}
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", gap: "4px", color: "var(--color-gold)", margin: "10px 0" }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} style={{ color: rating >= s ? "var(--color-gold)" : "#333", fontSize: "1.2rem" }}>★</span>
                                    ))}
                                </div>
                                <p style={{ color: "#555" }}>{rating > 0 ? `${jobsDone} reviews` : "No reviews yet"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── JOB POOL ─── */}
                {activeTab === "Job Pool" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        <h2 style={{ fontSize: "1.8rem", margin: 0 }}>Available Work Listings</h2>
                        {loading ? (
                            <p style={{ color: "#555" }}>Loading open requests…</p>
                        ) : openJobs.length === 0 ? (
                            <div style={{ padding: "4rem", textAlign: "center", background: "#111", borderRadius: "20px", border: "1px dashed #333" }}>
                                <h3 style={{ color: "#888" }}>No open requests right now</h3>
                                <p style={{ color: "#555" }}>New Flex requests from customers will appear here.</p>
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
                                {openJobs.map((job) => (
                                    <div key={job.id} style={{ background: "#111", padding: "2rem", borderRadius: "24px", border: "1px solid #222", position: "relative" }}>
                                        <span style={{ position: "absolute", top: "20px", right: "20px", padding: "4px 10px", borderRadius: "10px", background: "rgba(33,150,243,0.1)", color: "#2196f3", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>FLEX</span>
                                        <h3 style={{ marginTop: 0, fontSize: "1.2rem", marginBottom: "8px" }}>{job.title}</h3>
                                        {job.subcategory && <p style={{ color: "var(--color-gold)", fontSize: "0.85rem", margin: "0 0 8px 0" }}>{job.subcategory}</p>}
                                        <p style={{ color: "#888", fontSize: "0.95rem", marginBottom: "12px" }}>📍 {job.location}</p>
                                        {job.description && <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "16px", lineHeight: "1.4" }}>{job.description.slice(0, 100)}{job.description.length > 100 ? "…" : ""}</p>}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #222", paddingTop: "1.5rem" }}>
                                            <div>
                                                <span style={{ color: "#555", fontSize: "0.8rem", display: "block", marginBottom: "2px" }}>BUDGET</span>
                                                <strong style={{ fontSize: "1.1rem", color: "white" }}>
                                                    {job.budget_type === "fixed" && job.budget_amount
                                                        ? `GHS ${Number(job.budget_amount).toLocaleString()}`
                                                        : "Open to offers"}
                                                </strong>
                                            </div>
                                            <button
                                                style={{ padding: "10px 20px", background: acceptedIds.includes(job.id) ? "#4caf50" : "var(--color-gold)", color: "black", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}
                                                onClick={() => handleAcceptJob(job.id)}
                                                disabled={acceptedIds.includes(job.id)}
                                            >
                                                {acceptedIds.includes(job.id) ? "Accepted ✓" : "Accept Job"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ─── EARNINGS ─── */}
                {activeTab === "Earnings" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        <h2 style={{ fontSize: "1.8rem", margin: 0 }}>Earnings Financial Hub</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                            <div style={{ background: "#111", padding: "2rem", borderRadius: "24px", border: "1px solid #222" }}>
                                <p style={{ color: "#888", margin: "0 0 10px 0" }}>Total Balance</p>
                                <h2 style={{ fontSize: "2.5rem", margin: "0 0 20px 0" }}>GHS {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                                <button className="btn-primary" style={{ width: "100%", padding: "12px", opacity: balance === 0 ? 0.5 : 1 }} disabled={balance === 0}>
                                    Request Payout
                                </button>
                            </div>
                        </div>
                        <div style={{ background: "#111", padding: "2rem", borderRadius: "24px", border: "1px solid #222" }}>
                            <h3 style={{ margin: "0 0 1.5rem 0" }}>Recent Transactions</h3>
                            {transactions.length === 0 ? (
                                <p style={{ color: "#555", textAlign: "center", padding: "2rem 0" }}>No transaction history available.</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    {transactions.map((t) => (
                                        <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#0a0a0a", borderRadius: "12px", border: "1px solid #222" }}>
                                            <div>
                                                <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>{t.description}</p>
                                                <span style={{ color: "#555", fontSize: "0.85rem" }}>{formatDate(t.created_at)}</span>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <p style={{ margin: "0 0 4px 0", color: t.type === "deposit" ? "#4caf50" : "#f44336", fontWeight: "bold" }}>
                                                    {t.type === "deposit" ? "+" : "-"} GHS {Number(t.amount).toLocaleString()}
                                                </p>
                                                <span style={{ fontSize: "0.8rem", color: t.status === "success" ? "#4caf50" : "#888", textTransform: "capitalize" }}>{t.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── PROFILE ─── */}
                {activeTab === "Profile" && (
                    <div>
                        <h2 style={{ fontSize: "1.8rem", margin: "0 0 2rem 0" }}>Provider Profile</h2>
                        <div style={{ background: "#111", padding: "2rem", borderRadius: "24px", border: "1px solid #222", maxWidth: "100%" }}>
                            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                                <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "var(--color-gold)", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: "bold", color: "black" }}>
                                    {artisanName.substring(0, 2).toUpperCase()}
                                </div>
                                <h3 style={{ margin: 0 }}>{artisanName}</h3>
                                <p style={{ color: "#888", margin: "4px 0" }}>{user?.email}</p>
                                {artisanProfile && (
                                    <p style={{ color: "var(--color-gold)", margin: "4px 0", fontSize: "0.9rem" }}>
                                        {artisanProfile.subcategory} · {artisanProfile.region}
                                    </p>
                                )}
                            </div>
                            {artisanProfile ? (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", textAlign: "center", background: "#0a0a0a", padding: "1.5rem", borderRadius: "16px", border: "1px solid #222" }}>
                                    <div>
                                        <div style={{ color: "var(--color-gold)", fontWeight: "bold", fontSize: "1.4rem" }}>{rating.toFixed(1)} ★</div>
                                        <div style={{ fontSize: "0.7rem", color: "#555" }}>RATING</div>
                                    </div>
                                    <div style={{ borderLeft: "1px solid #222", borderRight: "1px solid #222" }}>
                                        <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>{jobsDone}</div>
                                        <div style={{ fontSize: "0.7rem", color: "#555" }}>COMPLETED</div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: "bold", fontSize: "1.4rem" }}>{artisanProfile.experience_years}y</div>
                                        <div style={{ fontSize: "0.7rem", color: "#555" }}>EXP.</div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: "center", padding: "2rem", color: "#555", border: "1px dashed #333", borderRadius: "16px" }}>
                                    <p>Complete your artisan profile to start receiving job requests.</p>
                                    <p style={{ fontSize: "0.85rem" }}>Contact support to get your profile verified.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ArtisanDashboard;
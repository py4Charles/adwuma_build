import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { walletApi } from "../lib/supabase.js";
import "../styles/components.css";

const WalletPage = () => {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [showFundModal, setShowFundModal] = useState(false);
    const [fundAmount, setFundAmount] = useState("");
    const [payMethod, setPayMethod] = useState("mobile_money");
    const [loading, setLoading] = useState(true);
    const [funding, setFunding] = useState(false);

    const fetchData = async () => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        const [{ data: w }, { data: txns }] = await Promise.all([
            walletApi.get(user.id),
            walletApi.transactions(user.id),
        ]);
        setWallet(w);
        setTransactions(txns || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [user]);

    const handleFundWallet = async (e) => {
        e.preventDefault();
        if (!fundAmount || !user) return;
        setFunding(true);
        const { error } = await walletApi.fund(user.id, parseFloat(fundAmount), payMethod);
        if (!error) {
            await fetchData();
            setShowFundModal(false);
            setFundAmount("");
        } else {
            alert("Failed to fund wallet. Please try again.");
        }
        setFunding(false);
    };

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const TXN_ICONS = { deposit: "↓", withdrawal: "↑", escrow_hold: "🔒", escrow_release: "🔓", payout: "↑" };
    const TXN_COLORS = { deposit: "#4caf50", withdrawal: "#f44336", escrow_hold: "#d4af37", payout: "#f44336", escrow_release: "#4caf50" };

    const balance = wallet ? Number(wallet.balance) : 0;

    return (
        <div className={isEmbedded ? "" : "page"}>
            {!isEmbedded && <Navbar />}
            <main
                className={isEmbedded ? "" : "page-content"}
                style={{ maxWidth: "900px", margin: "0 auto", width: "100%", padding: isEmbedded ? "0" : "2rem 1rem", minHeight: isEmbedded ? "auto" : "70vh" }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: isEmbedded ? "1.8rem" : "2rem", color: "var(--color-text-main)", margin: 0 }}>
                        My Wallet
                    </h1>
                    {!isEmbedded && (
                        <Link to="/dashboard" style={{ color: "var(--color-gold)", textDecoration: "none" }}>
                            ← Back to Dashboard
                        </Link>
                    )}
                </div>

                {/* Balance Card */}
                <div
                    style={{
                        background: "linear-gradient(135deg, var(--color-surface) 0%, #1a1a1a 100%)",
                        border: "1px solid var(--color-gold)",
                        borderRadius: "16px",
                        padding: "2rem",
                        marginBottom: "2rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1.5rem",
                    }}
                >
                    <div>
                        <p style={{ color: "var(--color-text-dim)", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
                            Total Balance
                        </p>
                        <h2 style={{ color: "var(--color-gold)", fontSize: "3rem", margin: "0" }}>
                            GHS {loading ? "…" : balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h2>
                        <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                            Available for instant booking & escrow.
                        </p>
                    </div>
                    <div>
                        <button
                            className="btn-primary"
                            onClick={() => setShowFundModal(true)}
                            style={{ padding: "12px 24px", fontSize: "1.1rem" }}
                        >
                            + Fund Wallet
                        </button>
                    </div>
                </div>

                {/* Transaction History */}
                <div>
                    <h3 style={{ color: "var(--color-text-main)", marginBottom: "1rem", fontSize: "1.3rem" }}>
                        Transaction History
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-dim)" }}>Loading…</div>
                        ) : transactions.length > 0 ? (
                            transactions.map((txn) => (
                                <div
                                    key={txn.id}
                                    style={{
                                        background: "var(--color-surface)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "12px",
                                        padding: "1rem 1.5rem",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "1rem",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                borderRadius: "50%",
                                                background: `${TXN_COLORS[txn.type] || "#888"}20`,
                                                color: TXN_COLORS[txn.type] || "#888",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontSize: "1.5rem",
                                            }}
                                        >
                                            {TXN_ICONS[txn.type] || "•"}
                                        </div>
                                        <div>
                                            <h4 style={{ color: "var(--color-text-main)", margin: "0 0 4px 0", fontSize: "1.1rem" }}>
                                                {txn.description}
                                            </h4>
                                            <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                                                {formatDate(txn.created_at)} • {txn.reference || txn.id.slice(0, 8).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div
                                            style={{
                                                color: txn.type === "deposit" || txn.type === "escrow_release" ? "#4caf50" : "var(--color-text-main)",
                                                fontWeight: "bold",
                                                fontSize: "1.2rem",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            {txn.type === "deposit" || txn.type === "escrow_release" ? "+" : "-"} GHS {Number(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "0.85rem",
                                                color: txn.status === "success" ? "#4caf50" : txn.status === "pending" ? "var(--color-gold)" : "#f44336",
                                                background: txn.status === "success" ? "rgba(76,175,80,0.1)" : txn.status === "pending" ? "rgba(212,175,55,0.1)" : "rgba(244,67,54,0.1)",
                                                padding: "2px 8px",
                                                borderRadius: "12px",
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {txn.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "3rem 2rem",
                                    background: "var(--color-surface)",
                                    borderRadius: "12px",
                                    border: "1px dashed var(--color-border)",
                                    color: "var(--color-text-dim)",
                                }}
                            >
                                No transactions yet. Fund your wallet to get started.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Fund Modal */}
            {showFundModal && (
                <div
                    style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            background: "var(--color-bg)", border: "1px solid var(--color-border)",
                            borderRadius: "16px", padding: "2rem", width: "100%", maxWidth: "400px",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h3 style={{ color: "var(--color-text-main)", margin: 0 }}>Fund Wallet</h3>
                            <button onClick={() => setShowFundModal(false)} style={{ background: "transparent", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: "1.5rem" }}>×</button>
                        </div>

                        <form onSubmit={handleFundWallet}>
                            <div className="form-group">
                                <label className="form-label" style={{ color: "var(--color-text-dim)" }}>Amount (GHS)</label>
                                <input
                                    type="number"
                                    min="10"
                                    className="form-input"
                                    placeholder="e.g. 100"
                                    value={fundAmount}
                                    onChange={(e) => setFundAmount(e.target.value)}
                                    style={{ background: "var(--color-surface)", fontSize: "1.2rem" }}
                                    required
                                />
                            </div>

                            <div style={{ margin: "1.5rem 0", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                                <p>Select Payment Method:</p>
                                <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                        <input type="radio" name="pm" checked={payMethod === "mobile_money"} onChange={() => setPayMethod("mobile_money")} /> Mobile Money
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                        <input type="radio" name="pm" checked={payMethod === "card"} onChange={() => setPayMethod("card")} /> Card
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "12px", opacity: funding ? 0.7 : 1 }} disabled={funding}>
                                {funding ? "Processing…" : "Proceed to Pay"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {!isEmbedded && <Footer />}
        </div>
    );
};

export default WalletPage;
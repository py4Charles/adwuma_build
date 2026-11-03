import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import "../styles/components.css";
import { useToast } from "../context/ToastContext.jsx";
import { supabase } from "../lib/supabase.js";

/**
 * Waits for a real provider to accept the request the customer just created.
 *
 * The request id arrives as ?request=<uuid> from FlexRequestFormPage. Nothing
 * here invents an id: the chat link uses this request's real uuid, because
 * messages.request_id is a uuid column and a code like "REQ-1099" is rejected
 * by Postgres as `invalid input syntax for type uuid`.
 */
const FlexMatchPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addToast } = useToast();

    const requestId = searchParams.get("request");

    const [matched, setMatched] = useState(null);
    const [notFound, setNotFound] = useState(false);

    // Fetch the request + the accepting provider's profile.
    const loadMatch = async (id) => {
        const { data, error } = await supabase
            .from("service_requests")
            .select("*, artisan:artisan_profiles(id, user_id, subcategory, region, rating, profiles(username, first_name, last_name))")
            .eq("id", id)
            .single();

        if (error || !data) { setNotFound(true); return; }
        if (data.artisan) setMatched(data);
    };

    useEffect(() => {
        if (!requestId) { setNotFound(true); return; }

        let cancelled = false;

        loadMatch(requestId);

        // Realtime on service_requests: the customer is the row's customer_id,
        // so the existing "Requests: own read" policy lets them receive the
        // UPDATE that claim_request makes when a provider accepts.
        const channel = supabase
            .channel(`request:${requestId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "service_requests",
                    filter: `id=eq.${requestId}`,
                },
                (payload) => {
                    if (cancelled) return;
                    if (payload.new?.artisan_id) {
                        loadMatch(requestId);
                        addToast("A professional just accepted your request!", "success");
                    }
                }
            )
            .subscribe();

        return () => {
            cancelled = true;
            supabase.removeChannel(channel);
        };
    }, [requestId, addToast]);

    if (notFound) {
        return (
            <div className="page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                    <div style={{ textAlign: "center" }}>
                        <h1 style={{ color: "var(--color-text-main)", marginBottom: "1rem" }}>No request to match</h1>
                        <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                            Start from your dashboard to post a request and we will find you a professional.
                        </p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="btn-primary"
                            style={{ padding: "12px 24px", borderRadius: "20px" }}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const artisan = matched?.artisan;
    const artisanName = artisan?.profiles
        ? (artisan.profiles.first_name
            ? `${artisan.profiles.first_name} ${artisan.profiles.last_name || ""}`.trim()
            : artisan.profiles.username)
        : "Your professional";
    const initials = artisanName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div className="page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>

                {!matched && (
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

                {/* Match Found Modal */}
                {matched && (
                    <div className="modal-overlay">
                        <div className="match-modal">
                            <h2 style={{ color: "var(--color-gold)", margin: "0 0 16px 0", fontSize: "2rem" }}>Match Found!</h2>
                            <p style={{ color: "var(--color-text-main)", marginBottom: "24px" }}>{artisanName} has accepted your request.</p>

                            <div style={{ background: "var(--color-bg)", padding: "20px", borderRadius: "16px", border: "1px solid var(--color-border)", marginBottom: "24px", textAlign: "left" }}>
                                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
                                    <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--color-gold)", color: "#000", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem", fontWeight: "bold" }}>
                                        {initials}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: "0 0 4px 0", color: "var(--color-text-main)" }}>{artisanName}</h3>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            {artisan.rating > 0 && <span style={{ color: "var(--color-gold)" }}>★ {Number(artisan.rating).toFixed(1)}</span>}
                                            <span style={{ color: "var(--color-text-dim)" }}>• {artisan.subcategory}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed var(--color-border)", paddingTop: "16px", marginTop: "8px" }}>
                                    <div>
                                        <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.85rem", marginBottom: "4px" }}>Your Task</span>
                                        <strong style={{ color: "var(--color-text-main)", fontSize: "1.1rem" }}>{matched.title}</strong>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.85rem", marginBottom: "4px" }}>Location</span>
                                        <strong style={{ color: "var(--color-text-main)", fontSize: "1.1rem" }}>{matched.location}</strong>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
                                <Link
                                    to={`/chat/${matched.id}`}
                                    className="btn-primary"
                                    style={{ padding: "14px", fontSize: "1.1rem" }}
                                >
                                    Message Artisan
                                </Link>
                                <Link to="/dashboard" className="btn-secondary" style={{ padding: "14px" }}>
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default FlexMatchPage;

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import "../styles/components.css";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase, messagesApi, profilesApi } from "../lib/supabase.js";

const ChatPage = () => {
    const { chatId } = useParams(); // request id
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState("");
    const [request, setRequest] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => { scrollToBottom(); }, [messages]);

    // `/chat/new` is not a real conversation — conversations are tied to a
    // request. Route into the booking flow so a request (and its chat) exists.
    useEffect(() => {
        if (chatId !== "new") return;
        if (!user) { navigate("/login"); return; }
        const artisan = searchParams.get("artisan");
        navigate(`/service-request${artisan ? `?artisan=${encodeURIComponent(artisan)}` : ""}`);
    }, [chatId, user, navigate, searchParams]);

    // Load request info + messages
    useEffect(() => {
        if (!chatId || !user || chatId === "new") { setLoading(false); return; }
        const init = async () => {
            setLoading(true);
            const { data: req } = await supabase
                .from("service_requests")
                .select("*, artisan:artisan_profiles(id, user_id, subcategory, profiles(username, first_name, last_name))")
                .eq("id", chatId)
                .single();
            const [{ data: msgs }, customerRes] = await Promise.all([
                messagesApi.list(chatId),
                req?.customer_id ? profilesApi.get(req.customer_id) : Promise.resolve({ data: null }),
            ]);
            setRequest(req || null);
            setCustomer(customerRes?.data || null);
            setMessages(msgs || []);
            setLoading(false);
        };
        init();
    }, [chatId, user]);

    // Subscribe to real-time messages
    useEffect(() => {
        if (!chatId) return;
        const channel = messagesApi.subscribe(chatId, (payload) => {
            setMessages((prev) => {
                // Avoid duplicates
                if (prev.find((m) => m.id === payload.new.id)) return prev;
                return [...prev, payload.new];
            });
        });
        return () => { supabase.removeChannel(channel); };
    }, [chatId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !user || sending) return;

        const text = inputText.trim();
        setInputText("");
        setSending(true);
        setSendError("");

        const { data, error } = await messagesApi.send({
            requestId: chatId,
            senderId: user.id,
            text,
        });

        setSending(false);

        if (error) {
            console.error("Send message error:", error);
            setSendError(error.message || "Could not send your message. Please try again.");
            setInputText(text);
            return;
        }

        // Append the confirmation so the message shows up even if the
        // realtime event is delayed; dedupe in case realtime already delivered it.
        if (data) {
            setMessages((prev) => (prev.find((m) => m.id === data.id) ? prev : [...prev, data]));
        }
    };

    const isArtisanView = !!request && user?.id === request.artisan?.user_id;

    const getOtherPartyName = () => {
        if (isArtisanView) {
            if (!customer) return "Customer";
            return customer.first_name
                ? `${customer.first_name} ${customer.last_name || ""}`
                : customer.username;
        }
        const art = request?.artisan?.profiles;
        if (!art) return "Artisan";
        return art.first_name ? `${art.first_name} ${art.last_name || ""}` : art.username;
    };

    const getInitials = (name) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const otherName = getOtherPartyName();

    const formatTime = (iso) =>
        new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="page" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* <Navbar /> */}

            <main style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: "800px", margin: "0 auto", width: "100%", background: "var(--color-bg)" }}>

                {/* Header */}
                <header
                    style={{
                        padding: "1rem",
                        borderBottom: "1px solid var(--color-border)",
                        background: "var(--color-surface)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{ background: "transparent", border: "none", color: "var(--color-gold)", cursor: "pointer", fontSize: "1.2rem" }}
                        >
                            ←
                        </button>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-blue-light)", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontWeight: "bold" }}>
                            {getInitials(otherName)}
                        </div>
                        <div>
                            <h2 style={{ fontSize: "1.1rem", margin: "0", color: "var(--color-text-main)" }}>{otherName}</h2>
                            <p style={{ margin: "0", fontSize: "0.85rem", color: "var(--color-text-dim)" }}>
                                {request?.title || chatId}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Messages */}
                <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-dim)" }}>Loading messages…</div>
                    ) : (
                        <>
                            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                                <span style={{ background: "var(--color-surface)", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem", color: "var(--color-text-dim)" }}>
                                    Keep all conversations on the platform for your protection.
                                </span>
                            </div>

                            {messages.map((msg) => {
                                const isMe = msg.sender_id === user?.id;
                                return (
                                    <div
                                        key={msg.id}
                                        style={{
                                            alignSelf: isMe ? "flex-end" : "flex-start",
                                            maxWidth: "75%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: isMe ? "flex-end" : "flex-start",
                                            gap: "4px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                background: isMe ? "rgba(51, 51, 209, 0.15)" : "var(--color-surface)",
                                                color: "var(--color-text-main)",
                                                border: isMe ? "1px solid rgba(51, 51, 209, 0.15)" : "1px solid var(--color-border)",
                                                padding: "12px 16px",
                                                borderRadius: isMe ? "16px 16px 0 16px" : "16px 16px 16px 0",
                                                fontSize: "0.95rem",
                                                lineHeight: "1.4",
                                            }}
                                        >
                                            {msg.text}
                                        </div>
                                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                                            {formatTime(msg.created_at)}
                                        </span>
                                    </div>
                                );
                            })}

                            {messages.length === 0 && !loading && (
                                <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-dim)" }}>
                                    {user ? "No messages yet. Start the conversation!" : "Please log in to send and view messages."}
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: "1rem", borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
                    {sendError && (
                        <div style={{ backgroundColor: "rgba(244,67,54,0.1)", border: "1px solid #f44336", color: "#f44336", padding: "10px 14px", borderRadius: "10px", fontSize: "0.85rem", marginBottom: "10px" }}>
                            {sendError}
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            disabled={!user || sending}
                            style={{
                                flex: 1, padding: "12px 16px", borderRadius: "24px",
                                border: "1px solid var(--color-border)", background: "var(--color-bg)",
                                color: "var(--color-text-main)", outline: "none",
                                opacity: !user || sending ? 0.6 : 1,
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!user || sending}
                            style={{
                                background: inputText.trim() && !sending ? "var(--color-blue-light)" : "var(--color-border)",
                                color: inputText.trim() && !sending ? "#fff" : "var(--color-text-dim)",
                                border: "none", width: "44px", height: "44px", borderRadius: "50%",
                                cursor: inputText.trim() && !sending ? "pointer" : "default",
                                display: "flex", justifyContent: "center", alignItems: "center",
                                transition: "all 0.2s",
                            }}
                        >
                            {sending ? "⏳" : "➤"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;
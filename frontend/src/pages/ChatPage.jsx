import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

import "../styles/components.css";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase, messagesApi, requestsApi } from "../lib/supabase.js";

const ChatPage = () => {
    const { chatId } = useParams(); // request id
    const navigate = useNavigate();
    const { user, profile } = useAuth();

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => { scrollToBottom(); }, [messages]);

    // Load request info + messages
    useEffect(() => {
        if (!chatId || !user) { setLoading(false); return; }
        const init = async () => {
            setLoading(true);
            const [{ data: req }, { data: msgs }] = await Promise.all([
                supabase
                    .from("service_requests")
                    .select("*, artisan:artisan_profiles(id, subcategory, profiles(username, first_name, last_name))")
                    .eq("id", chatId)
                    .single(),
                messagesApi.list(chatId),
            ]);
            setRequest(req);
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
        if (!inputText.trim() || !user) return;

        const text = inputText.trim();
        setInputText("");

        const { error } = await messagesApi.send({
            requestId: chatId,
            senderId: user.id,
            text,
        });

        if (error) console.error("Send message error:", error);
    };

    const getOtherPartyName = () => {
        if (!request) return "Artisan";
        const art = request.artisan;
        if (!art?.profiles) return "Artisan";
        const p = art.profiles;
        return p.first_name ? `${p.first_name} ${p.last_name}` : p.username;
    };

    const getInitials = (name) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const otherName = getOtherPartyName();
    const myName = profile?.first_name
        ? `${profile.first_name} ${profile.last_name || ""}`
        : profile?.username || "You";

    const formatTime = (iso) =>
        new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="page" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />

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
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-gold)", display: "flex", justifyContent: "center", alignItems: "center", color: "#000", fontWeight: "bold" }}>
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
                                                background: isMe ? "rgba(212, 175, 55, 0.15)" : "var(--color-surface)",
                                                color: "var(--color-text-main)",
                                                border: isMe ? "1px solid rgba(212, 175, 55, 0.3)" : "1px solid var(--color-border)",
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
                                    No messages yet. Start the conversation!
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: "1rem", borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
                    <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            style={{
                                flex: 1, padding: "12px 16px", borderRadius: "24px",
                                border: "1px solid var(--color-border)", background: "var(--color-bg)",
                                color: "var(--color-text-main)", outline: "none",
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                background: inputText.trim() ? "var(--color-gold)" : "var(--color-border)",
                                color: inputText.trim() ? "#000" : "var(--color-text-dim)",
                                border: "none", width: "44px", height: "44px", borderRadius: "50%",
                                cursor: inputText.trim() ? "pointer" : "default",
                                display: "flex", justifyContent: "center", alignItems: "center",
                                transition: "all 0.2s",
                            }}
                        >
                            ➤
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api", timeout: 60000 });

function getSessionId() {
    const key = "lf_session_id";
    let id = localStorage.getItem(key);
    if (!id) {
        id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem(key, id);
    }
    return id;
}

const EXAMPLES = [
    "What is a REST API and how does it work?",
    "Explain async/await in JavaScript",
    "How does React's virtual DOM work?",
];

function TypingDots() {
    return (
        <div style={{ display: "flex", gap: 4, padding: "6px 2px" }}>
            {[0, 160, 320].map(delay => (
                <span key={delay} style={{
                    width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", display: "block",
                    animation: `bounce3 1s ${delay}ms ease-in-out infinite`,
                }} />
            ))}
        </div>
    );
}

function UserBubble({ content }) {
    return (
        <div className="fade-in" style={{ display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "flex-start" }}>
            <div style={{
                maxWidth: "72%", padding: "10px 14px",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                borderRadius: "16px 16px 4px 16px",
                fontSize: 14, color: "#fff", lineHeight: 1.6,
                boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                whiteSpace: "pre-wrap",
            }}>{content}</div>
            <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #7c3aed, #db2777)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#fff", marginTop: 2,
            }}>U</div>
        </div>
    );
}

function AIBubble({ content }) {
    // Simple inline markdown for AI responses
    const lines = (content ?? "").split("\n");
    return (
        <div className="fade-in" style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: "rgba(30,41,59,0.9)", border: "1px solid rgba(71,85,105,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
            }}>
                <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div style={{
                maxWidth: "78%", padding: "10px 14px",
                background: "rgba(15,23,42,0.85)", border: "1px solid rgba(51,65,85,0.5)",
                borderRadius: "16px 16px 16px 4px",
                fontSize: 14, color: "#cbd5e1", lineHeight: 1.7,
            }}>
                {lines.map((line, i) => {
                    const t = line.trim();
                    if (!t) return <div key={i} style={{ height: 6 }} />;
                    if (t.startsWith("### ")) return <p key={i} style={{ color: "#a78bfa", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", margin: "10px 0 4px" }}>{t.slice(4)}</p>;
                    if (t.startsWith("## ")) return <p key={i} style={{ color: "#e2e8f0", fontWeight: 700, margin: "10px 0 4px" }}>{t.slice(3)}</p>;
                    if (t.startsWith("- ") || t.startsWith("* ")) return (
                        <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 3 }}>
                            <span style={{ color: "#7c3aed", marginTop: 1, flexShrink: 0 }}>▸</span>
                            <span>{t.slice(2)}</span>
                        </div>
                    );
                    if (t.startsWith("```")) return <pre key={i} className="codeblock" style={{ margin: "8px 0" }}><code>{t.slice(3)}</code></pre>;
                    return <p key={i} style={{ margin: "0 0 4px" }}>{t}</p>;
                })}
            </div>
        </div>
    );
}

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const sessionId = useRef(getSessionId());
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const resizeTextarea = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
    };

    const send = useCallback(async (question) => {
        const q = (question ?? input).trim();
        if (!q || loading) return;
        setInput("");
        setError(null);
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setMessages(prev => [...prev, { id: Date.now(), role: "user", content: q }]);
        setLoading(true);
        try {
            const res = await API.post("/qa", { sessionId: sessionId.current, question: q });
            const answer = res.data.answer ?? res.data.response ?? res.data.text ?? res.data.message ?? JSON.stringify(res.data);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", content: String(answer) }]);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to get answer");
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 80);
        }
    }, [input, loading]);

    const clearChat = () => {
        setMessages([]); setError(null);
        // New session
        localStorage.removeItem("lf_session_id");
        sessionId.current = getSessionId();
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const questionCount = messages.filter(m => m.role === "user").length;

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(51,65,85,0.4)", background: "rgba(3,7,18,0.6)", backdropFilter: "blur(10px)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Q&amp;A Assistant</h1>
                        <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Session-aware · {questionCount} {questionCount === 1 ? "question" : "questions"}</p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button className="btn btn-secondary" onClick={clearChat} style={{ fontSize: 12, padding: "6px 14px", gap: 6 }}>
                        <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Clear Chat
                    </button>
                )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px" }}>
                {messages.length === 0 && !loading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 20, textAlign: "center" }}>
                        <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.1))", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg viewBox="0 0 24 24" fill="none" width="26" height="26"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <div>
                            <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 16, margin: "0 0 6px" }}>Ask anything technical</p>
                            <p style={{ color: "#64748b", fontSize: 13, maxWidth: 300, lineHeight: 1.6, margin: 0 }}>Get instant AI answers on code, algorithms, frameworks, or any concept</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 360 }}>
                            <p style={{ fontSize: 11, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>Try asking</p>
                            {EXAMPLES.map(q => (
                                <button key={q} onClick={() => send(q)} style={{ textAlign: "left", padding: "10px 14px", background: "rgba(15,23,42,0.7)", border: "1px solid rgba(51,65,85,0.5)", borderRadius: 10, color: "#94a3b8", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}
                                    onMouseEnter={e => { e.target.style.borderColor = "rgba(139,92,246,0.4)"; e.target.style.color = "#c4b5fd"; }}
                                    onMouseLeave={e => { e.target.style.borderColor = "rgba(51,65,85,0.5)"; e.target.style.color = "#94a3b8"; }}>
                                    <span style={{ color: "#7c3aed", marginRight: 6 }}>↗</span>{q}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 780, margin: "0 auto" }}>
                        {messages.map(msg =>
                            msg.role === "user"
                                ? <UserBubble key={msg.id} content={msg.content} />
                                : <AIBubble key={msg.id} content={msg.content} />
                        )}
                        {loading && (
                            <div className="fade-in" style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(30,41,59,0.9)", border: "1px solid rgba(71,85,105,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <div style={{ padding: "10px 16px", background: "rgba(15,23,42,0.85)", border: "1px solid rgba(51,65,85,0.5)", borderRadius: "16px 16px 16px 4px" }}>
                                    <TypingDots />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div style={{ margin: "0 24px 8px", padding: "10px 14px", background: "rgba(69,10,10,0.6)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{ color: "#f87171", fontSize: 13, flex: 1 }}>{error}</span>
                    <button onClick={() => setError(null)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", opacity: 0.7, fontSize: 16 }}>×</button>
                </div>
            )}

            {/* Input bar */}
            <div style={{ padding: "12px 24px 16px", borderTop: "1px solid rgba(51,65,85,0.4)", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(71,85,105,0.5)", borderRadius: 14, padding: "8px 8px 8px 14px", transition: "border-color 0.2s", outline: "none" }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(71,85,105,0.5)"}
                >
                    <textarea
                        ref={el => { inputRef.current = el; textareaRef.current = el; }}
                        value={input}
                        onChange={e => { setInput(e.target.value); resizeTextarea(); }}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                        placeholder="Ask a technical question… (Enter to send)"
                        disabled={loading}
                        rows={1}
                        style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#e2e8f0", fontSize: 14, resize: "none", fontFamily: "inherit", minHeight: 36, maxHeight: 120, lineHeight: 1.55, padding: "4px 0", caretColor: "#a78bfa" }}
                    />
                    <button
                        onClick={() => send()}
                        disabled={loading || !input.trim()}
                        style={{
                            width: 36, height: 36, borderRadius: 10, border: "none",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                            flexShrink: 0, transition: "all 0.18s",
                            background: loading || !input.trim() ? "rgba(30,41,59,0.6)" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                            boxShadow: loading || !input.trim() ? "none" : "0 4px 12px rgba(124,58,237,0.4)",
                        }}
                    >
                        {loading
                            ? <span className="spinner" style={{ width: 14, height: 14 }} />
                            : <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={loading || !input.trim() ? "#475569" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        }
                    </button>
                </div>
                <p style={{ fontSize: 11, color: "#334155", textAlign: "center", margin: "6px 0 0" }}>
                    Enter to send · Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}

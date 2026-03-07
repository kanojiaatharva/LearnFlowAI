import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://44.210.21.77:5000/api", timeout: 60000 });

function getSessionId() {
    const key = "lf_session_id";
    let id = localStorage.getItem(key);
    if (!id) {
        id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem(key, id);
    }
    return id;
}

function addRipple(e) {
    const btn = e.currentTarget;
    const r = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.className = "ripple";
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 560);
}

function fmtTime(d) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const EXAMPLES = [
    { q: "What is a REST API and how does it work?", icon: "🌐" },
    { q: "Explain async/await in JavaScript", icon: "⚡" },
    { q: "How does React's virtual DOM work?", icon: "⚛️" },
    { q: "What is the difference between SQL and NoSQL?", icon: "🗄️" },
];

/* ─── Typing dots ─────────────────────────────────────────────── */
function TypingDots() {
    return (
        <div style={{ display: "flex", gap: 5, padding: "4px 2px", alignItems: "center" }}>
            {[0, 180, 360].map(delay => (
                <span key={delay} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "linear-gradient(135deg,#7c3aed,#6366f1)",
                    display: "block",
                    animation: `bounce3 1.1s ${delay}ms ease-in-out infinite`,
                }} />
            ))}
        </div>
    );
}

/* ─── Inline markdown render ─────────────────────────────────── */
function renderInline(text) {
    const parts = [];
    const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) parts.push(<span key={last}>{text.slice(last, m.index)}</span>);
        if (m[0].startsWith("`")) {
            parts.push(<code key={m.index} style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(51,65,85,0.5)", borderRadius: 4, padding: "1px 5px", fontFamily: "monospace", fontSize: "0.88em", color: "#7dd3fc" }}>{m[0].slice(1, -1)}</code>);
        } else {
            parts.push(<strong key={m.index} style={{ color: "#e2e8f0", fontWeight: 700 }}>{m[0].slice(2, -2)}</strong>);
        }
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(<span key={last}>{text.slice(last)}</span>);
    return parts.length ? parts : text;
}

/* ─── Message bubbles ─────────────────────────────────────────── */
function UserBubble({ content, time }) {
    return (
        <div className="fade-slide-up" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{
                    maxWidth: "72%", padding: "11px 16px",
                    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                    borderRadius: "18px 18px 5px 18px",
                    fontSize: 13.5, color: "#fff", lineHeight: 1.65,
                    boxShadow: "0 4px 16px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                }}>{content}</div>
                <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: "#fff", marginBottom: 2,
                    boxShadow: "0 2px 8px rgba(124,58,237,0.35)",
                }}>U</div>
            </div>
            <span className="timestamp" style={{ marginRight: 38 }}>{time}</span>
        </div>
    );
}

function AIBubble({ content, time }) {
    // Backend may return literal "\n" (two chars) instead of actual newlines — normalize both
    const normalized = (content ?? "").replace(/\\n/g, "\n").replace(/\\r/g, "");
    const lines = normalized.split("\n");
    return (
        <div className="fade-slide-up" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(13,20,40,0.9)",
                    border: "1px solid rgba(124,58,237,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 2,
                    boxShadow: "0 0 12px rgba(124,58,237,0.15)",
                }}>
                    <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div style={{
                    maxWidth: "78%", padding: "11px 16px",
                    background: "rgba(13,20,40,0.85)",
                    border: "1px solid rgba(51,65,85,0.5)",
                    borderRadius: "18px 18px 18px 5px",
                    fontSize: 13.5, color: "#94a3b8", lineHeight: 1.7,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.02)",
                    wordBreak: "break-word",
                }}>
                    {lines.map((line, i) => {
                        const t = line.trim();
                        if (!t) return <div key={i} style={{ height: 6 }} />;
                        if (t.startsWith("### ")) return <p key={i} style={{ color: "#a78bfa", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", margin: "10px 0 4px" }}>{t.slice(4)}</p>;
                        if (t.startsWith("## ")) return <p key={i} style={{ color: "#e2e8f0", fontWeight: 700, margin: "10px 0 4px" }}>{t.slice(3)}</p>;
                        if (t.startsWith("- ") || t.startsWith("* ")) return (
                            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                                <span style={{ color: "#7c3aed", flexShrink: 0, marginTop: 2 }}>▸</span>
                                <span>{renderInline(t.slice(2))}</span>
                            </div>
                        );
                        if (t.startsWith("```")) return (
                            <pre key={i} className="codeblock" style={{ margin: "8px 0", fontSize: 12 }}>
                                <code>{t.slice(3)}</code>
                            </pre>
                        );
                        return <p key={i} style={{ margin: "0 0 4px" }}>{renderInline(t)}</p>;
                    })}
                </div>
            </div>
            <span className="timestamp" style={{ marginLeft: 38 }}>{time}</span>
        </div>
    );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const sessionId = useRef(getSessionId());
    const bottomRef = useRef(null);
    const textareaRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const resizeTextarea = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 130) + "px";
    };

    const send = useCallback(async (question) => {
        const q = (question ?? input).trim();
        if (!q || loading) return;
        setInput("");
        setError(null);
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        const now = new Date();
        setMessages(prev => [...prev, { id: now.getTime(), role: "user", content: q, time: fmtTime(now) }]);
        setLoading(true);
        try {
            const res = await API.post("/qa", { sessionId: sessionId.current, question: q });
            const answer = res.data.answer ?? res.data.response ?? res.data.text ?? res.data.message ?? JSON.stringify(res.data);
            const aiTime = new Date();
            setMessages(prev => [...prev, { id: aiTime.getTime() + 1, role: "ai", content: String(answer), time: fmtTime(aiTime) }]);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || "Failed to get answer");
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 80);
        }
    }, [input, loading]);

    const clearChat = () => {
        setMessages([]); setError(null);
        localStorage.removeItem("lf_session_id");
        sessionId.current = getSessionId();
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const qCount = messages.filter(m => m.role === "user").length;

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
            {/* ── Header ── */}
            <div style={{ padding: "13px 22px", borderBottom: "1px solid rgba(51,65,85,0.35)", background: "rgba(2,8,23,0.7)", backdropFilter: "blur(16px)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(139,92,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(124,58,237,0.12)" }}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: 14.5, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Q&amp;A Assistant</h1>
                        <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>Session · {qCount} {qCount === 1 ? "question" : "questions"} asked</p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button className="btn btn-secondary" onClick={clearChat} style={{ fontSize: 12, padding: "6px 14px", gap: 6 }}>
                        <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        New Chat
                    </button>
                )}
            </div>

            {/* ── Messages area ── */}
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "24px" }}>
                {messages.length === 0 && !loading ? (
                    /* Empty state */
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", gap: 20, textAlign: "center", padding: "24px 0" }}>
                        <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.1))", border: "1px solid rgba(139,92,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(124,58,237,0.1)" }}>
                            <svg viewBox="0 0 24 24" fill="none" width="26" height="26"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <div>
                            <p style={{ color: "#e2e8f0", fontWeight: 800, fontSize: 17, margin: "0 0 7px", letterSpacing: "-0.02em" }}>Ask anything technical</p>
                            <p style={{ color: "#475569", fontSize: 13, maxWidth: 320, lineHeight: 1.65, margin: 0 }}>Get instant AI answers on code, algorithms, system design, or any concept</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%", maxWidth: 520 }}>
                            <p className="section-label" style={{ marginBottom: 0, gridColumn: "1 / -1" }}>Try asking</p>
                            {EXAMPLES.map(({ q, icon }) => (
                                <button key={q} onClick={() => send(q)} className="btn btn-secondary" style={{
                                    textAlign: "left", padding: "10px 13px", fontSize: 12.5,
                                    width: "100%", justifyContent: "flex-start", gap: 8,
                                    borderRadius: 11,
                                }}>
                                    <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                                    <span style={{ lineHeight: 1.4 }}>{q}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 800, margin: "0 auto" }}>
                        {messages.map(msg =>
                            msg.role === "user"
                                ? <UserBubble key={msg.id} content={msg.content} time={msg.time} />
                                : <AIBubble key={msg.id} content={msg.content} time={msg.time} />
                        )}
                        {loading && (
                            <div className="fade-in" style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(13,20,40,0.9)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <div style={{ padding: "11px 16px", background: "rgba(13,20,40,0.85)", border: "1px solid rgba(51,65,85,0.5)", borderRadius: "18px 18px 18px 5px", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
                                    <TypingDots />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            {/* ── Error ── */}
            {error && (
                <div style={{ margin: "0 20px 8px", padding: "10px 16px", background: "rgba(69,10,10,0.7)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, display: "flex", alignItems: "center", gap: 8, flexShrink: 0, backdropFilter: "blur(8px)" }}>
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ color: "#fca5a5", fontSize: 13, flex: 1 }}>{error}</span>
                    <button onClick={() => setError(null)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 18, opacity: 0.6, lineHeight: 1 }}>×</button>
                </div>
            )}

            {/* ── Sticky input bar ── */}
            <div style={{ padding: "10px 20px 16px", borderTop: "1px solid rgba(51,65,85,0.3)", flexShrink: 0, background: "rgba(2,8,23,0.8)", backdropFilter: "blur(20px)" }}>
                <div style={{
                    display: "flex", gap: 10, alignItems: "flex-end",
                    background: "rgba(10,18,35,0.8)",
                    border: "1px solid rgba(51,65,85,0.6)",
                    borderRadius: 16, padding: "10px 10px 10px 16px",
                    boxShadow: "0 0 0 0 transparent",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(51,65,85,0.6)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                    <textarea
                        ref={el => { inputRef.current = el; textareaRef.current = el; }}
                        value={input}
                        onChange={e => { setInput(e.target.value); resizeTextarea(); }}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                        placeholder="Ask a technical question… (Enter to send)"
                        disabled={loading}
                        rows={1}
                        style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#e2e8f0", fontSize: 13.5, resize: "none", fontFamily: "inherit", minHeight: 36, maxHeight: 130, lineHeight: 1.6, padding: "4px 0", caretColor: "#a78bfa" }}
                    />
                    <button
                        onClick={e => { addRipple(e); send(); }}
                        disabled={loading || !input.trim()}
                        style={{
                            width: 36, height: 36, borderRadius: 10, border: "none",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                            flexShrink: 0, transition: "all 0.18s", position: "relative", overflow: "hidden",
                            background: loading || !input.trim() ? "rgba(30,41,59,0.5)" : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                            boxShadow: loading || !input.trim() ? "none" : "0 4px 14px rgba(124,58,237,0.4), 0 0 0 1px rgba(139,92,246,0.2)",
                        }}
                    >
                        {loading
                            ? <span className="spinner" style={{ width: 14, height: 14, color: "#64748b" }} />
                            : <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={loading || !input.trim() ? "#475569" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        }
                    </button>
                </div>
                <p style={{ fontSize: 10.5, color: "#1e293b", textAlign: "center", margin: "6px 0 0", letterSpacing: "0.02em" }}>
                    Enter · Send &nbsp;·&nbsp; Shift+Enter · New line
                </p>
            </div>
        </div>
    );
}

const ITEMS = [
    {
        id: "explain", label: "Explain Content",
        icon: <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    },
    {
        id: "qa", label: "Q&A Assistant",
        icon: <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    },
    {
        id: "upload", label: "Upload Knowledge",
        icon: <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    },
    { id: "path", label: "Learning Path", disabled: true },
    { id: "prog", label: "Progress", disabled: true },
];

export default function Sidebar({ activePage, onNavigate }) {
    return (
        <aside style={{
            width: 228,
            flexShrink: 0,
            background: "rgba(2,8,23,0.85)",
            borderRight: "1px solid rgba(30,41,59,0.6)",
            display: "flex",
            flexDirection: "column",
            padding: "18px 10px",
            gap: 2,
        }}>
            <p className="section-label" style={{ padding: "0 10px", marginBottom: 10 }}>Workspace</p>

            {ITEMS.map((item) => {
                const isActive = activePage === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => !item.disabled && onNavigate(item.id)}
                        disabled={item.disabled}
                        className={`nav-item${item.disabled ? " nav-item-disabled" : isActive ? " nav-item-active" : ""}`}
                        style={{ color: item.disabled ? undefined : isActive ? "#c4b5fd" : "#64748b" }}
                    >
                        <span style={{ color: isActive ? "#a78bfa" : item.disabled ? "#334155" : "#475569", flexShrink: 0, transition: "color 0.15s" }}>
                            {item.icon}
                        </span>
                        <span style={{ flex: 1, fontSize: 13.5 }}>{item.label}</span>
                        {item.disabled && (
                            <span className="badge" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(30,41,59,0.6)", color: "#334155", fontSize: 9 }}>Soon</span>
                        )}
                        {isActive && (
                            <span style={{ width: 3, height: 16, background: "linear-gradient(to bottom, #7c3aed, #6366f1)", borderRadius: 2, flexShrink: 0, boxShadow: "0 0 8px rgba(124,58,237,0.6)" }} />
                        )}
                    </button>
                );
            })}

            {/* Footer */}
            <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid rgba(30,41,59,0.5)" }}>
                <div className="card" style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 7, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 800, color: "#e2e8f0", margin: 0, letterSpacing: "-0.01em" }}>LearnFlow AI</p>
                    </div>
                    <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.5, margin: "0 0 10px" }}>AI-powered learning assistant</p>
                    <div style={{ display: "flex", gap: 5 }}>
                        <span className="badge" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa" }}>v2.0</span>
                        <span className="badge" style={{ background: "rgba(5,150,105,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#6ee7b7" }}>● Live</span>
                    </div>
                </div>
                <p style={{ fontSize: 10, color: "#334155", textAlign: "center", margin: "10px 0 0", lineHeight: 1.5 }}>
                    &copy; {new Date().getFullYear()} Made by <span style={{ color: "#a78bfa", fontWeight: 600 }}>Atharva Kanojia</span>
                </p>
            </div>
        </aside>
    );
}

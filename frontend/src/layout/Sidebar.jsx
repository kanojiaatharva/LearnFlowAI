const ITEMS = [
    {
        id: "explain",
        label: "Explain Content",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "qa",
        label: "Q&A Assistant",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "upload",
        label: "Upload Knowledge",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    { id: "path", label: "Learning Path", disabled: true, badge: "Soon" },
    { id: "prog", label: "Progress", disabled: true, badge: "Soon" },
];

export default function Sidebar({ activePage, onNavigate }) {
    return (
        <aside style={{
            width: 232,
            flexShrink: 0,
            background: "rgba(3,7,18,0.85)",
            borderRight: "1px solid rgba(51,65,85,0.4)",
            display: "flex",
            flexDirection: "column",
            padding: "20px 12px",
            gap: 2,
        }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 10px", marginBottom: 10 }}>
                Workspace
            </p>

            {ITEMS.map((item) => {
                const isActive = activePage === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => !item.disabled && onNavigate(item.id)}
                        disabled={item.disabled}
                        className={`nav-item ${item.disabled ? "nav-item-disabled" : isActive ? "nav-item-active" : ""}`}
                    >
                        {item.icon && (
                            <span style={{ color: isActive ? "#a78bfa" : item.disabled ? "#475569" : "#64748b", flexShrink: 0 }}>
                                {item.icon}
                            </span>
                        )}
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {item.badge && (
                            <span className="badge" style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(71,85,105,0.4)", color: "#64748b" }}>
                                {item.badge}
                            </span>
                        )}
                        {isActive && <span style={{ width: 3, height: 18, background: "#7c3aed", borderRadius: 2, flexShrink: 0, boxShadow: "0 0 8px #7c3aed" }} />}
                    </button>
                );
            })}

            {/* Footer */}
            <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(51,65,85,0.3)" }}>
                <div className="card" style={{ padding: "12px 14px" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>LearnFlow AI</p>
                    <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>AI-powered learning assistant</p>
                    <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                        <span className="badge" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa" }}>v2.0</span>
                        <span className="badge" style={{ background: "rgba(5,46,22,0.5)", border: "1px solid rgba(34,197,94,0.25)", color: "#86efac" }}>Live</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

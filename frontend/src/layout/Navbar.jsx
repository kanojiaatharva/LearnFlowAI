export default function Navbar() {
    return (
        <header style={{
            height: 54,
            background: "rgba(2,8,23,0.9)",
            borderBottom: "1px solid rgba(30,41,59,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 20px", flexShrink: 0, zIndex: 50,
            boxShadow: "0 1px 0 rgba(124,58,237,0.06), 0 4px 16px rgba(0,0,0,0.2)",
        }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(124,58,237,0.45), 0 0 0 1px rgba(139,92,246,0.2)" }}>
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ fontWeight: 800, fontSize: 15, color: "#f1f5f9", letterSpacing: "-0.03em" }}>
                    LearnFlow <span style={{ background: "linear-gradient(135deg,#a78bfa,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
                </span>
            </div>

            {/* Center */}
            <p style={{ fontSize: 12, color: "#2d3748", fontWeight: 500 }}>
                AI-powered technical learning
            </p>

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(5,150,105,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 9999, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#6ee7b7" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block" }} />
                    AI Ready
                </div>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#db2777)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12.5, color: "#fff", cursor: "pointer", border: "2px solid rgba(51,65,85,0.5)", boxShadow: "0 2px 10px rgba(124,58,237,0.3)", transition: "transform 0.15s, box-shadow 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.45)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(124,58,237,0.3)"; }}>
                    A
                </div>
            </div>
        </header>
    );
}

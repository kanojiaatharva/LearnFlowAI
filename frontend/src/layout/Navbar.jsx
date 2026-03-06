export default function Navbar() {
    return (
        <header style={{
            height: 56,
            background: "rgba(3,7,18,0.9)",
            borderBottom: "1px solid rgba(51,65,85,0.4)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            flexShrink: 0,
            zIndex: 50,
        }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                    width: 30, height: 30, borderRadius: 10,
                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
                }}>
                    <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                            stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span style={{ fontWeight: 800, fontSize: 15, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                    LearnFlow <span style={{ color: "#a78bfa" }}>AI</span>
                </span>
            </div>

            {/* Center tagline */}
            <p style={{ fontSize: 12, color: "#475569", fontWeight: 500 }} className="hidden md:block">
                AI-powered technical learning
            </p>

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(5,46,22,0.4)", border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 9999, padding: "5px 12px",
                    fontSize: 12, fontWeight: 600, color: "#86efac",
                }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "none", boxShadow: "0 0 6px #22c55e" }} />
                    AI Ready
                </div>
                <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #db2777)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13, color: "#fff",
                    cursor: "pointer", border: "2px solid rgba(71,85,105,0.4)",
                    boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
                }}>A</div>
            </div>
        </header>
    );
}

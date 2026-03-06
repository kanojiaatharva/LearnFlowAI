import { useState, useCallback } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api", timeout: 60000 });

const SKILLS = ["Beginner", "Intermediate", "Advanced"];

// ── Toast ───────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
    if (!msg) return null;
    return (
        <div className={`toast toast-${type}`}>
            <span>{type === "success" ? "✓" : "✕"}</span>
            <span style={{ flex: 1 }}>{msg}</span>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 16, opacity: 0.7 }}>×</button>
        </div>
    );
}

// ── Markdown renderer ────────────────────────────────────────────
function AIResult({ text }) {
    const lines = (text ?? "").split("\n");
    const nodes = [];
    let codeLines = [], inCode = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const t = line.trim();

        if (t.startsWith("```")) {
            if (inCode) {
                nodes.push(
                    <pre key={i} className="codeblock" style={{ marginBottom: 12 }}>
                        <code>{codeLines.join("\n")}</code>
                    </pre>
                );
                codeLines = []; inCode = false;
            } else {
                inCode = true;
            }
            continue;
        }
        if (inCode) { codeLines.push(line); continue; }
        if (!t) { nodes.push(<div key={i} style={{ height: 8 }} />); continue; }

        if (t.startsWith("### ")) {
            nodes.push(<h4 key={i} style={{ color: "#a78bfa", fontSize: 13, fontWeight: 700, margin: "16px 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.slice(4)}</h4>);
        } else if (t.startsWith("## ")) {
            nodes.push(<h3 key={i} style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 700, margin: "18px 0 6px" }}>{t.slice(3)}</h3>);
        } else if (t.startsWith("# ")) {
            nodes.push(<h2 key={i} style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 800, margin: "20px 0 8px", borderBottom: "1px solid rgba(71,85,105,0.4)", paddingBottom: 8 }}>{t.slice(2)}</h2>);
        } else if (t.startsWith("- ") || t.startsWith("* ")) {
            nodes.push(
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                    <span style={{ color: "#7c3aed", marginTop: 2, flexShrink: 0 }}>▸</span>
                    <span style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.6 }}>{t.slice(2)}</span>
                </div>
            );
        } else {
            nodes.push(<p key={i} style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, marginBottom: 6 }}>{t}</p>);
        }
    }
    if (inCode && codeLines.length) {
        nodes.push(<pre key="eof" className="codeblock"><code>{codeLines.join("\n")}</code></pre>);
    }
    return <div>{nodes}</div>;
}

export default function ExplainPage() {
    const [content, setContent] = useState("");
    const [skill, setSkill] = useState("Intermediate");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [copied, setCopied] = useState(false);

    const showToast = (msg, type = "info") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleGenerate = async () => {
        if (!content.trim()) return;
        setLoading(true); setResult(null);
        try {
            const res = await API.post("/explain", { content: content.trim() });
            const explanation = res.data.explanation ?? res.data.response ?? res.data.text ?? JSON.stringify(res.data);
            setResult(String(explanation));
        } catch (err) {
            showToast(err?.response?.data?.message || err?.message || "Failed to generate explanation", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = useCallback(async () => {
        if (!result) return;
        await navigator.clipboard.writeText(result).catch(() => { });
        setCopied(true);
        showToast("Copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2500);
    }, [result]);

    return (
        <div style={{ padding: "28px 32px", maxWidth: 860, margin: "0 auto" }}>
            <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Explain Content</h1>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>AI explanations tailored to your skill level</p>
                    </div>
                </div>
            </div>

            {/* Input card */}
            <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                {/* Skill selector */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Skill Level:</span>
                    {SKILLS.map(s => (
                        <button
                            key={s}
                            onClick={() => setSkill(s)}
                            style={{
                                padding: "5px 14px", fontSize: 12, fontWeight: 600,
                                borderRadius: 8, border: "1px solid",
                                cursor: "pointer", transition: "all 0.15s",
                                background: skill === s ? "rgba(124,58,237,0.2)" : "rgba(30,41,59,0.6)",
                                borderColor: skill === s ? "rgba(139,92,246,0.5)" : "rgba(71,85,105,0.4)",
                                color: skill === s ? "#c4b5fd" : "#94a3b8",
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Textarea */}
                <textarea
                    className="input"
                    rows={8}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    onKeyDown={e => { if (e.ctrlKey && e.key === "Enter") handleGenerate(); }}
                    placeholder="Paste your code, documentation, or any technical content here..."
                    disabled={loading}
                    style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", marginBottom: 14 }}
                />

                {/* Footer row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#475569" }}>
                        {content.length.toLocaleString()} chars ·{" "}
                        <kbd style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(71,85,105,0.5)", borderRadius: 4, padding: "1px 5px", fontSize: 10, fontFamily: "monospace" }}>Ctrl+Enter</kbd>{" "}
                        to submit
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                        {result && (
                            <button className="btn btn-secondary" onClick={() => setResult(null)} style={{ padding: "8px 16px", fontSize: 13 }}>
                                Clear
                            </button>
                        )}
                        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading || !content.trim()}>
                            {loading ? (
                                <><span className="spinner" /> Generating…</>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    Generate Explanation
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="card fade-in" style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <span className="spinner" style={{ borderTopColor: "#7c3aed", borderColor: "rgba(124,58,237,0.2)" }} />
                        <span style={{ fontSize: 13, color: "#64748b" }}>Analyzing content with AI…</span>
                    </div>
                    {[100, 85, 92, 70, 78].map((w, i) => (
                        <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, marginBottom: 10 }} />
                    ))}
                </div>
            )}

            {/* Result */}
            {result && !loading && (
                <div className="card-glow fade-in" style={{ overflow: "hidden" }}>
                    {/* Result header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid rgba(51,65,85,0.4)", background: "rgba(124,58,237,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(5,150,105,0.15)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="#10b981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>AI Explanation</span>
                            <span className="badge" style={{ background: "rgba(5,150,105,0.15)", border: "1px solid rgba(16,185,129,0.25)", color: "#6ee7b7" }}>Generated</span>
                        </div>
                        <button className="btn btn-secondary" onClick={handleCopy}
                            style={{ padding: "6px 14px", fontSize: 12, gap: 6, color: copied ? "#6ee7b7" : undefined, borderColor: copied ? "rgba(16,185,129,0.3)" : undefined, background: copied ? "rgba(5,150,105,0.15)" : undefined }}>
                            {copied ? (
                                <><svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Copied!</>
                            ) : (
                                <><svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg> Copy</>
                            )}
                        </button>
                    </div>
                    {/* Content */}
                    <div style={{ padding: 20, maxHeight: 500, overflowY: "auto" }}>
                        <AIResult text={result} />
                    </div>
                    {/* Footer */}
                    <div style={{ padding: "8px 20px", borderTop: "1px solid rgba(51,65,85,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#475569" }}>{(result ?? "").split(/\s+/).filter(Boolean).length} words</span>
                        <button onClick={() => setResult(null)} className="btn btn-secondary" style={{ fontSize: 12, padding: "5px 14px" }}>New Explanation</button>
                    </div>
                </div>
            )}
        </div>
    );
}

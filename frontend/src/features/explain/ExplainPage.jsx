import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const API = axios.create({ baseURL: "http://44.210.21.77:5000/api", timeout: 60000 });
const SKILLS = ["Beginner", "Intermediate", "Advanced"];
const MAX_CHARS = 12000;

/* ─── Ripple ──────────────────────────────────────────────────── */
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

/* ─── Toast ───────────────────────────────────────────────────── */
function Toast({ msg, type, onClose }) {
    if (!msg) return null;
    const icons = { success: "✓", error: "✕", info: "✦" };
    return (
        <div className={`toast toast-${type}`}>
            <span>{icons[type] ?? "✦"}</span>
            <span style={{ flex: 1 }}>{msg}</span>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 18, lineHeight: 1, opacity: 0.6 }}>×</button>
        </div>
    );
}

/* ─── Inline markdown ─────────────────────────────────────────── */
function renderInline(text) {
    const parts = [];
    const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) parts.push(<span key={last}>{text.slice(last, m.index)}</span>);
        if (m[0].startsWith("`")) {
            parts.push(<code key={m.index} style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(51,65,85,0.5)", borderRadius: 5, padding: "1px 6px", fontFamily: "monospace", fontSize: "0.88em", color: "#7dd3fc" }}>{m[0].slice(1, -1)}</code>);
        } else {
            parts.push(<strong key={m.index} style={{ color: "#e2e8f0", fontWeight: 700 }}>{m[0].slice(2, -2)}</strong>);
        }
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(<span key={last}>{text.slice(last)}</span>);
    return parts.length ? parts : text;
}

/* ─── Markdown + callout renderer ────────────────────────────── */
function AIResult({ text }) {
    const normalized = (text ?? "").replace(/\\n/g, "\n").replace(/\\r/g, "");
    const lines = normalized.split("\n");
    const nodes = [];
    let codeLines = [], inCode = false, codeLang = "";
    let i = 0;

    const detectCallout = (t) => {
        const lower = t.toLowerCase();
        if (lower.startsWith("note:") || lower.startsWith("ℹ️") || lower.startsWith("[note]")) return "info";
        if (lower.startsWith("warning:") || lower.startsWith("⚠️") || lower.startsWith("[warning]")) return "warning";
        if (lower.startsWith("tip:") || lower.startsWith("💡") || lower.startsWith("[tip]")) return "tip";
        return null;
    };

    while (i < lines.length) {
        const line = lines[i];
        const t = line.trim();

        if (t.startsWith("```")) {
            if (inCode) {
                nodes.push(
                    <div key={`code-${i}`} style={{ position: "relative", margin: "14px 0" }}>
                        {codeLang && <span style={{ position: "absolute", top: 10, right: 14, fontSize: 10, color: "#475569", fontFamily: "monospace", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{codeLang}</span>}
                        <pre className="codeblock"><code>{codeLines.join("\n")}</code></pre>
                    </div>
                );
                codeLines = []; inCode = false; codeLang = "";
            } else { inCode = true; codeLang = t.slice(3).trim(); }
            i++; continue;
        }
        if (inCode) { codeLines.push(line); i++; continue; }
        if (!t) { nodes.push(<div key={`sp-${i}`} style={{ height: 10 }} />); i++; continue; }

        if (t.startsWith("# ")) { nodes.push(<h2 key={i} style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 800, margin: "22px 0 10px", borderBottom: "1px solid rgba(51,65,85,0.5)", paddingBottom: 10 }}>{t.slice(2)}</h2>); i++; continue; }
        if (t.startsWith("## ")) { nodes.push(<h3 key={i} style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 700, margin: "18px 0 8px" }}>{t.slice(3)}</h3>); i++; continue; }
        if (t.startsWith("### ")) { nodes.push(<h4 key={i} style={{ color: "#a78bfa", fontSize: 12.5, fontWeight: 700, margin: "14px 0 5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{t.slice(4)}</h4>); i++; continue; }

        const calloutType = detectCallout(t);
        if (calloutType) {
            const icons = { info: "ℹ️", warning: "⚠️", tip: "💡" };
            nodes.push(
                <div key={i} className={`callout callout-${calloutType}`}>
                    <span className="callout-icon">{icons[calloutType]}</span>
                    <span>{t.replace(/^(note:|warning:|tip:|ℹ️|⚠️|💡|\[note\]|\[warning\]|\[tip\])\s*/i, "")}</span>
                </div>
            );
            i++; continue;
        }

        if (t.startsWith("- ") || t.startsWith("* ") || /^\d+\.\s/.test(t)) {
            const items = [];
            while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* ") || /^\d+\.\s/.test(lines[i].trim()))) {
                items.push(lines[i].trim().replace(/^(\d+\.\s|-\s|\*\s)/, ""));
                i++;
            }
            nodes.push(
                <ul key={`ul-${i}`} style={{ listStyle: "none", padding: 0, margin: "8px 0", display: "flex", flexDirection: "column", gap: 6 }}>
                    {items.map((item, j) => (
                        <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span style={{ color: "#7c3aed", fontWeight: 800, fontSize: 14, flexShrink: 0, marginTop: 2 }}>▸</span>
                            <span style={{ color: "#94a3b8", fontSize: 13.5, lineHeight: 1.65 }}>{renderInline(item)}</span>
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        if (t.startsWith("**") && t.endsWith("**") && t.length > 4) {
            nodes.push(<p key={i} style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, margin: "12px 0 4px" }}>{t.slice(2, -2)}</p>);
            i++; continue;
        }

        nodes.push(<p key={i} style={{ color: "#94a3b8", fontSize: 13.5, lineHeight: 1.75, margin: "0 0 8px" }}>{renderInline(t)}</p>);
        i++;
    }
    if (inCode && codeLines.length) nodes.push(<pre key="eof" className="codeblock"><code>{codeLines.join("\n")}</code></pre>);
    return <div>{nodes}</div>;
}

/* ─── Copy button ─────────────────────────────────────────────── */
function CopyBtn({ text }) {
    const [done, setDone] = useState(false);
    return (
        <button onClick={async (e) => { addRipple(e); await navigator.clipboard.writeText(text).catch(() => { }); setDone(true); setTimeout(() => setDone(false), 2000); }}
            className="btn btn-secondary" style={{ padding: "6px 14px", fontSize: 12, gap: 5, color: done ? "#6ee7b7" : undefined, borderColor: done ? "rgba(16,185,129,0.35)" : undefined, background: done ? "rgba(5,150,105,0.15)" : undefined }}>
            {done ? <>✓ Copied</> : <><svg viewBox="0 0 24 24" fill="none" width="11" height="11"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg> Copy</>}
        </button>
    );
}

/* ─── PDF extraction using pdf.js ────────────────────────────── */
async function extractPdfText(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const txtContent = await page.getTextContent();
        const pageText = txtContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n";
    }
    return fullText.trim();
}

/* ─── PDF Drop Zone ───────────────────────────────────────────── */
function PdfTab({ onExtracted, onError }) {
    const [pdfFile, setPdfFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [extracted, setExtracted] = useState(null); // { text, pages, name }
    const inputRef = useRef(null);

    const handleFile = async (f) => {
        if (!f) return;
        if (f.type !== "application/pdf") { onError("Only PDF files are supported."); return; }
        if (f.size > 20 * 1024 * 1024) { onError("File must be under 20 MB."); return; }
        setPdfFile(f);
        setExtracted(null);
        setExtracting(true);
        try {
            const text = await extractPdfText(f);
            if (!text) { onError("Could not extract text — the PDF may be image-based or protected."); setExtracting(false); return; }
            setExtracted({ text, name: f.name, size: f.size });
        } catch (err) {
            onError("PDF extraction failed: " + (err?.message ?? "unknown error"));
        } finally {
            setExtracting(false);
        }
    };

    const clear = () => { setPdfFile(null); setExtracted(null); };

    return (
        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Drop zone */}
            {!pdfFile && (
                <div
                    className={`dropzone${dragging ? " dropzone-drag" : ""}`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                    style={{ padding: "32px 24px", marginBottom: 0 }}
                >
                    <input ref={inputRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
                    <div style={{ width: 52, height: 52, borderRadius: 15, background: dragging ? "rgba(124,58,237,0.12)" : "rgba(15,23,42,0.7)", border: `1px solid ${dragging ? "rgba(139,92,246,0.5)" : "rgba(51,65,85,0.5)"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", transition: "all 0.2s", boxShadow: dragging ? "0 0 24px rgba(124,58,237,0.2)" : "none" }}>
                        <svg viewBox="0 0 24 24" fill="none" width="22" height="22"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke={dragging ? "#a78bfa" : "#475569"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <p style={{ color: dragging ? "#c4b5fd" : "#94a3b8", fontWeight: 700, fontSize: 15, margin: "0 0 5px", transition: "color 0.2s" }}>
                        {dragging ? "Drop PDF here" : "Drag & drop a PDF"}
                    </p>
                    <p style={{ color: "#475569", fontSize: 12.5, margin: "0 0 14px" }}>or click to browse · PDF only · Max 20 MB</p>
                    <span style={{ fontSize: 11, color: "#334155", background: "rgba(15,23,42,0.7)", border: "1px solid rgba(51,65,85,0.4)", borderRadius: 9999, padding: "4px 12px" }}>
                        Text is extracted locally — nothing is shared until you click Explain
                    </span>
                </div>
            )}

            {/* File info + extracting */}
            {pdfFile && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(10,18,35,0.5)", border: "1px solid rgba(51,65,85,0.45)", borderRadius: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(220,38,38,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {extracting
                            ? <span className="spinner" style={{ color: "#a78bfa", width: 16, height: 16 }} />
                            : <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="#ef4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 13.5, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pdfFile.name}</p>
                        <p style={{ color: "#64748b", fontSize: 11.5, margin: 0 }}>
                            {(pdfFile.size / 1024).toFixed(1)} KB · {extracting ? "Extracting text…" : extracted ? `${extracted.text.length.toLocaleString()} characters extracted` : ""}
                        </p>
                    </div>
                    {!extracting && (
                        <button onClick={clear} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 20, padding: 4, lineHeight: 1, borderRadius: 6 }}
                            onMouseEnter={e => e.target.style.color = "#94a3b8"}
                            onMouseLeave={e => e.target.style.color = "#475569"}>×</button>
                    )}
                </div>
            )}

            {/* Preview of extracted text */}
            {extracted && (
                <>
                    <div style={{ background: "rgba(5,10,25,0.6)", border: "1px solid rgba(51,65,85,0.5)", borderRadius: 12, padding: "12px 14px", maxHeight: 180, overflowY: "auto" }}>
                        <p className="section-label" style={{ marginBottom: 8 }}>Extracted Preview</p>
                        <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {extracted.text.slice(0, 600)}{extracted.text.length > 600 ? "…" : ""}
                        </p>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={e => { addRipple(e); onExtracted(extracted.text); }}
                        style={{ width: "100%", justifyContent: "center", fontSize: 14, padding: "12px 20px" }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Explain this PDF
                    </button>
                </>
            )}
        </div>
    );
}

/* ─── Main page ───────────────────────────────────────────────── */
export default function ExplainPage() {
    const [content, setContent] = useState("");
    const [skill, setSkill] = useState("Intermediate");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState("text"); // "text" | "pdf"
    const resultRef = useRef(null);
    const textareaRef = useRef(null);

    const showToast = (msg, type = "info") => { setToast({ msg, type }); setTimeout(() => setToast(null), 4500); };

    useEffect(() => {
        if (result) setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }, [result]);

    const generate = async (textOverride) => {
        const text = (textOverride ?? content).trim();
        if (!text || loading) return;
        setLoading(true); setResult(null);
        if (textareaRef.current) textareaRef.current.style.opacity = "0.5";
        try {
            const res = await API.post("/explain", { content: text });
            const explanation = res.data.explanation ?? res.data.response ?? res.data.text ?? JSON.stringify(res.data);
            setResult(String(explanation));
            // If PDF tab triggered this, switch to text tab to show result cleanly
            if (textOverride) setActiveTab("text");
        } catch (err) {
            showToast(err?.response?.data?.message || err?.message || "Request failed", "error");
        } finally {
            setLoading(false);
            if (textareaRef.current) textareaRef.current.style.opacity = "1";
        }
    };

    const handleGenerate = (e) => { if (e) addRipple(e); generate(); };
    const handlePdfExtracted = (text) => {
        setContent(text);
        setActiveTab("text");
        generate(text);
    };

    const handleFollowUp = () => {
        if (result) navigator.clipboard.writeText(`Based on this explanation:\n\n${result}\n\nMy question is: `).catch(() => { });
        showToast("Context copied — paste it in Q&A Assistant!", "info");
    };

    const charCount = content.length;
    const overLimit = charCount > MAX_CHARS;
    const estimatedTime = charCount < 500 ? "~5s" : charCount < 2000 ? "~10s" : charCount < 5000 ? "~20s" : "~30s";

    return (
        <div style={{ padding: "24px 32px 40px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
            <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(99,102,241,0.15))", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(124,58,237,0.15)" }}>
                    <svg viewBox="0 0 24 24" fill="none" width="19" height="19"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                    <h1 style={{ fontSize: 21, fontWeight: 800, color: "#f1f5f9", margin: 0, letterSpacing: "-0.025em" }}>Explain Content</h1>
                    <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0" }}>AI-powered explanations · text or PDF</p>
                </div>
            </div>

            {/* Input card */}
            <div className="card" style={{ overflow: "hidden", marginBottom: 18 }}>
                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid rgba(51,65,85,0.4)" }}>
                    {[{ id: "text", label: "✏️ Text / Code" }, { id: "pdf", label: "📄 PDF Upload" }].map(tab => (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setResult(null); }}
                            style={{
                                padding: "12px 22px", fontSize: 13, fontWeight: 600, border: "none", background: "none", cursor: "pointer", transition: "all 0.15s",
                                borderBottom: `2px solid ${activeTab === tab.id ? "#7c3aed" : "transparent"}`,
                                color: activeTab === tab.id ? "#a78bfa" : "#64748b", marginBottom: -1,
                                boxShadow: activeTab === tab.id ? "0 0 16px rgba(124,58,237,0.15)" : "none",
                            }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "text" ? (
                    <div style={{ padding: "16px 20px" }}>
                        {/* Skill selector */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                            <span className="section-label">Skill Level</span>
                            <div style={{ display: "flex", gap: 6 }}>
                                {SKILLS.map(s => (
                                    <button key={s} onClick={() => setSkill(s)} className="btn" style={{
                                        padding: "5px 14px", fontSize: 12, fontWeight: 600, borderRadius: 9, border: "1px solid",
                                        background: skill === s ? "rgba(124,58,237,0.2)" : "rgba(15,23,42,0.6)",
                                        borderColor: skill === s ? "rgba(139,92,246,0.5)" : "rgba(51,65,85,0.5)",
                                        color: skill === s ? "#c4b5fd" : "#64748b",
                                        boxShadow: skill === s ? "0 0 14px rgba(124,58,237,0.2)" : "none",
                                    }}>{s}</button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            ref={textareaRef}
                            className="input"
                            rows={7}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            onKeyDown={e => { if (e.ctrlKey && e.key === "Enter") handleGenerate(e); }}
                            placeholder="Paste code, documentation, or any technical content here…"
                            disabled={loading}
                            style={{ transition: "opacity 0.3s ease", marginBottom: 14 }}
                        />

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                <span style={{ fontSize: 11, color: overLimit ? "#f87171" : "#475569", fontWeight: overLimit ? 700 : 400, fontVariantNumeric: "tabular-nums" }}>
                                    {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
                                </span>
                                {content.length > 50 && <span style={{ fontSize: 11, color: "#334155" }}>{estimatedTime} est.</span>}
                                <span style={{ fontSize: 11, color: "#2d3748" }}>
                                    <kbd style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(51,65,85,0.6)", borderRadius: 5, padding: "1px 6px", fontSize: 10, fontFamily: "monospace", color: "#475569" }}>Ctrl+Enter</kbd>
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {result && <button className="btn btn-secondary" onClick={() => setResult(null)} style={{ fontSize: 12, padding: "7px 14px" }}>Clear</button>}
                                <button className={`btn btn-primary${loading ? " loading" : ""}`} onClick={handleGenerate} disabled={loading || !content.trim() || overLimit}>
                                    {loading ? <><span className="spinner" /> Generating…</> : <><svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg> Generate Explanation</>}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <PdfTab onExtracted={handlePdfExtracted} onError={msg => showToast(msg, "error")} />
                )}
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="card fade-in" style={{ padding: 22, marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                        <span className="spinner" style={{ color: "#7c3aed", width: 16, height: 16 }} />
                        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Processing with AI…</span>
                    </div>
                    {[92, 100, 78, 86, 65, 95].map((w, i) => (
                        <div key={i} className="skeleton" style={{ height: 13, width: `${w}%`, marginBottom: 10, animationDelay: `${i * 0.08}s` }} />
                    ))}
                </div>
            )}

            {/* Result */}
            {result && !loading && (
                <div ref={resultRef} className="card-glow fade-slide-up" style={{ overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", borderBottom: "1px solid rgba(51,65,85,0.4)", background: "rgba(124,58,237,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="ai-badge">
                                <svg viewBox="0 0 24 24" fill="none" width="9" height="9"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                AI Generated
                            </div>
                            <span style={{ fontSize: 11, color: "#475569" }}>·</span>
                            <span style={{ fontSize: 11, color: "#475569" }}>{(result ?? "").split(/\s+/).filter(Boolean).length} words</span>
                        </div>
                        <CopyBtn text={result} />
                    </div>
                    <div style={{ padding: "20px 22px 8px", maxHeight: 560, overflowY: "auto" }}>
                        <AIResult text={result} />
                    </div>
                    <div className="card-section" style={{ padding: "12px 22px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span className="section-label" style={{ marginRight: 4 }}>Actions</span>
                        <button className="btn btn-secondary" onClick={() => setResult(null)} style={{ fontSize: 12, padding: "6px 14px" }}>
                            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Refine
                        </button>
                        <button className="btn btn-secondary" onClick={(e) => { addRipple(e); handleFollowUp(); }} style={{ fontSize: 12, padding: "6px 14px" }}>
                            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Ask Follow-up
                        </button>
                        <div style={{ flex: 1 }} />
                        <span style={{ fontSize: 11, color: "#2d3748" }}>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useRef } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api", timeout: 60000 });

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

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("idle"); // idle | uploading | success | error
    const [message, setMessage] = useState("");
    const [docs, setDocs] = useState([]);
    const inputRef = useRef(null);

    const handleFile = (f) => {
        if (!f) return;
        if (f.type !== "application/pdf") { setStatus("error"); setMessage("Only PDF files are supported."); return; }
        if (f.size > 20 * 1024 * 1024) { setStatus("error"); setMessage("File must be under 20MB."); return; }
        setFile(f); setStatus("idle"); setMessage(""); setProgress(0);
    };

    const reset = () => { setFile(null); setStatus("idle"); setMessage(""); setProgress(0); };

    const handleUpload = async (e) => {
        if (e) addRipple(e);
        if (!file || status === "uploading") return;
        setStatus("uploading"); setProgress(0); setMessage("");
        const fd = new FormData();
        fd.append("file", file);
        try {
            const res = await API.post("/upload", fd, {
                onUploadProgress: ev => {
                    if (ev.total) setProgress(Math.round((ev.loaded * 100) / ev.total));
                },
            });
            setStatus("success"); setProgress(100);
            setMessage(res.data.message || "Document processed successfully");
            setDocs(prev => [{ id: Date.now(), name: file.name, size: file.size, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...prev]);
            setTimeout(reset, 3500);
        } catch (err) {
            setStatus("error");
            setMessage(err?.response?.data?.message || err?.message || "Upload failed");
        }
    };

    return (
        <div style={{ padding: "24px 32px 40px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.1))", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(59,130,246,0.12)" }}>
                    <svg viewBox="0 0 24 24" fill="none" width="19" height="19"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="#818cf8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                    <h1 style={{ fontSize: 21, fontWeight: 800, color: "#f1f5f9", margin: 0, letterSpacing: "-0.025em" }}>Upload Knowledge</h1>
                    <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0" }}>Add PDFs to the AI knowledge base (RAG)</p>
                </div>
            </div>

            {/* Main card */}
            <div className="card" style={{ overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "22px 24px" }}>

                    {/* Success state */}
                    {status === "success" ? (
                        <div className="pop-in" style={{ textAlign: "center", padding: "28px 0" }}>
                            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(5,150,105,0.12)", border: "2px solid rgba(16,185,129,0.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 0 40px rgba(16,185,129,0.15)", animation: "successPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                                <svg viewBox="0 0 24 24" fill="none" width="30" height="30"><path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <p style={{ color: "#6ee7b7", fontWeight: 800, fontSize: 16, margin: "0 0 6px", letterSpacing: "-0.01em" }}>Document Processed!</p>
                            <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>{message}</p>
                        </div>
                    ) : (
                        <>
                            {/* Drop zone */}
                            {!file ? (
                                <div
                                    className={`dropzone${dragging ? " dropzone-drag" : ""}`}
                                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                                    onClick={() => inputRef.current?.click()}
                                    style={{ marginBottom: 16 }}
                                >
                                    <input ref={inputRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

                                    <div style={{ width: 56, height: 56, borderRadius: 16, background: dragging ? "rgba(124,58,237,0.12)" : "rgba(15,23,42,0.7)", border: `1px solid ${dragging ? "rgba(139,92,246,0.5)" : "rgba(51,65,85,0.5)"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", transition: "all 0.2s", boxShadow: dragging ? "0 0 24px rgba(124,58,237,0.2)" : "none" }}>
                                        <svg viewBox="0 0 24 24" fill="none" width="24" height="24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke={dragging ? "#a78bfa" : "#475569"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                    <p style={{ color: dragging ? "#c4b5fd" : "#94a3b8", fontWeight: 700, fontSize: 15, margin: "0 0 5px", transition: "color 0.2s" }}>
                                        {dragging ? "Release to upload" : "Drag & drop your PDF here"}
                                    </p>
                                    <p style={{ color: "#475569", fontSize: 12.5, margin: "0 0 16px" }}>or click to browse · PDF only · Max 20MB</p>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(10,18,35,0.7)", border: "1px solid rgba(51,65,85,0.4)", borderRadius: 9999, padding: "5px 14px" }}>
                                        <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="#ef4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>PDF Document</span>
                                    </div>
                                </div>
                            ) : (
                                /* File preview */
                                <div className="pop-in" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(10,18,35,0.5)", border: "1px solid rgba(51,65,85,0.45)", borderRadius: 13, marginBottom: 16 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 11, background: "rgba(220,38,38,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="#ef4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 13.5, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                                        <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>{formatSize(file.size)} · PDF</p>
                                    </div>
                                    {status !== "uploading" && (
                                        <button onClick={reset} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 20, padding: 4, lineHeight: 1, borderRadius: 6, transition: "color 0.15s" }}
                                            onMouseEnter={e => e.target.style.color = "#94a3b8"}
                                            onMouseLeave={e => e.target.style.color = "#475569"}
                                        >×</button>
                                    )}
                                </div>
                            )}

                            {/* Progress */}
                            {status === "uploading" && (
                                <div className="fade-in" style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                                        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Uploading & processing…</span>
                                        <span style={{ fontSize: 12, color: "#475569", fontVariantNumeric: "tabular-nums" }}>{progress}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {status === "error" && (
                                <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(69,10,10,0.5)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 11, marginBottom: 16 }}>
                                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14" style={{ flexShrink: 0 }}><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <span style={{ flex: 1, fontSize: 13, color: "#fca5a5", lineHeight: 1.5 }}>{message}</span>
                                    <button onClick={() => { setStatus("idle"); setMessage(""); }} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 18, opacity: 0.6, lineHeight: 1 }}>×</button>
                                </div>
                            )}

                            {/* Upload button */}
                            {file && (
                                <button className={`btn btn-primary ${status === "uploading" ? "loading" : ""}`} onClick={handleUpload} disabled={status === "uploading"} style={{ width: "100%", justifyContent: "center", fontSize: 14, padding: "12px 20px" }}>
                                    {status === "uploading"
                                        ? <><span className="spinner" /> Processing Document…</>
                                        : <><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg> Upload to Knowledge Base</>
                                    }
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Info footer */}
                <div className="card-section" style={{ padding: "10px 24px", display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {[
                        { d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "PDF only", color: "#a78bfa" },
                        { d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4", text: "Max 20MB", color: "#60a5fa" },
                        { d: "M13 10V3L4 14h7v7l9-11h-7z", text: "RAG pipeline", color: "#34d399" },
                    ].map(({ d, text, color }) => (
                        <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569" }}>
                            <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d={d} stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            {text}
                        </div>
                    ))}
                </div>
            </div>

            {/* Uploaded docs */}
            {docs.length > 0 && (
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>Uploaded Documents</span>
                        <span className="badge" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa" }}>{docs.length}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {docs.map(doc => (
                            <div key={doc.id} className="card pop-in" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px" }}>
                                <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(5,150,105,0.1)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</p>
                                    <p style={{ color: "#475569", fontSize: 11, margin: 0 }}>{formatSize(doc.size)} · {doc.time}</p>
                                </div>
                                <span className="badge" style={{ background: "rgba(5,150,105,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#6ee7b7", flexShrink: 0 }}>✓ Ready</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty knowledge base card */}
            {docs.length === 0 && !file && (
                <div className="card" style={{ padding: "18px 22px" }}>
                    <p className="section-label" style={{ marginBottom: 8 }}>Knowledge Base</p>
                    <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                        Upload PDF documents to expand the AI's knowledge. Documents are processed through the RAG pipeline and become available for Q&amp;A sessions instantly.
                    </p>
                </div>
            )}
        </div>
    );
}

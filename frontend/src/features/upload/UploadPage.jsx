import { useState, useRef } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api", timeout: 60000 });

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

    const handleUpload = async () => {
        if (!file || status === "uploading") return;
        setStatus("uploading"); setProgress(0); setMessage("");
        const fd = new FormData();
        fd.append("file", file);
        try {
            const res = await API.post("/upload", fd, {
                onUploadProgress: e => {
                    if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
                },
            });
            setStatus("success");
            setProgress(100);
            setMessage(res.data.message || "Document processed successfully");
            setDocs(prev => [{ id: Date.now(), name: file.name, size: file.size }, ...prev]);
            setTimeout(() => { setFile(null); setStatus("idle"); setProgress(0); }, 3000);
        } catch (err) {
            setStatus("error");
            setMessage(err?.response?.data?.message || err?.message || "Upload failed");
        }
    };

    return (
        <div style={{ padding: "28px 32px", maxWidth: 720, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="#818cf8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Upload Knowledge</h1>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Add PDFs to the AI knowledge base (RAG)</p>
                    </div>
                </div>
            </div>

            {/* Upload card */}
            <div className="card" style={{ overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: 24 }}>
                    {/* Drop zone */}
                    {status !== "success" && (
                        <>
                            {!file ? (
                                <div
                                    className={`dropzone${dragging ? " dropzone-drag" : ""}`}
                                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                                    onClick={() => inputRef.current?.click()}
                                >
                                    <input ref={inputRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
                                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(30,41,59,0.8)", border: "1px solid rgba(71,85,105,0.5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                                        <svg viewBox="0 0 24 24" fill="none" width="24" height="24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke={dragging ? "#a78bfa" : "#64748b"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                    <p style={{ color: dragging ? "#c4b5fd" : "#94a3b8", fontWeight: 700, fontSize: 15, margin: "0 0 6px" }}>
                                        {dragging ? "Release to upload" : "Drag & drop your PDF here"}
                                    </p>
                                    <p style={{ color: "#475569", fontSize: 13, margin: "0 0 16px" }}>or click to browse · PDF only · Max 20MB</p>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(30,41,59,0.8)", border: "1px solid rgba(71,85,105,0.4)", borderRadius: 9999, padding: "5px 14px" }}>
                                        <svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="#ef4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>PDF Document</span>
                                    </div>
                                </div>
                            ) : (
                                /* File preview */
                                <div className="pop-in" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(71,85,105,0.4)", borderRadius: 12, marginBottom: 14 }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(220,38,38,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="#ef4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                                        <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>{formatSize(file.size)} · PDF Document</p>
                                    </div>
                                    {status !== "uploading" && (
                                        <button onClick={() => { setFile(null); setStatus("idle"); setMessage(""); setProgress(0); }} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4, fontSize: 18, flexShrink: 0 }}>×</button>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Progress bar */}
                    {status === "uploading" && (
                        <div className="fade-in" style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Uploading & Processing…</span>
                                <span style={{ fontSize: 12, color: "#64748b" }}>{progress}%</span>
                            </div>
                            <div style={{ height: 6, background: "rgba(30,41,59,0.8)", borderRadius: 9999, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #7c3aed, #6366f1)", borderRadius: 9999, transition: "width 0.3s ease" }} />
                            </div>
                        </div>
                    )}

                    {/* Success state */}
                    {status === "success" && (
                        <div className="fade-in" style={{ textAlign: "center", padding: "24px 0" }}>
                            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(5,150,105,0.15)", border: "2px solid rgba(16,185,129,0.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", animation: "popIn 0.3s ease both" }}>
                                <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            <p style={{ color: "#6ee7b7", fontWeight: 700, fontSize: 15, margin: "0 0 6px" }}>Document Processed!</p>
                            <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>{message}</p>
                        </div>
                    )}

                    {/* Error message */}
                    {status === "error" && (
                        <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(69,10,10,0.5)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, marginBottom: 14 }}>
                            <svg viewBox="0 0 24 24" fill="none" width="15" height="15" style={{ flexShrink: 0 }}><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f87171" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span style={{ flex: 1, fontSize: 13, color: "#fca5a5" }}>{message}</span>
                            <button onClick={() => { setStatus("idle"); setMessage(""); }} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", opacity: 0.7, fontSize: 16 }}>×</button>
                        </div>
                    )}

                    {/* Upload button */}
                    {file && status !== "success" && (
                        <button className="btn btn-primary" onClick={handleUpload} disabled={status === "uploading"} style={{ width: "100%", justifyContent: "center", fontSize: 14, padding: "11px 20px" }}>
                            {status === "uploading"
                                ? <><span className="spinner" /> Processing Document…</>
                                : <><svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg> Upload to Knowledge Base</>
                            }
                        </button>
                    )}
                </div>

                {/* Info footer */}
                <div style={{ padding: "10px 24px", borderTop: "1px solid rgba(51,65,85,0.35)", background: "rgba(15,23,42,0.4)", display: "flex", gap: 20, flexWrap: "wrap" }}>
                    {[
                        { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "PDF only", color: "#a78bfa" },
                        { icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4", text: "Max 20MB", color: "#60a5fa" },
                        { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "RAG pipeline", color: "#34d399" },
                    ].map(({ icon, text, color }) => (
                        <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                            <svg viewBox="0 0 24 24" fill="none" width="13" height="13"><path d={icon} stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            {text}
                        </div>
                    ))}
                </div>
            </div>

            {/* Uploaded docs list */}
            {docs.length > 0 && (
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", margin: 0 }}>Uploaded Documents</h2>
                        <span className="badge" style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(71,85,105,0.4)", color: "#64748b" }}>{docs.length}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {docs.map(doc => (
                            <div key={doc.id} className="card pop-in" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
                                <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(5,150,105,0.12)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</p>
                                    <p style={{ color: "#64748b", fontSize: 11, margin: 0 }}>{formatSize(doc.size)} · Processed</p>
                                </div>
                                <span className="badge" style={{ background: "rgba(5,150,105,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#6ee7b7", flexShrink: 0 }}>✓ Ready</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty knowledge base info */}
            {docs.length === 0 && !file && (
                <div className="card" style={{ padding: "20px 24px" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#475569", margin: "0 0 8px" }}>Knowledge Base</p>
                    <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                        Upload PDF documents to expand the AI's knowledge. Documents are processed through the RAG pipeline and become available for Q&amp;A sessions.
                    </p>
                </div>
            )}
        </div>
    );
}

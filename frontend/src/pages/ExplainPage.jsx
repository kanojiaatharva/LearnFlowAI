import { useState } from "react";
import api from "../services/api.js";
import UploadBox from "../components/UploadBox.jsx";
import ResultView from "../components/ResultView.jsx";

// ── Status enum ────────────────────────────────────────────────
const STATUS = { IDLE: "idle", LOADING: "loading", SUCCESS: "success", ERROR: "error" };

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];

// ── Inline loader used in the page ─────────────────────────────
function InlineLoader({ message }) {
    return (
        <div className="flex items-center gap-3 p-4 glass-card">
            <div className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                    <span
                        key={delay}
                        className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                    />
                ))}
            </div>
            <p className="text-sm text-gray-400 font-medium">{message}</p>
        </div>
    );
}

// ── Error banner ────────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 animate-fade-slide-in">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-red-400 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex-1 space-y-0.5">
                <p className="text-sm font-semibold text-red-300">Failed to generate explanation</p>
                <p className="text-xs text-red-400/70">{message}</p>
            </div>
            <button
                onClick={onDismiss}
                aria-label="Dismiss error"
                className="text-red-400/50 hover:text-red-300 transition-colors mt-0.5"
            >
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}

// ── Main Page ───────────────────────────────────────────────────
export default function ExplainPage() {
    const [content, setContent] = useState("");
    const [skillLevel, setSkillLevel] = useState("Intermediate");
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState(STATUS.IDLE);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("text"); // "text" | "pdf"

    const isLoading = status === STATUS.LOADING;

    const handleExplain = async () => {
        if (!content.trim() || isLoading) return;
        setStatus(STATUS.LOADING);
        setError(null);
        setResult(null);
        try {
            const res = await api.post("/explain", { content: content.trim() });
            setResult(res.data.explanation);
            setStatus(STATUS.SUCCESS);
        } catch (err) {
            setError(err.message);
            setStatus(STATUS.ERROR);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
        setStatus(STATUS.IDLE);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-5">
            {/* ── Page Header ── */}
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-violet-400" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-lg font-bold text-white">Explain Content</h1>
                </div>
                <p className="text-sm text-gray-400">
                    Paste code or documentation and get an AI-powered explanation tailored to your skill level.
                </p>
            </div>

            {/* ── Input Card ── */}
            <div className="glass-card overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-800/60">
                    {[
                        {
                            id: "text",
                            label: "Text / Code",
                            icon: <path d="M4 6h16M4 12h16M4 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
                        },
                        {
                            id: "pdf",
                            label: "PDF Upload",
                            icon: <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); handleReset(); }}
                            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${activeTab === tab.id
                                    ? "border-violet-500 text-violet-300 bg-violet-500/5"
                                    : "border-transparent text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                                {tab.icon}
                            </svg>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="p-5 space-y-4">
                    {activeTab === "text" ? (
                        <>
                            {/* Skill level */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-xs font-medium text-gray-400">Skill Level:</span>
                                <div className="flex gap-1.5">
                                    {SKILL_LEVELS.map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setSkillLevel(level)}
                                            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 ${skillLevel === level
                                                    ? "bg-violet-600/20 border-violet-500/40 text-violet-300"
                                                    : "bg-gray-800/40 border-gray-700/60 text-gray-400 hover:border-gray-600 hover:text-gray-300"
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Textarea */}
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyDown={(e) => { if (e.ctrlKey && e.key === "Enter") handleExplain(); }}
                                placeholder="Paste documentation, code snippets, or any technical content here..."
                                aria-label="Content to explain"
                                className="input-field min-h-[210px] font-mono text-sm leading-relaxed"
                                disabled={isLoading}
                            />

                            {/* Submit row */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    {/* Character count */}
                                    <span className={`text-xs ${content.length > 8000 ? "text-amber-400" : "text-gray-600"}`}>
                                        {content.length.toLocaleString()} chars
                                    </span>
                                    <span className="text-gray-700 text-xs">·</span>
                                    <span className="text-xs text-gray-600">Ctrl+Enter to submit</span>
                                </div>

                                <div className="flex gap-2">
                                    {(status === STATUS.SUCCESS || status === STATUS.ERROR) && (
                                        <button onClick={handleReset} className="btn-secondary text-sm py-2.5">
                                            New Explanation
                                        </button>
                                    )}
                                    <button
                                        onClick={handleExplain}
                                        disabled={isLoading || !content.trim()}
                                        className="btn-primary"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="8" />
                                                </svg>
                                                Generating…
                                            </>
                                        ) : (
                                            <>
                                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Generate Explanation
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <UploadBox
                            onResult={(r) => { setResult(r); setError(null); setStatus(STATUS.SUCCESS); }}
                            onError={(msg) => { setError(msg); setStatus(STATUS.ERROR); }}
                            onLoading={(v) => setStatus(v ? STATUS.LOADING : STATUS.IDLE)}
                        />
                    )}
                </div>
            </div>

            {/* ── Status area ── */}
            {status === STATUS.LOADING && (
                <InlineLoader message="Analyzing content with AI…" />
            )}

            {status === STATUS.ERROR && error && (
                <ErrorBanner message={error} onDismiss={handleReset} />
            )}

            {status === STATUS.SUCCESS && result && (
                <ResultView result={result} />
            )}
        </div>
    );
}

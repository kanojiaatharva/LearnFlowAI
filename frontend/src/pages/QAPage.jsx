import { useState, useRef, useEffect, useCallback } from "react";
import api from "../services/api.js";
import ChatWindow from "../components/ChatWindow.jsx";

export default function QAPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef();
    const textareaRef = useRef();

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Auto-resize textarea height
    const resizeTextarea = useCallback((el) => {
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }, []);

    const sendMessage = async (questionOverride) => {
        const question = (questionOverride ?? input).trim();
        if (!question || loading) return;

        setInput("");
        setError(null);

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        // Optimistic update — user message appears immediately
        setMessages((prev) => [...prev, { role: "user", content: question }]);
        setLoading(true);

        try {
            const res = await api.post("/qa", { question });
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: res.data.answer },
            ]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 80);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const questionCount = messages.filter((m) => m.role === "user").length;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* ── Page Header ── */}
            <div className="px-6 pt-5 pb-4 border-b border-gray-800/60 shrink-0 bg-gray-950/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-violet-400" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white leading-none">Q&amp;A Assistant</h1>
                            <p className="text-xs text-gray-500 mt-0.5">Ask any technical question</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {messages.length > 0 && (
                            <button
                                onClick={clearChat}
                                className="btn-secondary text-xs py-1.5 px-3 gap-1.5"
                                aria-label="Clear chat history"
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Clear
                            </button>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {questionCount} {questionCount === 1 ? "question" : "questions"}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Chat messages (flex-1, scrollable) ── */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <ChatWindow
                    messages={messages}
                    loading={loading}
                    onExampleClick={(q) => sendMessage(q)}
                />
            </div>

            {/* ── Error banner ── */}
            {error && (
                <div className="mx-4 mb-2 flex items-center gap-3 p-3 rounded-xl bg-red-500/8 border border-red-500/20 shrink-0 animate-fade-slide-in">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-red-400 shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-xs text-red-300 flex-1">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-400/60 hover:text-red-300 transition-colors p-0.5"
                        aria-label="Dismiss error"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            )}

            {/* ── Sticky input bar ── */}
            <div className="px-4 pb-4 pt-2 border-t border-gray-800/60 shrink-0">
                <div className="flex gap-2.5 items-end glass-card p-2.5 focus-within:ring-2 focus-within:ring-violet-500/30 transition-all duration-200">
                    <textarea
                        ref={(el) => {
                            inputRef.current = el;
                            textareaRef.current = el;
                        }}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            resizeTextarea(e.target);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question… (Enter to send, Shift+Enter for new line)"
                        disabled={loading}
                        rows={1}
                        aria-label="Chat input"
                        className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none resize-none leading-relaxed py-1 px-2 min-h-[36px] max-h-[120px] overflow-y-auto disabled:opacity-60"
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        aria-label="Send message"
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200
              ${loading || !input.trim()
                                ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                                : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 active:scale-90"
                            }`}
                    >
                        {loading ? (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="8" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 translate-x-px" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-700 mt-1.5 text-center">
                    <kbd className="bg-gray-800/80 border border-gray-700 px-1 py-0.5 rounded text-gray-500 text-[10px]">Enter</kbd>
                    {" "}to send · {" "}
                    <kbd className="bg-gray-800/80 border border-gray-700 px-1 py-0.5 rounded text-gray-500 text-[10px]">Shift+Enter</kbd>
                    {" "}for new line
                </p>
            </div>
        </div>
    );
}

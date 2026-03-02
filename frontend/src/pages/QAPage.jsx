import { useState, useRef, useEffect } from "react";
import api from "../services/api.js";
import ChatWindow from "../components/ChatWindow.jsx";

export default function QAPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef();

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const sendMessage = async () => {
        const question = input.trim();
        if (!question || loading) return;

        setInput("");
        setError(null);
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
            // Remove the user message on error (optional UX decision — keep it here)
        } finally {
            setLoading(false);
            // Re-focus input after response
            setTimeout(() => inputRef.current?.focus(), 100);
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
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-full max-h-full overflow-hidden">
            {/* Page Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-800/60 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-violet-400" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white leading-tight">Q&A Assistant</h1>
                            <p className="text-xs text-gray-500">Ask any technical question and get instant answers</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {messages.length > 0 && (
                            <button
                                onClick={clearChat}
                                className="btn-secondary text-xs py-1.5 px-3 gap-1.5"
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Clear
                            </button>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            {messages.filter(m => m.role === "user").length} questions asked
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <ChatWindow messages={messages} loading={loading} />
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mx-4 mb-2 flex items-center gap-3 p-3 rounded-xl bg-red-500/8 border border-red-500/20 shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-red-400 shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-xs text-red-300 flex-1">{error}</p>
                    <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-300">
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="px-4 pb-5 pt-3 border-t border-gray-800/60 shrink-0">
                <div className="flex gap-3 items-end glass-card p-2.5">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question... (Enter to send, Shift+Enter for new line)"
                        disabled={loading}
                        rows={1}
                        className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none resize-none leading-relaxed py-1 px-2 min-h-[36px] max-h-[120px] overflow-y-auto"
                        style={{
                            height: "auto",
                        }}
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200
              ${loading || !input.trim()
                                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 active:scale-95"
                            }`}
                    >
                        {loading ? (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4" strokeDashoffset="10" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-700 mt-2 text-center">
                    Press <kbd className="text-gray-600 bg-gray-800 px-1 py-0.5 rounded text-xs">Enter</kbd> to send
                </p>
            </div>
        </div>
    );
}

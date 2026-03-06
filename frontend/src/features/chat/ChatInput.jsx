import { useCallback, useRef } from "react";

/**
 * ChatInput — auto-resizing textarea with send button.
 */
export default function ChatInput({ value, onChange, onSend, loading, disabled }) {
    const textareaRef = useRef(null);

    const resize = useCallback((el) => {
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!loading && value.trim()) onSend();
        }
    };

    const handleChange = (e) => {
        onChange(e.target.value);
        resize(e.target);
    };

    const handleSend = () => {
        if (!loading && value.trim()) {
            onSend();
            // Reset height
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const canSend = !loading && !disabled && value.trim().length > 0;

    return (
        <div className="px-4 pb-4 pt-2.5 border-t border-gray-800/50 shrink-0">
            <div className="flex gap-2.5 items-end glass-card p-2.5 focus-within:ring-2 focus-within:ring-violet-500/25 transition-all duration-200">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a technical question… (Enter to send, Shift+Enter for new line)"
                    disabled={loading || disabled}
                    rows={1}
                    aria-label="Chat input"
                    className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none resize-none leading-relaxed py-1 px-2 min-h-[36px] max-h-[120px] overflow-y-auto disabled:opacity-60"
                />

                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    aria-label="Send message"
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${canSend
                            ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 active:scale-90 hover:-translate-y-px"
                            : "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                        }`}
                >
                    {loading ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="8" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 translate-x-px">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
            </div>

            <p className="text-[11px] text-gray-700 mt-1.5 text-center">
                <kbd className="bg-gray-800/80 border border-gray-700 px-1 py-0.5 rounded text-[10px] text-gray-600 font-mono">Enter</kbd>
                {" "}to send ·{" "}
                <kbd className="bg-gray-800/80 border border-gray-700 px-1 py-0.5 rounded text-[10px] text-gray-600 font-mono">Shift+Enter</kbd>
                {" "}for new line
            </p>
        </div>
    );
}

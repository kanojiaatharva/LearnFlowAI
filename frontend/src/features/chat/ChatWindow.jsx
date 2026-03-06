import { useEffect, useRef } from "react";
import { EXAMPLE_QUESTIONS } from "../../utils/constants.js";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

/**
 * ChatWindow — scrollable message list with empty state and auto-scroll.
 */
export default function ChatWindow({ messages, loading, onExampleClick }) {
    const bottomRef = useRef(null);

    // Auto-scroll on new messages or loading state change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const isEmpty = messages.length === 0 && !loading;

    return (
        <div className="h-full overflow-y-auto px-4 py-4">
            {isEmpty ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center min-h-full gap-6 text-center py-12">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-600/10 border border-violet-500/20 flex items-center justify-center shadow-xl shadow-violet-900/10">
                        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-violet-400">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <div>
                        <p className="text-gray-200 font-semibold text-base">Ask anything technical</p>
                        <p className="text-gray-500 text-sm mt-1.5 max-w-[300px] leading-relaxed mx-auto">
                            Get instant AI answers on code, algorithms, frameworks, or any concept.
                        </p>
                    </div>

                    {/* Example question chips */}
                    <div className="flex flex-col gap-2 w-full max-w-[340px]">
                        <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Try asking</p>
                        {EXAMPLE_QUESTIONS.slice(0, 3).map((q) => (
                            <button
                                key={q}
                                onClick={() => onExampleClick?.(q)}
                                className="text-xs text-gray-400 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-xl px-4 py-2.5 text-left transition-all duration-150 active:scale-[0.98] hover:text-gray-200"
                            >
                                <span className="text-violet-500 mr-1">↗</span>
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                /* Messages */
                <div className="space-y-4 max-w-3xl mx-auto">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
                    ))}

                    {loading && <TypingIndicator />}

                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
}

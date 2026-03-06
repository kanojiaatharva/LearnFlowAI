import { useEffect, useRef } from "react";

function ChatBubble({ role, content }) {
    const isUser = role === "user";
    return (
        <div className={`flex gap-2.5 animate-fade-slide-in ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 select-none
          ${isUser
                        ? "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-md shadow-violet-900/30"
                        : "bg-gray-800 border border-gray-700 text-gray-300"
                    }`}
            >
                {isUser ? "U" : "AI"}
            </div>

            {/* Bubble */}
            <div
                className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed
          ${isUser
                        ? "bg-violet-600 text-white rounded-2xl rounded-tr-sm shadow-sm shadow-violet-900/20"
                        : "bg-gray-800/80 border border-gray-700/60 text-gray-200 rounded-2xl rounded-tl-sm"
                    }`}
            >
                <span className="whitespace-pre-wrap">{content}</span>
            </div>
        </div>
    );
}

const EXAMPLE_QUESTIONS = [
    "What is a REST API?",
    "Explain async/await in JavaScript",
    "How does React reconciliation work?",
];

export default function ChatWindow({ messages, loading, onExampleClick }) {
    const containerRef = useRef(null);
    const bottomRef = useRef(null);

    // Auto-scroll to bottom whenever messages or loading changes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const isEmpty = messages.length === 0 && !loading;

    return (
        /* Single container — always fills available space */
        <div
            ref={containerRef}
            className="h-full overflow-y-auto px-4 py-4"
        >
            {isEmpty ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center min-h-full gap-5 text-center py-12">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-violet-400" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-gray-200 font-semibold text-sm">Ask anything technical</p>
                        <p className="text-gray-500 text-xs mt-1 max-w-[280px] leading-relaxed">
                            Questions about code, algorithms, frameworks, or any concept you want explained.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-[300px]">
                        {EXAMPLE_QUESTIONS.map((q) => (
                            <button
                                key={q}
                                onClick={() => onExampleClick?.(q)}
                                className="text-xs text-gray-400 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/60 hover:border-gray-600 rounded-xl px-4 py-2.5 text-left transition-all duration-150 active:scale-[0.98]"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                /* Message list */
                <div className="space-y-4">
                    {messages.map((msg, i) => (
                        <ChatBubble key={i} role={msg.role} content={msg.content} />
                    ))}

                    {/* Typing indicator */}
                    {loading && (
                        <div className="flex gap-2.5 animate-fade-slide-in">
                            <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-300 shrink-0 mt-0.5">
                                AI
                            </div>
                            <div className="bg-gray-800/80 border border-gray-700/60 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "160ms" }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "320ms" }} />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
}

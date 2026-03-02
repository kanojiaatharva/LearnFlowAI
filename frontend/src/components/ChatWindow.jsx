import { useEffect, useRef } from "react";

function ChatBubble({ role, content }) {
    const isUser = role === "user";
    return (
        <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5
          ${isUser
                        ? "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white"
                        : "bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-700 text-gray-300"
                    }`}
            >
                {isUser ? "A" : "AI"}
            </div>

            {/* Bubble */}
            <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isUser
                        ? "bg-violet-600 text-white rounded-tr-none"
                        : "bg-gray-800/80 border border-gray-700/60 text-gray-200 rounded-tl-none"
                    }`}
            >
                <span className="whitespace-pre-wrap">{content}</span>
            </div>
        </div>
    );
}

export default function ChatWindow({ messages, loading }) {
    const bottomRef = useRef();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    if (messages.length === 0 && !loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6 py-12">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-violet-400" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div>
                    <p className="text-gray-300 font-semibold text-base">Ask anything technical</p>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed max-w-xs">
                        Ask questions about code, algorithms, frameworks, or any documentation you want explained.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-2 w-full max-w-sm mt-2">
                    {[
                        "What is a REST API?",
                        "Explain async/await in JavaScript",
                        "How does React reconciliation work?",
                    ].map((q) => (
                        <div
                            key={q}
                            className="text-xs text-gray-400 bg-gray-800/40 border border-gray-700/60 rounded-lg px-4 py-2.5 text-left hover:bg-gray-800 cursor-default transition-colors"
                        >
                            {q}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg, i) => (
                <ChatBubble key={i} role={msg.role} content={msg.content} />
            ))}

            {loading && (
                <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 shrink-0 mt-0.5">
                        AI
                    </div>
                    <div className="bg-gray-800/80 border border-gray-700/60 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                        <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}

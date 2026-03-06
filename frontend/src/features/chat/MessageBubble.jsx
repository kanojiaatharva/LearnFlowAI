import { parseMarkdownBlocks, parseInlineMarkdown } from "../../utils/formatters.js";

/**
 * Renders inline markdown for chat bubbles.
 */
function InlineText({ text }) {
    const segments = parseInlineMarkdown(text);
    return (
        <>
            {segments.map((seg, i) => {
                if (seg.type === "bold") return <strong key={i} className="font-semibold text-inherit">{seg.content}</strong>;
                if (seg.type === "code") return (
                    <code key={i} className="bg-black/20 text-violet-200 text-[11px] px-1.5 py-0.5 rounded font-mono">
                        {seg.content}
                    </code>
                );
                return <span key={i}>{seg.content}</span>;
            })}
        </>
    );
}

/**
 * MessageBubble — a single chat message, user or AI, with markdown support.
 */
export default function MessageBubble({ role, content }) {
    const isUser = role === "user";
    const blocks = parseMarkdownBlocks(content);

    return (
        <div className={`flex gap-2.5 animate-fade-slide-in ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 select-none ${isUser
                    ? "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-md shadow-violet-900/30"
                    : "bg-gray-800 border border-gray-700/60 text-gray-400"
                }`}>
                {isUser ? "U" : (
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-violet-400">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>

            {/* Bubble */}
            <div className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${isUser
                    ? "bg-violet-600 text-white rounded-tr-sm shadow-sm shadow-violet-900/30"
                    : "bg-gray-800/80 border border-gray-700/50 text-gray-200 rounded-tl-sm"
                }`}>
                {isUser ? (
                    <span className="whitespace-pre-wrap">{content}</span>
                ) : (
                    <div className="space-y-2 text-sm leading-relaxed">
                        {blocks.map((block, i) => {
                            switch (block.type) {
                                case "h1": return <h4 key={i} className="font-bold text-white text-sm mt-2 first:mt-0"><InlineText text={block.content} /></h4>;
                                case "h2": return <h5 key={i} className="font-semibold text-gray-100 text-sm mt-1 first:mt-0"><InlineText text={block.content} /></h5>;
                                case "h3": return <h6 key={i} className="font-semibold text-violet-300 text-xs mt-1 first:mt-0 uppercase tracking-wide"><InlineText text={block.content} /></h6>;
                                case "bold-line": return <p key={i} className="font-semibold text-gray-100"><InlineText text={block.content} /></p>;
                                case "list": return (
                                    <ul key={i} className="space-y-1 pl-1">
                                        {block.items.map((item, j) => (
                                            <li key={j} className="flex gap-2">
                                                <span className="mt-2 w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                                                <span className="text-gray-200"><InlineText text={item} /></span>
                                            </li>
                                        ))}
                                    </ul>
                                );
                                case "code": return (
                                    <pre key={i} className="bg-gray-900/80 border border-gray-700/60 rounded-lg p-3 overflow-x-auto text-xs font-mono text-gray-300 leading-relaxed">
                                        <code>{block.content}</code>
                                    </pre>
                                );
                                case "spacer": return <div key={i} className="h-0.5" />;
                                default: return <p key={i} className="whitespace-pre-wrap"><InlineText text={block.content} /></p>;
                            }
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

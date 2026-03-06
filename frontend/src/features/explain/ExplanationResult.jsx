import { useState, useCallback } from "react";
import { copyToClipboard } from "../../utils/helpers.js";
import { parseMarkdownBlocks, parseInlineMarkdown, countWords } from "../../utils/formatters.js";
import { toast } from "../common/Toast.jsx";

/**
 * Renders inline markdown (bold + code) segments.
 */
function InlineText({ text }) {
    const segments = parseInlineMarkdown(text);
    return (
        <>
            {segments.map((seg, i) => {
                if (seg.type === "bold") return <strong key={i} className="font-semibold text-gray-100">{seg.content}</strong>;
                if (seg.type === "code") return (
                    <code key={i} className="bg-gray-800 border border-gray-700/60 text-violet-300 text-[11px] px-1.5 py-0.5 rounded font-mono">
                        {seg.content}
                    </code>
                );
                return <span key={i}>{seg.content}</span>;
            })}
        </>
    );
}

/**
 * Rich Markdown content renderer.
 */
function RichContent({ text }) {
    const blocks = parseMarkdownBlocks(text);

    return (
        <div className="space-y-3 text-sm leading-7 text-gray-300">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case "h1":
                        return <h2 key={i} className="text-base font-bold text-white mt-5 first:mt-0 pb-1 border-b border-gray-800/60"><InlineText text={block.content} /></h2>;
                    case "h2":
                        return <h3 key={i} className="text-sm font-bold text-gray-100 mt-4 first:mt-0"><InlineText text={block.content} /></h3>;
                    case "h3":
                        return <h4 key={i} className="text-sm font-semibold text-violet-300 mt-3 first:mt-0"><InlineText text={block.content} /></h4>;
                    case "bold-line":
                        return <p key={i} className="font-semibold text-gray-200"><InlineText text={block.content} /></p>;
                    case "list":
                        return (
                            <ul key={i} className="space-y-1.5 pl-1">
                                {block.items.map((item, j) => (
                                    <li key={j} className="flex gap-3">
                                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-violet-500/80 shrink-0" />
                                        <span><InlineText text={item} /></span>
                                    </li>
                                ))}
                            </ul>
                        );
                    case "code":
                        return (
                            <div key={i} className="relative group">
                                {block.lang && (
                                    <span className="absolute top-3 right-3 text-[10px] text-gray-500 font-mono bg-gray-800 px-2 py-0.5 rounded">
                                        {block.lang}
                                    </span>
                                )}
                                <pre className="code-block">
                                    <code>{block.content}</code>
                                </pre>
                            </div>
                        );
                    case "spacer":
                        return <div key={i} className="h-1" />;
                    default:
                        return <p key={i}><InlineText text={block.content} /></p>;
                }
            })}
        </div>
    );
}

/**
 * ExplanationResult — displays the AI explanation with copy button.
 */
export default function ExplanationResult({ result, onReset }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        const ok = await copyToClipboard(result);
        if (ok) {
            setCopied(true);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopied(false), 2500);
        } else {
            toast.error("Failed to copy — please copy manually.");
        }
    }, [result]);

    if (!result) return null;

    return (
        <div className="glass-card-glow overflow-hidden animate-fade-slide-up">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-800/60">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-emerald-400">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="text-sm font-semibold text-gray-200 flex-1">AI Explanation</span>
                <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Generated
                </span>
            </div>

            {/* Rich content */}
            <div className="px-5 py-4 max-h-[560px] overflow-y-auto">
                <RichContent text={result} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800/40 bg-gray-900/30">
                <p className="text-xs text-gray-600">{countWords(result).toLocaleString()} words</p>
                <div className="flex items-center gap-2">
                    {onReset && (
                        <button onClick={onReset} className="btn-secondary text-xs py-1.5 px-3">
                            New Explanation
                        </button>
                    )}
                    <button
                        onClick={handleCopy}
                        className={`btn-secondary text-xs py-1.5 px-3 ${copied ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" : ""
                            }`}
                    >
                        {copied ? (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Copy Response
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

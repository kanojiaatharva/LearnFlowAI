import { useState, useCallback } from "react";

/**
 * Parses plain-text AI output into rich blocks:
 *  - Lines starting with ##/# → headings
 *  - Lines starting with -/* → list items
 *  - Blank lines → paragraph breaks
 *  - Code fences (```...```) → code block
 *  - Everything else → body text
 */
function parseBlocks(text) {
    const lines = text.split("\n");
    const blocks = [];
    let codeBuffer = [];
    let inCode = false;

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const trimmed = raw.trim();

        // Code fence toggle
        if (trimmed.startsWith("```")) {
            if (inCode) {
                blocks.push({ type: "code", content: codeBuffer.join("\n") });
                codeBuffer = [];
                inCode = false;
            } else {
                inCode = true;
            }
            continue;
        }

        if (inCode) {
            codeBuffer.push(raw);
            continue;
        }

        if (trimmed === "") {
            blocks.push({ type: "spacer" });
            continue;
        }

        if (trimmed.startsWith("### ")) {
            blocks.push({ type: "h3", content: trimmed.slice(4) });
        } else if (trimmed.startsWith("## ")) {
            blocks.push({ type: "h2", content: trimmed.slice(3) });
        } else if (trimmed.startsWith("# ")) {
            blocks.push({ type: "h1", content: trimmed.slice(2) });
        } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.match(/^\d+\.\s/)) {
            // Merge consecutive list items
            const content = trimmed.replace(/^[-*]\s|^\d+\.\s/, "");
            if (blocks.length > 0 && blocks[blocks.length - 1].type === "list") {
                blocks[blocks.length - 1].items.push(content);
            } else {
                blocks.push({ type: "list", items: [content] });
            }
        } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
            blocks.push({ type: "bold-line", content: trimmed.slice(2, -2) });
        } else {
            // Merge consecutive body lines into one paragraph
            if (blocks.length > 0 && blocks[blocks.length - 1].type === "paragraph") {
                blocks[blocks.length - 1].content += " " + trimmed;
            } else {
                blocks.push({ type: "paragraph", content: trimmed });
            }
        }
    }

    // flush unclosed code block
    if (inCode && codeBuffer.length) {
        blocks.push({ type: "code", content: codeBuffer.join("\n") });
    }

    return blocks;
}

function RichContent({ text }) {
    const blocks = parseBlocks(text);

    return (
        <div className="space-y-3 text-sm leading-7 text-gray-300">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case "h1":
                        return <h2 key={i} className="text-base font-bold text-white mt-4 first:mt-0">{block.content}</h2>;
                    case "h2":
                        return <h3 key={i} className="text-sm font-bold text-gray-100 mt-3 first:mt-0">{block.content}</h3>;
                    case "h3":
                        return <h4 key={i} className="text-sm font-semibold text-violet-300 mt-2 first:mt-0">{block.content}</h4>;
                    case "bold-line":
                        return <p key={i} className="font-semibold text-gray-200">{block.content}</p>;
                    case "list":
                        return (
                            <ul key={i} className="space-y-1 pl-1">
                                {block.items.map((item, j) => (
                                    <li key={j} className="flex gap-2.5">
                                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        );
                    case "code":
                        return (
                            <pre key={i} className="bg-gray-950 border border-gray-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-gray-300 leading-relaxed">
                                <code>{block.content}</code>
                            </pre>
                        );
                    case "spacer":
                        return <div key={i} className="h-1" />;
                    default: // paragraph
                        return <p key={i}>{block.content}</p>;
                }
            })}
        </div>
    );
}

export default function ResultView({ result }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard unavailable */
        }
    }, [result]);

    if (!result) return null;

    return (
        <div className="glass-card p-5 space-y-4 animate-fade-slide-in">
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-800/60">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-emerald-400" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="text-sm font-semibold text-gray-200">AI Explanation</span>
                <span className="ml-auto badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Generated
                </span>
            </div>

            {/* Rich content */}
            <div className="max-h-[520px] overflow-y-auto pr-1">
                <RichContent text={result} />
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-800/40">
                <p className="text-xs text-gray-600">{result.split(/\s+/).length} words</p>
                <button
                    onClick={handleCopy}
                    aria-label="Copy explanation to clipboard"
                    className={`btn-secondary text-xs py-1.5 px-3 gap-1.5 transition-all ${copied ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5" : ""
                        }`}
                >
                    {copied ? (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Copy Response
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
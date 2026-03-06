import { MAX_CONTENT_LENGTH } from "../../utils/constants.js";
import { formatCharCount } from "../../utils/formatters.js";

/**
 * ExplainInput — large textarea for content input with char count and submit row.
 */
export default function ExplainInput({ value, onChange, onSubmit, disabled, loading }) {
    const charCount = value.length;
    const isOverLimit = charCount > MAX_CONTENT_LENGTH;
    const isEmpty = !value.trim();

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === "Enter") {
            e.preventDefault();
            if (!isEmpty && !isOverLimit && !loading) onSubmit();
        }
    };

    return (
        <div className="space-y-3">
            {/* Textarea */}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste code snippets, documentation, or any technical content here…"
                aria-label="Content to explain"
                className="input-field min-h-[220px] font-mono text-sm leading-relaxed"
                disabled={disabled || loading}
            />

            {/* Footer row */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className={`text-xs tabular-nums ${isOverLimit ? "text-amber-400 font-medium" : "text-gray-600"
                        }`}>
                        {formatCharCount(charCount)} / {formatCharCount(MAX_CONTENT_LENGTH)}
                    </span>
                    <span className="text-gray-700 text-xs">·</span>
                    <span className="text-xs text-gray-600">
                        <kbd className="bg-gray-800/80 border border-gray-700 px-1 py-0.5 rounded text-[10px] font-mono text-gray-500">
                            Ctrl+Enter
                        </kbd>
                        {" "}to submit
                    </span>
                </div>

                <button
                    onClick={onSubmit}
                    disabled={loading || isEmpty || isOverLimit}
                    className="btn-primary"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5"
                                    strokeLinecap="round" strokeDasharray="28" strokeDashoffset="8" />
                            </svg>
                            Generating…
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor"
                                    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Generate Explanation
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default function ResultView({ result }) {
    if (!result) return null;

    return (
        <div className="glass-card p-5 space-y-3 animate-fadeIn">
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

            {/* Content */}
            <div className="max-h-[480px] overflow-y-auto pr-1">
                <div className="text-sm text-gray-300 leading-7 whitespace-pre-wrap font-mono bg-gray-950/50 rounded-xl p-4 border border-gray-800/40">
                    {result}
                </div>
            </div>

            {/* Copy button */}
            <div className="flex justify-end pt-1">
                <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="btn-secondary text-xs py-1.5 px-3 gap-1.5"
                >
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Copy
                </button>
            </div>
        </div>
    );
}
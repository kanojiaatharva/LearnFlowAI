/**
 * TypingIndicator — three animated bouncing dots as an AI typing bubble.
 */
export default function TypingIndicator() {
    return (
        <div className="flex gap-2.5 animate-fade-slide-in">
            {/* AI avatar */}
            <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700/60 flex items-center justify-center shrink-0 mt-0.5">
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-violet-400">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Dots bubble */}
            <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl rounded-tl-sm px-4 py-3.5 flex gap-1.5 items-center">
                {[0, 160, 320].map((delay) => (
                    <span
                        key={delay}
                        className="w-2 h-2 rounded-full bg-violet-400/80"
                        style={{ animation: `typingBounce 1s ${delay}ms ease-in-out infinite` }}
                    />
                ))}
            </div>
        </div>
    );
}

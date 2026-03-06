/**
 * Loader — skeleton shimmer, typing dots, or full-page spinner.
 */

/** Three bouncing dots typing indicator */
export function TypingDots({ className = "" }) {
    return (
        <div className={`flex gap-1.5 items-center ${className}`}>
            {[0, 160, 320].map((delay) => (
                <span
                    key={delay}
                    className="w-2 h-2 rounded-full bg-violet-400"
                    style={{ animation: `typingBounce 1s ${delay}ms ease-in-out infinite` }}
                />
            ))}
        </div>
    );
}

/** Single skeleton shimmer line */
export function SkeletonLine({ className = "" }) {
    return <div className={`skeleton h-4 ${className}`} />;
}

/** Block of multiple skeleton lines */
export function SkeletonBlock({ lines = 4 }) {
    return (
        <div className="space-y-3 animate-fade-slide-in">
            {Array.from({ length: lines }).map((_, i) => (
                <SkeletonLine
                    key={i}
                    className={i === lines - 1 ? "w-2/3" : ""}
                />
            ))}
        </div>
    );
}

/** Spinning circle (inline) */
export function Spinner({ className = "w-5 h-5" }) {
    return (
        <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
            <circle
                cx="12" cy="12" r="9" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray="28" strokeDashoffset="8"
            />
        </svg>
    );
}

export default { TypingDots, SkeletonLine, SkeletonBlock, Spinner };

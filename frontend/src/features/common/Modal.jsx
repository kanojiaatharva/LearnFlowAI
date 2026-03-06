import { useEffect } from "react";

/**
 * Modal — animated overlay modal with close-on-backdrop and ESC key.
 */
export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`relative w-full ${maxWidth} glass-card-glow animate-pop-in overflow-hidden`}>
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800/60">
                        <h2 className="text-sm font-semibold text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-800/60"
                            aria-label="Close modal"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}

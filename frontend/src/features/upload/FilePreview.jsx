import { formatFileSize } from "../../utils/formatters.js";

/**
 * FilePreview — file card showing name, size, type, and remove button.
 */
export default function FilePreview({ file, onRemove, disabled }) {
    if (!file) return null;

    return (
        <div className="flex items-center gap-3 p-3 glass-card animate-pop-in">
            {/* PDF icon */}
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-400">
                    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatFileSize(file.size)} · PDF Document</p>
            </div>

            {/* Remove */}
            {!disabled && (
                <button
                    onClick={onRemove}
                    className="text-gray-600 hover:text-gray-300 transition-colors p-1.5 rounded-lg hover:bg-gray-800/60 shrink-0"
                    aria-label="Remove file"
                >
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            )}
        </div>
    );
}

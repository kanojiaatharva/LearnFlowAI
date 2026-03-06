import { useRef, useState } from "react";

/**
 * UploadDropzone — drag-and-drop PDF upload zone with animated glow.
 */
export default function UploadDropzone({ onFile, disabled }) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    const handleDragOver = (e) => { e.preventDefault(); if (!disabled) setDragging(true); };
    const handleDragLeave = () => setDragging(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) onFile?.(e.dataTransfer.files[0]);
    };
    const handleClick = () => { if (!disabled) inputRef.current?.click(); };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`drop-zone select-none transition-all duration-300 ${disabled ? "opacity-50 cursor-not-allowed" :
                    dragging ? "drop-zone-active" : ""
                }`}
        >
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => onFile?.(e.target.files[0])}
                disabled={disabled}
            />

            {/* Icon */}
            <div className={`mx-auto mb-3 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragging
                    ? "bg-violet-500/20 border-2 border-violet-500/40"
                    : "bg-gray-800/70 border border-gray-700"
                }`}>
                <svg viewBox="0 0 24 24" fill="none" className={`w-7 h-7 transition-colors duration-300 ${dragging ? "text-violet-400" : "text-gray-500"}`}>
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* Text */}
            <p className={`text-sm font-semibold transition-colors duration-200 ${dragging ? "text-violet-300" : "text-gray-300"}`}>
                {dragging ? "Release to upload" : "Drag & drop your PDF here"}
            </p>
            <p className="text-xs text-gray-500 mt-1.5">or click to browse files · PDF only · Max 20MB</p>

            {/* Supported format badge */}
            <div className="mt-4 inline-flex items-center gap-1.5 bg-gray-800/60 border border-gray-700/50 rounded-full px-3 py-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-red-400">
                    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[11px] text-gray-500 font-medium">PDF Document</span>
            </div>
        </div>
    );
}

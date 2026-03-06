import { useState, useRef } from "react";

export default function UploadBox({ onResult, onError, onLoading }) {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef();

    const handleFile = (f) => {
        if (!f) return;
        if (f.type !== "application/pdf") {
            onError("Only PDF files are supported.");
            return;
        }
        if (f.size > 20 * 1024 * 1024) {
            onError("File size must be under 20MB.");
            return;
        }
        setFile(f);
        onError(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleUpload = async () => {
        if (!file || uploading) return;
        setUploading(true);
        onLoading(true);
        onError(null);
        onResult(null);
        try {
            const { default: api } = await import("../services/api.js");
            const formData = new FormData();
            formData.append("file", file);
            const res = await api.post("/explain/upload", formData);
            onResult(res.data.explanation);
        } catch (err) {
            onError(err.message);
        } finally {
            setUploading(false);
            onLoading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
        onError(null);
    };

    return (
        <div className="space-y-3">
            {/* Drop zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !file && inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer
          ${dragging
                        ? "border-violet-500 bg-violet-500/5"
                        : file
                            ? "border-emerald-500/40 bg-emerald-500/5 cursor-default"
                            : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/30"
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])}
                />

                {file ? (
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-red-400" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-200 truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB · PDF</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); removeFile(); }}
                            className="ml-auto text-gray-500 hover:text-gray-300 transition-colors p-1"
                        >
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="mx-auto w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-300">
                                {dragging ? "Drop your PDF here" : "Drag & drop PDF"}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">or click to browse • Max 20MB</p>
                        </div>
                    </div>
                )}
            </div>

            {file && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn-primary w-full justify-center"
                >
                    {uploading ? (
                        <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4" strokeDashoffset="10" />
                            </svg>
                            Analyzing PDF...
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Analyze PDF
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
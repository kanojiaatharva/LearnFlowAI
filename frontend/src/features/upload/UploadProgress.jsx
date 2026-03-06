/**
 * UploadProgress — animated progress bar for upload status.
 */
export default function UploadProgress({ progress, status }) {
    const isSuccess = status === "success";
    const isError = status === "error";

    return (
        <div className="space-y-2 animate-fade-slide-in">
            <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${isSuccess ? "text-emerald-400" : isError ? "text-red-400" : "text-gray-400"
                    }`}>
                    {isSuccess ? "Upload complete!" : isError ? "Upload failed" : `Uploading… ${progress}%`}
                </span>
                <span className="text-gray-600 tabular-nums">{progress}%</span>
            </div>

            <div className="progress-bar">
                <div
                    className={`progress-fill ${isSuccess ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                            isError ? "bg-red-500" :
                                "bg-gradient-to-r from-violet-600 to-blue-500"
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

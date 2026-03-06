import { useState, useCallback } from "react";
import { uploadDocument } from "../services/uploadService.js";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from "../utils/constants.js";
import { uid } from "../utils/helpers.js";

const STATUS = { IDLE: "idle", UPLOADING: "uploading", SUCCESS: "success", ERROR: "error" };

/**
 * useUpload — manages file selection, upload progress, and uploaded docs list.
 */
export function useUpload() {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState(STATUS.IDLE);
    const [error, setError] = useState(null);
    const [uploadedDocs, setUploadedDocs] = useState([]);

    const selectFile = useCallback((f) => {
        if (!f) return;
        if (!ACCEPTED_FILE_TYPES.includes(f.type)) {
            setError("Only PDF files are supported.");
            return;
        }
        if (f.size > MAX_FILE_SIZE_BYTES) {
            setError(`File must be under ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`);
            return;
        }
        setFile(f);
        setError(null);
        setStatus(STATUS.IDLE);
        setProgress(0);
    }, []);

    const clearFile = useCallback(() => {
        setFile(null);
        setError(null);
        setStatus(STATUS.IDLE);
        setProgress(0);
    }, []);

    const upload = useCallback(async () => {
        if (!file || status === STATUS.UPLOADING) return;

        setStatus(STATUS.UPLOADING);
        setError(null);
        setProgress(0);

        try {
            const result = await uploadDocument(file, (p) => setProgress(p));
            setStatus(STATUS.SUCCESS);
            setProgress(100);

            // Add to uploaded docs list
            setUploadedDocs((prev) => [
                { id: uid(), name: file.name, size: file.size, uploadedAt: new Date(), message: result.message },
                ...prev,
            ]);

            // Reset after success animation
            setTimeout(() => {
                setFile(null);
                setStatus(STATUS.IDLE);
                setProgress(0);
            }, 2500);
        } catch (err) {
            setError(err.message);
            setStatus(STATUS.ERROR);
            setProgress(0);
        }
    }, [file, status]);

    const dismissError = useCallback(() => {
        setError(null);
        setStatus(STATUS.IDLE);
    }, []);

    return {
        file,
        progress,
        status,
        error,
        uploadedDocs,
        isUploading: status === STATUS.UPLOADING,
        isSuccess: status === STATUS.SUCCESS,
        selectFile,
        clearFile,
        upload,
        dismissError,
    };
}

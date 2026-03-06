import apiClient from "./apiClient.js";

/**
 * Upload a document (PDF) for RAG knowledge base.
 * POST /api/upload
 * @param {File} file
 * @param {(progress: number) => void} [onProgress] - progress 0-100
 * @returns {Promise<{message: string}>}
 */
export async function uploadDocument(file, onProgress) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post("/upload", formData, {
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percent);
            }
        },
    });

    return res.data;
}

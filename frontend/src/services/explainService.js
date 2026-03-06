import apiClient from "./apiClient.js";

/**
 * Explain text content at a given skill level.
 * POST /api/explain
 * @param {string} content
 * @param {string} skillLevel
 * @returns {Promise<string>} explanation text
 */
export async function explainText(content, skillLevel = "Intermediate") {
    const res = await apiClient.post("/explain", { content, skillLevel });
    return res.data.explanation;
}

/**
 * Upload a PDF and get an AI explanation.
 * POST /api/explain/upload
 * @param {File} file
 * @returns {Promise<string>} explanation text
 */
export async function explainPdf(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post("/explain/upload", formData);
    return res.data.explanation;
}

import apiClient from "./apiClient.js";
import { API_BASE_URL } from "../utils/constants.js";

/**
 * Send a Q&A question (non-streaming).
 * POST /api/qa
 * @param {string} sessionId
 * @param {string} question
 * @returns {Promise<string>} answer text
 */
export async function sendQuestion(sessionId, question) {
    const res = await apiClient.post("/qa", { sessionId, question });
    return res.data.answer;
}

/**
 * Send a Q&A question with streaming response.
 * Uses native Fetch + ReadableStream to stream tokens progressively.
 * @param {string} sessionId
 * @param {string} question
 * @param {(chunk: string) => void} onChunk - called with each text chunk
 * @param {AbortSignal} [signal] - optional abort signal
 * @returns {Promise<void>}
 */
export async function streamQuestion(sessionId, question, onChunk, signal) {
    const response = await fetch(`${API_BASE_URL}/qa/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, question }),
        signal,
    });

    if (!response.ok) {
        let errMsg = "AI service returned an error.";
        try {
            const data = await response.json();
            errMsg = data?.message || data?.error || errMsg;
        } catch {/* ignore */ }
        throw new Error(errMsg);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
    }
}

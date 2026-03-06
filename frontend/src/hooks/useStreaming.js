import { useState, useCallback, useRef } from "react";
import { streamQuestion } from "../services/chatService.js";
import { getSessionId, uid } from "../utils/helpers.js";

/**
 * useStreaming — streams AI response tokens progressively.
 * Falls back gracefully if streaming endpoint isn't available.
 */
export function useStreaming() {
    const [streamingContent, setStreamingContent] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);
    const abortRef = useRef(null);

    const startStream = useCallback(async (question, onComplete) => {
        if (isStreaming) return;

        // Cancel any existing stream
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setStreamingContent("");
        setIsStreaming(true);
        setError(null);

        let accumulated = "";

        try {
            const sessionId = getSessionId();
            await streamQuestion(
                sessionId,
                question,
                (chunk) => {
                    accumulated += chunk;
                    setStreamingContent(accumulated);
                },
                abortRef.current.signal
            );
            onComplete?.({ id: uid(), role: "ai", content: accumulated });
        } catch (err) {
            if (err.name !== "AbortError") {
                setError(err.message);
            }
        } finally {
            setIsStreaming(false);
            setStreamingContent("");
        }
    }, [isStreaming]);

    const cancel = useCallback(() => {
        abortRef.current?.abort();
        setIsStreaming(false);
        setStreamingContent("");
    }, []);

    return { streamingContent, isStreaming, error, startStream, cancel };
}

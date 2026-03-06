import { useState, useCallback, useRef } from "react";
import { sendQuestion } from "../services/chatService.js";
import { getSessionId, clearSessionId, uid } from "../utils/helpers.js";

/**
 * useChat — manages Q&A chat state with session persistence.
 */
export function useChat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const sessionIdRef = useRef(getSessionId());

    const send = useCallback(async (question) => {
        if (!question?.trim() || loading) return;

        // Optimistic user message
        setMessages((prev) => [...prev, { id: uid(), role: "user", content: question.trim() }]);
        setLoading(true);
        setError(null);

        try {
            const answer = await sendQuestion(sessionIdRef.current, question.trim());
            setMessages((prev) => [...prev, { id: uid(), role: "ai", content: answer }]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const clear = useCallback(() => {
        setMessages([]);
        setError(null);
        // Create a new session
        clearSessionId();
        sessionIdRef.current = getSessionId();
    }, []);

    const dismissError = useCallback(() => setError(null), []);

    return {
        messages,
        loading,
        error,
        sessionId: sessionIdRef.current,
        send,
        clear,
        dismissError,
    };
}

import { SESSION_ID_KEY } from "./constants.js";

/**
 * Get or create a persistent session ID for Q&A context.
 */
export function getSessionId() {
    let id = localStorage.getItem(SESSION_ID_KEY);
    if (!id) {
        id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
}

/**
 * Clear the current session ID (start fresh).
 */
export function clearSessionId() {
    localStorage.removeItem(SESSION_ID_KEY);
}

/**
 * Copy text to clipboard. Returns true on success.
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        try {
            const el = document.createElement("textarea");
            el.value = text;
            el.style.position = "fixed";
            el.style.opacity = "0";
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            return true;
        } catch {
            return false;
        }
    }
}

/**
 * Truncate a string to maxLength, appending ellipsis.
 */
export function truncate(str, maxLength = 60) {
    if (!str || str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "…";
}

/**
 * Generate a unique ID.
 */
export function uid() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

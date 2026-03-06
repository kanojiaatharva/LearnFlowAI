/**
 * Format a file size in bytes to a human-readable string.
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Count words in a string.
 */
export function countWords(text) {
    if (!text?.trim()) return 0;
    return text.trim().split(/\s+/).length;
}

/**
 * Format a character count with locale string.
 */
export function formatCharCount(count) {
    return count.toLocaleString();
}

/**
 * Parse AI markdown text into structured blocks for rendering.
 * Supports: headings (# ## ###), lists (- * 1.), code fences, bold-line, paragraph.
 */
export function parseMarkdownBlocks(text) {
    if (!text) return [];
    const lines = text.split("\n");
    const blocks = [];
    let codeBuffer = [];
    let codeLang = "";
    let inCode = false;

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const trimmed = raw.trim();

        // Code fence toggle
        if (trimmed.startsWith("```")) {
            if (inCode) {
                blocks.push({ type: "code", content: codeBuffer.join("\n"), lang: codeLang });
                codeBuffer = [];
                codeLang = "";
                inCode = false;
            } else {
                inCode = true;
                codeLang = trimmed.slice(3).trim();
            }
            continue;
        }

        if (inCode) { codeBuffer.push(raw); continue; }

        if (trimmed === "") {
            // Avoid consecutive spacers
            if (blocks.length > 0 && blocks[blocks.length - 1].type !== "spacer") {
                blocks.push({ type: "spacer" });
            }
            continue;
        }

        if (trimmed.startsWith("### ")) {
            blocks.push({ type: "h3", content: trimmed.slice(4) });
        } else if (trimmed.startsWith("## ")) {
            blocks.push({ type: "h2", content: trimmed.slice(3) });
        } else if (trimmed.startsWith("# ")) {
            blocks.push({ type: "h1", content: trimmed.slice(2) });
        } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) {
            const content = trimmed.replace(/^[-*]\s|^\d+\.\s/, "");
            const last = blocks[blocks.length - 1];
            if (last?.type === "list") {
                last.items.push(content);
            } else {
                blocks.push({ type: "list", items: [content] });
            }
        } else if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length > 4) {
            blocks.push({ type: "bold-line", content: trimmed.slice(2, -2) });
        } else {
            // Inline bold within paragraph
            const last = blocks[blocks.length - 1];
            if (last?.type === "paragraph") {
                last.content += " " + trimmed;
            } else {
                blocks.push({ type: "paragraph", content: trimmed });
            }
        }
    }

    // Flush unclosed code block
    if (inCode && codeBuffer.length) {
        blocks.push({ type: "code", content: codeBuffer.join("\n"), lang: codeLang });
    }

    return blocks;
}

/**
 * Inline-render text with **bold** and `code` support.
 * Returns an array of React-compatible segments.
 */
export function parseInlineMarkdown(text) {
    // Split on **bold** and `code`
    const parts = [];
    const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
        }
        const raw = match[0];
        if (raw.startsWith("**")) {
            parts.push({ type: "bold", content: raw.slice(2, -2) });
        } else if (raw.startsWith("`")) {
            parts.push({ type: "code", content: raw.slice(1, -1) });
        }
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push({ type: "text", content: text.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: "text", content: text }];
}

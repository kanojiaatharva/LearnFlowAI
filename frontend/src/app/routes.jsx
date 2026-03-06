/**
 * routes.jsx — page route definitions.
 * Used by App.jsx to map page IDs to their components.
 */
import ExplainPage from "../features/explain/ExplainPage.jsx";
import ChatPage from "../features/chat/ChatPage.jsx";
import UploadPage from "../features/upload/UploadPage.jsx";

export const ROUTES = {
    explain: ExplainPage,
    qa: ChatPage,
    upload: UploadPage,
};

export const DEFAULT_ROUTE = "explain";

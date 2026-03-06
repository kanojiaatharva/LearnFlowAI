import axios from "axios";
import { API_BASE_URL, API_TIMEOUT_MS } from "../utils/constants.js";

const isDev = import.meta.env.DEV;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT_MS,
});

// ── Request interceptor ──────────────────────────────────────────
apiClient.interceptors.request.use(
    (config) => {
        // IMPORTANT: Do NOT manually set Content-Type for FormData.
        // Axios handles multipart/form-data boundary automatically.
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        if (isDev) {
            console.log(
                `%c[LearnFlow API] → ${config.method?.toUpperCase()} ${config.url}`,
                "color: #8b5cf6; font-weight: 600",
                config.data instanceof FormData ? "[FormData]" : (config.data ?? "")
            );
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────
apiClient.interceptors.response.use(
    (response) => {
        if (isDev) {
            console.log(
                `%c[LearnFlow API] ✓ ${response.config.url}`,
                "color: #10b981; font-weight: 600",
                response.data
            );
        }
        return response;
    },
    (error) => {
        if (isDev) {
            console.error("[LearnFlow API] ✗", error);
        }

        let message;
        if (error.code === "ECONNABORTED") {
            message = "Request timed out. The AI service is taking too long — please try again.";
        } else if (error.code === "ERR_NETWORK" || !error.response) {
            message = "Cannot reach the server. Make sure the backend is running on port 5000.";
        } else {
            const status = error.response.status;
            const data = error.response.data;

            if (status === 413) {
                message = "File is too large for the server to process.";
            } else if (status === 415) {
                message = "Unsupported file type. Please upload a PDF.";
            } else if (status >= 500) {
                message = "AI service is temporarily unavailable. Please try again later.";
            } else {
                message =
                    data?.message ||
                    data?.error ||
                    data?.detail ||
                    error.message ||
                    "Something went wrong. Please try again.";
            }
        }

        return Promise.reject(new Error(message));
    }
);

export default apiClient;

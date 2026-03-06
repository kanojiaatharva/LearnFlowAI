import axios from "axios";

const isDev = import.meta.env.DEV;

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 30000,
});

// Request interceptor — dev logging
api.interceptors.request.use(
  (config) => {
    if (isDev) {
      console.log(
        `%c[LearnFlow API] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
        "color: #8b5cf6; font-weight: 600",
        config.data ?? ""
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
api.interceptors.response.use(
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
    } else if (!error.response) {
      message = "Cannot reach the server. Make sure the backend is running on port 5000.";
    } else {
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        error.message ||
        "AI service temporarily unavailable. Please try again.";
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
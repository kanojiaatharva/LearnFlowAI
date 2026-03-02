import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 60000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "An unexpected error occurred. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
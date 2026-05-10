import axios from "axios";

// Determine API URL based on environment
let apiUrl = "http://localhost:5000"; // Default for local development

if (import.meta.env.VITE_API_URL) {
  // If explicitly set via environment variable
  apiUrl = import.meta.env.VITE_API_URL;
} else if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
  // Production: use deployed backend
  apiUrl = "https://team-task-manager-6nku.onrender.com";
}

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

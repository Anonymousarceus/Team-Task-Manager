import axios from "axios";

// Use deployed backend URL, fallback to environment variable
const apiUrl =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? window.location.origin.replace(/:\d+$/, "") + ":5000"
    : "http://localhost:5000");

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

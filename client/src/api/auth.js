import api from "./axios";

export const registerUser = (payload) => api.post("/api/auth/register", payload);
export const loginUser = (payload) => api.post("/api/auth/login", payload);
export const fetchMe = () => api.get("/api/auth/me");

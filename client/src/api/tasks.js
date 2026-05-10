import api from "./axios";

export const getTasks = (params) => api.get("/api/tasks", { params });
export const createTask = (payload) => api.post("/api/tasks", payload);
export const updateTask = (id, payload) => api.put(`/api/tasks/${id}`, payload);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

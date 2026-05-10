import api from "./axios";

export const getProjects = () => api.get("/api/projects");
export const getProjectById = (id) => api.get(`/api/projects/${id}`);
export const createProject = (payload) => api.post("/api/projects", payload);
export const updateProject = (id, payload) => api.put(`/api/projects/${id}`, payload);
export const deleteProject = (id) => api.delete(`/api/projects/${id}`);
export const updateProjectMembers = (id, payload) =>
  api.put(`/api/projects/${id}/members`, payload);

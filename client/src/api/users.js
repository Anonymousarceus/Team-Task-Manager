import api from "./axios";

export const getUsers = () => api.get("/api/users");

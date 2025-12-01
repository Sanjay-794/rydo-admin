import http from "./http";

export const getAllUsers = () => http.get("/api/admin/users");

export const addUser     = (data) => http.post("/api/admin/users", data);


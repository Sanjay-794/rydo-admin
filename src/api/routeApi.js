import http from "./http";

export const getAllRoutes = () => http.get("/api/admin/routes");

export const addRoute = (routeData) => http.post("/api/admin/routes", routeData);

export const deleteRoute = (id) => http.delete(`/api/admin/routes/${id}`);
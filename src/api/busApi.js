import http from "./http";

export const getAllBuses = () => http.get("/api/admin/buses");

export const addBus = (data) => http.post("/api/admin/buses", data);


export const deleteBus = (id) => http.delete(`/api/admin/buses/${id}`);

import http from "./http";

export const getAllTrips    = () => http.get("/api/admin/trips");
export const deleteTrip     = (id) => http.delete(`/api/admin/trips/${id}`);

// 📌 Create/Add a new trip
export const addTrip = (tripData) => http.post("/api/admin/trips", tripData);
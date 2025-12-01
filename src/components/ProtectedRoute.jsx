import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ redirectTo = "/" }) {
  const token = localStorage.getItem("auth_token");
  if (!token) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
}

import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar Always Visible */}
      <Sidebar />

      {/* Page Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet /> {/* This loads the child pages */}
      </div>
    </div>
  );
}

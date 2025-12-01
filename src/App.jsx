import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";    
import Buses from "./pages/Buses";   // ← Missing and REQUIRED
import RoutesPage from "./pages/Routes"; // add this import
import Trips from "./pages/Trips";



import Layout from "./layout/Layout";    
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Private Routes with Sidebar */}
      <Route element={<ProtectedRoute redirectTo="/login" />}> 
        <Route element={<Layout />}>  
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />  
          <Route path="/buses" element={<Buses />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/trips" element={<Trips />} />



        </Route>
      </Route>
    </Routes>
  );
}

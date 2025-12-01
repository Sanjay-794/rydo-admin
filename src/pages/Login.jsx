import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, authLoading, authError } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email.trim(), password);
    if (res.ok) navigate("/dashboard", { replace: true });
  };

  return (
    <div
      style={{
        width:"100vw",
        height:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        background:"linear-gradient(135deg, #2b5876, #4e4376)", // FULL background
      }}
    >
      <div
        style={{
          width:420,
          padding:"40px 35px",
          background:"#fff",
          borderRadius:"15px",
          boxShadow:"0px 10px 35px rgba(0,0,0,0.25)",
          textAlign:"center",
        }}
      >
        <h2 style={{fontSize:30, fontWeight:"bold", color:"#4e4376", marginBottom:25}}>
          Admin Login
        </h2>

        <form onSubmit={onSubmit} style={{display:"flex", flexDirection:"column", gap:20}}>
          
          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={{
              padding:"13px",
              borderRadius:"8px",
              border:"1px solid #cfcfcf",
              fontSize:16,
            }}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={{
              padding:"13px",
              borderRadius:"8px",
              border:"1px solid #cfcfcf",
              fontSize:16
            }}
            required
          />

          {authError && <p style={{color:"red"}}>{authError}</p>}

          <button
            type="submit"
            style={{
              padding:"13px",
              borderRadius:"8px",
              border:"none",
              fontSize:17,
              background:"#4e4376",
              color:"#fff",
              fontWeight:"bold",
              cursor:"pointer"
            }}
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getAllUsers } from "../api/userApi";
import { getAllRoutes } from "../api/routeApi";
import { getAllBuses } from "../api/busApi";
import { getAllTrips } from "../api/tripApi";

export default function Dashboard() {

  const [stats, setStats] = useState({
    users:0,drivers:0,students:0,buses:0,routes:0,trips:0
  });

  useEffect(()=>{ loadData(); },[]);

  const loadData = async()=>{
    const u = await getAllUsers().catch(()=>({data:{data:[]}}));
    const r = await getAllRoutes().catch(()=>({data:{data:[]}}));
    const b = await getAllBuses().catch(()=>({data:{data:[]}}));
    const t = await getAllTrips().catch(()=>({data:{data:[]}}));

    const users = u.data?.data || [];

    setStats({
      users: users.length,
      drivers:users.filter(u=>u.role==="DRIVER").length,
      students:users.filter(u=>u.role==="STUDENT").length,
      buses:b.data?.data?.length||0,
      routes:r.data?.data?.length||0,
      trips:t.data?.data?.length||0
    });
  };


  return (
    <div style={page} className="fadePage">

      {/* HEADER with animation */}
      <div style={header} className="fadeDown">
        <h1 style={title}>Admin Dashboard</h1>
        <p style={subtitle}>Monitor & Control the Complete System</p>
      </div>

      {/* STATS CARDS with stagger animation */}
      <div style={grid}>
        <Card label="Total Users" value={stats.users}    color="#4e4376" delay={0}/>
        <Card label="Drivers"     value={stats.drivers}  color="#43a047" delay={0.1}/>
        <Card label="Students"    value={stats.students} color="#1e88e5" delay={0.2}/>
        <Card label="Buses"       value={stats.buses}    color="#f4511e" delay={0.3}/>
        <Card label="Routes"      value={stats.routes}   color="#00897b" delay={0.4}/>
        <Card label="Trips"       value={stats.trips}    color="#8e24aa" delay={0.5}/>
      </div>

      {/* Quick Navigation */}
      <div style={quickNav} className="fadeUpSlow">
        <button style={navBtn} onClick={()=>window.location="/routes"}>🧭 Manage Routes</button>
        <button style={navBtn} onClick={()=>window.location="/buses"}>🚌 Manage Buses</button>
        <button style={navBtn} onClick={()=>window.location="/users"}>👥 Manage Users</button>
        <button style={navBtn} onClick={()=>window.location="/trips"}>🕒 Manage Trips</button>
      </div>


      {/* ANIMATION CSS */}
      <style>{`

        .cardBox{ 
          opacity:0;
          transform:translateY(15px);
          animation:popIn .6s forwards;
        }

        @keyframes popIn{
          to{ opacity:1; transform:translateY(0); }
        }

        .fadePage{ animation:fade .7s ease; }
        @keyframes fade{ from{opacity:0;} to{opacity:1;} }

        .fadeDown{ animation:slideDown .7s ease; }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-15px);} to{opacity:1;transform:translateY(0);} }

        .fadeUpSlow{ animation:slideUpSlow .9s ease; }
        @keyframes slideUpSlow{ from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:none;} }

        .cardBox:hover{
          transform:translateY(-8px)!important;
          box-shadow:0 15px 32px rgba(0,0,0,.22);
        }

      `}</style>

    </div>
  );
}


/* ***** CARD COMPONENT ***** */
function Card({label,value,color,delay}){
  return(
    <div className="cardBox" style={{
      animationDelay:`${delay}s`,
      background:color,padding:"26px",borderRadius:"14px",
      color:"#fff",textAlign:"center",fontSize:"18px",fontWeight:"600",
      boxShadow:"0 8px 22px rgba(0,0,0,.12)"
    }}>
      <div style={{fontSize:"14px",opacity:.95}}>{label}</div>
      <div style={{fontSize:"34px",fontWeight:"800",marginTop:"6px"}}>{value}</div>
    </div>
  );
}


/* ******** STYLING ******** */
const page={padding:"40px",background:"#fff",minHeight:"100vh"};
const header={background:"linear-gradient(135deg,#4e4376,#2b5876)",padding:"25px",
borderRadius:"14px",color:"#fff",marginBottom:"28px",boxShadow:"0 10px 25px rgba(0,0,0,.15)"};
const title={margin:0,fontWeight:"700",fontSize:"32px"};
const subtitle={marginTop:"6px",opacity:.9};

const grid={display:"grid",gap:"20px",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))"};
const quickNav={marginTop:"35px",display:"flex",gap:"12px",flexWrap:"wrap"};

const navBtn={background:"#4e4376",color:"#fff",padding:"12px 22px",borderRadius:"8px",
fontSize:"15px",border:"none",cursor:"pointer",fontWeight:"600"};

import { useEffect, useState } from "react";
import { getAllRoutes, addRoute, deleteRoute } from "../api/routeApi";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showForm, setShowForm] = useState(false);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  // Load all routes
  useEffect(() => loadRoutes(), []);

  const loadRoutes = () => {
    setLoading(true);
    getAllRoutes()
      .then(res => setRoutes(res.data?.data || []))
      .finally(() => setTimeout(() => setLoading(false), 450));
  };

  // Create Route
  const handleAddRoute = async (e) => {
    e.preventDefault();
    try {
      await addRoute({ source, destination });
      setSource("");
      setDestination("");
      setShowForm(false);
      loadRoutes();
    } catch (err) {
      alert(err.response?.data?.message ?? "Failed to add route");
    }
  };

  // Delete Route
  const handleDelete = async(id)=>{
    if(!confirm("Delete this route?")) return;

    try{
      await deleteRoute(id);
      loadRoutes();
    }catch(err){
      alert(err.response?.data?.data ?? "Cannot delete route (maybe it has trips!)");
    }
  };

  return (
    <div style={page}>
      <h2 style={title}>🧭 Route Management</h2>

      {/* Add Button */}
      <button onClick={() => setShowForm(true)} style={addBtn}>
        ➕ Add New Route
      </button>

      {/* ---------------- Add Route Modal ---------------- */}
      {showForm && (
        <div style={overlay}>
          <div style={modal} className="fadeIn">
            <h3 style={modalTitle}>Add Route</h3>

            <form onSubmit={handleAddRoute} style={form}>
              <input style={input} required placeholder="Enter Source" 
                     value={source} onChange={(e)=>setSource(e.target.value)} />

              <input style={input} required placeholder="Enter Destination" 
                     value={destination} onChange={(e)=>setDestination(e.target.value)} />

              <div style={btnRow}>
                <button style={saveBtn} type="submit">Save</button>
                <button style={cancelBtn} type="button" onClick={()=>setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- Table ---------------- */}
      {!loading && (
        <div style={card} className="fadeTable">
          <table style={table}>
            <thead>
              <tr style={headerRow}>
                <th style={th}>ID</th>
                <th style={th}>Source</th>
                <th style={th}>Destination</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {routes.map((r,i)=>(
                <tr key={r.id} className="fadeRow"
                    style={{...row,animationDelay:`${i*0.06}s`}}>

                  <td style={td}>{r.id}</td>
                  <td style={td}><span style={badgeBlue}>{r.source}</span></td>
                  <td style={td}><span style={badgeGreen}>{r.destination}</span></td>

                  <td style={td}>
                    <button style={deleteBtn} onClick={()=>handleDelete(r.id)}>
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div style={loaderBox}>
          <div className="spinner"/>
        </div>
      )}

      {/* 🔥 Animations */}
      <style>{`
        .fadeTable { animation: fadeIn .55s ease; }
        .fadeRow  { animation: slideUp .4s ease forwards; opacity:0; }
        @keyframes fadeIn { from{opacity:.4;} to{opacity:1;} }
        @keyframes slideUp { from{opacity:0;transform:translateY(9px);} to{opacity:1;} }

        .spinner{
          width:50px;height:50px;border-radius:50%;
          border:6px solid #ccc;border-top:6px solid #4e4376;
          animation:spin .9s linear infinite;
        }
        @keyframes spin {100%{transform:rotate(360deg)}}
      `}</style>

    </div>
  );
}

/* ---------- UI Styles ---------- */
const page={padding:"40px",background:"#fff",minHeight:"100vh"};
const title={fontSize:"30px",fontWeight:700,marginBottom:"15px"};

const addBtn={background:"#00CBA9",color:"#fff",padding:"12px 18px",fontSize:"16px",
border:"none",borderRadius:"8px",cursor:"pointer",fontWeight:600};

/* Rounded table top left + right like trips */
const card={
  background:"#fff",borderRadius:"14px 14px 10px 10px",
  boxShadow:"0 8px 22px rgba(0,0,0,.12)",overflow:"hidden",marginTop:"20px"
};

const table={width:"100%",borderCollapse:"collapse"};
const headerRow={background:"#4e4376"};
const th={padding:"14px",color:"#fff",textAlign:"left",fontSize:"15px"};
const td={padding:"12px",borderBottom:"1px solid #eee",fontSize:"15px"};
const row={background:"#fff",transition:".25s"};

const deleteBtn={
  background:"#E53935",color:"#fff",padding:"7px 12px",
  border:"none",borderRadius:"6px",cursor:"pointer"
};

const badgeBlue={background:"#1e88e5",color:"#fff",padding:"6px 12px",borderRadius:"20px"};
const badgeGreen={background:"#43a047",color:"#fff",padding:"6px 12px",borderRadius:"20px"};

const overlay={position:"fixed",inset:0,background:"rgba(0,0,0,.55)",
display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999};

const modal={background:"#fff",padding:"22px",width:"360px",borderRadius:"12px",
boxShadow:"0 12px 26px rgba(0,0,0,.28)"};

const modalTitle={fontSize:"22px",fontWeight:700,marginBottom:"12px"};
const form={display:"flex",flexDirection:"column",gap:"14px"};
const input={padding:"12px",borderRadius:"8px",fontSize:"15px",border:"1px solid #ccc"};

const btnRow={display:"flex",justifyContent:"space-between"};
const saveBtn={background:"#4e4376",color:"#fff",padding:"10px 18px",borderRadius:"8px",border:"none"};
const cancelBtn={background:"#999",color:"#fff",padding:"10px 18px",borderRadius:"8px",border:"none"};

const loaderBox={display:"flex",justifyContent:"center",alignItems:"center",height:"220px"};

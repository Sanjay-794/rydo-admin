import { useEffect, useState } from "react";
import { getAllTrips, addTrip, deleteTrip } from "../api/tripApi";
import { getAllRoutes } from "../api/routeApi";
import { getAllBuses } from "../api/busApi";

export default function Trips() {

  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // FORM STATE
  const [showForm, setShowForm] = useState(false);
  const [routeId, setRouteId] = useState("");
  const [busId, setBusId] = useState("");

  // ================= LOAD INITIAL DATA =================
  useEffect(() => {
    loadTrips();
    loadRoutes();
    loadBuses();
  }, []);

  const loadTrips = () => {
    setLoading(true);
    getAllTrips()
      .then(res => setTrips(res.data?.data || []))
      .finally(() => setTimeout(()=>setLoading(false),550));
  };

  const loadRoutes = () =>
    getAllRoutes().then(res => setRoutes(res.data?.data || []));

  const loadBuses = () =>
    getAllBuses().then(res => setBuses(res.data?.data || []));


  // ================= CREATE TRIP =================
  const handleAddTrip = async (e) => {
  e.preventDefault();

  // Get full selected Route + Bus objects from loaded lists
  const routeObj = routes.find(r => r.id == routeId);
  const busObj = buses.find(b => b.id == busId);

  if (!routeObj || !busObj) {
    alert("⚠ Route or Bus object missing");
    return;
  }

  try {
    await addTrip({
      startTime: null,        // same as Postman
      endTime: null,          // null until trip ends
      status: "INACTIVE",     // enum matches backend
      route: routeObj,        // FULL OBJECT not only id
      bus: busObj             // FULL OBJECT not only id
    });

    setShowForm(false);
    setRouteId("");
    setBusId("");
    loadTrips();

  } catch (err) {
    console.log("TRIP CREATION ERROR >>>", err.response?.data);
    alert(err.response?.data?.data ?? "Trip creation failed");
  }
};



  // ================= DELETE TRIP =================
  const handleDelete = async(id)=>{
    if(!confirm("Are you sure you want to delete this Trip?")) return;
    await deleteTrip(id);
    loadTrips();
  };


  return (
  <div style={page}>
    
    <h2 style={title}>🕒 Trip Management</h2>

    <button style={addBtn} onClick={()=>setShowForm(true)}>
      ➕ Create New Trip
    </button>


    {/* ========== ADD TRIP POPUP ========== */}
    {showForm && (
    <div style={overlay}>
      <div style={modal} className="fadeIn">

        <h3 style={modalTitle}>Create New Trip</h3>

        <form onSubmit={handleAddTrip} style={form}>

          {/* Route Dropdown */}
          <select required style={input}
            value={routeId} onChange={e=>setRouteId(e.target.value)}>
            <option value="">Select Route</option>
            {routes.map(r=>(
              <option key={r.id} value={r.id}>
                {r.source} → {r.destination}
              </option>
            ))}
          </select>

          {/* Bus Dropdown */}
          <select required style={input}
            value={busId} onChange={e=>setBusId(e.target.value)}>
            <option value="">Select Bus</option>
            {buses.map(b=>(
              <option key={b.id} value={b.id}>{b.busNumber}</option>
            ))}
          </select>

          <div style={btnRow}>
            <button style={saveBtn} type="submit">Create</button>
            <button style={cancelBtn} type="button"
              onClick={()=>setShowForm(false)}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
    )}




    {/* ========== TABLE ========== */}
    {!loading && trips.length>0 && (
      <div style={card} className="fadeTable">

        <table style={table}>

          <thead>
            <tr style={headerRow}>
              <th style={th}>ID</th>
              <th style={th}>Route</th>
              <th style={th}>Start</th>
              <th style={th}>End</th>
              <th style={th}>Status</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {trips.map((t,i)=>(
              <tr key={t.id} className="fadeRow"
                  style={{...row,animationDelay:`${i*0.07}s`}}>

                <td style={td}>{t.id}</td>
                <td style={td}>{t.route?.source} → {t.route?.destination}</td>
                <td style={td}>{t.startTime ?? "---"}</td>
                <td style={td}>{t.endTime ?? "---"}</td>

                <td style={td}>
                  <span style={{
                    background:t.status==="ACTIVE" ? "#43a047" : "#9c27b0",
                    color:"#fff",padding:"6px 12px",borderRadius:"18px",
                    fontWeight:"bold"
                  }}>
                    {t.status}
                  </span>
                </td>

                <td style={td}>
                  <button style={deleteBtn} onClick={()=>handleDelete(t.id)}>
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    )}


    {/* LOADER (just like other pages) */}
    {loading && (
      <div style={loaderWrap}>
        <div className="spinner"/>
      </div>
    )}



    {/* ===== Animations ===== */}
    <style>{`
      .fadeTable { animation: fadeIn .6s ease; }
      .fadeRow { animation: slideUp .6s ease forwards; opacity:0; }
      .fadeIn { animation: zoom .4s ease; }

      @keyframes fadeIn { from{opacity:.4;} to{opacity:1;} }
      @keyframes slideUp { from{opacity:0;transform:translateY(9px);} to{opacity:1;} }
      @keyframes zoom { from{transform:scale(.7);opacity:0;} to{transform:scale(1);opacity:1;} }

      .spinner{
        width:50px;height:50px;border-radius:50%;
        border:6px solid #ccc;border-top:6px solid #4e4376;
        animation:spin .9s linear infinite;
      }
      @keyframes spin{100%{transform:rotate(360deg)}}
    `}</style>
  </div>
  );
}



/* ========== UI STYLING ========== */

const page = { padding:"40px",minHeight:"100vh",background:"#fff" };
const title={ fontSize:"30px",fontWeight:"700",marginBottom:"12px" };
const addBtn={
  background:"#00CBA9",color:"#fff",padding:"12px 18px",
  borderRadius:"8px",border:"none",fontSize:"16px",cursor:"pointer"
};


/* 🔥 Rounded top-left & top-right */
const card={
  background:"#fff",borderRadius:"14px 14px 8px 8px",
  overflow:"hidden",marginTop:"20px",
  boxShadow:"0 8px 25px rgba(0,0,0,.12)"
};

const table={ width:"100%",borderCollapse:"collapse" };
const headerRow={ background:"#4e4376",color:"#fff" };
const th={ padding:"14px",fontSize:"15px",fontWeight:"600" };
const td={ padding:"12px",borderBottom:"1px solid #eee",fontSize:"15px" };

const row={ background:"#fff",transition:".25s" };
const deleteBtn={ background:"#e53935",color:"#fff",padding:"7px 12px",borderRadius:"6px",border:"none" };

const overlay={position:"fixed",inset:0,background:"rgba(0,0,0,.55)",
  display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999};

const modal={background:"#fff",padding:"22px",width:"350px",
  borderRadius:"12px",boxShadow:"0 12px 26px rgba(0,0,0,.30)"};

const modalTitle={fontSize:"22px",fontWeight:"700",marginBottom:"10px"};

const form={display:"flex",flexDirection:"column",gap:"12px"};
const input={padding:"12px",borderRadius:"8px",border:"1px solid #ccc",fontSize:"15px"};

const btnRow={display:"flex",justifyContent:"space-between"};
const saveBtn={background:"#4e4376",color:"#fff",padding:"10px 18px",borderRadius:"8px",border:"none"};
const cancelBtn={background:"#999",color:"#fff",padding:"10px 18px",borderRadius:"8px",border:"none"};

const loaderWrap={display:"flex",justifyContent:"center",padding:"60px 0"};

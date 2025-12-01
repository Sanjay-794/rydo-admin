import { useEffect, useState } from "react";
import { getAllBuses, addBus, deleteBus } from "../api/busApi";
import { getAllUsers } from "../api/userApi";

export default function Buses() {

  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showForm, setShowForm] = useState(false);
  const [busNumber, setBusNumber] = useState("");
  const [driverId, setDriverId] = useState("");

  useEffect(() => {
    loadBuses();
    loadDrivers();
  }, []);

  const loadBuses = () => {
    setLoading(true);
    getAllBuses()
      .then(res => setBuses(res.data?.data || []))
      .finally(() => setTimeout(() => setLoading(false), 400));
  };

  const loadDrivers = () =>
    getAllUsers().then(res =>
      setDrivers((res.data?.data || []).filter(u => u.role === "DRIVER"))
    );

  // ADD BUS
  const handleAddBus = async(e)=>{
    e.preventDefault();
    try{
      const payload = { busNumber, driver: driverId?{id:driverId}:null };
      await addBus(payload);
      setBusNumber(""); setDriverId("");
      setShowForm(false);
      loadBuses();
    }catch(err){
      alert(err.response?.data?.message ?? "Failed to add bus");
    }
  };

  // DELETE BUS
  const handleDelete = async(id)=>{
    if(!confirm("Delete this bus permanently?")) return;

    try{
      await deleteBus(id);
      loadBuses();
    }catch(err){
      alert(err.response?.data?.data ?? "Cannot delete bus — Trip assigned!");
    }
  };

  return(
    <div style={page}>
      <h2 style={title}>🚌 Bus Management</h2>

      <button style={addBtn} onClick={()=>setShowForm(true)}>
        ➕ Add Bus
      </button>

      {/* ───── Add Bus Modal ───── */}
      {showForm && (
        <div style={overlay}>
          <div style={modal} className="fadeIn">

            <h3 style={modalTitle}>Add Bus</h3>

            <form style={form} onSubmit={handleAddBus}>
              <input style={input} required placeholder="Bus Number"
                value={busNumber} onChange={e=>setBusNumber(e.target.value)}
              />

              <select style={select} value={driverId} onChange={e=>setDriverId(e.target.value)}>
                <option value="">Select Driver (optional)</option>
                {drivers.map(d=>(
                  <option key={d.id} value={d.id}>{d.name} — {d.email}</option>
                ))}
              </select>

              <div style={btnRow}>
                <button style={saveBtn} type="submit">Save</button>
                <button style={cancelBtn} type="button" onClick={()=>setShowForm(false)}>Cancel</button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ───── Bus Table ───── */}
      {!loading && (
        <div style={card} className="fadeTable">
          <table style={table}>

            <thead>
              <tr style={tableHeadRow}>
                <th style={th}>ID</th>
                <th style={th}>Bus Number</th>
                <th style={th}>Driver</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {buses.map((b,i)=>(
                <tr key={b.id} className="fadeRow"
                    style={{...row,animationDelay:`${i*0.07}s`}}>

                  <td style={td}>{b.id}</td>
                  <td style={td}>{b.busNumber}</td>

                  <td style={td}>
                    {b.driver
                      ? <b>{b.driver.name}</b>
                      : <span style={noDriver}>No Driver Assigned</span>
                    }
                  </td>

                  <td style={td}>
                    <button style={deleteBtn} onClick={()=>handleDelete(b.id)}>
                      🗑 Remove
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {loading && <div style={loaderWrap}><div className="spinner"/></div>}

      <style>{`
        .fadeTable { animation: fadeIn .5s ease; }
        .fadeRow { animation: fadeUp .45s ease forwards; opacity:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px);} to{opacity:1;} }

        .spinner{
          width:45px;height:45px;border-radius:50%;
          border:6px solid #ccc;border-top:6px solid #4e4376;
          animation:spin .8s linear infinite;
        }
        @keyframes spin {100%{transform:rotate(360deg)}}
      `}</style>

    </div>
  );
}


/* STYLES */

const page={padding:"40px",background:"#fff",minHeight:"100vh"};
const title={fontSize:"30px",fontWeight:"700",marginBottom:"18px"};

const addBtn={background:"#00CBA9",color:"#fff",padding:"12px 20px",
borderRadius:"8px",border:"none",fontSize:"16px",cursor:"pointer"};

const card={background:"#fff",borderRadius:"14px",
boxShadow:"0 8px 25px rgba(0,0,0,.12)",marginTop:"20px"};

const table={width:"100%",borderCollapse:"collapse"};
const tableHeadRow={background:"#4e4376",color:"#fff"};
const th={padding:"14px",fontSize:"15px",fontWeight:600,color:"#fff"};
const td={padding:"12px 14px",borderBottom:"1px solid #eee",fontSize:"15px"};

const row={transition:"0.3s"};
const deleteBtn={background:"#d32f2f",color:"#fff",padding:"6px 12px",
borderRadius:"6px",border:"none",cursor:"pointer",fontWeight:"bold"};

const noDriver={background:"#ffe0e0",padding:"4px 9px",borderRadius:"6px",color:"#c62828"};

const overlay={position:"fixed",inset:0,background:"rgba(0,0,0,.55)",
display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999};

const modal={background:"#fff",padding:"22px",width:"360px",
borderRadius:"12px",boxShadow:"0 12px 28px rgba(0,0,0,.25)"};

const modalTitle={fontSize:"22px",fontWeight:"700",marginBottom:"12px"};
const form={display:"flex",flexDirection:"column",gap:"14px"};
const input={padding:"12px",borderRadius:"8px",border:"1px solid #ccc",fontSize:"15px"};
const select={padding:"12px",borderRadius:"8px",border:"1px solid #ccc"};

const btnRow={display:"flex",justifyContent:"space-between"};
const saveBtn={background:"#4e4376",color:"#fff",padding:"10px 18px",borderRadius:"8px",border:"none"};
const cancelBtn={background:"#999",color:"#fff",padding:"10px 18px",borderRadius:"8px",border:"none"};

const loaderWrap={display:"flex",justifyContent:"center",paddingTop:"60px"};

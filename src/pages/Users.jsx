import { useEffect, useState } from "react";
import { getAllUsers, addUser } from "../api/userApi";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Load Users
  useEffect(()=>loadUsers(),[]);

  const loadUsers = ()=>{
    setLoading(true);
    getAllUsers()
      .then(res=>setUsers(res.data?.data || []))
      .finally(()=>setTimeout(()=>setLoading(false),450));
  };

  // ADD DRIVER
  const handleAddDriver = async(e)=>{
    e.preventDefault();
    try{
      await addUser({ name,email,password,phone,role:"DRIVER" });
      setShowAddDriver(false);
      setName(""); setEmail(""); setPassword(""); setPhone("");
      loadUsers();
    }catch(err){
      alert(err.response?.data?.message ?? "Failed to add driver");
    }
  };

  const drivers = users.filter(u=>u.role==="DRIVER");
  const students = users.filter(u=>u.role==="STUDENT");

  return(
  <div style={page}>

      {/* Title left aligned */}
      <h2 style={title}>👥 User Management</h2>

      {/* Button just below, aligned left nicely */}
      <div style={btnRowTop}>
        <button style={addButton} onClick={()=>setShowAddDriver(true)}>
          ➕ Add Driver
        </button>
      </div>



      {/* Loading Spinner */}
      {loading && <div style={loaderWrap}><div className="spinner"/></div>}


      {/* DRIVER SECTION */}
      {!loading && (
        <div style={section}>
          <h3 style={sectionTitle}>🚍 Drivers</h3>

          <div style={tableCard}>
            <table style={table}>

              <thead>
                <tr style={thead}>
                  <th style={th}>ID</th>
                  <th style={th}>Name</th>
                  <th style={th}>Email</th>
                  <th style={th}>Phone</th>
                </tr>
              </thead>

              <tbody>
              {drivers.map((d,i)=>(
                <tr key={d.id} className="fadeRow" style={{...tr,animationDelay:`${i*0.06}s`}}>
                  <td style={td}>{d.id}</td>
                  <td style={td}><b>{d.name}</b></td>
                  <td style={td}>{d.email}</td>
                  <td style={td}>{d.phone}</td>
                </tr>
              ))}
              {!drivers.length && <tr><td colSpan={4} style={empty}>No Drivers Found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}



      {/* STUDENT SECTION */}
      {!loading && (
        <div style={section}>
          <h3 style={sectionTitle}>🎓 Students</h3>

          <div style={tableCard}>
            <table style={table}>
              <thead>
                <tr style={thead}>
                  <th style={th}>ID</th>
                  <th style={th}>Name</th>
                  <th style={th}>Email</th>
                  <th style={th}>Phone</th>
                </tr>
              </thead>

              <tbody>
              {students.map((s,i)=>(
                <tr key={s.id} className="fadeRow" style={{...tr,animationDelay:`${i*0.06}s`}}>
                  <td style={td}>{s.id}</td>
                  <td style={td}><b>{s.name}</b></td>
                  <td style={td}>{s.email}</td>
                  <td style={td}>{s.phone}</td>
                </tr>
              ))}
              {!students.length && <tr><td colSpan={4} style={empty}>No Students Found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      
      {/* MODAL ADD DRIVER */}
      {showAddDriver && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={modalTitle}>Add New Driver</h3>

            <form style={form} onSubmit={handleAddDriver}>
              <input style={input} required placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)}/>
              <input style={input} required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
              <input style={input} required type="number" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)}/>
              <input style={input} required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>

              <div style={modalBtnRow}>
                <button style={modalSave} type="submit">Add Driver</button>
                <button style={modalCancel} type="button" onClick={()=>setShowAddDriver(false)}>Cancel</button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        .fadeRow{animation:fadeUp .45s forwards;opacity:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
        .spinner{width:55px;height:55px;border-radius:50%;border:6px solid #ccc;border-top:6px solid #4e4376;animation:spin .9s linear infinite;}
        @keyframes spin{100%{transform:rotate(360deg)}}
      `}</style>

    </div>
  );
}



/* ==================== STYLES ==================== */
const page={padding:"40px",background:"#fff",minHeight:"100vh"};
const title = { fontSize:"30px", fontWeight:700, marginBottom:"6px" };

const btnRowTop = {
  marginBottom:"20px",
  display:"flex",
  justifyContent:"flex-start"  // ⬅ button left aligned under title
};


/* Button under heading centered */
const addBtnWrap={display:"flex",justifyContent:"center",marginBottom:"22px"};
const addButton={background:"#00CBA9",padding:"12px 22px",borderRadius:"8px",color:"#fff",
fontSize:"16px",border:"none",cursor:"pointer",fontWeight:600};

/* Section UI */
const section={marginTop:"25px"};
const sectionTitle={fontSize:"22px",fontWeight:700,marginBottom:"10px",color:"#222"};

/* Beautiful Table Card UI */
const tableCard={borderRadius:"14px",overflow:"hidden",boxShadow:"0 8px 22px rgba(0,0,0,.12)"};
const table={width:"100%",borderCollapse:"collapse"};
const thead={background:"#4e4376"};
const th={color:"#fff",padding:"12px",fontSize:"15px"};
const td={padding:"12px",fontSize:"15px",borderBottom:"1px solid #eee"};
const tr={background:"#fff",transition:"0.25s"};
const empty={padding:"18px",textAlign:"center",opacity:.55};

/* Modal Styles */
const loaderWrap={display:"flex",justifyContent:"center",paddingTop:"100px"};
const overlay={position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",
alignItems:"center",justifyContent:"center",zIndex:9999};
const modal={background:"#fff",padding:"22px",width:"350px",borderRadius:"12px",boxShadow:"0 15px 30px rgba(0,0,0,.32)"};
const modalTitle={fontSize:"22px",fontWeight:700,marginBottom:"14px"};
const form={display:"flex",flexDirection:"column",gap:"12px"};
const input={padding:"12px",borderRadius:"8px",border:"1px solid #ccc"};
const modalBtnRow={display:"flex",justifyContent:"space-between",marginTop:"12px"};
const modalSave={background:"#4e4376",color:"#fff",padding:"10px 18px",borderRadius:"8px",border:"none"};
const modalCancel={background:"#777",color:"#fff",padding:"10px 18px",borderRadius:"8px",border:"none"};

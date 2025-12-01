import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{width:220,height:"100vh",background:"#111",color:"#fff",padding:20}}>
      <h2>RYDO Admin</h2>
      <hr/>

      <Link to="/dashboard"><p>📊 Dashboard</p></Link>
      <Link to="/users"><p>👥 Users</p></Link>
      <Link to="/buses"><p>🚌 Buses</p></Link>
      <Link to="/routes"><p>🧭 Routes</p></Link>
      <Link to="/trips"><p>🕒 Trips</p></Link>
    </div>
  );
}

import { useState, useEffect } from "react";
import { usersAPI } from "../../services/api";
import { exportToCSV } from "../../utils/exportUtils";

const STATUS_BADGE = {
  true:  "adm-badge adm-badge-green",
  false: "adm-badge adm-badge-red",
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("All");
  const [viewing,   setViewing]   = useState(null);
  const [editing,   setEditing]   = useState(null);
  const [editForm,  setEditForm]  = useState({ name:"", role:"customer", isActive:true });
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    usersAPI.getAll({ limit: 100 })
      .then(res => { if (res?.data) setCustomers(res.data); })
      .catch(err => console.warn("Users fetch:", err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    const match = !q || (c.name||"").toLowerCase().includes(q) || (c.email||"").toLowerCase().includes(q);
    if (filter === "Active")   return match && c.isActive;
    if (filter === "Inactive") return match && !c.isActive;
    return match;
  });

  const activeCount = customers.filter(c => c.isActive).length;

  const metrics = [
    { label: "Total customers", value: customers.length },
    { label: "Active",          value: activeCount,                     positive: true },
    { label: "Inactive",        value: customers.length - activeCount,  positive: false },
    { label: "Admins",          value: customers.filter(c => c.role === "admin").length },
  ];

  const openEdit = (c) => {
    setEditing(c);
    setEditForm({ name: c.name||"", role: c.role||"customer", isActive: c.isActive !== false });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersAPI.update(editing._id, editForm);
      setCustomers(prev => prev.map(c => c._id === editing._id ? { ...c, ...editForm } : c));
      setEditing(null);
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete account for "${c.name}"?`)) return;
    try {
      await usersAPI.delete(c._id);
      setCustomers(prev => prev.filter(u => u._id !== c._id));
    } catch (err) {
      alert("Failed: " + err.message);
    }
  };

  const handleExport = () => {
    exportToCSV("customers_export", filtered, [
      { key: "name",  label: "Name" },
      { key: "email", label: "Email" },
      { key: "role",  label: "Role" },
    ]);
  };

  const fmt = (d) => { try { return new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }); } catch { return "—"; } };

  return (
    <div className="adm-page">

      <div className="adm-metrics">
        {metrics.map(m => (
          <div key={m.label} className="adm-metric-card">
            <p className="adm-metric-label">{m.label}</p>
            <p className="adm-metric-value">{m.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="adm-controls">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#98a2b3" strokeWidth="1.5"/><path d="M13 13L16 16" stroke="#98a2b3" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" />
        </div>
        {["All","Active","Inactive"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`adm-btn-secondary${filter===f?" active":""}`}>{f}</button>
        ))}
        <button onClick={handleExport} className="adm-btn-primary">Export CSV</button>
      </div>

      <div className="adm-table-wrap">
        <div className="adm-table-header">
          {["Customer","Email","Role","Joined","Status","Actions"].map(h => (
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>

        {loading && <div className="adm-empty"><p>Loading customers…</p></div>}

        {!loading && filtered.map(c => (
          <div key={c._id} className="adm-table-row">
            <div className="adm-table-td" style={{ display:"flex", alignItems:"center", gap:10, overflow:"hidden" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"#2563eb", color:"#fff", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {c.name?.charAt(0)||"?"}
              </div>
              <span style={{ fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</span>
            </div>
            <p className="adm-table-td" style={{ color:"#667085", fontSize:11 }}>{c.email}</p>
            <div className="adm-table-td">
              <span className={c.role === "admin" ? "adm-badge adm-badge-blue" : "adm-badge adm-badge-gray"}>{c.role}</span>
            </div>
            <p className="adm-table-td" style={{ color:"#98a2b3", fontSize:11 }}>{fmt(c.createdAt)}</p>
            <div className="adm-table-td">
              <span className={c.isActive !== false ? "adm-badge adm-badge-green" : "adm-badge adm-badge-red"}>
                {c.isActive !== false ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="adm-table-td" style={{ display:"flex", gap:6 }}>
              <button onClick={() => setViewing(c)} className="adm-action-view">View</button>
              <button onClick={() => openEdit(c)} className="adm-action-edit">Edit</button>
              <button onClick={() => handleDelete(c)} className="adm-action-delete">Delete</button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && <div className="adm-empty"><p>No customers found.</p></div>}
      </div>

      {/* View modal */}
      {viewing && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:24 }}>
          <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:480, boxShadow:"0 20px 60px rgba(0,0,0,0.15)", overflow:"hidden" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #f4f7fb", background:"#fafbfd", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:"#101828" }}>Customer Profile</h3>
              <button onClick={() => setViewing(null)} style={{ background:"none", border:"none", fontSize:18, color:"#98a2b3", cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ padding:20, display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:52, height:52, borderRadius:14, background:"#2563eb", color:"#fff", fontSize:22, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {viewing.name?.charAt(0)||"?"}
                </div>
                <div>
                  <p style={{ fontSize:15, fontWeight:700, color:"#101828", margin:0 }}>{viewing.name}</p>
                  <p style={{ fontSize:12, color:"#667085", margin:"2px 0 0" }}>{viewing.email}</p>
                </div>
                <span className={viewing.isActive !== false ? "adm-badge adm-badge-green" : "adm-badge adm-badge-red"} style={{ marginLeft:"auto" }}>
                  {viewing.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div style={{ background:"#fafbfd", padding:"10px 14px", borderRadius:10, border:"1px solid #dde4ee" }}>
                  <p style={{ fontSize:10, color:"#98a2b3", fontWeight:600, margin:"0 0 4px" }}>ROLE</p>
                  <p style={{ fontSize:13, fontWeight:600, color:"#101828", margin:0 }}>{viewing.role}</p>
                </div>
                <div style={{ background:"#fafbfd", padding:"10px 14px", borderRadius:10, border:"1px solid #dde4ee" }}>
                  <p style={{ fontSize:10, color:"#98a2b3", fontWeight:600, margin:"0 0 4px" }}>JOINED</p>
                  <p style={{ fontSize:13, fontWeight:600, color:"#101828", margin:0 }}>{fmt(viewing.createdAt)}</p>
                </div>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button onClick={() => { openEdit(viewing); setViewing(null); }} className="adm-btn-primary" style={{ flex:1, justifyContent:"center" }}>Edit Profile</button>
                <button onClick={() => setViewing(null)} className="adm-btn-secondary">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:24 }}>
          <form onSubmit={handleSaveEdit} style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:440, boxShadow:"0 20px 60px rgba(0,0,0,0.15)", overflow:"hidden" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #f4f7fb", background:"#fafbfd", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:"#101828" }}>Edit Customer</h3>
              <button type="button" onClick={() => setEditing(null)} style={{ background:"none", border:"none", fontSize:18, color:"#98a2b3", cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ padding:20, display:"flex", flexDirection:"column", gap:14 }}>
              <div className="adm-field">
                <label className="adm-label">Full name</label>
                <input value={editForm.name} onChange={e => setEditForm({...editForm, name:e.target.value})} className="adm-input" required />
              </div>
              <div className="adm-field">
                <label className="adm-label">Role</label>
                <select value={editForm.role} onChange={e => setEditForm({...editForm, role:e.target.value})} className="adm-input" style={{ cursor:"pointer" }}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-label">Status</label>
                <select value={editForm.isActive ? "active" : "inactive"} onChange={e => setEditForm({...editForm, isActive: e.target.value === "active"})} className="adm-input" style={{ cursor:"pointer" }}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button type="button" onClick={() => setEditing(null)} className="adm-btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="adm-btn-primary" style={{ flex:1, justifyContent:"center" }}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

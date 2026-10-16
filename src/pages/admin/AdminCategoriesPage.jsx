import { useState, useEffect } from "react";
import { categoriesAPI } from "../../services/api";

export default function AdminCategoriesPage() {
  const [cats,    setCats]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [drawer,  setDrawer]  = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState({ name:"", desc:"", icon:"Sparkles", color:"#2563eb" });
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    categoriesAPI.getAll()
      .then(res => { if (res?.data) setCats(res.data); })
      .catch(err => console.warn("Categories:", err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = cats.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm({ name:"", desc:"", icon:"Sparkles", color:"#2563eb" }); setDrawer(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ name:c.name||"", desc:c.desc||"", icon:c.icon||"Sparkles", color:c.color||"#2563eb" });
    setDrawer(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { alert("Name is required."); return; }
    setSaving(true);
    try {
      if (editing) {
        await categoriesAPI.update(editing._id, form);
        setCats(prev => prev.map(c => c._id === editing._id ? { ...c, ...form } : c));
      } else {
        const res = await categoriesAPI.create(form);
        setCats(prev => [res.data, ...prev]);
      }
      setDrawer(false);
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    try {
      await categoriesAPI.delete(c._id);
      setCats(prev => prev.filter(x => x._id !== c._id));
    } catch (err) {
      alert(err.message);
    }
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="adm-page">

      <div className="adm-metrics">
        {[
          { label:"Total categories",   value: cats.length },
          { label:"Active",             value: cats.filter(c=>c.isActive!==false).length },
          { label:"Total products",     value: cats.reduce((a,c)=>a+(c.count||0),0) },
          { label:"Empty categories",   value: cats.filter(c=>(c.count||0)===0).length },
        ].map(m=>(
          <div key={m.label} className="adm-metric-card">
            <p className="adm-metric-label">{m.label}</p>
            <p className="adm-metric-value">{m.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="adm-controls">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#98a2b3" strokeWidth="1.5"/><path d="M13 13L16 16" stroke="#98a2b3" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search categories…" />
        </div>
        <button onClick={openAdd} className="adm-btn-primary">+ Add category</button>
      </div>

      <div style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
        <div className="adm-table-wrap" style={{ flex:1, minWidth:0 }}>
          <div className="adm-table-header">
            {["Category","Slug","Products","Status","Actions"].map(h=>(
              <p key={h} className="adm-table-th">{h}</p>
            ))}
          </div>

          {loading && <div className="adm-empty"><p>Loading…</p></div>}

          {!loading && filtered.map(c=>(
            <div key={c._id} className="adm-table-row">
              <div className="adm-table-td" style={{ display:"flex", alignItems:"center", gap:10, overflow:"hidden" }}>
                <div style={{ width:28, height:28, borderRadius:8, background:c.color||"#2563eb", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:14 }}>📦</span>
                </div>
                <span style={{ fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</span>
              </div>
              <p className="adm-table-td" style={{ color:"#98a2b3" }}>{c.slug}</p>
              <p className="adm-table-td">{c.count||0} products</p>
              <div className="adm-table-td">
                <span className={c.isActive!==false ? "adm-badge adm-badge-green" : "adm-badge adm-badge-gray"}>
                  {c.isActive!==false ? "Active" : "Hidden"}
                </span>
              </div>
              <div className="adm-table-td" style={{ display:"flex", gap:6 }}>
                <button onClick={()=>openEdit(c)} className="adm-action-edit">Edit</button>
                <button onClick={()=>handleDelete(c)} className="adm-action-delete">Delete</button>
              </div>
            </div>
          ))}

          {!loading && filtered.length===0 && <div className="adm-empty"><p>No categories found.</p></div>}
        </div>

        {/* Drawer */}
        {drawer && (
          <div style={{ width:300, flexShrink:0 }}>
            <div className="adm-card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <p className="adm-card-title">{editing ? "Edit category" : "New category"}</p>
                <button onClick={()=>setDrawer(false)} style={{ background:"none", border:"none", fontSize:16, color:"#98a2b3", cursor:"pointer" }}>✕</button>
              </div>
              <div className="adm-field">
                <label className="adm-label">Name *</label>
                <input value={form.name} onChange={f("name")} placeholder="e.g. Smart Speakers" className="adm-input" />
              </div>
              <div className="adm-field">
                <label className="adm-label">Description</label>
                <textarea value={form.desc} onChange={f("desc")} rows={3} placeholder="Short description…" className="adm-textarea" />
              </div>
              <div className="adm-field">
                <label className="adm-label">Icon name</label>
                <input value={form.icon} onChange={f("icon")} placeholder="e.g. Sparkles" className="adm-input" />
              </div>
              <div className="adm-field">
                <label className="adm-label">Color</label>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <input type="color" value={form.color} onChange={f("color")} style={{ width:40, height:40, border:"1px solid #dde4ee", borderRadius:8, cursor:"pointer", padding:2 }} />
                  <input value={form.color} onChange={f("color")} className="adm-input" style={{ flex:1 }} />
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setDrawer(false)} className="adm-btn-secondary">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="adm-btn-primary" style={{ flex:1, justifyContent:"center" }}>
                  {saving ? "Saving…" : editing ? "Save changes" : "Add category"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

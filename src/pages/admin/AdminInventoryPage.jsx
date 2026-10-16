import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { exportToCSV } from "../../utils/exportUtils";

export default function AdminInventoryPage() {
  const { products, updateProduct } = useProducts();
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");
  const [adjId,   setAdjId]   = useState(null);
  const [adjVal,  setAdjVal]  = useState("");

  const totalUnits = products.reduce((a, p) => a + (p.stock || 0), 0);
  const low        = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const out        = products.filter(p => p.stock === 0).length;

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
    if (filter === "Low") return matchQ && p.stock > 0 && p.stock < 10;
    if (filter === "Out") return matchQ && p.stock === 0;
    return matchQ;
  });

  const confirmAdj = (id) => {
    const n = parseInt(adjVal, 10);
    if (!isNaN(n) && n >= 0) updateProduct(id, { stock: n });
    setAdjId(null); setAdjVal("");
  };

  const handleExport = () => {
    exportToCSV("inventory_report", filtered, [
      { key:"name",     label:"Product" },
      { key:"brand",    label:"Brand" },
      { key:"category", label:"Category" },
      { key:"sku",      label:"SKU" },
      { key:"stock",    label:"Stock" },
    ]);
  };

  const stockBadge = (p) => {
    if (p.stock === 0)      return "adm-badge adm-badge-red";
    if (p.stock < 10)       return "adm-badge adm-badge-amber";
    return "adm-badge adm-badge-green";
  };
  const stockLabel = (p) => {
    if (p.stock === 0) return "Out of stock";
    if (p.stock < 10)  return "Low stock";
    return "In stock";
  };

  return (
    <div className="adm-page">

      <div className="adm-metrics">
        {[
          { label:"Total units",   value: totalUnits.toLocaleString() },
          { label:"In stock",      value: products.filter(p=>p.stock>=10).length },
          { label:"Low stock",     value: low,  positive: low===0 },
          { label:"Out of stock",  value: out,  positive: out===0 },
          { label:"Needs restock", value: low + out, positive: (low+out)===0 },
        ].map(m => (
          <div key={m.label} className="adm-metric-card">
            <p className="adm-metric-label">{m.label}</p>
            <p className="adm-metric-value">{String(m.value)}</p>
          </div>
        ))}
      </div>

      <div className="adm-controls">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#98a2b3" strokeWidth="1.5"/><path d="M13 13L16 16" stroke="#98a2b3" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by product name or brand…" />
        </div>
        {[{l:"All items",k:"All"},{l:"Low stock",k:"Low"},{l:"Out of stock",k:"Out"}].map(f=>(
          <button key={f.k} onClick={()=>setFilter(f.k)} className={`adm-btn-secondary${filter===f.k?" active":""}`}>{f.l}</button>
        ))}
        <button onClick={handleExport} className="adm-btn-primary">Export CSV</button>
      </div>

      <div className="adm-table-wrap">
        <div style={{ padding:"10px 16px", borderBottom:"1px solid #dde4ee", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:12, color:"#98a2b3" }}>{filtered.length} of {products.length} products</span>
          <span style={{ fontSize:11, color:"#dde4ee" }}>Click Adjust to edit inline</span>
        </div>
        <div className="adm-table-header">
          {["Product","Brand","Category","SKU","Price","Stock","Status","Actions"].map(h=>(
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>

        {filtered.map(p => {
          const pid = p._id || p.id;
          const isAdj = adjId === pid;
          return (
            <div key={pid} className="adm-table-row">
              <div className="adm-table-td" style={{ display:"flex", alignItems:"center", gap:8, overflow:"hidden" }}>
                <img src={p.image} alt="" style={{ width:30, height:30, borderRadius:7, objectFit:"cover", border:"1px solid #dde4ee", flexShrink:0 }}
                  onError={e=>{e.currentTarget.style.display="none";}} />
                <span style={{ fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</span>
              </div>
              <p className="adm-table-td" style={{ color:"#667085" }}>{p.brand}</p>
              <p className="adm-table-td" style={{ color:"#667085" }}>{p.category}</p>
              <p className="adm-table-td" style={{ color:"#98a2b3", fontSize:11 }}>{p.sku}</p>
              <p className="adm-table-td" style={{ fontWeight:700 }}>${p.price?.toLocaleString()}</p>
              <p className="adm-table-td" style={{ fontWeight:700, color: p.stock===0?"#d92d20": p.stock<10?"#d97706":"#078a55" }}>
                {p.stock} units
              </p>
              <div className="adm-table-td">
                <span className={stockBadge(p)}>{stockLabel(p)}</span>
              </div>
              <div className="adm-table-td">
                {isAdj ? (
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <input autoFocus type="number" min="0" value={adjVal} onChange={e=>setAdjVal(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter")confirmAdj(pid);if(e.key==="Escape"){setAdjId(null);setAdjVal("");}}}
                      className="adm-inline-input" placeholder={String(p.stock)} />
                    <button onClick={()=>confirmAdj(pid)} className="adm-action-edit" style={{ padding:"0 8px", height:30 }}>✓</button>
                    <button onClick={()=>{setAdjId(null);setAdjVal("");}} className="adm-action-neutral" style={{ padding:"0 8px", height:30 }}>✕</button>
                  </div>
                ) : (
                  <button onClick={()=>{setAdjId(pid);setAdjVal(String(p.stock));}} className="adm-action-edit">Adjust</button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length===0 && <div className="adm-empty"><p>No inventory items found.</p></div>}
      </div>
    </div>
  );
}

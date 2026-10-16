import { useState, useEffect } from "react";
import { ordersAPI } from "../../services/api";
import { exportToCSV } from "../../utils/exportUtils";

const STATUS_OPTS = ["Pending","Processing","Shipped","Completed","Cancelled","Refunded"];
const STATUS_BADGE = {
  Pending:    "adm-badge adm-badge-amber",
  Processing: "adm-badge adm-badge-amber",
  Shipped:    "adm-badge adm-badge-blue",
  Completed:  "adm-badge adm-badge-green",
  Cancelled:  "adm-badge adm-badge-red",
  Refunded:   "adm-badge adm-badge-red",
};

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    ordersAPI.getAll({ limit: 100 })
      .then(res => { if (res?.data) setOrders(res.data); })
      .catch(err => console.warn("Orders fetch:", err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const match = !q || (o.orderId||"").toLowerCase().includes(q) ||
      (o.customerName||"").toLowerCase().includes(q) ||
      (o.customerEmail||"").toLowerCase().includes(q);
    if (filter !== "All") return match && o.status === filter;
    return match;
  });

  const metrics = [
    { label: "Total orders",  value: orders.length },
    { label: "Processing",    value: orders.filter(o => o.status === "Processing" || o.status === "Pending").length,  positive: false },
    { label: "Shipped",       value: orders.filter(o => o.status === "Shipped").length,   positive: true },
    { label: "Completed",     value: orders.filter(o => o.status === "Completed").length,  positive: true },
    { label: "Cancelled",     value: orders.filter(o => o.status === "Cancelled" || o.status === "Refunded").length, positive: false },
  ];

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o)));
      if (selected?._id === orderId) setSelected(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleExport = () => {
    exportToCSV("orders_export", filtered, [
      { key: "orderId",       label: "Order ID" },
      { key: "customerName",  label: "Customer" },
      { key: "customerEmail", label: "Email" },
      { key: "status",        label: "Status" },
      { key: "total",         label: "Total ($)" },
    ]);
  };

  const fmt = (dateStr) => {
    try { return new Date(dateStr).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }); }
    catch { return "—"; }
  };

  return (
    <div className="adm-page">

      {/* KPI cards */}
      <div className="adm-metrics">
        {metrics.map(m => (
          <div key={m.label} className="adm-metric-card">
            <p className="adm-metric-label">{m.label}</p>
            <p className="adm-metric-value">{m.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="adm-controls">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#98a2b3" strokeWidth="1.5"/><path d="M13 13L16 16" stroke="#98a2b3" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID, customer name or email…" />
        </div>
        {["All","Pending","Processing","Shipped","Completed","Cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`adm-btn-secondary${filter === f ? " active" : ""}`}>{f}</button>
        ))}
        <button onClick={handleExport} className="adm-btn-primary">Export CSV</button>
      </div>

      {/* Table */}
      <div className="adm-table-wrap">
        <div className="adm-table-header">
          {["Order ID","Customer","Date","Items","Total","Status","Actions"].map(h => (
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>

        {loading && (
          <div className="adm-empty"><p>Loading orders…</p></div>
        )}

        {!loading && filtered.map(o => (
          <div key={o._id} className="adm-table-row">
            <p className="adm-table-td" style={{ fontWeight: 700, color: "#2563eb" }}>{o.orderId || o._id?.slice(-8)}</p>
            <div className="adm-table-td" style={{ display:"flex", flexDirection:"column", gap:2, overflow:"hidden" }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#101828", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.customerName}</span>
              <span style={{ fontSize:11, color:"#98a2b3", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.customerEmail}</span>
            </div>
            <p className="adm-table-td" style={{ color:"#98a2b3", fontSize:11 }}>{fmt(o.createdAt)}</p>
            <p className="adm-table-td" style={{ color:"#667085" }}>{o.items?.length ?? 0} item{o.items?.length !== 1 ? "s" : ""}</p>
            <p className="adm-table-td" style={{ fontWeight:700 }}>${(o.total||0).toLocaleString()}</p>
            <div className="adm-table-td">
              <span className={STATUS_BADGE[o.status] || "adm-badge adm-badge-gray"}>{o.status}</span>
            </div>
            <div className="adm-table-td" style={{ display:"flex", gap:6 }}>
              <button onClick={() => setSelected(o)} className="adm-action-view">View</button>
              <select
                value={o.status}
                disabled={updating === o._id}
                onChange={e => handleStatusChange(o._id, e.target.value)}
                style={{ height:30, padding:"0 6px", border:"1px solid #dde4ee", borderRadius:8, fontSize:11, fontFamily:"inherit", color:"#101828", background:"#fff", cursor:"pointer", outline:"none" }}
              >
                {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="adm-empty"><p>No orders match the current filter.</p></div>
        )}
      </div>

      {/* Order detail modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:24 }}>
          <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:540, boxShadow:"0 20px 60px rgba(0,0,0,0.15)", overflow:"hidden" }}>

            {/* Modal header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #f4f7fb", background:"#fafbfd" }}>
              <div>
                <p style={{ fontSize:10, fontWeight:700, color:"#2563eb", textTransform:"uppercase", margin:0 }}>Order Invoice</p>
                <h3 style={{ fontSize:17, fontWeight:700, color:"#101828", margin:0 }}>{selected.orderId || selected._id}</h3>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", fontSize:18, color:"#98a2b3", cursor:"pointer" }}>✕</button>
            </div>

            <div style={{ padding:20, display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div style={{ background:"#fafbfd", padding:"10px 14px", borderRadius:10, border:"1px solid #dde4ee" }}>
                  <p style={{ fontSize:10, color:"#98a2b3", fontWeight:600, margin:"0 0 4px", textTransform:"uppercase" }}>Customer</p>
                  <p style={{ fontSize:13, fontWeight:700, color:"#101828", margin:0 }}>{selected.customerName}</p>
                  <p style={{ fontSize:11, color:"#667085", margin:"2px 0 0" }}>{selected.customerEmail}</p>
                </div>
                <div style={{ background:"#fafbfd", padding:"10px 14px", borderRadius:10, border:"1px solid #dde4ee" }}>
                  <p style={{ fontSize:10, color:"#98a2b3", fontWeight:600, margin:"0 0 4px", textTransform:"uppercase" }}>Status</p>
                  <span className={STATUS_BADGE[selected.status] || "adm-badge adm-badge-gray"}>{selected.status}</span>
                  <p style={{ fontSize:11, color:"#667085", margin:"6px 0 0" }}>{fmt(selected.createdAt)}</p>
                </div>
              </div>
              <div style={{ background:"#fafbfd", padding:"10px 14px", borderRadius:10, border:"1px solid #dde4ee" }}>
                <p style={{ fontSize:10, color:"#98a2b3", fontWeight:600, margin:"0 0 4px", textTransform:"uppercase" }}>Shipping address</p>
                <p style={{ fontSize:12, color:"#101828", margin:0 }}>{selected.address}</p>
              </div>
              {/* Items */}
              {selected.items?.map((item, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:"1px solid #f4f7fb" }}>
                  {item.productImage && <img src={item.productImage} alt="" style={{ width:40, height:40, borderRadius:8, objectFit:"cover", border:"1px solid #dde4ee", flexShrink:0 }} />}
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, fontWeight:600, color:"#101828", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.productName}</p>
                    <p style={{ fontSize:11, color:"#667085", margin:0 }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontSize:13, fontWeight:700, color:"#101828", flexShrink:0 }}>${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              {/* Totals */}
              <div style={{ background:"#e8f0ff", borderRadius:10, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  {selected.discount > 0 && <span style={{ fontSize:11, color:"#667085" }}>Discount: -${selected.discount?.toFixed(2)}</span>}
                  <span style={{ fontSize:11, color:"#667085" }}>Tax: ${selected.tax?.toFixed(2)}</span>
                  <span style={{ fontSize:11, color:"#667085" }}>Shipping: {selected.shipping === 0 ? "Free" : `$${selected.shipping}`}</span>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontSize:11, color:"#667085", margin:0 }}>Total</p>
                  <p style={{ fontSize:20, fontWeight:700, color:"#101828", margin:0 }}>${selected.total?.toLocaleString()}</p>
                </div>
              </div>
              {/* Status update */}
              <div style={{ display:"flex", gap:10 }}>
                <select value={selected.status} onChange={e => handleStatusChange(selected._id, e.target.value)}
                  style={{ flex:1, height:44, padding:"0 12px", borderRadius:10, border:"1px solid #dde4ee", fontSize:13, fontFamily:"inherit", color:"#101828", background:"#fff", cursor:"pointer", outline:"none" }}>
                  {STATUS_OPTS.map(s => <option key={s} value={s}>Status: {s}</option>)}
                </select>
                <button onClick={() => setSelected(null)} className="adm-btn-secondary">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

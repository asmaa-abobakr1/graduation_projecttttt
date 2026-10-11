import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStoredOrders, saveStoredOrders, exportToCSV } from "../../utils/exportUtils";

const STATUS_MAP = {
  Processing: "adm-badge-yellow",
  Shipped:    "adm-badge-blue",
  Completed:  "adm-badge-green",
  Returns:    "adm-badge-red",
};

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");
  const [orders, setOrders]   = useState(() => getStoredOrders());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  useEffect(() => {
    saveStoredOrders(orders);
  }, [orders]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.email && o.email.toLowerCase().includes(search.toLowerCase()));
    if (filter !== "All") return matchSearch && o.status === filter;
    return matchSearch;
  });

  const metrics = [
    { label: "Total orders",   value: String(orders.length) },
    { label: "Processing",     value: String(orders.filter((o) => o.status === "Processing").length),  positive: false, change: "Awaiting fulfillment" },
    { label: "Shipped",        value: String(orders.filter((o) => o.status === "Shipped").length),     positive: true,  change: "In transit" },
    { label: "Completed",      value: String(orders.filter((o) => o.status === "Completed").length),   positive: true,  change: "Successfully delivered" },
    { label: "Returns",        value: String(orders.filter((o) => o.status === "Returns").length),     positive: false, change: "Needs resolution" },
  ];

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleExportCSV = () => {
    exportToCSV("orders_report", filtered, [
      { key: "id", label: "Order ID" },
      { key: "customer", label: "Customer Name" },
      { key: "email", label: "Customer Email" },
      { key: "date", label: "Order Date" },
      { key: "items", label: "Items Count" },
      { key: "total", label: "Total Amount ($)" },
      { key: "status", label: "Status" },
      { key: "address", label: "Shipping Address" },
      { key: "payment", label: "Payment Method" },
      { key: "trackingNumber", label: "Tracking Number" },
    ]);
  };

  return (
    <div className="adm-page">
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Orders Management</p>
          <p className="adm-topbar-sub">{today} · Real-time fulfillment & tracking</p>
        </div>
        <div className="adm-topbar-right">
          <div className="adm-avatar">{user?.name ? user.name.charAt(0) : "A"}</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{user?.name || "Admin"}</p>
        </div>
      </div>

      <div className="adm-metrics">
        {metrics.map((m) => (
          <div key={m.label} className="adm-metric-card">
            <p className="adm-metric-label">{m.label}</p>
            <p className="adm-metric-value">{m.value}</p>
            {m.change && <p className={m.positive ? "adm-metric-change-pos" : "adm-metric-change-neg"}>{m.change}</p>}
          </div>
        ))}
      </div>

      <div className="adm-controls">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" style={{ color: "#94a3b8", flexShrink: 0 }}>
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name or email..."
          />
        </div>
        {["All", "Processing", "Shipped", "Completed", "Returns"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`adm-btn-secondary${filter === f ? " active" : ""}`}
          >
            {f}
          </button>
        ))}
        <button onClick={handleExportCSV} className="adm-btn-primary" title="Export current orders as CSV spreadsheet">
          Export CSV
        </button>
      </div>

      <div className="adm-table-wrap">
        <div className="adm-table-header">
          {["Order ID", "Customer", "Date", "Items", "Total", "Status", "Actions"].map((h) => (
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>

        {filtered.map((o) => (
          <div key={o.id} className="adm-table-row">
            <p className="adm-table-td" style={{ fontWeight: 700, color: "#2563eb" }}>{o.id}</p>
            <div className="adm-table-td" style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.customer}</p>
              <p style={{ fontSize: 10, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.email}</p>
            </div>
            <p className="adm-table-td" style={{ color: "#94a3b8", fontSize: 11 }}>{o.date}</p>
            <p className="adm-table-td" style={{ color: "#64748b" }}>{o.items} item{o.items !== 1 ? "s" : ""}</p>
            <p className="adm-table-td" style={{ fontWeight: 700 }}>${o.total.toLocaleString()}</p>
            <div className="adm-table-td">
              <span className={`adm-badge ${STATUS_MAP[o.status] || "adm-badge-gray"}`}>{o.status}</span>
            </div>
            <div className="adm-table-td" style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setSelectedOrder(o)} className="adm-action-view">View</button>
              <select
                value={o.status}
                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                style={{
                  fontSize: 11, fontWeight: 600, color: "#475569",
                  background: "#F1F5F9", border: "none", borderRadius: 8,
                  padding: "4px 6px", cursor: "pointer", outline: "none",
                }}
              >
                {["Processing", "Shipped", "Completed", "Returns"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="adm-empty"><p>No orders match the current filter</p></div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 16
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 540,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "1px solid #E2E8F0",
            overflow: "hidden", animation: "fadeIn 0.2s ease"
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC"
            }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>Order Invoice</p>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: 0 }}>{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: "none", border: "none", fontSize: 18, color: "#94a3b8",
                  cursor: "pointer", padding: "4px 8px", borderRadius: 8
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#F8FAFC", padding: 12, borderRadius: 12, border: "1px solid #E8EDF5" }}>
                  <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", margin: "0 0 4px" }}>Customer</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>{selectedOrder.customer}</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>{selectedOrder.email}</p>
                </div>
                <div style={{ background: "#F8FAFC", padding: 12, borderRadius: 12, border: "1px solid #E8EDF5" }}>
                  <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", margin: "0 0 4px" }}>Payment & Date</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>{selectedOrder.payment || "Credit Card"}</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>Placed on {selectedOrder.date}</p>
                </div>
              </div>

              <div style={{ background: "#F8FAFC", padding: 12, borderRadius: 12, border: "1px solid #E8EDF5" }}>
                <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", margin: "0 0 4px" }}>Shipping Destination</p>
                <p style={{ fontSize: 12, color: "#0f172a", margin: 0 }}>{selectedOrder.address || "123 Technology Drive, Suite 400"}</p>
                <p style={{ fontSize: 11, color: "#2563eb", fontWeight: 600, margin: "4px 0 0" }}>Tracking: {selectedOrder.trackingNumber || "FX-7749210"}</p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#EFF6FF", borderRadius: 12 }}>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Items: <strong>{selectedOrder.items}</strong></span>
                  <span style={{ margin: "0 8px", color: "#CBD5E1" }}>•</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Status: <strong className={STATUS_MAP[selectedOrder.status]}>{selectedOrder.status}</strong></span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>Total Billed</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>${selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  style={{
                    flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid #CBD5E1",
                    fontSize: 12, fontWeight: 600, color: "#0f172a", background: "#fff", cursor: "pointer"
                  }}
                >
                  {["Processing", "Shipped", "Completed", "Returns"].map((s) => (
                    <option key={s} value={s}>Status: {s}</option>
                  ))}
                </select>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: "10px 18px", borderRadius: 10, background: "#0f172a", color: "#fff",
                    border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer"
                  }}
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

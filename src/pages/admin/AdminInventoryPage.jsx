import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { exportToCSV } from "../../utils/exportUtils";

export default function AdminInventoryPage() {
  const { products, updateProduct } = useProducts();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [adjustingId, setAdjustingId] = useState(null);
  const [adjustValue, setAdjustValue] = useState("");
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const totalUnits      = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount   = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const restockNeeded   = lowStockCount + outOfStockCount;

  const metrics = [
    { label: "Total stock",    value: `${totalUnits.toLocaleString()} units` },
    { label: "Low stock",      value: String(lowStockCount),   change: `${lowStockCount} below 10`,   positive: lowStockCount === 0 },
    { label: "In stock",       value: String(products.filter((p) => p.stock >= 10).length), positive: true },
    { label: "Out of stock",   value: String(outOfStockCount), change: "Needs restock",               positive: outOfStockCount === 0 },
    { label: "Restock needed", value: String(restockNeeded),   change: "Total attention needed",      positive: restockNeeded === 0 },
  ];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
    if (filter === "Low") return matchSearch && p.stock > 0 && p.stock < 10;
    if (filter === "Out") return matchSearch && p.stock === 0;
    return matchSearch;
  });

  const handleAdjustConfirm = (productId) => {
    const parsed = parseInt(adjustValue);
    if (!isNaN(parsed) && parsed >= 0) {
      updateProduct(productId, { stock: parsed });
    }
    setAdjustingId(null);
    setAdjustValue("");
  };

  const handleAdjustKeyDown = (e, productId) => {
    if (e.key === "Enter") handleAdjustConfirm(productId);
    if (e.key === "Escape") { setAdjustingId(null); setAdjustValue(""); }
  };

  const handleExportCSV = () => {
    const exportData = filtered.map((p) => ({
      ...p,
      status: p.stock === 0 ? "Out of stock" : p.stock < 10 ? "Low stock" : "In stock",
    }));
    exportToCSV("inventory_report", exportData, [
      { key: "id", label: "Product ID" },
      { key: "name", label: "Product Name" },
      { key: "brand", label: "Brand" },
      { key: "category", label: "Category" },
      { key: "price", label: "Price ($)" },
      { key: "stock", label: "Units in Stock" },
      { key: "status", label: "Stock Status" },
    ]);
  };

  return (
    <div className="adm-page">
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Inventory Control</p>
          <p className="adm-topbar-sub">{today} · Stock management</p>
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
            {m.change && (
              <p className={m.positive ? "adm-metric-change-pos" : "adm-metric-change-neg"}>{m.change}</p>
            )}
          </div>
        ))}
      </div>

      <div className="adm-controls">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" style={{ color: "#94a3b8", flexShrink: 0 }}>
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by product name or brand..." />
        </div>
        {[
          { label: "All items", key: "All" },
          { label: "Low stock", key: "Low" },
          { label: "Out of stock", key: "Out" },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`adm-btn-secondary${filter === f.key ? " active" : ""}`}>
            {f.label}
          </button>
        ))}
        <button onClick={handleExportCSV} className="adm-btn-primary">Export CSV</button>
      </div>

      <div className="adm-table-wrap">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: "1px solid #E8EDF5" }}>
          <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{filtered.length} of {products.length} items</p>
          <p style={{ fontSize: 10, color: "#cbd5e1" }}>Click Adjust to edit stock inline</p>
        </div>

        <div className="adm-table-header">
          {["Product", "Brand", "Category", "Price", "Stock", "Status", "Threshold", "Warehouse", "Actions"].map((h) => (
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>

        {filtered.map((p) => {
          const stockStatus = p.stock === 0 ? "out" : p.stock < 10 ? "low" : "ok";
          const isAdjusting = adjustingId === p.id;
          return (
            <div key={p.id} className="adm-table-row">
              <div className="adm-table-td" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <img src={p.image} alt="" style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover", flexShrink: 0, border: "1px solid #E8EDF5" }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{p.name}</span>
              </div>
              <p className="adm-table-td" style={{ color: "#94a3b8" }}>{p.brand}</p>
              <p className="adm-table-td" style={{ color: "#94a3b8" }}>{p.category}</p>
              <p className="adm-table-td" style={{ fontWeight: 600 }}>${p.price?.toLocaleString()}</p>
              <p className="adm-table-td" style={{ fontWeight: 700, color: stockStatus === "out" ? "#dc2626" : stockStatus === "low" ? "#d97706" : "#059669" }}>
                {p.stock} units
              </p>
              <div className="adm-table-td">
                <span className={`adm-badge ${stockStatus === "out" ? "adm-badge-red" : stockStatus === "low" ? "adm-badge-yellow" : "adm-badge-green"}`}>
                  {stockStatus === "out" ? "Out of stock" : stockStatus === "low" ? "Low stock" : "In stock"}
                </span>
              </div>
              <p className="adm-table-td" style={{ color: "#94a3b8" }}>10 units</p>
              <p className="adm-table-td" style={{ color: "#94a3b8" }}>WH-Main</p>
              <div className="adm-table-td">
                {isAdjusting ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input
                      autoFocus
                      type="number"
                      min="0"
                      value={adjustValue}
                      onChange={(e) => setAdjustValue(e.target.value)}
                      onKeyDown={(e) => handleAdjustKeyDown(e, p.id)}
                      className="adm-inline-input"
                      placeholder={String(p.stock)}
                    />
                    <button onClick={() => handleAdjustConfirm(p.id)} className="adm-action-edit" style={{ padding: "4px 8px" }}>✓</button>
                    <button onClick={() => { setAdjustingId(null); setAdjustValue(""); }} className="adm-action-neutral" style={{ padding: "4px 8px" }}>✕</button>
                  </div>
                ) : (
                  <button onClick={() => { setAdjustingId(p.id); setAdjustValue(String(p.stock)); }} className="adm-action-edit">
                    Adjust
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="adm-empty"><p>No inventory items match the current filter</p></div>
        )}
      </div>
    </div>
  );
}

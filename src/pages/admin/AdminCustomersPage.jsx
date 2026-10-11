import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStoredCustomers, saveStoredCustomers, exportToCSV } from "../../utils/exportUtils";

export default function AdminCustomersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [customers, setCustomers] = useState(() => getStoredCustomers());
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", location: "", status: "Active" });

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  useEffect(() => {
    saveStoredCustomers(customers);
  }, [customers]);

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search));
    if (filter !== "All") return matchSearch && c.status === filter;
    return matchSearch;
  });

  const totalRevenue = customers.reduce((a, c) => a + c.spent, 0);
  const totalOrders  = customers.reduce((a, c) => a + c.orders, 0);

  const metrics = [
    { label: "Total customers",  value: String(customers.length) },
    { label: "Active",           value: String(customers.filter((c) => c.status === "Active").length),   positive: true,  change: "Currently active" },
    { label: "Inactive",         value: String(customers.filter((c) => c.status === "Inactive").length), positive: false, change: "Re-engage needed" },
    { label: "Total revenue",    value: `$${totalRevenue.toLocaleString()}`,                               positive: true,  change: "All-time" },
    { label: "Avg order value",  value: totalOrders > 0 ? `$${Math.round(totalRevenue / totalOrders)}` : "$0", positive: true },
  ];

  const handleExportCSV = () => {
    exportToCSV("customers_list", filtered, [
      { key: "id", label: "Customer ID" },
      { key: "name", label: "Full Name" },
      { key: "email", label: "Email Address" },
      { key: "phone", label: "Phone Number" },
      { key: "location", label: "Location" },
      { key: "joined", label: "Join Date" },
      { key: "orders", label: "Total Orders" },
      { key: "spent", label: "Total Spent ($)" },
      { key: "status", label: "Account Status" },
    ]);
  };

  const openEdit = (customer) => {
    setEditingCustomer(customer);
    setEditForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "+1 (555) 000-0000",
      location: customer.location || "San Francisco, CA",
      status: customer.status || "Active",
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) return;
    setCustomers((prev) =>
      prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...editForm } : c))
    );
    setEditingCustomer(null);
  };

  return (
    <div className="adm-page">
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Customer Management</p>
          <p className="adm-topbar-sub">{today} · Customer accounts & activity</p>
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
            placeholder="Search by customer name, email or phone..."
          />
        </div>
        {["All", "Active", "Inactive"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`adm-btn-secondary${filter === f ? " active" : ""}`}
          >
            {f}
          </button>
        ))}
        <button onClick={handleExportCSV} className="adm-btn-primary" title="Export customer directory to CSV">
          Export CSV
        </button>
      </div>

      <div className="adm-table-wrap">
        <div className="adm-table-header">
          {["ID", "Customer", "Joined", "Orders", "Total spent", "Status", "Actions"].map((h) => (
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>

        {filtered.map((c) => (
          <div key={c.id} className="adm-table-row">
            <p className="adm-table-td" style={{ color: "#94a3b8", fontSize: 11, fontWeight: 500 }}>{c.id}</p>
            <div className="adm-table-td" style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
              <p style={{ fontSize: 10, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</p>
            </div>
            <p className="adm-table-td" style={{ color: "#94a3b8", fontSize: 11 }}>{c.joined}</p>
            <p className="adm-table-td" style={{ fontWeight: 600 }}>{c.orders} orders</p>
            <p className="adm-table-td" style={{ fontWeight: 700 }}>${c.spent.toLocaleString()}</p>
            <div className="adm-table-td">
              <span className={`adm-badge ${c.status === "Active" ? "adm-badge-green" : "adm-badge-gray"}`}>{c.status}</span>
            </div>
            <div className="adm-table-td" style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setViewingCustomer(c)} className="adm-action-view">View</button>
              <button onClick={() => openEdit(c)} className="adm-action-neutral">Edit</button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="adm-empty"><p>No customers match the current filter</p></div>
        )}
      </div>

      {/* Customer View Profile Modal */}
      {viewingCustomer && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 16
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 500,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "1px solid #E2E8F0",
            overflow: "hidden"
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC"
            }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>Customer Profile</p>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>{viewingCustomer.name}</h3>
              </div>
              <button onClick={() => setViewingCustomer(null)}
                style={{ background: "none", border: "none", fontSize: 18, color: "#94a3b8", cursor: "pointer", padding: "4px 8px" }}>
                ✕
              </button>
            </div>

            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                  color: "#fff", fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {viewingCustomer.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{viewingCustomer.name}</h4>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>{viewingCustomer.email}</p>
                </div>
                <span className={`adm-badge ${viewingCustomer.status === "Active" ? "adm-badge-green" : "adm-badge-gray"}`} style={{ marginLeft: "auto" }}>
                  {viewingCustomer.status}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "#F8FAFC", padding: "10px 14px", borderRadius: 10, border: "1px solid #E8EDF5" }}>
                  <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Phone</span>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", margin: "2px 0 0" }}>{viewingCustomer.phone || "+1 (555) 234-5678"}</p>
                </div>
                <div style={{ background: "#F8FAFC", padding: "10px 14px", borderRadius: 10, border: "1px solid #E8EDF5" }}>
                  <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Location</span>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", margin: "2px 0 0" }}>{viewingCustomer.location || "San Francisco, CA"}</p>
                </div>
                <div style={{ background: "#F8FAFC", padding: "10px 14px", borderRadius: 10, border: "1px solid #E8EDF5" }}>
                  <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Total Orders</span>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#2563eb", margin: "2px 0 0" }}>{viewingCustomer.orders}</p>
                </div>
                <div style={{ background: "#F8FAFC", padding: "10px 14px", borderRadius: 10, border: "1px solid #E8EDF5" }}>
                  <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>Lifetime Spend</span>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#059669", margin: "2px 0 0" }}>${viewingCustomer.spent.toLocaleString()}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button
                  onClick={() => {
                    openEdit(viewingCustomer);
                    setViewingCustomer(null);
                  }}
                  className="adm-btn-primary" style={{ flex: 1, justifyContent: "center" }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setViewingCustomer(null)}
                  className="adm-btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Edit Modal */}
      {editingCustomer && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 16
        }}>
          <form onSubmit={handleSaveEdit} style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "1px solid #E2E8F0",
            overflow: "hidden"
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC"
            }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>Edit Customer</p>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>{editingCustomer.id}</h3>
              </div>
              <button type="button" onClick={() => setEditingCustomer(null)}
                style={{ background: "none", border: "none", fontSize: 18, color: "#94a3b8", cursor: "pointer", padding: "4px 8px" }}>
                ✕
              </button>
            </div>

            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="adm-field">
                <label className="adm-label">Full Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="adm-input" required
                />
              </div>

              <div className="adm-field">
                <label className="adm-label">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="adm-input" required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div className="adm-field">
                  <label className="adm-label">Phone</label>
                  <input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="adm-input"
                  />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Location</label>
                  <input
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="adm-input"
                  />
                </div>
              </div>

              <div className="adm-field">
                <label className="adm-label">Account Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="adm-input" style={{ cursor: "pointer" }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setEditingCustomer(null)} className="adm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

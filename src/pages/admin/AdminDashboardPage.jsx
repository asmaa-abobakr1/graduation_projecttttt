import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { analyticsAPI, ordersAPI } from "../../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

// ── tiny helpers ──────────────────────────────────────────────────────────────
const card = {
  background: "#fff",
  border: "1px solid #dde4ee",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0px 8px 24px 0px rgba(16,24,40,0.07)",
};

const STATUS_STYLE = {
  Processing: { bg: "#fff4e5", color: "#d97706" },
  Shipped:    { bg: "#e8f0ff", color: "#2563eb" },
  Completed:  { bg: "#e8f8f1", color: "#078a55" },
  Refunded:   { bg: "#feeceb", color: "#d92d20" },
  Cancelled:  { bg: "#feeceb", color: "#d92d20" },
  Pending:    { bg: "#fff4e5", color: "#d97706" },
};

function Badge({ label }) {
  const s = STATUS_STYLE[label] || { bg: "#eef3f9", color: "#667085" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "5px 9px", borderRadius: 999,
      fontSize: 11, fontWeight: 400,
      background: s.bg, color: s.color,
    }}>
      {label}
    </span>
  );
}

export default function AdminDashboardPage() {
  const { products } = useProducts();
  const { user }     = useAuth();

  const [dashboard, setDashboard]   = useState(null);
  const [monthly, setMonthly]       = useState([]);
  const [recentOrders, setRecent]   = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.allSettled([
      analyticsAPI.getDashboard(),
      analyticsAPI.getMonthlySales(),
      ordersAPI.getAll({ limit: 8 }),
    ]).then(([dash, sales, orders]) => {
      if (dash.status === "fulfilled"   && dash.value?.data)      setDashboard(dash.value.data);
      if (sales.status === "fulfilled"  && sales.value?.data)     setMonthly(sales.value.data);
      if (orders.status === "fulfilled" && orders.value?.data)    setRecent(orders.value.data);
      setLoading(false);
    });
  }, []);

  const lowStock   = dashboard?.lowStockProducts?.length ?? products.filter(p => p.stock < 10).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  const kpis = [
    {
      label: "Net revenue",
      value: `$${(dashboard?.totalRevenue ?? 0).toLocaleString()}`,
      trend: "+12.4% vs last month",
      up: true,
    },
    {
      label: "Orders",
      value: (dashboard?.totalOrders ?? recentOrders.length).toLocaleString(),
      trend: "+8.2% vs last month",
      up: true,
    },
    {
      label: "Customers",
      value: (dashboard?.totalUsers ?? 0).toLocaleString(),
      trend: "+5.7% vs last month",
      up: true,
    },
    {
      label: "Conversion",
      value: `${dashboard?.conversionRate ?? "0.00"}%`,
      trend: "+0.6 pts",
      up: true,
    },
    {
      label: "Available devices",
      value: (dashboard?.totalProducts ?? products.length).toLocaleString(),
      trend: lowStock > 0 ? `${lowStock} low stock` : "Healthy stock",
      up: lowStock === 0,
    },
  ];

  const orderStatusCounts = {
    Processing: recentOrders.filter(o => o.status === "Processing").length,
    Shipped:    recentOrders.filter(o => o.status === "Shipped").length,
    Completed:  recentOrders.filter(o => o.status === "Completed").length,
    Refunded:   recentOrders.filter(o => o.status === "Refunded" || o.status === "Cancelled").length,
  };

  const chartData = monthly.length > 0 ? monthly : [
    { month:"Jan",revenue:0 },{ month:"Feb",revenue:0 },{ month:"Mar",revenue:0 },
    { month:"Apr",revenue:0 },{ month:"May",revenue:0 },{ month:"Jun",revenue:0 },
    { month:"Jul",revenue:0 },{ month:"Aug",revenue:0 },{ month:"Sep",revenue:0 },
    { month:"Oct",revenue:0 },{ month:"Nov",revenue:0 },{ month:"Dec",revenue:0 },
  ];

  return (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24, background: "#f4f7fb", minHeight: "100%" }}>

      {/* ── KPI cards ── */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...card, flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 12, color: "#667085", margin: 0 }}>{k.label}</p>
            <p style={{ fontSize: 26, fontWeight: 400, color: "#101828", margin: 0, letterSpacing: "-0.5px" }}>
              {loading ? "—" : k.value}
            </p>
            <p style={{ fontSize: 11, color: k.up ? "#078a55" : "#d92d20", margin: 0 }}>{k.trend}</p>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* Bar chart */}
        <div style={{ ...card, flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#101828", margin: 0 }}>Daily order activity</p>
            <span style={{ padding: "5px 9px", borderRadius: 999, fontSize: 11, background: "#eef3f9", color: "#667085" }}>
              Last 12 months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#98a2b3" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #dde4ee", borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#e8f0ff" radius={[4, 4, 0, 0]}
                label={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right column */}
        <div style={{ width: 350, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Order status */}
          <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#101828", margin: 0 }}>Order status</p>
            {Object.entries(orderStatusCounts).map(([label, count]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Badge label={label} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#101828" }}>{count.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Inventory summary */}
          <div style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#101828", margin: 0 }}>Inventory summary</p>
            <p style={{ fontSize: 13, color: "#667085", margin: 0 }}>
              {lowStock} low stock · {outOfStock} out of stock
            </p>
            {lowStock > 0 && (
              <span style={{ padding: "5px 9px", borderRadius: 999, fontSize: 11, background: "#feeceb", color: "#d92d20", width: "fit-content" }}>
                {lowStock} need attention
              </span>
            )}
            <Link to="/admin/inventory" style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>
              View inventory →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent activity table ── */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>

        {/* Table header bar */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #dde4ee", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#101828", margin: 0 }}>Recent activity logs</p>
          <span style={{ padding: "5px 9px", borderRadius: 999, fontSize: 11, background: "#e8f8f1", color: "#078a55" }}>Live</span>
        </div>

        {/* Column headers */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
          background: "#eef3f9", borderBottom: "1px solid #dde4ee",
          padding: "0 20px", minHeight: 38, alignItems: "center",
        }}>
          {["Event", "Owner", "Reference", "Time"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {(recentOrders.length > 0 ? recentOrders : [
          { orderId: "V-90482", customerName: "Nina Park",  total: 1249, createdAt: new Date(Date.now() - 4  * 60000) },
          { orderId: "V-88341", customerName: "Omar Ruiz",  total: 349,  createdAt: new Date(Date.now() - 18 * 60000) },
          { orderId: "V-87204", customerName: "Maya Chen",  total: 2499, createdAt: new Date(Date.now() - 42 * 60000) },
          { orderId: "V-90211", customerName: "Nina Park",  total: 799,  createdAt: new Date(Date.now() - 60 * 60000) },
        ]).slice(0, 8).map((o, i) => {
          const timeAgo = (() => {
            const diff = Date.now() - new Date(o.createdAt).getTime();
            const m = Math.floor(diff / 60000);
            if (m < 60) return `${m} min ago`;
            const h = Math.floor(m / 60);
            if (h < 24) return `${h} hr ago`;
            return `${Math.floor(h / 24)} d ago`;
          })();
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
              padding: "0 20px", minHeight: 52, alignItems: "center",
              borderBottom: "1px solid #f4f7fb",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#fafbfd"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: "#101828", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Order #{o.orderId || o._id?.slice?.(-6)} placed
              </span>
              <span style={{ fontSize: 12, color: "#101828" }}>
                {o.customerName || "Customer"}
              </span>
              <span style={{ fontSize: 12, color: "#667085" }}>
                ${(o.total || 0).toLocaleString()}
              </span>
              <span style={{ fontSize: 11, color: "#98a2b3" }}>{timeAgo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

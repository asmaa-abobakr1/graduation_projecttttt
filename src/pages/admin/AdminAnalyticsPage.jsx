import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import { exportToCSV } from "../../utils/exportUtils";
import { analyticsAPI } from "../../services/api";

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const [period, setPeriod] = useState("30d");

  const [dashboard, setDashboard] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    analyticsAPI.getDashboard()
      .then((res) => { if (res?.data) setDashboard(res.data); })
      .catch((e) => console.warn("Analytics dashboard error:", e.message));

    analyticsAPI.getMonthlySales()
      .then((res) => { if (res?.data?.length) setMonthlySales(res.data); })
      .catch((e) => console.warn("Monthly sales error:", e.message));

    analyticsAPI.getCategoryBreakdown()
      .then((res) => { if (res?.data?.length) setCategoryBreakdown(res.data); })
      .catch((e) => console.warn("Category breakdown error:", e.message));

    analyticsAPI.getTopProducts()
      .then((res) => { if (res?.data?.length) setTopProducts(res.data); })
      .catch((e) => console.warn("Top products error:", e.message));
  }, []);

  const totalRev = dashboard?.totalRevenue || 284920;

  const summaryMetrics = [
    { label: "Total revenue", value: `$${totalRev.toLocaleString()}`, change: "+12.4%", positive: true },
    { label: "Net profit",    value: `$${Math.round(totalRev * 0.33).toLocaleString()}`, change: "+9.1%", positive: true },
    { label: "Avg order val", value: dashboard?.totalOrders ? `$${Math.round(totalRev / dashboard.totalOrders)}` : "$412", change: "+3.2%", positive: true },
    { label: "Refund rate",   value: "2.7%",     change: "-0.4%", positive: true },
  ];

  const funnelStages = [
    { stage: "Visitors",      value: "42,800 sessions" },
    { stage: "Product views", value: "18,240 sessions" },
    { stage: "Add to cart",   value: "6,390 sessions" },
    { stage: "Checkout",      value: "3,210 sessions" },
    { stage: "Purchase",      value: `${dashboard?.totalOrders ? dashboard.totalOrders.toLocaleString() : "2,060"} orders` },
  ];

  const channels = [
    { channel: "Organic search",   revenue: "$84,200", orders: "892", cvr: "3.8%" },
    { channel: "Direct / branded", revenue: "$61,440", orders: "648", cvr: "5.1%" },
    { channel: "Paid social",      revenue: "$38,960", orders: "412", cvr: "2.2%" },
    { channel: "Email",            revenue: "$29,340", orders: "310", cvr: "6.4%" },
  ];

  const topProductsData = topProducts.length > 0 ? topProducts.map((p) => ({
    product: p.name || p.product,
    category: p.category || "General",
    revenue: `$${((p.price || 500) * (p.soldCount || 10)).toLocaleString()}`,
    units: String(p.soldCount || 10),
    margin: "28%",
  })) : [
    { product: "Aether Phone Pro",      category: "Phones",    revenue: "$48,200", units: "48", margin: "24%" },
    { product: "NovaBook Air 14",       category: "Laptops",   revenue: "$43,740", units: "35", margin: "18%" },
    { product: "Pulse ANC Headphones", category: "Audio",     revenue: "$28,360", units: "81", margin: "41%" },
    { product: "Orbit Watch S",         category: "Wearables", revenue: "$21,450", units: "50", margin: "33%" },
  ];

  const maxRevenue = Math.max(...(monthlySales?.map((m) => m.revenue) || [1]));

  const catData = (categoryBreakdown || [
    { name: "Phones",    revenue: 84200 },
    { name: "Laptops",   revenue: 61440 },
    { name: "Audio",     revenue: 38960 },
    { name: "Tablets",   revenue: 29340 },
    { name: "Wearables", revenue: 21450 },
  ]).map((cat) => ({ ...cat, category: cat.name || cat.category || cat._id }));

  const maxCatRevenue = Math.max(...catData.map((c) => c.revenue || 0), 1);

  const handleExportReport = () => {
    exportToCSV(`analytics_report_${period}`, topProductsData, [
      { key: "product", label: "Product Name" },
      { key: "category", label: "Category" },
      { key: "revenue", label: "Revenue" },
      { key: "units", label: "Units Sold" },
      { key: "margin", label: "Profit Margin" },
    ]);
  };

  return (
    <div className="adm-page">
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Analytics & Reports</p>
          <p className="adm-topbar-sub">{today} · Performance overview</p>
        </div>
        <div className="adm-topbar-right">
          {["30d", "90d", "1y"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`adm-btn-secondary${period === p ? " active" : ""}`}>
              {p === "30d" ? "Last 30 days" : p === "90d" ? "Last 90 days" : "This year"}
            </button>
          ))}
          <button onClick={handleExportReport} className="adm-btn-primary">Export report</button>
        </div>
      </div>

      <div className="adm-metrics">
        {summaryMetrics.map((m) => (
          <div key={m.label} className="adm-metric-card">
            <p className="adm-metric-label">{m.label}</p>
            <p className="adm-metric-value">{m.value}</p>
            <p className={m.positive ? "adm-metric-change-pos" : "adm-metric-change-neg"}>{m.change}</p>
          </div>
        ))}
      </div>

      <div className="adm-charts-row">
        {/* Revenue Trend */}
        <div className="adm-chart-main">
          <div>
            <p className="adm-card-title">Revenue trend</p>
            <p className="adm-card-sub">Monthly revenue · USD</p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140, width: "100%" }}>
            {(monthlySales || []).map((bar, i) => {
              const h = Math.max(6, Math.round(((bar.revenue || 0) / maxRevenue) * 120));
              const isLast = i === (monthlySales?.length ?? 0) - 1;
              return (
                <div key={i} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", borderRadius: 5, height: h, backgroundColor: isLast ? "#2563eb" : "#DBEAFE" }} />
                  <span style={{ fontSize: 8, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
                    {bar.month?.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales Performance */}
        <div className="adm-chart-side">
          <p className="adm-card-title">Sales by category</p>
          {catData.map((cat) => {
            const w = Math.max(5, Math.round((cat.revenue / maxCatRevenue) * 100));
            return (
              <div key={cat.category} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <p style={{ fontSize: 12, color: "#0f172a", width: 70, flexShrink: 0, fontWeight: 500 }}>{cat.category}</p>
                <div style={{ flex: 1, background: "#F1F5F9", height: 7, borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ background: "linear-gradient(90deg, #3b82f6, #2563eb)", height: "100%", borderRadius: 999, width: `${w}%`, transition: "width 0.4s" }} />
                </div>
                <p style={{ fontSize: 11, color: "#64748b", textAlign: "right", width: 60, flexShrink: 0, fontWeight: 600 }}>
                  ${(cat.revenue || 0).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="adm-charts-row">
        {/* Conversion Funnel */}
        <div className="adm-card">
          <p className="adm-card-title">Conversion funnel</p>
          {funnelStages.map((s, i) => (
            <div key={s.stage} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: i < funnelStages.length - 1 ? "1px solid #F1F5F9" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, background: "#EFF6FF", color: "#2563eb", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                <p style={{ fontSize: 12, color: "#0f172a", fontWeight: 500 }}>{s.stage}</p>
              </div>
              <span className="adm-badge adm-badge-blue">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Channel Performance */}
        <div className="adm-card">
          <p className="adm-card-title">Channel performance</p>
          <div className="adm-table-header" style={{ borderRadius: 8, margin: "0 -4px" }}>
            {["Channel", "Revenue", "Orders", "CVR"].map((h) => (
              <p key={h} className="adm-table-th">{h}</p>
            ))}
          </div>
          {channels.map((c, i) => (
            <div key={c.channel} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: i < channels.length - 1 ? "1px solid #F1F5F9" : "none" }}>
              <p style={{ flex: 1, fontSize: 12, color: "#0f172a", fontWeight: 500, minWidth: 0 }}>{c.channel}</p>
              <p style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{c.revenue}</p>
              <p style={{ flex: 1, fontSize: 12, color: "#64748b" }}>{c.orders}</p>
              <p style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#059669" }}>{c.cvr}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="adm-table-wrap">
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #E8EDF5" }}>
          <p className="adm-card-title">Detailed product report</p>
        </div>
        <div className="adm-table-header">
          {["Product", "Category", "Revenue", "Units sold", "Margin"].map((h) => (
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>
        {topProductsData.map((p) => (
          <div key={p.product} className="adm-table-row">
            <p className="adm-table-td" style={{ fontWeight: 500 }}>{p.product}</p>
            <p className="adm-table-td" style={{ color: "#94a3b8" }}>{p.category}</p>
            <p className="adm-table-td" style={{ fontWeight: 700 }}>{p.revenue}</p>
            <p className="adm-table-td">{p.units}</p>
            <p className="adm-table-td" style={{ color: "#059669", fontWeight: 700 }}>{p.margin}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

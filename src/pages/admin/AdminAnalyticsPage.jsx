import { useState, useEffect } from "react";
import { analyticsAPI } from "../../services/api";
import { exportToCSV } from "../../utils/exportUtils";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const PIE_COLORS = ["#2563eb","#4f46e5","#0ea5e9","#10b981","#f59e0b","#ec4899","#6366f1"];

export default function AdminAnalyticsPage() {
  const [dashboard,  setDashboard]  = useState(null);
  const [monthly,    setMonthly]    = useState([]);
  const [categories, setCategories] = useState([]);
  const [topProds,   setTopProds]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.allSettled([
      analyticsAPI.getDashboard(),
      analyticsAPI.getMonthlySales(),
      analyticsAPI.getCategoryBreakdown(),
      analyticsAPI.getTopProducts(),
    ]).then(([d, m, c, t]) => {
      if (d.status==="fulfilled" && d.value?.data) setDashboard(d.value.data);
      if (m.status==="fulfilled" && m.value?.data) setMonthly(m.value.data);
      if (c.status==="fulfilled" && c.value?.data) setCategories(c.value.data);
      if (t.status==="fulfilled" && t.value?.data) setTopProds(t.value.data);
      setLoading(false);
    });
  }, []);

  const rev = dashboard?.totalRevenue || 0;
  const metrics = [
    { label:"Total revenue",   value:`$${rev.toLocaleString()}`,                              up:true  },
    { label:"Net profit",      value:`$${Math.round(rev*0.33).toLocaleString()}`,              up:true  },
    { label:"Avg order value", value: dashboard?.totalOrders ? `$${Math.round(rev/dashboard.totalOrders)}` : "$0", up:true },
    { label:"Total orders",    value: (dashboard?.totalOrders||0).toLocaleString(),            up:true  },
  ];

  const chartData = monthly.length ? monthly : Array.from({length:12},(_,i)=>({ month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], revenue:0 }));

  const catChartData = categories.length ? categories : [];

  const handleExport = () => {
    exportToCSV("analytics_top_products", topProds, [
      { key:"name",     label:"Product" },
      { key:"category", label:"Category" },
      { key:"sales",    label:"Units Sold" },
      { key:"revenue",  label:"Revenue ($)" },
    ]);
  };

  return (
    <div className="adm-page">

      {/* KPI cards */}
      <div className="adm-metrics">
        {metrics.map(m=>(
          <div key={m.label} className="adm-metric-card">
            <p className="adm-metric-label">{m.label}</p>
            <p className="adm-metric-value">{loading ? "—" : m.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="adm-charts-row">
        {/* Monthly revenue bar chart */}
        <div className="adm-card adm-chart-main">
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <p className="adm-card-title">Monthly revenue</p>
            <button onClick={handleExport} className="adm-btn-secondary" style={{ height:34, fontSize:12 }}>Export</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize:10, fill:"#98a2b3" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background:"#fff", border:"1px solid #dde4ee", borderRadius:8, fontSize:12 }}
                formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#e8f0ff" radius={[4,4,0,0]}>
                {chartData.map((_,i)=>(
                  <Cell key={i} fill={i===chartData.length-1 ? "#2563eb" : "#e8f0ff"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown pie */}
        <div className="adm-card adm-chart-side">
          <p className="adm-card-title">Sales by category</p>
          {catChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={catChartData} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}%`}>
                  {catChartData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v=>[`$${v.toLocaleString()}`, "Revenue"]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", color:"#98a2b3", fontSize:13 }}>
              {loading ? "Loading…" : "No data yet"}
            </div>
          )}
          {catChartData.map((c,i)=>(
            <div key={c.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 0" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:PIE_COLORS[i%PIE_COLORS.length], flexShrink:0 }} />
                <span style={{ fontSize:12, color:"#101828" }}>{c.name}</span>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:"#101828" }}>${(c.revenue||0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top products table */}
      <div className="adm-table-wrap">
        <div style={{ padding:"14px 20px", borderBottom:"1px solid #dde4ee", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <p className="adm-card-title">Top performing products</p>
          <span className="adm-badge adm-badge-blue">By revenue</span>
        </div>
        <div className="adm-table-header">
          {["Product","Category","Units sold","Revenue"].map(h=>(
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>
        {topProds.length > 0 ? topProds.map((p,i)=>(
          <div key={i} className="adm-table-row">
            <p className="adm-table-td" style={{ fontWeight:600 }}>{p.name}</p>
            <p className="adm-table-td" style={{ color:"#667085" }}>{p.category}</p>
            <p className="adm-table-td">{(p.sales||p.soldCount||0).toLocaleString()}</p>
            <p className="adm-table-td" style={{ fontWeight:700 }}>${(p.revenue||0).toLocaleString()}</p>
          </div>
        )) : (
          <div className="adm-empty"><p>{loading ? "Loading…" : "No data yet."}</p></div>
        )}
      </div>
    </div>
  );
}

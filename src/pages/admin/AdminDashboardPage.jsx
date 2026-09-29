import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { adminStats, monthlySales } from '../../data/adminStats';
import { orders, recentActivity } from '../../data/orders';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const { products } = useProducts();
  const { user } = useAuth();

  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const kpis = [
    { label: 'Net revenue', value: `$${adminStats.totalRevenue?.toLocaleString() || '284,920'}`, change: '+12.4% vs last month', positive: true },
    { label: 'Orders', value: String(adminStats.dailyOrders || '3,842'), change: '+8.2% vs last month', positive: true },
    { label: 'Customers', value: '18,406', change: '+5.7% vs last month', positive: true },
    { label: 'Conversion', value: `${adminStats.conversionRate || '4.82'}%`, change: '+0.6 pts', positive: true },
    { label: 'Devices', value: `${products.length}`, change: `${lowStockCount > 0 ? `${lowStockCount} low stock` : 'Healthy stock'}`, positive: lowStockCount === 0 },
  ];

  const statusColors = {
    Processing: { bg: '#fff4e5', text: '#d97706' },
    Shipped:    { bg: '#e8f0ff', text: '#2563eb' },
    Completed:  { bg: '#e8f8f1', text: '#078a55' },
    Returns:    { bg: '#feeceb', text: '#d92d20' },
  };

  const orderStatuses = [
    { label: 'Processing', count: 486 },
    { label: 'Shipped',    count: 1248 },
    { label: 'Delivered',  count: 2004 },
    { label: 'Returns',    count: 104 },
  ];

  const maxRevenue = Math.max(...(monthlySales?.map(m => m.revenue) || [1]));
  const chartBars  = monthlySales?.slice(-12) || [];

  return (
    <div className="adm-page">

      {/* Top Bar */}
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Admin Main Dashboard</p>
          <p className="adm-topbar-sub">{today} · Live commerce overview</p>
        </div>
        <div className="adm-topbar-right">
          <div className="adm-avatar">{user?.name ? user.name.charAt(0) : 'M'}</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#101828' }}>{user?.name || 'Admin'}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="adm-metrics">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="adm-metric-card">
            <p className="adm-metric-label">{kpi.label}</p>
            <p className="adm-metric-value">{kpi.value}</p>
            <p className={kpi.positive ? 'adm-metric-change-pos' : 'adm-metric-change-neg'}>{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="adm-charts-row">

        {/* Bar Chart */}
        <div className="adm-chart-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p className="adm-card-title">Daily order activity</p>
            <span className="adm-badge adm-badge-gray">Last 14 days</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140, width: '100%' }}>
            {chartBars.map((bar, i) => {
              const h = Math.max(6, Math.round(((bar.revenue || 0) / maxRevenue) * 120));
              return (
                <div key={i} style={{
                  flex: 1, minWidth: 0, borderRadius: 4, height: h,
                  backgroundColor: i === chartBars.length - 1 ? '#2563eb' : '#e8f0ff'
                }} />
              );
            })}
          </div>
        </div>

        {/* Right side panels */}
        <div className="adm-side-col">
          {/* Order Status */}
          <div className="adm-card">
            <p className="adm-card-title">Order status</p>
            {orderStatuses.map((s) => {
              const c = statusColors[s.label] || { bg: '#eef3f9', text: '#667085' };
              return (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="adm-badge" style={{ background: c.bg, color: c.text }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#101828' }}>{s.count.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          {/* Inventory Summary */}
          <div className="adm-card">
            <p className="adm-card-title">Inventory summary</p>
            <p className="adm-card-sub">{lowStockCount} low stock · {products.filter(p => p.stock === 0).length} out of stock</p>
            {lowStockCount > 0 && (
              <span className="adm-badge adm-badge-red">{lowStockCount} need attention</span>
            )}
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="adm-table-wrap">
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #dde4ee' }}>
          <p className="adm-card-title">Recent activity logs</p>
        </div>
        <div className="adm-table-header">
          {['Event', 'Owner', 'Reference', 'Time'].map((h) => (
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>

        {(recentActivity?.length > 0 ? recentActivity : [
          { action: 'Order #V-90482 marked shipped', user: 'Nina Park',  detail: 'FedEx 7814',      time: '4 min ago' },
          { action: 'NovaBook Air stock adjusted',   user: 'Omar Ruiz',  detail: 'WH-West +24',     time: '18 min ago' },
          { action: 'New product published',         user: 'Maya Chen',  detail: 'Pulse Buds 3',    time: '42 min ago' },
          { action: 'Refund approved',               user: 'Nina Park',  detail: 'Order #V-90211',  time: '1 hr ago' },
        ]).slice(0, 4).map((act, i) => (
          <div key={i} className="adm-table-row">
            <p className="adm-table-td" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.action}</p>
            <p className="adm-table-td">{act.user || 'Admin'}</p>
            <p className="adm-table-td">{act.detail}</p>
            <p className="adm-table-td" style={{ color: '#667085' }}>{act.time}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

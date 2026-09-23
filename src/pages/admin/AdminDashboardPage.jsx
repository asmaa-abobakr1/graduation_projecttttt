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
    { label: 'Available devices', value: `${products.length}`, change: `${lowStockCount > 0 ? `-${lowStockCount} low stock` : 'Healthy stock'}`, positive: lowStockCount === 0 },
  ];

  const statusColors = {
    Processing: { bg: '#fff4e5', text: '#d97706' },
    Shipped: { bg: '#e8f0ff', text: '#2563eb' },
    Completed: { bg: '#e8f8f1', text: '#078a55' },
    Returns: { bg: '#feeceb', text: '#d92d20' },
  };

  const orderStatuses = [
    { label: 'Processing', count: 486 },
    { label: 'Shipped', count: 1248 },
    { label: 'Delivered', count: 2004 },
    { label: 'Returns', count: 104 },
  ];

  // Simple bar chart heights based on monthlySales
  const maxRevenue = Math.max(...(monthlySales?.map(m => m.revenue) || [1]));
  const chartBars = monthlySales?.slice(-12) || [];

  return (
    <div className="flex flex-col gap-6 items-start p-8 w-full">

      {/* Top Bar */}
      <div className="bg-white flex items-center justify-between h-[72px] px-8 rounded-[16px] w-full border border-[#dde4ee]">
        <div className="flex flex-col gap-[3px]">
          <p className="text-[20px] font-bold text-[#101828]">Admin Main Dashboard</p>
          <p className="text-[12px] text-[#667085]">{today} · Live commerce overview</p>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="w-5 h-5 text-[#667085]">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 2a6 6 0 016 6c0 3.5-6 10-6 10S4 11.5 4 8a6 6 0 016-6z" />
              <circle cx="10" cy="8" r="2" />
            </svg>
          </div>
          <div className="w-[34px] h-[34px] rounded-full bg-[#2563eb] text-white font-bold flex items-center justify-center text-sm">
            {user?.name ? user.name.charAt(0) : 'M'}
          </div>
          <p className="text-[13px] font-semibold text-[#101828]">{user?.name || 'Maya Chen'}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="flex gap-4 items-start w-full">
        {kpis.map((kpi) => (
          <div key={kpi.label}
            className="bg-white border border-[#dde4ee] flex-1 flex flex-col gap-[10px] items-start p-[18px] rounded-[16px] shadow-[0px_8px_24px_0px_rgba(16,24,40,0.07)] min-w-0">
            <p className="text-[12px] text-[#667085] whitespace-nowrap">{kpi.label}</p>
            <p className="text-[26px] text-[#101828] font-normal">{kpi.value}</p>
            <p className={`text-[11px] ${kpi.positive ? 'text-[#078a55]' : 'text-[#d92d20]'}`}>{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="flex gap-5 items-start w-full">
        {/* Bar Chart */}
        <div className="bg-white border border-[#dde4ee] flex-1 flex flex-col gap-4 items-start p-5 rounded-[16px] min-w-0">
          <div className="flex items-start justify-between w-full">
            <p className="text-[16px] font-bold text-[#101828]">Daily order activity</p>
            <span className="bg-[#eef3f9] text-[#667085] text-[11px] px-[9px] py-[5px] rounded-full">Last 14 days</span>
          </div>
          <div className="flex items-end gap-[18px] w-full" style={{ height: '158px' }}>
            {chartBars.map((bar, i) => {
              const h = Math.max(8, Math.round(((bar.revenue || 0) / maxRevenue) * 140));
              return (
                <div key={i}
                  className="flex-1 min-w-0 rounded-[4px]"
                  style={{
                    height: `${h}px`,
                    backgroundColor: i === chartBars.length - 1 ? '#2563eb' : '#e8f0ff'
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Breakdowns */}
        <div className="flex flex-col gap-5 items-start w-[350px] shrink-0">
          {/* Order Status */}
          <div className="bg-white border border-[#dde4ee] flex flex-col gap-4 items-start p-5 rounded-[16px] w-full">
            <p className="text-[16px] font-bold text-[#101828]">Order status</p>
            {orderStatuses.map((s) => {
              const c = statusColors[s.label] || { bg: '#eef3f9', text: '#667085' };
              return (
                <div key={s.label} className="flex items-center justify-between w-full">
                  <span className="text-[11px] px-[9px] py-[5px] rounded-full font-normal"
                    style={{ background: c.bg, color: c.text }}>
                    {s.label}
                  </span>
                  <span className="text-[13px] font-bold text-[#101828]">{s.count.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          {/* Inventory Summary */}
          <div className="bg-white border border-[#dde4ee] flex flex-col gap-4 items-start p-5 rounded-[16px] w-full">
            <p className="text-[16px] font-bold text-[#101828]">Inventory summary</p>
            <p className="text-[13px] text-[#667085]">{lowStockCount} low stock · {products.filter(p => p.stock === 0).length} out of stock</p>
            {lowStockCount > 0 && (
              <span className="bg-[#feeceb] text-[#d92d20] text-[11px] px-[9px] py-[5px] rounded-full">
                {lowStockCount} need attention
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-[#dde4ee] flex flex-col gap-4 items-start p-5 rounded-[16px] w-full">
        <p className="text-[16px] font-bold text-[#101828]">Recent activity logs</p>

        {/* Table Header */}
        <div className="bg-[#eef3f9] border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[38px] px-3 rounded-t-lg">
          {['Event', 'Owner', 'Reference', 'Time'].map((h) => (
            <p key={h} className="flex-1 min-w-0 text-[11px] font-bold text-[#667085] uppercase tracking-wide truncate">{h}</p>
          ))}
        </div>

        {/* Table Rows */}
        {(recentActivity || []).slice(0, 4).map((act, i) => (
          <div key={i} className="border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[52px] px-3">
            <p className="flex-1 min-w-0 text-[12px] text-[#101828] truncate">{act.action}</p>
            <p className="flex-1 min-w-0 text-[12px] text-[#101828] truncate">{act.user || 'Admin'}</p>
            <p className="flex-1 min-w-0 text-[12px] text-[#101828] truncate">{act.detail}</p>
            <p className="flex-1 min-w-0 text-[12px] text-[#101828] truncate">{act.time}</p>
          </div>
        ))}

        {/* Show fallback rows if no recentActivity */}
        {(!recentActivity || recentActivity.length === 0) && (
          <>
            {[
              ['Order #V-90482 marked shipped', 'Nina Park', 'FedEx 7814', '4 min ago'],
              ['NovaBook Air stock adjusted', 'Omar Ruiz', 'WH-West +24', '18 min ago'],
              ['New product published', 'Maya Chen', 'Pulse Buds 3', '42 min ago'],
              ['Refund approved', 'Nina Park', 'Order #V-90211', '1 hr ago'],
            ].map(([event, owner, ref, time], i) => (
              <div key={i} className="border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[52px] px-3">
                <p className="flex-1 min-w-0 text-[12px] text-[#101828] truncate">{event}</p>
                <p className="flex-1 min-w-0 text-[12px] text-[#101828] truncate">{owner}</p>
                <p className="flex-1 min-w-0 text-[12px] text-[#101828] truncate">{ref}</p>
                <p className="flex-1 min-w-0 text-[12px] text-[#101828] truncate">{time}</p>
              </div>
            ))}
          </>
        )}
      </div>

    </div>
  );
}

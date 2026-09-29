import { useAuth } from '../../context/AuthContext';
import { adminStats, monthlySales, categoryBreakdown } from '../../data/adminStats';

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const summaryMetrics = [
    { label: 'Total revenue', value: `$${adminStats.totalRevenue?.toLocaleString() || '284,920'}`, change: '+12.4%', positive: true },
    { label: 'Net profit',    value: '$94,280',  change: '+9.1%', positive: true },
    { label: 'Avg order val', value: '$412',     change: '+3.2%', positive: true },
    { label: 'Refund rate',   value: '2.7%',     change: '-0.4%', positive: true },
  ];

  const funnelStages = [
    { stage: 'Visitors',      value: '42,800 sessions' },
    { stage: 'Product views', value: '18,240 sessions' },
    { stage: 'Add to cart',   value: '6,390 sessions' },
    { stage: 'Checkout',      value: '3,210 sessions' },
    { stage: 'Purchase',      value: '2,060 orders' },
  ];

  const channels = [
    { channel: 'Organic search',   revenue: '$84,200', orders: '892', cvr: '3.8%' },
    { channel: 'Direct / branded', revenue: '$61,440', orders: '648', cvr: '5.1%' },
    { channel: 'Paid social',      revenue: '$38,960', orders: '412', cvr: '2.2%' },
    { channel: 'Email',            revenue: '$29,340', orders: '310', cvr: '6.4%' },
  ];

  const topProductsData = [
    { product: 'Aether Phone Pro',      category: 'Phones',    revenue: '$48,200', units: '48', margin: '24%' },
    { product: 'NovaBook Air 14',       category: 'Laptops',   revenue: '$43,740', units: '35', margin: '18%' },
    { product: 'Pulse ANC Headphones', category: 'Audio',     revenue: '$28,360', units: '81', margin: '41%' },
    { product: 'Orbit Watch S',         category: 'Wearables', revenue: '$21,450', units: '50', margin: '33%' },
  ];

  const maxRevenue = Math.max(...(monthlySales?.map(m => m.revenue) || [1]));

  const catData = categoryBreakdown || [
    { category: 'Phones',    revenue: 84200 },
    { category: 'Laptops',   revenue: 61440 },
    { category: 'Audio',     revenue: 38960 },
    { category: 'Tablets',   revenue: 29340 },
    { category: 'Wearables', revenue: 21450 },
  ];

  return (
    <div className="adm-page">

      {/* Top Bar */}
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Analytics & Reports</p>
          <p className="adm-topbar-sub">{today} · Performance overview</p>
        </div>
        <div className="adm-topbar-right">
          <span className="adm-badge adm-badge-gray" style={{ cursor: 'pointer' }}>Last 30 days</span>
          <span className="adm-badge adm-badge-gray" style={{ cursor: 'pointer' }}>Last 90 days</span>
          <button className="adm-btn-primary">Export report</button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="adm-metrics">
        {summaryMetrics.map((m) => (
          <div key={m.label} className="adm-metric-card">
            <p className="adm-metric-label">{m.label}</p>
            <p className="adm-metric-value">{m.value}</p>
            <p className={m.positive ? 'adm-metric-change-pos' : 'adm-metric-change-neg'}>{m.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="adm-charts-row">
        {/* Revenue Trend */}
        <div className="adm-chart-main">
          <div>
            <p className="adm-card-title">Revenue trend</p>
            <p className="adm-card-sub">Monthly revenue · USD</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, width: '100%' }}>
            {(monthlySales || []).map((bar, i) => {
              const h = Math.max(6, Math.round(((bar.revenue || 0) / maxRevenue) * 120));
              return (
                <div key={i} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', borderRadius: 4, height: h, backgroundColor: '#e8f0ff' }} />
                  <span style={{ fontSize: 9, color: '#98a2b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                    {bar.month?.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales Performance */}
        <div className="adm-chart-side">
          <p className="adm-card-title">Sales performance</p>
          {catData.map((cat) => {
            const w = Math.max(5, Math.round(((cat.revenue || cat.sales || 0) / 100000) * 100));
            return (
              <div key={cat.category} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 12, color: '#101828', width: 72, flexShrink: 0 }}>{cat.category}</p>
                <div style={{ flex: 1, background: '#f4f7fb', height: 6, borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ background: '#2563eb', height: '100%', borderRadius: 999, width: `${w}%` }} />
                </div>
                <p style={{ fontSize: 11, color: '#667085', textAlign: 'right', width: 64, flexShrink: 0 }}>
                  ${(cat.revenue || cat.sales || 0).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel + Channel Row */}
      <div className="adm-charts-row">
        {/* Conversion Funnel */}
        <div className="adm-card">
          <p className="adm-card-title">Conversion funnel</p>
          {funnelStages.map((s) => (
            <div key={s.stage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 12, color: '#101828' }}>{s.stage}</p>
              <span className="adm-badge adm-badge-gray">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Channel Performance */}
        <div className="adm-card">
          <p className="adm-card-title">Channel performance</p>
          <div className="adm-table-header" style={{ borderRadius: 8, margin: '0 -4px' }}>
            {['Channel', 'Revenue', 'Orders', 'CVR'].map((h) => (
              <p key={h} className="adm-table-th">{h}</p>
            ))}
          </div>
          {channels.map((c) => (
            <div key={c.channel} style={{ display: 'flex', gap: 10, alignItems: 'center', paddingBottom: 6, borderBottom: '1px solid #f0f3f8' }}>
              <p style={{ flex: 1, fontSize: 12, color: '#101828', minWidth: 0 }}>{c.channel}</p>
              <p style={{ flex: 1, fontSize: 12, color: '#101828' }}>{c.revenue}</p>
              <p style={{ flex: 1, fontSize: 12, color: '#101828' }}>{c.orders}</p>
              <p style={{ flex: 1, fontSize: 12, color: '#101828' }}>{c.cvr}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Product Report */}
      <div className="adm-table-wrap">
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #dde4ee' }}>
          <p className="adm-card-title">Detailed product report</p>
        </div>
        <div className="adm-table-header">
          {['Product', 'Category', 'Revenue', 'Units sold', 'Margin'].map((h) => (
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>
        {topProductsData.map((p) => (
          <div key={p.product} className="adm-table-row">
            <p className="adm-table-td">{p.product}</p>
            <p className="adm-table-td" style={{ color: '#667085' }}>{p.category}</p>
            <p className="adm-table-td">{p.revenue}</p>
            <p className="adm-table-td">{p.units}</p>
            <p className="adm-table-td" style={{ color: '#078a55', fontWeight: 600 }}>{p.margin}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

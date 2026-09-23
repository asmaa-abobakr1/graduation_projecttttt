import { useAuth } from '../../context/AuthContext';
import { adminStats, monthlySales, categoryBreakdown } from '../../data/adminStats';

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const summaryMetrics = [
    { label: 'Total revenue', value: `$${adminStats.totalRevenue?.toLocaleString() || '284,920'}`, change: '+12.4%', positive: true },
    { label: 'Net profit', value: '$94,280', change: '+9.1%', positive: true },
    { label: 'Avg order value', value: '$412', change: '+3.2%', positive: true },
    { label: 'Refund rate', value: '2.7%', change: '-0.4%', positive: true },
  ];

  const funnelStages = [
    { stage: 'Visitors', value: '42,800 sessions' },
    { stage: 'Product views', value: '18,240 sessions' },
    { stage: 'Add to cart', value: '6,390 sessions' },
    { stage: 'Checkout', value: '3,210 sessions' },
    { stage: 'Purchase', value: '2,060 orders' },
  ];

  const channels = [
    { channel: 'Organic search', revenue: '$84,200', orders: '892', cvr: '3.8%', aov: '$94' },
    { channel: 'Direct / branded', revenue: '$61,440', orders: '648', cvr: '5.1%', aov: '$95' },
    { channel: 'Paid social', revenue: '$38,960', orders: '412', cvr: '2.2%', aov: '$95' },
    { channel: 'Email', revenue: '$29,340', orders: '310', cvr: '6.4%', aov: '$95' },
  ];

  const topProductsData = [
    { product: 'Aether Phone Pro', category: 'Phones', revenue: '$48,200', units: '48', margin: '24%' },
    { product: 'NovaBook Air 14', category: 'Laptops', revenue: '$43,740', units: '35', margin: '18%' },
    { product: 'Pulse ANC Headphones', category: 'Audio', revenue: '$28,360', units: '81', margin: '41%' },
    { product: 'Orbit Watch S', category: 'Wearables', revenue: '$21,450', units: '50', margin: '33%' },
  ];

  // Simple bar chart from monthlySales
  const maxRevenue = Math.max(...(monthlySales?.map(m => m.revenue) || [1]));

  return (
    <div className="flex flex-col gap-6 items-start p-8 w-full">

      {/* Top Bar */}
      <div className="bg-white flex items-center justify-between h-[72px] px-8 rounded-[16px] w-full border border-[#dde4ee]">
        <div className="flex flex-col gap-[3px]">
          <p className="text-[20px] font-bold text-[#101828]">Analytics & Reports</p>
          <p className="text-[12px] text-[#667085]">{today} · Performance overview</p>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="flex gap-2">
            <span className="bg-[#eef3f9] text-[#667085] text-[11px] px-[9px] py-[5px] rounded-full cursor-pointer hover:bg-[#e2e8f0]">Last 30 days</span>
            <span className="bg-[#eef3f9] text-[#667085] text-[11px] px-[9px] py-[5px] rounded-full cursor-pointer hover:bg-[#e2e8f0]">Last 90 days</span>
          </div>
          <button className="h-[44px] bg-[#2563eb] text-white text-[14px] px-[18px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors whitespace-nowrap">
            Export report
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="flex gap-4 items-start w-full">
        {summaryMetrics.map((m) => (
          <div key={m.label}
            className="bg-white border border-[#dde4ee] flex-1 flex flex-col gap-[10px] items-start p-[18px] rounded-[16px] shadow-[0px_8px_24px_0px_rgba(16,24,40,0.07)] min-w-0">
            <p className="text-[12px] text-[#667085]">{m.label}</p>
            <p className="text-[26px] text-[#101828]">{m.value}</p>
            <p className={`text-[11px] ${m.positive ? 'text-[#078a55]' : 'text-[#d92d20]'}`}>{m.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="flex gap-5 items-start w-full">
        {/* Revenue Trend */}
        <div className="bg-white border border-[#dde4ee] flex-1 flex flex-col gap-4 items-start p-5 rounded-[16px] min-w-0">
          <p className="text-[16px] font-bold text-[#101828]">Revenue trend</p>
          <p className="text-[11px] text-[#667085]">Monthly revenue · USD</p>
          <div className="flex items-end gap-3 w-full" style={{ height: '160px' }}>
            {(monthlySales || []).map((bar, i) => {
              const h = Math.max(8, Math.round(((bar.revenue || 0) / maxRevenue) * 140));
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                  <div className="w-full rounded-[4px]" style={{ height: `${h}px`, backgroundColor: '#e8f0ff' }} />
                  <span className="text-[9px] text-[#98a2b3] truncate">{bar.month?.slice(0,3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales Performance */}
        <div className="bg-white border border-[#dde4ee] flex flex-col gap-4 items-start p-5 rounded-[16px] w-[400px] shrink-0">
          <p className="text-[16px] font-bold text-[#101828]">Sales performance</p>
          {(categoryBreakdown || [
            { category: 'Phones', revenue: 84200 },
            { category: 'Laptops', revenue: 61440 },
            { category: 'Audio', revenue: 38960 },
            { category: 'Tablets', revenue: 29340 },
            { category: 'Wearables', revenue: 21450 },
          ]).map((cat) => {
            const maxCat = 100000;
            const w = Math.max(5, Math.round(((cat.revenue || cat.sales || 0) / maxCat) * 100));
            return (
              <div key={cat.category} className="flex items-center justify-between w-full">
                <p className="text-[12px] text-[#101828] w-24 shrink-0">{cat.category}</p>
                <div className="flex-1 bg-[#f4f7fb] h-[6px] rounded-full mx-3 overflow-hidden">
                  <div className="bg-[#2563eb] h-full rounded-full" style={{ width: `${w}%` }} />
                </div>
                <p className="text-[12px] text-[#667085] text-right w-20 shrink-0">
                  ${(cat.revenue || cat.sales || 0).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel + Channel Row */}
      <div className="flex gap-5 items-start w-full">
        {/* Conversion Funnel */}
        <div className="bg-white border border-[#dde4ee] flex flex-col gap-4 items-start p-5 rounded-[16px] flex-1 min-w-0">
          <p className="text-[16px] font-bold text-[#101828]">Conversion funnel</p>
          {funnelStages.map((s) => (
            <div key={s.stage} className="flex items-center justify-between w-full">
              <p className="text-[12px] text-[#101828]">{s.stage}</p>
              <span className="bg-[#eef3f9] text-[#667085] text-[11px] px-[9px] py-[5px] rounded-full">
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Channel Performance */}
        <div className="bg-white border border-[#dde4ee] flex flex-col gap-4 items-start p-5 rounded-[16px] flex-1 min-w-0">
          <p className="text-[16px] font-bold text-[#101828]">Channel performance</p>
          {/* Table Header */}
          <div className="bg-[#eef3f9] flex gap-3 items-center w-full min-h-[38px] px-3 rounded-lg">
            {['Channel', 'Revenue', 'Orders', 'CVR'].map((h) => (
              <p key={h} className="flex-1 text-[11px] font-bold text-[#667085] uppercase">{h}</p>
            ))}
          </div>
          {channels.map((c) => (
            <div key={c.channel} className="border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[52px] px-3">
              <p className="flex-1 text-[12px] text-[#101828]">{c.channel}</p>
              <p className="flex-1 text-[12px] text-[#101828]">{c.revenue}</p>
              <p className="flex-1 text-[12px] text-[#101828]">{c.orders}</p>
              <p className="flex-1 text-[12px] text-[#101828]">{c.cvr}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="bg-white border border-[#dde4ee] flex flex-col gap-4 items-start p-5 rounded-[16px] w-full">
        <p className="text-[16px] font-bold text-[#101828]">Detailed product report</p>
        {/* Table Header */}
        <div className="bg-[#eef3f9] flex gap-3 items-center w-full min-h-[38px] px-3 rounded-lg">
          {['Product', 'Category', 'Revenue', 'Units sold', 'Margin'].map((h) => (
            <p key={h} className="flex-1 text-[11px] font-bold text-[#667085] uppercase">{h}</p>
          ))}
        </div>
        {topProductsData.map((p) => (
          <div key={p.product} className="border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[52px] px-3">
            <p className="flex-1 text-[12px] text-[#101828]">{p.product}</p>
            <p className="flex-1 text-[12px] text-[#101828]">{p.category}</p>
            <p className="flex-1 text-[12px] text-[#101828]">{p.revenue}</p>
            <p className="flex-1 text-[12px] text-[#101828]">{p.units}</p>
            <p className="flex-1 text-[12px] text-[#078a55]">{p.margin}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

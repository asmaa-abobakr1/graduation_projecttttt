import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Plus,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useProducts } from '../../context/ProductContext';
import { adminStats, monthlySales } from '../../data/adminStats';
import { orders, recentActivity } from '../../data/orders';
import Badge from '../../components/ui/Badge';

export default function AdminDashboardPage() {
  const { products } = useProducts();
  
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  const kpis = [
    {
      title: 'Total Revenue',
      value: `$${adminStats.totalRevenue.toLocaleString()}`,
      trend: `+${adminStats.revenueTrend}%`,
      isPositive: true,
      subtitle: 'vs. previous 30 days',
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: 'Available Devices',
      value: `${products.length} models`,
      trend: `${totalStockUnits} units`,
      isPositive: true,
      subtitle: lowStockCount > 0 ? `${lowStockCount} low stock` : 'Healthy stock levels',
      icon: Package,
      color: 'indigo',
    },
    {
      title: 'Daily Orders',
      value: adminStats.dailyOrders,
      trend: `+${adminStats.ordersTrend}%`,
      isPositive: true,
      subtitle: 'avg. 14 orders/hr',
      icon: ShoppingBag,
      color: 'emerald',
    },
    {
      title: 'Conversion Rate',
      value: `${adminStats.conversionRate}%`,
      trend: `${adminStats.conversionTrend}%`,
      isPositive: false,
      subtitle: 'industry benchmark: 2.8%',
      icon: TrendingUp,
      color: 'amber',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">Delivered</Badge>;
      case 'Shipped': return <Badge variant="primary">In Transit</Badge>;
      case 'Pending': return <Badge variant="warning">Processing</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner Alert if low stock */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Inventory Warning:</strong> {lowStockCount} hardware devices have fallen below 10 units in stock.
            </span>
          </div>
          <Link
            to="/admin/inventory"
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            Review Stock
          </Link>
        </div>
      )}

      {/* Financial & Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-blue-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {kpi.value}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs">
                  <span
                    className={`font-bold flex items-center ${
                      kpi.isPositive ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {kpi.isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    {kpi.trend}
                  </span>
                  <span className="text-slate-400 truncate">{kpi.subtitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Monthly Revenue Trajectory
              </h3>
              <p className="text-xs text-slate-400">Total cumulative gross revenue in USD</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              FY2024 Current
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySales}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Operational Activity Log */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white tracking-tight">
                Live Store Activity
              </h3>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              {recentActivity.slice(0, 6).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-200">{act.action}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.detail}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 text-center">
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              <span>Manage Products Database</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-slate-400">Latest transactions dispatched via Cash on Delivery</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Showing 6 of {orders.length} orders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Item Purchased</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Total (COD)</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
              {orders.slice(0, 6).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-blue-400">{ord.id}</td>
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-white">{ord.customer}</p>
                    <p className="text-[10px] text-slate-400">{ord.email}</p>
                  </td>
                  <td className="py-3.5 px-3 max-w-[180px] truncate">{ord.product}</td>
                  <td className="py-3.5 px-3 text-slate-400">{ord.date}</td>
                  <td className="py-3.5 px-3 font-bold text-white">${ord.total.toLocaleString()}</td>
                  <td className="py-3.5 px-3">{getStatusBadge(ord.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

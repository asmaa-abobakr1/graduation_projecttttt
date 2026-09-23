import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  PieChart as PieIcon, 
  DollarSign, 
  CreditCard 
} from 'lucide-react';
import { categoryBreakdown, topProducts } from '../../data/adminStats';

export default function AdminAnalyticsPage() {
  const COLORS = ['#2563EB', '#7C3AED', '#059669', '#EA580C'];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Financial & Hardware Performance Analytics
        </h2>
        <p className="text-xs text-slate-400">
          In-depth revenue contribution by device category and top performing models
        </p>
      </div>

      {/* Analytics KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Order Value</span>
          <p className="text-2xl font-black text-white mt-1">$1,420.50</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">+8.4% compared to last quarter</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lead Margin Category</span>
          <p className="text-2xl font-black text-blue-400 mt-1">Laptops (45%)</p>
          <span className="text-[11px] text-slate-400 mt-1 block">$57,802 gross contribution</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">COD Completion Rate</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">98.2%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Low doorstep refusal rate</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Revenue Bar Chart */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Revenue by Hardware Class</h3>
              <p className="text-xs text-slate-400">Share of total store sales</p>
            </div>
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
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
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Products Leaderboard */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Top Revenue Drivers</h3>
              <Award className="w-4 h-4 text-amber-400" />
            </div>

            <div className="space-y-4 pt-3">
              {topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px]">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.sales} units ordered</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400 text-sm">
                    ${p.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Top 5 devices generate 68% of cumulative electronic revenue.</span>
          </div>
        </div>

      </div>

    </div>
  );
}

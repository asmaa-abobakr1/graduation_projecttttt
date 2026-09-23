import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminInventoryPage() {
  const { products, updateProduct } = useProducts();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const restockNeeded = lowStockCount + outOfStockCount;

  const metrics = [
    { label: 'Total stock', value: `${totalUnits.toLocaleString()} units` },
    { label: 'Low stock', value: String(lowStockCount), change: `${lowStockCount} items below 10`, positive: lowStockCount === 0 },
    { label: 'In stock', value: String(products.filter(p => p.stock >= 10).length), positive: true },
    { label: 'Out of stock', value: String(outOfStockCount), change: 'Needs restock', positive: outOfStockCount === 0 },
    { label: 'Restock needed', value: String(restockNeeded), change: 'Total attention needed', positive: restockNeeded === 0 },
  ];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Low') return matchSearch && p.stock > 0 && p.stock < 10;
    if (filter === 'Out') return matchSearch && p.stock === 0;
    return matchSearch;
  });

  return (
    <div className="flex flex-col gap-6 items-start p-8 w-full">

      {/* Top Bar */}
      <div className="bg-white flex items-center justify-between h-[72px] px-8 rounded-[16px] w-full border border-[#dde4ee]">
        <div className="flex flex-col gap-[3px]">
          <p className="text-[20px] font-bold text-[#101828]">Inventory Control</p>
          <p className="text-[12px] text-[#667085]">{today} · Stock management</p>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="w-[34px] h-[34px] rounded-full bg-[#2563eb] text-white font-bold flex items-center justify-center text-sm">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <p className="text-[13px] font-semibold text-[#101828]">{user?.name || 'Admin'}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex gap-4 items-start w-full">
        {metrics.map((m) => (
          <div key={m.label}
            className="bg-white border border-[#dde4ee] flex-1 flex flex-col gap-[10px] items-start p-[18px] rounded-[16px] shadow-[0px_8px_24px_0px_rgba(16,24,40,0.07)] min-w-0">
            <p className="text-[12px] text-[#667085]">{m.label}</p>
            <p className="text-[26px] text-[#101828]">{m.value}</p>
            {m.change && (
              <p className={`text-[11px] ${m.positive ? 'text-[#078a55]' : 'text-[#d92d20]'}`}>{m.change}</p>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 bg-white border border-[#dde4ee] rounded-[10px] h-[42px] flex items-center px-4 gap-2">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-[#98a2b3]">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by product name or brand..."
            className="bg-transparent flex-1 text-[13px] text-[#101828] placeholder-[#98a2b3] outline-none" />
        </div>
        {[
          { label: 'All items', key: 'All' },
          { label: 'Low stock', key: 'Low' },
          { label: 'Out of stock', key: 'Out' },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`h-[44px] px-[18px] rounded-[10px] text-[14px] transition-colors whitespace-nowrap border ${
              filter === f.key
                ? 'bg-[#2563eb] border-[#2563eb] text-white'
                : 'bg-white border-[#dde4ee] text-[#101828] hover:bg-[#f4f7fb]'
            }`}>
            {f.label}
          </button>
        ))}
        <button className="h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] px-[18px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors whitespace-nowrap">
          Export CSV
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#dde4ee] flex flex-col items-start rounded-[16px] w-full overflow-hidden">
        <div className="flex items-center justify-between w-full px-5 py-4 border-b border-[#dde4ee]">
          <p className="text-[12px] text-[#667085]">{filtered.length} of {products.length} items</p>
          <p className="text-[11px] text-[#98a2b3]">Scroll right for all columns on small screens</p>
        </div>

        {/* Header */}
        <div className="bg-[#eef3f9] border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[38px] px-5">
          {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Status', 'Low threshold', 'Warehouse', 'Actions'].map((h) => (
            <p key={h} className="flex-1 text-[11px] font-bold text-[#667085] uppercase min-w-0">{h}</p>
          ))}
        </div>

        {filtered.map((p) => {
          const stockStatus = p.stock === 0 ? 'out' : p.stock < 10 ? 'low' : 'ok';
          return (
            <div key={p.id} className="border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[52px] px-5 hover:bg-[#fafbfc] transition-colors">
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <img src={p.image} alt="" className="w-7 h-7 rounded-[6px] object-cover shrink-0 border border-[#dde4ee]" />
                <p className="text-[12px] text-[#101828] truncate">{p.name}</p>
              </div>
              <p className="flex-1 text-[12px] text-[#667085] truncate min-w-0">{p.brand}</p>
              <p className="flex-1 text-[12px] text-[#667085] truncate min-w-0">{p.category}</p>
              <p className="flex-1 text-[12px] text-[#101828] min-w-0">${p.price?.toLocaleString()}</p>
              <p className={`flex-1 text-[12px] font-semibold min-w-0 ${
                stockStatus === 'out' ? 'text-[#d92d20]' : stockStatus === 'low' ? 'text-[#d97706]' : 'text-[#078a55]'
              }`}>{p.stock} units</p>
              <div className="flex-1 min-w-0">
                <span className={`text-[11px] px-[9px] py-[5px] rounded-full ${
                  stockStatus === 'out' ? 'bg-[#feeceb] text-[#d92d20]'
                  : stockStatus === 'low' ? 'bg-[#fff4e5] text-[#d97706]'
                  : 'bg-[#e8f8f1] text-[#078a55]'
                }`}>
                  {stockStatus === 'out' ? 'Out of stock' : stockStatus === 'low' ? 'Low stock' : 'In stock'}
                </span>
              </div>
              <p className="flex-1 text-[12px] text-[#667085] min-w-0">10 units</p>
              <p className="flex-1 text-[12px] text-[#667085] min-w-0">WH-Main</p>
              <div className="flex-1 flex gap-2 min-w-0">
                <button onClick={() => {
                  const val = prompt('New stock quantity:', String(p.stock));
                  if (val !== null && !isNaN(parseInt(val))) updateProduct(p.id, { stock: parseInt(val) });
                }} className="text-[11px] text-[#2563eb] hover:underline">Adjust</button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center w-full py-12">
            <p className="text-[13px] text-[#667085]">No inventory items match the current filter</p>
          </div>
        )}
      </div>

    </div>
  );
}

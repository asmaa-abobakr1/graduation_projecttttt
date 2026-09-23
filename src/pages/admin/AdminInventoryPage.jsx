import { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Plus, 
  Search,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export default function AdminInventoryPage() {
  const { products, updateProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // all, low, warning, healthy

  const lowStock = products.filter((p) => p.stock < 10);
  const warningStock = products.filter((p) => p.stock >= 10 && p.stock <= 30);
  const healthyStock = products.filter((p) => p.stock > 30);
  const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);

  const handleRestock = (productId, amount) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      updateProduct(productId, { stock: prod.stock + amount });
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (stockFilter === 'low') return matchesSearch && p.stock < 10;
    if (stockFilter === 'warning') return matchesSearch && p.stock >= 10 && p.stock <= 30;
    if (stockFilter === 'healthy') return matchesSearch && p.stock > 30;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Inventory Control & Stock Health Tracking
        </h2>
        <p className="text-xs text-slate-400">
          Monitor warehouse replenishment levels, threshold alerts, and instant restock actions
        </p>
      </div>

      {/* Stock Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Units in Stock</span>
          <p className="text-2xl font-black text-white mt-1">{totalUnits.toLocaleString()}</p>
          <span className="text-[11px] text-blue-400 mt-1 block">Across {products.length} registered models</span>
        </div>

        <div className="bg-slate-900/90 border border-red-500/20 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Critical Low (&lt;10)</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-black text-red-400 mt-1">{lowStock.length} items</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Immediate reorder required</span>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Attention (10 - 30)</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{warningStock.length} items</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Medium stock levels</span>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/20 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Optimal Stock (&gt;30)</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{healthyStock.length} items</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">Healthy inventory buffer</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search SKU or device name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'low', 'warning', 'healthy'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStockFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                stockFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-950/60">
                <th className="py-3.5 px-4">Item & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Buffer Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
              {filtered.map((p) => {
                const bufferPercent = Math.min(100, Math.round((p.stock / 60) * 100));
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover bg-slate-950 border border-slate-800"
                        />
                        <div>
                          <p className="font-bold text-white">{p.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-300">{p.category}</td>

                    <td className="py-3 px-4 font-mono font-bold text-sm text-white">
                      {p.stock} units
                    </td>

                    <td className="py-3 px-4 w-44">
                      <div className="space-y-1">
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              p.stock < 10
                                ? 'bg-red-500'
                                : p.stock < 30
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${bufferPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400">{bufferPercent}% of target 60</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {p.stock < 10 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                          Critical Alert
                        </span>
                      ) : p.stock < 30 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Low Buffer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Optimal
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRestock(p.id, 5)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 text-[11px] font-bold transition-colors"
                          title="Restock 5 units"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleRestock(p.id, 20)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-[11px] font-bold transition-colors"
                          title="Restock 20 units"
                        >
                          +20
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

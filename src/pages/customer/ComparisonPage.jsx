import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GitCompare, 
  Trash2, 
  ShoppingCart, 
  Plus, 
  Star, 
  Check, 
  X, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

export default function ComparisonPage() {
  const { products, compareList, toggleCompare, clearCompare } = useProducts();
  const { addToCart } = useCart();
  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const compareProducts = products.filter((p) => compareList.includes(p.id));

  // Collect all unique specification keys across compared products
  const allSpecKeys = [
    'Processor',
    'RAM',
    'Storage',
    'Display',
    'Battery',
    'Graphics',
    'OS',
    'Weight',
    'Camera',
    'Connectivity',
  ];

  // Products available to add
  const availableToAdd = products.filter((p) => !compareList.includes(p.id));

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-slate-50/50 pb-20">
      
      {/* ── Page Header ── */}
      <div className="w-full bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <GitCompare className="w-4 h-4" /> Hardware Benchmark & Compare
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Compare Specifications Side-by-Side
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Select up to 4 devices to analyze hardware benchmarks, battery life, and pricing.
            </p>
          </div>

          {compareProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setHighlightDiffs((v) => !v)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border ${
                  highlightDiffs
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {highlightDiffs ? '✓ Highlighting Differences' : 'Highlight Differences'}
              </button>
              <button
                onClick={clearCompare}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Comparison Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {compareProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-white border border-slate-200 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <GitCompare className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Devices Selected</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Explore the catalog and click the compare icon on any device to compare its specifications side-by-side.
            </p>
            <Link
              to="/search"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden overflow-x-auto">
            
            {/* Top Cards Row */}
            <div className="grid grid-cols-5 min-w-[900px] border-b border-slate-200">
              <div className="p-6 bg-slate-50/70 border-r border-slate-200 flex flex-col justify-end">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Compared Devices ({compareProducts.length}/4)
                </span>
                {compareProducts.length < 4 && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Device
                  </button>
                )}
              </div>

              {/* Compared Product Headers */}
              {compareProducts.map((p) => (
                <div key={p.id} className="p-6 border-r border-slate-200 last:border-r-0 flex flex-col justify-between relative group">
                  <button
                    onClick={() => toggleCompare(p.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove device"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 p-2 flex items-center justify-center bg-slate-50 rounded-2xl mb-3">
                      <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase">{p.brand}</span>
                    <Link
                      to={`/product/${p.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 mt-1 leading-snug"
                    >
                      {p.name}
                    </Link>
                    <div className="text-lg font-black text-slate-900 mt-2">${p.price.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-slate-700">{p.rating}</span>
                      <span className="text-slate-400">({p.reviews})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(p, 1)}
                    className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>
              ))}

              {/* Empty slot placeholders */}
              {[...Array(4 - compareProducts.length)].map((_, i) => (
                <div
                  key={i}
                  className="p-6 border-r border-slate-200 last:border-r-0 flex flex-col items-center justify-center text-center min-h-[300px] bg-slate-50/40"
                >
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-12 h-12 rounded-2xl bg-white border-2 border-dashed border-slate-300 text-slate-400 hover:text-blue-600 hover:border-blue-500 flex items-center justify-center transition-colors mb-2 shadow-xs"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                  <span className="text-xs font-bold text-slate-500">Empty Slot</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Click to add device</span>
                </div>
              ))}
            </div>

            {/* Spec Matrix Rows */}
            <div className="min-w-[900px]">
              {allSpecKeys.map((key, idx) => {
                const values = compareProducts.map((p) => p.specs?.[key] || '—');
                const isDifferent = new Set(values).size > 1;

                return (
                  <div
                    key={key}
                    className={`grid grid-cols-5 border-b border-slate-100 text-xs ${
                      highlightDiffs && isDifferent ? 'bg-amber-50/40' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                    }`}
                  >
                    <div className="p-4 font-bold text-slate-700 bg-slate-50/80 border-r border-slate-200 flex items-center">
                      {key}
                    </div>

                    {compareProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 text-slate-800 border-r border-slate-200 last:border-r-0 flex items-center"
                      >
                        <span className={highlightDiffs && isDifferent ? 'font-bold text-amber-900' : ''}>
                          {p.specs?.[key] || '—'}
                        </span>
                      </div>
                    ))}

                    {[...Array(4 - compareProducts.length)].map((_, i) => (
                      <div key={i} className="p-4 border-r border-slate-200 last:border-r-0 text-slate-300">
                        —
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>

      {/* ── Add Device to Comparison Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Add Device to Compare</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto divide-y divide-slate-100 space-y-2">
              {availableToAdd.length > 0 ? (
                availableToAdd.map((product) => (
                  <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 p-1 shrink-0 border border-slate-200">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase">{product.brand}</span>
                        <p className="text-xs font-bold text-slate-900">{product.name}</p>
                        <p className="text-xs font-black text-slate-700">${product.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        toggleCompare(product.id);
                        setIsAddModalOpen(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                    >
                      + Select
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-slate-500 py-8">All available devices are already in comparison.</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

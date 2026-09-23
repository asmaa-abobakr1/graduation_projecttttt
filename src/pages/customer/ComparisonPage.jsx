import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  Trash2, 
  Plus, 
  ShoppingCart, 
  Check, 
  X, 
  ArrowRight,
  HelpCircle,
  Cpu,
  Monitor,
  Battery,
  HardDrive
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

export default function ComparisonPage() {
  const { products, compareList, toggleCompare, clearCompare, getCompareProducts } = useProducts();
  const { addToCart } = useCart();
  const [selectModalOpen, setSelectModalOpen] = useState(false);

  const comparedProducts = getCompareProducts();

  // Distinct spec keys across selected items
  const specKeys = ['Processor', 'RAM', 'Storage', 'Display', 'Battery', 'Weight', 'OS'];

  const handleAddFromModal = (productId) => {
    toggleCompare(productId);
    setSelectModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Scale className="w-4 h-4" />
            <span>Side-by-Side Benchmarks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Smart Device Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluate specifications, pricing, and pros/cons across up to 3 electronic devices simultaneously.
          </p>
        </div>

        {comparedProducts.length > 0 && (
          <button
            onClick={clearCompare}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Comparison</span>
          </button>
        )}
      </div>

      {comparedProducts.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No devices selected for comparison</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Browse our electronic catalog and tap the scale icon on any device to compare its specs side-by-side.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setSelectModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Select from Catalog</span>
            </button>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <span>Explore Products</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Comparison Table Grid */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Top Device Cards Header */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-4 sm:p-6 text-left w-1/4 align-top bg-slate-50/70">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parameters</span>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      Comparing {comparedProducts.length} of 3 devices
                    </p>
                    {comparedProducts.length < 3 && (
                      <button
                        onClick={() => setSelectModalOpen(true)}
                        className="mt-4 w-full py-2.5 px-3 rounded-xl border border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Device ({3 - comparedProducts.length} left)</span>
                      </button>
                    )}
                  </th>

                  {comparedProducts.map((p) => (
                    <th key={p.id} className="p-4 sm:p-6 text-left align-top border-l border-slate-200">
                      <div className="space-y-3">
                        <div className="relative pt-[60%] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <button
                            onClick={() => toggleCompare(p.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-600 transition-colors"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                            {p.brand} • {p.category}
                          </span>
                          <Link to={`/product/${p.id}`} className="block font-bold text-slate-900 hover:text-blue-600 transition-colors text-sm line-clamp-1">
                            {p.name}
                          </Link>
                          <div className="text-base font-black text-slate-900 mt-1">
                            ${p.price.toLocaleString()}
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(p, 1)}
                          className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </th>
                  ))}

                  {/* Empty Slot Placeholder if fewer than 3 */}
                  {[...Array(3 - comparedProducts.length)].map((_, idx) => (
                    <th key={idx} className="p-4 sm:p-6 text-center align-middle border-l border-slate-200 bg-slate-50/40">
                      <button
                        onClick={() => setSelectModalOpen(true)}
                        className="py-12 px-4 w-full rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-white text-slate-400 hover:text-blue-600 flex flex-col items-center justify-center gap-2 transition-all"
                      >
                        <Plus className="w-6 h-6" />
                        <span className="text-xs font-bold">Add Device to Compare</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Specification Rows */}
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                
                {/* Stock Level */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/70">Availability</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-200">
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> In Stock ({p.stock} units)
                      </span>
                    </td>
                  ))}
                  {[...Array(3 - comparedProducts.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-slate-200 bg-slate-50/40" />
                  ))}
                </tr>

                {/* Rating */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/70">Rating & Reviews</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-200 font-medium text-slate-800">
                      ★ {p.rating} ({p.reviews} verified reviews)
                    </td>
                  ))}
                  {[...Array(3 - comparedProducts.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-slate-200 bg-slate-50/40" />
                  ))}
                </tr>

                {/* Technical Specs Rows */}
                {specKeys.map((key) => (
                  <tr key={key} className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/70">{key}</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-4 border-l border-slate-200 font-medium text-slate-900">
                        {p.specs?.[key] || '—'}
                      </td>
                    ))}
                    {[...Array(3 - comparedProducts.length)].map((_, i) => (
                      <td key={i} className="p-4 border-l border-slate-200 bg-slate-50/40" />
                    ))}
                  </tr>
                ))}

                {/* Pros */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/70">Key Strengths</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-200">
                      <ul className="space-y-1">
                        {p.pros?.map((pro, i) => (
                          <li key={i} className="text-xs text-emerald-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {[...Array(3 - comparedProducts.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-slate-200 bg-slate-50/40" />
                  ))}
                </tr>

                {/* Cons */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-500 bg-slate-50/70">Considerations</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 border-l border-slate-200">
                      <ul className="space-y-1">
                        {p.cons?.map((con, i) => (
                          <li key={i} className="text-xs text-amber-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {[...Array(3 - comparedProducts.length)].map((_, i) => (
                    <td key={i} className="p-4 border-l border-slate-200 bg-slate-50/40" />
                  ))}
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Device Picker Modal */}
      {selectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectModalOpen(false)} />
          <div className="min-h-screen px-4 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10 max-h-[85vh] flex flex-col">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Select a device to add to comparison</h3>
                <button
                  onClick={() => setSelectModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto py-4 space-y-2 flex-1">
                {products
                  .filter((p) => !compareList.includes(p.id))
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleAddFromModal(p.id)}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                        <div>
                          <p className="text-xs font-semibold text-blue-600">{p.brand} • {p.category}</p>
                          <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                          <p className="text-xs text-slate-500">{p.specs?.Processor || p.specs?.Display}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900">${p.price.toLocaleString()}</span>
                        <span className="block text-[11px] font-bold text-blue-600 hover:underline mt-0.5">Select +</span>
                      </div>
                    </div>
                  ))}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

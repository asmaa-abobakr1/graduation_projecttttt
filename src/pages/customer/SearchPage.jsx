import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  X, 
  Check, 
  ChevronDown 
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../../components/products/ProductCard';
import { brands } from '../../data/products';
import { categories } from '../../data/categories';

export default function SearchPage() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial filter values from query parameters if present
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(3500);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Toggle brand in filter
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSelectedBrands([]);
    setMaxPrice(3500);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search text
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchCpu = p.specs?.Processor?.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCategory && !matchCpu) return false;
        }

        // Category
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Brands
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }

        // Max price
        if (p.price > maxPrice) {
          return false;
        }

        // In stock
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.tags?.includes('New') ? 1 : 0) - (a.tags?.includes('New') ? 1 : 0);
        return 0; // featured default
      });
  }, [products, query, selectedCategory, selectedBrands, maxPrice, inStockOnly, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    selectedBrands.length +
    (maxPrice < 3500 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (query ? 1 : 0);

  const filterSidebar = (
    <div className="space-y-6">
      
      {/* Search Input Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Search Keywords
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Filter by name, specs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[11px] text-slate-400">{products.length}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                selectedCategory === c.name
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-[11px] text-slate-400">
                {products.filter((p) => p.category === c.name).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Price Range
          </label>
          <span className="text-xs font-black text-slate-900">Up to ${maxPrice}</span>
        </div>
        <input
          type="range"
          min="100"
          max="3500"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>$100</span>
          <span>$3,500</span>
        </div>
      </div>

      {/* Brand Checkboxes */}
      <div className="pt-4 border-t border-slate-200">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Brand
        </label>
        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
          {brands.map((brand) => {
            const checked = selectedBrands.includes(brand);
            const count = products.filter((p) => p.brand === brand).length;
            if (count === 0) return null;
            return (
              <label
                key={brand}
                className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none py-0.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBrand(brand)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{brand}</span>
                </div>
                <span className="text-[11px] text-slate-400">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pt-4 border-t border-slate-200">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Show In-Stock Only</span>
        </label>
      </div>

      {/* Reset Action */}
      {activeFiltersCount > 0 && (
        <button
          onClick={handleResetFilters}
          className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters ({activeFiltersCount})</span>
        </button>
      )}

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Electronics Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Showing {filteredProducts.length} devices matching your criteria
          </p>
        </div>

        {/* Sort and mobile toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold shadow-xs"
          >
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              <option value="featured">Featured Devices</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Releases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-slate-200 shadow-xs sticky top-24">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </div>
            {activeFiltersCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {activeFiltersCount} active
              </span>
            )}
          </div>
          {filterSidebar}
        </aside>

        {/* Products Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Active:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
                </span>
              )}
              {selectedBrands.map((b) => (
                <span key={b} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {b}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleBrand(b)} />
                </span>
              ))}
              {maxPrice < 3500 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  Under ${maxPrice}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(3500)} />
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  In Stock Only
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No matching devices found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try loosening your filters or clearing search terms to explore available items.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-80 max-w-full h-full bg-white p-6 shadow-2xl overflow-y-auto animate-slide-in flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Filter Products</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterSidebar}
            </div>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

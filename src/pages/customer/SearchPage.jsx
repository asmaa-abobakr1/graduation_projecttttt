import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../../components/products/ProductCard';
import { categories } from '../../data/categories';

export default function SearchPage() {
  const { products } = useProducts();
  const [searchParams] = useSearchParams();

  // ── Reactive: sync state when URL params change ──
  const urlCategory = searchParams.get('category') || 'All';
  const urlQuery    = searchParams.get('q') || '';

  const [query,           setQuery]           = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [inStockOnly,     setInStockOnly]     = useState(false);
  const [sortBy,          setSortBy]          = useState('featured');
  const [selectedBrands,  setSelectedBrands]  = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  // When URL changes (e.g. clicking a category nav link), update state
  useEffect(() => {
    setSelectedCategory(urlCategory);
    setQuery(urlQuery);
  }, [urlCategory, urlQuery]);

  const allBrands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))],
    [products]
  );

  const priceRanges = [
    { label: 'Under $500',      min: 0,    max: 500   },
    { label: '$500 – $1,000',   min: 500,  max: 1000  },
    { label: '$1,000 – $2,000', min: 1000, max: 2000  },
    { label: '$2,000+',         min: 2000, max: 99999 },
  ];

  const filtered = useMemo(() => {
    let list = [...products];
    if (query)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand?.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.toLowerCase().includes(query.toLowerCase())
      );
    if (selectedCategory !== 'All')
      list = list.filter((p) => p.category === selectedCategory);
    if (selectedBrands.length > 0)
      list = list.filter((p) => selectedBrands.includes(p.brand));
    if (selectedPriceRange)
      list = list.filter(
        (p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
      );
    if (inStockOnly)
      list = list.filter((p) => p.stock > 0);
    if (sortBy === 'price-asc')   list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc')  list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [products, query, selectedCategory, selectedBrands, selectedPriceRange, inStockOnly, sortBy]);

  const activeFilters = [
    ...(selectedCategory !== 'All' ? [{ label: selectedCategory, clear: () => setSelectedCategory('All') }] : []),
    ...selectedBrands.map((b) => ({ label: b, clear: () => setSelectedBrands((prev) => prev.filter((x) => x !== b)) })),
    ...(selectedPriceRange ? [{ label: selectedPriceRange.label, clear: () => setSelectedPriceRange(null) }] : []),
    ...(inStockOnly ? [{ label: 'In stock only', clear: () => setInStockOnly(false) }] : []),
  ];

  const clearAll = () => {
    setQuery('');
    setSelectedCategory('All');
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    setInStockOnly(false);
  };

  const toggleBrand = (brand) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  return (
    <div className="bg-white flex flex-col items-start w-full min-h-screen">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 items-start px-16 pt-9 pb-6 w-full border-b border-[#dde4ee]">
        <p className="text-[11px] text-[#667085]">
          <Link to="/" className="hover:text-[#2563eb] transition-colors">Home</Link>
          {' / '}
          <span className="text-[#101828]">
            {query ? `Search: "${query}"` : selectedCategory !== 'All' ? selectedCategory : 'All Products'}
          </span>
        </p>

        <h1 className="text-[34px] text-[#101828] leading-tight font-normal">
          {query
            ? `Results for "${query}"`
            : selectedCategory !== 'All'
            ? selectedCategory
            : 'All Products'}
        </h1>

        <p className="text-[13px] text-[#667085]">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Active filter pills */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {activeFilters.map((f) => (
              <button
                key={f.label}
                onClick={f.clear}
                className="bg-[#e8f0ff] text-[#2563eb] text-[11px] px-[10px] py-[5px] rounded-full hover:bg-[#d1e3ff] transition-colors flex items-center gap-1"
              >
                {f.label}
                <span className="font-bold leading-none">×</span>
              </button>
            ))}
            <button
              onClick={clearAll}
              className="text-[11px] text-[#667085] hover:text-[#d92d20] transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Main Content ── */}
      <div className="flex items-start w-full px-16 py-9 gap-10">

        {/* ── Filter Panel ── */}
        <aside className="flex flex-col gap-8 items-start w-[260px] shrink-0">

          <div className="flex items-center justify-between w-full">
            <p className="text-[17px] font-semibold text-[#101828]">Filters</p>
            {activeFilters.length > 0 && (
              <button onClick={clearAll} className="text-[12px] text-[#667085] hover:text-[#d92d20] transition-colors">
                Clear all
              </button>
            )}
          </div>

          {/* Inline search within filter panel */}
          <div className="w-full">
            <p className="text-[13px] font-semibold text-[#101828] mb-3">Search</p>
            <div className="bg-[#f4f7fb] rounded-[10px] h-[40px] flex items-center gap-2 px-3">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" className="text-[#98a2b3] shrink-0">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by name..."
                className="bg-transparent flex-1 text-[13px] text-[#101828] placeholder-[#98a2b3] outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-[#98a2b3] hover:text-[#667085] leading-none">×</button>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="w-full">
            <p className="text-[13px] font-semibold text-[#101828] mb-3">Category</p>
            <div className="flex flex-col gap-2">
              {['All', ...categories.map((c) => c.name)].map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                  />
                  <span className={`text-[13px] transition-colors ${
                    selectedCategory === cat
                      ? 'text-[#101828] font-medium'
                      : 'text-[#667085] group-hover:text-[#101828]'
                  }`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="w-full">
            <p className="text-[13px] font-semibold text-[#101828] mb-3">Brand</p>
            <div className="flex flex-col gap-2">
              {allBrands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[13px] text-[#667085] group-hover:text-[#101828] transition-colors">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="w-full">
            <p className="text-[13px] font-semibold text-[#101828] mb-3">Price range</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === null}
                  onChange={() => setSelectedPriceRange(null)}
                  className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                />
                <span className={`text-[13px] transition-colors ${
                  selectedPriceRange === null ? 'text-[#101828] font-medium' : 'text-[#667085] group-hover:text-[#101828]'
                }`}>Any price</span>
              </label>
              {priceRanges.map((pr) => (
                <label key={pr.label} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange?.label === pr.label}
                    onChange={() => setSelectedPriceRange(pr)}
                    className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                  />
                  <span className={`text-[13px] transition-colors ${
                    selectedPriceRange?.label === pr.label
                      ? 'text-[#101828] font-medium'
                      : 'text-[#667085] group-hover:text-[#101828]'
                  }`}>{pr.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="w-full">
            <p className="text-[13px] font-semibold text-[#101828] mb-3">Availability</p>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#2563eb] w-4 h-4 cursor-pointer"
              />
              <span className="text-[13px] text-[#667085] group-hover:text-[#101828] transition-colors">
                In stock only
              </span>
            </label>
          </div>

          {/* Sort */}
          <div className="w-full">
            <p className="text-[13px] font-semibold text-[#101828] mb-3">Sort by</p>
            <div className="flex flex-col gap-2">
              {[
                { value: 'featured',   label: 'Featured' },
                { value: 'price-asc',  label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
                { value: 'rating',     label: 'Top rated' },
              ].map((s) => (
                <label key={s.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === s.value}
                    onChange={() => setSortBy(s.value)}
                    className="accent-[#2563eb] w-4 h-4 cursor-pointer"
                  />
                  <span className={`text-[13px] transition-colors ${
                    sortBy === s.value ? 'text-[#101828] font-medium' : 'text-[#667085] group-hover:text-[#101828]'
                  }`}>{s.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Results Column ── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-[#667085]">
              Showing <span className="font-semibold text-[#101828]">{filtered.length}</span> products
            </p>
            <div className="flex gap-2">
              <span className="bg-[#e8f0ff] text-[#2563eb] text-[11px] px-[10px] py-[5px] rounded-full cursor-default">
                Grid view
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#eef3f9] text-[#667085] text-[11px] px-[10px] py-[5px] rounded-full outline-none cursor-pointer border-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filtered.length >= 6 && (
                <div className="flex justify-start mt-2">
                  <button className="h-[44px] bg-white border border-[#dde4ee] text-[#101828] text-[14px] px-[18px] rounded-[10px] hover:bg-[#f4f7fb] transition-colors">
                    Load more products
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-5">
              <span className="text-[48px]">🔍</span>
              <p className="text-[22px] text-[#101828] font-normal">No products found</p>
              <p className="text-[14px] text-[#667085] text-center max-w-sm">
                Try adjusting your filters, selecting a different category, or clearing your search.
              </p>
              <button
                onClick={clearAll}
                className="h-[44px] bg-[#2563eb] text-white text-[14px] px-[18px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

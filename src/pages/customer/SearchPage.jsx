import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  LayoutGrid, 
  List, 
  Star, 
  Check, 
  Heart, 
  GitCompare, 
  ShoppingCart,
  ArrowUpDown,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/products/ProductCard';
import { categories } from '../../data/categories';

export default function SearchPage() {
  const { products, wishlist, toggleWishlist, isWishlisted, toggleCompare, compareList } = useProducts();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL parameters
  const urlCategory = searchParams.get('category') || 'All';
  const urlTag      = searchParams.get('tag') || '';
  const urlQuery    = searchParams.get('q') || '';
  const urlWishlist = searchParams.get('wishlist') === 'true';

  // Component state
  const [query, setQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedTag, setSelectedTag] = useState(urlTag);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3500);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState(urlWishlist);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSelectedTag(urlTag);
    setQuery(urlQuery);
    setShowWishlistOnly(urlWishlist);
  }, [urlCategory, urlTag, urlQuery, urlWishlist]);

  // All unique brands from current products
  const allBrands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
  }, [products]);

  // Brand product counts
  const brandCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Category product counts
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Wishlist filter
    if (showWishlistOnly) {
      list = list.filter((p) => wishlist.includes(p.id));
    }

    // Search query multi-field matching
    if (query.trim()) {
      const tokens = query.toLowerCase().trim().split(/\s+/);
      list = list.filter((p) => {
        const searchableText = [
          p.name,
          p.brand,
          p.category,
          p.description,
          ...(p.tags || []),
          ...Object.values(p.specs || {}),
        ]
          .join(' ')
          .toLowerCase();

        return tokens.every((token) => searchableText.includes(token));
      });
    }

    // Category filter (Handling 'New' tag gracefully if passed as category)
    if (selectedCategory && selectedCategory !== 'All') {
      if (selectedCategory === 'New' || selectedCategory === 'New releases') {
        list = list.filter((p) => p.tags?.includes('New'));
      } else {
        list = list.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
      }
    }

    // Tag filter (e.g. ?tag=New or ?tag=Sale)
    if (selectedTag) {
      list = list.filter((p) => p.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase()));
    }

    // Selected Brands
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    // Price range
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Rating
    if (minRating > 0) {
      list = list.filter((p) => (p.rating || 0) >= minRating);
    }

    // Stock availability
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    // Sort order
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => {
        const aNew = a.tags?.includes('New') ? 1 : 0;
        const bNew = b.tags?.includes('New') ? 1 : 0;
        return bNew - aNew;
      });
    }

    return list;
  }, [
    products,
    query,
    selectedCategory,
    selectedTag,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    showWishlistOnly,
    wishlist,
    sortBy,
  ]);

  // Brand toggle
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSelectedTag('');
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(3500);
    setMinRating(0);
    setInStockOnly(false);
    setShowWishlistOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  // Active filter tags for quick dismissal
  const activeFilters = [
    ...(query ? [{ label: `Search: "${query}"`, clear: () => setQuery('') }] : []),
    ...(showWishlistOnly ? [{ label: 'Wishlist Only', clear: () => setShowWishlistOnly(false) }] : []),
    ...(selectedCategory !== 'All' ? [{ label: `Category: ${selectedCategory}`, clear: () => setSelectedCategory('All') }] : []),
    ...(selectedTag ? [{ label: `Tag: ${selectedTag}`, clear: () => setSelectedTag('') }] : []),
    ...selectedBrands.map((b) => ({ label: `Brand: ${b}`, clear: () => toggleBrand(b) })),
    ...(minPrice > 0 || maxPrice < 3500 ? [{ label: `$${minPrice} – $${maxPrice}`, clear: () => { setMinPrice(0); setMaxPrice(3500); } }] : []),
    ...(minRating > 0 ? [{ label: `${minRating}★ and above`, clear: () => setMinRating(0) }] : []),
    ...(inStockOnly ? [{ label: 'In stock only', clear: () => setInStockOnly(false) }] : []),
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-slate-50/60 pb-16">
      
      {/* ── Page Header / Breadcrumb ── */}
      <div className="w-full bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-3">
            <nav className="flex items-center gap-2 text-xs text-slate-500">
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-slate-900 font-medium">Catalog & Search</span>
              {selectedCategory !== 'All' && (
                <>
                  <span>/</span>
                  <span className="text-blue-600 font-semibold">{selectedCategory}</span>
                </>
              )}
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {showWishlistOnly
                    ? 'My Saved Wishlist'
                    : query
                    ? `Results for "${query}"`
                    : selectedCategory !== 'All'
                    ? `${selectedCategory} Collection`
                    : selectedTag
                    ? `${selectedTag} Releases`
                    : 'Explore All Electronics'}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> available devices
                </p>
              </div>

              {/* Mobile Filter Trigger Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter & Refine ({activeFilters.length})</span>
              </button>
            </div>

            {/* Active Filters Pill Bar */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium mr-1">Active filters:</span>
                {activeFilters.map((f, i) => (
                  <button
                    key={i}
                    onClick={f.clear}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <span>{f.label}</span>
                    <X className="w-3.5 h-3.5 text-blue-500" />
                  </button>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline ml-2"
                >
                  Reset all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Catalog Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Desktop Filter Sidebar ── */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs sticky top-36">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <span className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filters
              </span>
              {activeFilters.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            <div className="space-y-6">
              
              {/* Keyword Filter Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                  Keyword Filter
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search in results..."
                    className="w-full h-10 pl-9 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2.5">
                  Category
                </label>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => { setSelectedCategory('All'); setSelectedTag(''); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedCategory === 'All' && !selectedTag
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>All Devices</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                      selectedCategory === 'All' && !selectedTag ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        selectedCategory === cat.name
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                        selectedCategory === cat.name ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {categoryCounts[cat.name] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2.5">
                  Brand ({selectedBrands.length ? `${selectedBrands.length} selected` : 'All'})
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {allBrands.map((brand) => (
                    <label key={brand} className="flex items-center justify-between group cursor-pointer text-xs">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className={`transition-colors ${
                          selectedBrands.includes(brand) ? 'font-bold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                        }`}>
                          {brand}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">({brandCounts[brand] || 0})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Max Price
                  </label>
                  <span className="text-xs font-extrabold text-blue-600">${maxPrice}</span>
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
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>$100</span>
                  <span>$1,500</span>
                  <span>$3,500</span>
                </div>
              </div>

              {/* Customer Rating Filter */}
              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                  Minimum Rating
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 4.0, 4.5, 4.8].map((ratingVal) => (
                    <button
                      key={ratingVal}
                      onClick={() => setMinRating(ratingVal)}
                      className={`py-1.5 text-center rounded-xl text-xs font-bold border transition-colors ${
                        minRating === ratingVal
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {ratingVal === 0 ? 'All' : `${ratingVal}★+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability & Wishlist */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer group text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>In stock only</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer group text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={showWishlistOnly}
                    onChange={(e) => setShowWishlistOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 border-slate-300 focus:ring-rose-500 cursor-pointer"
                  />
                  <span>Saved to wishlist ({wishlist.length})</span>
                </label>
              </div>

            </div>
          </aside>

          {/* ── Products Results Column ── */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-xs text-slate-600 self-start sm:self-auto">
                Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> devices matching criteria
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                
                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="newest">Sort: Newest Releases</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* Results Grid or List */}
            {filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                /* List View layout */
                <div className="flex flex-col gap-4">
                  {filteredProducts.map((product) => {
                    const wishlisted = isWishlisted(product.id);
                    const isCompared = compareList.includes(product.id);
                    return (
                      <div
                        key={product.id}
                        className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400 transition-all"
                      >
                        {/* Thumbnail */}
                        <Link
                          to={`/product/${product.id}`}
                          className="w-full sm:w-48 h-44 rounded-xl bg-slate-50 p-3 flex items-center justify-center shrink-0 overflow-hidden"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain hover:scale-105 transition-transform"
                          />
                        </Link>

                        {/* Middle info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-blue-600 uppercase">{product.brand}</span>
                            <span className="text-xs text-slate-400">· {product.category}</span>
                            {product.tags?.map((t) => (
                              <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                {t}
                              </span>
                            ))}
                          </div>

                          <Link
                            to={`/product/${product.id}`}
                            className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors block leading-snug"
                          >
                            {product.name}
                          </Link>

                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>

                          {/* Specs pills */}
                          {product.specs && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                                <span key={key} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                                  <strong>{key}:</strong> {val}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right Action column */}
                        <div className="flex flex-col items-end justify-between self-stretch shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto">
                          <div className="text-right">
                            <span className="text-2xl font-black text-slate-900 block">
                              ${product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                ${product.originalPrice.toLocaleString()}
                              </span>
                            )}
                            <div className="flex items-center gap-1 justify-end text-amber-500 text-xs mt-1">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="font-bold text-slate-800">{product.rating}</span>
                              <span className="text-slate-400">({product.reviews})</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-4">
                            <button
                              onClick={() => toggleWishlist(product.id)}
                              className={`p-2 rounded-xl border transition-colors ${
                                wishlisted ? 'bg-rose-50 border-rose-300 text-rose-600' : 'border-slate-200 text-slate-400 hover:text-rose-600'
                              }`}
                              title="Wishlist"
                            >
                              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => toggleCompare(product.id)}
                              className={`p-2 rounded-xl border transition-colors ${
                                isCompared ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-slate-200 text-slate-400 hover:text-blue-600'
                              }`}
                              title="Compare"
                            >
                              <GitCompare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl bg-white border border-slate-200 text-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No matching devices found</h3>
                <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
                  We couldn't find any products matching your selected filters. Try broadening your criteria or reset the search filters.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => { clearAllFilters(); setSelectedCategory('Phones'); }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    View Smartphones
                  </button>
                  <button
                    onClick={() => { clearAllFilters(); setSelectedCategory('Laptops'); }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    View Laptops
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

    </div>
  );
}

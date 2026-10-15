import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { categoriesAPI } from '../../services/api';

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top rated' },
  { value: 'newest',     label: 'Newest' },
];

function StarRating({ rating = 5 }) {
  const full = Math.round(rating);
  return <span style={{ color: '#d97706', fontSize: 12 }}>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>;
}

function ProductCard({ product }) {
  const { toggleWishlist, isWishlisted, toggleCompare, compareList } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const pid = product._id || product.id;
  const isNew  = product.tags?.includes('New');
  const isSale = product.originalPrice && product.originalPrice > product.price;
  const wishlisted = isWishlisted(pid);
  const inCompare  = compareList.includes(pid);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 220, borderRadius: 16, overflow: 'hidden', background: '#f4f7fb', cursor: 'pointer', flexShrink: 0 }}
        onClick={() => navigate(`/product/${pid}`)}>
        <img src={product.image} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.currentTarget.style.display = 'none'; }} />
        {(isNew || isSale) && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span className="badge badge-blue">{isSale ? `${product.discountPct || 'Sale'}% off` : 'New'}</span>
          </div>
        )}
        {/* Wishlist heart */}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(pid); }}
          style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #dde4ee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 15, color: wishlisted ? '#2563eb' : '#667085' }}>
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Link to={`/product/${pid}`} style={{ textDecoration: 'none' }}>
          <p style={{ fontSize: 15, color: '#101828', margin: 0, lineHeight: 1.3 }}>{product.name}</p>
        </Link>
        <p style={{ fontSize: 11, color: '#667085', margin: 0 }}>{product.brand}</p>
        <StarRating rating={product.rating} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: 17, color: '#101828', margin: 0 }}>${product.price?.toLocaleString()}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p style={{ fontSize: 13, color: '#98a2b3', margin: 0, textDecoration: 'line-through' }}>${product.originalPrice?.toLocaleString()}</p>
          )}
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <button
            className="btn-primary"
            style={{ flex: 1, height: 36, fontSize: 12, padding: '0 12px' }}
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
          <button
            onClick={() => toggleCompare(pid)}
            style={{ height: 36, width: 36, borderRadius: 9, border: `1px solid ${inCompare ? '#2563eb' : '#dde4ee'}`, background: inCompare ? '#e8f0ff' : '#fff', color: inCompare ? '#2563eb' : '#667085', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            title="Compare"
          >
            ⚖
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const { products, wishlist } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get('category') || 'All';
  const urlTag      = searchParams.get('tag')      || '';
  const urlQuery    = searchParams.get('q')        || '';
  const urlWishlist = searchParams.get('wishlist') === 'true';

  const [query, setQuery]                   = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedTag, setSelectedTag]       = useState(urlTag);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice]             = useState(0);
  const [maxPrice, setMaxPrice]             = useState(3500);
  const [minRating, setMinRating]           = useState(0);
  const [inStockOnly, setInStockOnly]       = useState(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState(urlWishlist);
  const [sortBy, setSortBy]                 = useState('featured');
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    let mounted = true;
    categoriesAPI.getAll()
      .then(res => {
        if (mounted && res?.data?.length) setCategoriesList(res.data);
        else if (mounted) {
          const d = [...new Set(products.map(p => p.category).filter(Boolean))].map(c => ({ id: c, name: c }));
          setCategoriesList(d);
        }
      })
      .catch(() => {
        if (mounted) {
          const d = [...new Set(products.map(p => p.category).filter(Boolean))].map(c => ({ id: c, name: c }));
          setCategoriesList(d);
        }
      });
    return () => { mounted = false; };
  }, [products]);

  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSelectedTag(urlTag);
    setQuery(urlQuery);
    setShowWishlistOnly(urlWishlist);
  }, [urlCategory, urlTag, urlQuery, urlWishlist]);

  const allBrands = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))].sort(), [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (showWishlistOnly) list = list.filter(p => {
      const id = String(p._id || p.id || '');
      return id && wishlist.includes(id);
    });
    if (query.trim()) {
      const tokens = query.toLowerCase().trim().split(/\s+/);
      list = list.filter(p => {
        const text = [p.name, p.brand, p.category, p.description, ...(p.tags || []), ...Object.values(p.specs || {})].join(' ').toLowerCase();
        return tokens.every(t => text.includes(t));
      });
    }
    if (selectedCategory && selectedCategory !== 'All') {
      if (selectedCategory === 'New' || selectedCategory === 'New releases') list = list.filter(p => p.tags?.includes('New'));
      else list = list.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedTag) list = list.filter(p => p.tags?.some(t => t.toLowerCase() === selectedTag.toLowerCase()));
    if (selectedBrands.length) list = list.filter(p => selectedBrands.includes(p.brand));
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);
    if (minRating > 0) list = list.filter(p => (p.rating || 0) >= minRating);
    if (inStockOnly) list = list.filter(p => p.stock > 0);
    if (sortBy === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'newest')     list.sort((a, b) => (b.tags?.includes('New') ? 1 : 0) - (a.tags?.includes('New') ? 1 : 0));
    return list;
  }, [products, query, selectedCategory, selectedTag, selectedBrands, minPrice, maxPrice, minRating, inStockOnly, showWishlistOnly, wishlist, sortBy]);

  const toggleBrand = brand => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);

  const clearAllFilters = () => {
    setQuery(''); setSelectedCategory('All'); setSelectedTag(''); setSelectedBrands([]);
    setMinPrice(0); setMaxPrice(3500); setMinRating(0); setInStockOnly(false);
    setShowWishlistOnly(false); setSortBy('featured'); setSearchParams({});
  };

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('q', query); return n; });
  };

  const pageTitle = showWishlistOnly ? 'My Wishlist'
    : query ? `Results for "${query}"`
    : selectedCategory !== 'All' ? selectedCategory
    : selectedTag ? selectedTag
    : 'All products';

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── Page header ── */}
      <div style={{ borderBottom: '1px solid #dde4ee', padding: '24px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#101828', margin: 0 }}>{pageTitle}</h1>
            <span className="badge badge-gray">{filteredProducts.length} results</span>
          </div>
          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 0, flex: 1, maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f4f7fb', borderRadius: 10, padding: '0 14px', height: 42, flex: 1, border: '1px solid #dde4ee' }}>
              <Search size={16} color="#98a2b3" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search devices, brands and specs…"
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#101828', fontFamily: 'inherit' }} />
              {query && <button type="button" onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#98a2b3', display: 'flex' }}><X size={14} /></button>}
            </div>
          </form>
        </div>
      </div>

      <div style={{ display: 'flex', padding: '32px 64px', gap: 32 }}>

        {/* ── Filters sidebar ── */}
        <aside style={{ width: 240, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#101828', margin: 0 }}>Filters</p>
            {(selectedCategory !== 'All' || selectedBrands.length || selectedTag || query || inStockOnly || showWishlistOnly || minPrice > 0 || maxPrice < 3500) && (
              <button onClick={clearAllFilters} style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Clear all</button>
            )}
          </div>

          {/* Category */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#101828', margin: '0 0 10px', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>Category</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[{ id: 'All', name: 'All' }, ...categoriesList].map(cat => (
                <button key={cat.id || cat.name} onClick={() => setSelectedCategory(cat.name)}
                  style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 8, border: 'none', background: selectedCategory === cat.name ? '#e8f0ff' : 'transparent', color: selectedCategory === cat.name ? '#2563eb' : '#667085', fontSize: 13, fontWeight: selectedCategory === cat.name ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          {allBrands.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#101828', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Brand</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {allBrands.map(brand => (
                  <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#667085' }}>
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)}
                      style={{ width: 14, height: 14, accentColor: '#2563eb' }} />
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price range */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#101828', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price range</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} min={0} max={maxPrice}
                style={{ width: '100%', height: 36, border: '1px solid #dde4ee', borderRadius: 8, padding: '0 8px', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} placeholder="Min" />
              <input type="number" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} min={minPrice} max={5000}
                style={{ width: '100%', height: 36, border: '1px solid #dde4ee', borderRadius: 8, padding: '0 8px', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} placeholder="Max" />
            </div>
            <input type="range" min={0} max={5000} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
            <p style={{ fontSize: 11, color: '#667085', margin: '4px 0 0' }}>${minPrice} – ${maxPrice}</p>
          </div>

          {/* Rating */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#101828', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Min rating</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 3, 4, 4.5].map(r => (
                <button key={r} onClick={() => setMinRating(r)}
                  style={{ padding: '4px 10px', borderRadius: 999, border: `1px solid ${minRating === r ? '#2563eb' : '#dde4ee'}`, background: minRating === r ? '#e8f0ff' : '#fff', color: minRating === r ? '#2563eb' : '#667085', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {r === 0 ? 'Any' : `${r}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* In stock */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#667085', marginBottom: 12 }}>
            <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} style={{ width: 14, height: 14, accentColor: '#2563eb' }} />
            In stock only
          </label>

          {/* Wishlist */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#667085' }}>
            <input type="checkbox" checked={showWishlistOnly} onChange={e => setShowWishlistOnly(e.target.checked)} style={{ width: 14, height: 14, accentColor: '#2563eb' }} />
            Wishlist only
          </label>
        </aside>

        {/* ── Product grid ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Sort bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: '#667085', margin: 0 }}>{filteredProducts.length} products</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 13, color: '#667085' }}>Sort by:</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ height: 36, padding: '0 10px', border: '1px solid #dde4ee', borderRadius: 8, fontSize: 13, color: '#101828', background: '#fff', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
              {filteredProducts.map(p => <ProductCard key={p._id || p.id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#667085' }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#101828', marginBottom: 8 }}>No products found</p>
              <p style={{ fontSize: 13, marginBottom: 24 }}>Try adjusting your filters or search terms.</p>
              <button className="btn-secondary" onClick={clearAllFilters}>Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

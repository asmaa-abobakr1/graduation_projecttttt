import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, GitCompare, Heart, Menu, X, ChevronDown, Zap, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);
  const [searchQuery, setSearchQuery]           = useState('');
  const [searchFocused, setSearchFocused]       = useState(false);
  const dropdownRef       = useRef(null);
  const searchRef         = useRef(null);

  const { itemCount, subtotal } = useCart();
  const { compareList, wishlist, products } = useProducts();
  const { user, logout, isAuthenticated }   = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setUserDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); setSearchFocused(false); }, [location.pathname, location.search]);

  const liveResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setSearchFocused(false); }
  };

  const currentCat = new URLSearchParams(location.search).get('category') || '';
  const currentTag = new URLSearchParams(location.search).get('tag') || '';

  const navLinks = [
    { name: 'All',       path: '/search',                    active: location.pathname === '/search' && !currentCat && !currentTag },
    { name: 'New',       path: '/search?tag=New',            active: currentTag === 'New' },
    { name: 'Phones',    path: '/search?category=Phones',    active: currentCat === 'Phones' },
    { name: 'Laptops',   path: '/search?category=Laptops',   active: currentCat === 'Laptops' },
    { name: 'Audio',     path: '/search?category=Audio',     active: currentCat === 'Audio' },
    { name: 'Gaming',    path: '/search?category=Gaming',    active: currentCat === 'Gaming' },
    { name: 'Tablets',   path: '/search?category=Tablets',   active: currentCat === 'Tablets' },
    { name: 'Wearables', path: '/search?category=Wearables', active: currentCat === 'Wearables' },
  ];

  /* ── shared styles ── */
  const iconBtn = {
    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 36, height: 36, borderRadius: 10, background: 'none', border: 'none',
    color: '#475569', cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%' }}>

      {/* ── Announcement bar ── */}
      <div style={{ background: '#0f172a', color: '#cbd5e1', fontSize: 11, padding: '7px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', flexShrink: 0, display: 'inline-block' }} />
          Spring sale · <strong style={{ color: '#93c5fd' }}>Extra 10% off with code VOLT10</strong>
        </span>
        <span style={{ color: '#475569' }}>·</span>
        <span>Free 2-Day Delivery</span>
        <span style={{ color: '#475569' }}>·</span>
        <span>2-Year Warranty</span>
        {user?.role === 'admin' && (
          <>
            <span style={{ color: '#475569' }}>·</span>
            <Link to="/admin" style={{ color: '#fbbf24', fontWeight: 700, textDecoration: 'none' }}>⚡ Admin</Link>
          </>
        )}
      </div>

      {/* ── Main navbar ── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={18} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1 }}>
              VOLT<span style={{ color: '#2563eb' }}>.</span>
            </span>
          </Link>

          {/* Search bar */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: 520, position: 'relative' }}>
            <form onSubmit={handleSearch}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: searchFocused ? '#fff' : '#f1f5f9',
                border: `1.5px solid ${searchFocused ? '#2563eb' : '#e2e8f0'}`,
                borderRadius: 12, padding: '0 12px', height: 38,
                boxShadow: searchFocused ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none',
                transition: 'all 0.15s',
              }}>
                <Search size={15} color={searchFocused ? '#2563eb' : '#94a3b8'} style={{ flexShrink: 0 }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search phones, laptops, audio..."
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#0f172a' }}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#94a3b8', display: 'flex' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </form>

            {/* Live search dropdown */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6,
                background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 999,
              }}>
                {liveResults.length > 0 ? liveResults.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} onClick={() => setSearchFocused(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', textDecoration: 'none', borderBottom: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{p.brand} · {p.category}</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>${p.price?.toLocaleString()}</span>
                  </Link>
                )) : (
                  <div style={{ padding: '20px 14px', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                    No results — press Enter to search
                  </div>
                )}
                <button onClick={handleSearch}
                  style={{ width: '100%', padding: '10px', background: '#f8fafc', border: 'none', borderTop: '1px solid #f1f5f9', color: '#2563eb', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span>See all results for "{searchQuery}"</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Nav links - desktop */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }} className="hide-mobile">
            <Link to="/compare" style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 9,
              textDecoration: 'none', fontSize: 12, fontWeight: 600,
              color: compareList.length > 0 ? '#2563eb' : '#475569',
              background: compareList.length > 0 ? '#eff6ff' : 'transparent',
              border: compareList.length > 0 ? '1px solid #bfdbfe' : '1px solid transparent',
              transition: 'all 0.15s',
            }}>
              <GitCompare size={14} />
              Compare{compareList.length > 0 ? ` (${compareList.length})` : ''}
            </Link>
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>

            {/* Wishlist */}
            <Link to="/search?wishlist=true" style={{ ...iconBtn, textDecoration: 'none', color: wishlist.length > 0 ? '#f43f5e' : '#475569' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff1f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <Heart size={18} fill={wishlist.length > 0 ? '#f43f5e' : 'none'} />
              {wishlist.length > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, minWidth: 16, height: 16, background: '#f43f5e', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10,
              background: '#0f172a', color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 700,
              flexShrink: 0, position: 'relative', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}>
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={16} />
                {itemCount > 0 && (
                  <span style={{ position: 'absolute', top: -8, right: -8, minWidth: 16, height: 16, background: '#fbbf24', color: '#0f172a', fontSize: 9, fontWeight: 900, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                    {itemCount}
                  </span>
                )}
              </div>
              <span>${subtotal > 0 ? subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}</span>
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button onClick={() => setUserDropdownOpen(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px 5px 5px', borderRadius: 10, background: 'none', border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent'; }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', color: '#fff', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown size={13} color="#94a3b8" />
                </button>

                {userDropdownOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 6, width: 220, background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 999 }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                      <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 2px' }}>Signed in as</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                    </div>
                    {[
                      user?.role === 'admin' ? { label: '⚡ Admin Dashboard', to: '/admin', color: '#2563eb' } : null,
                      { label: `🛒 My Cart (${itemCount})`, to: '/cart' },
                      { label: `⚖️ Compare (${compareList.length})`, to: '/compare' },
                    ].filter(Boolean).map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setUserDropdownOpen(false)}
                        style={{ display: 'block', padding: '9px 16px', textDecoration: 'none', fontSize: 12, color: item.color || '#334155', fontWeight: 500 }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid #f1f5f9' }} />
                    <button onClick={() => { logout(); setUserDropdownOpen(false); navigate('/'); }}
                      style={{ width: '100%', textAlign: 'left', padding: '9px 16px', background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#ef4444', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff1f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link to="/login" style={{ padding: '7px 12px', borderRadius: 9, textDecoration: 'none', fontSize: 12, fontWeight: 600, color: '#475569', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Sign In
                </Link>
                <Link to="/signup" style={{ padding: '7px 14px', borderRadius: 9, textDecoration: 'none', fontSize: 12, fontWeight: 700, color: '#fff', background: '#2563eb', transition: 'background 0.15s', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}>
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(v => !v)}
              style={{ ...iconBtn, display: 'none' }} className="show-mobile"
              aria-label="Menu">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Category sub-nav ── */}
        <div style={{ borderTop: '1px solid #f1f5f9', background: '#fafafa', overflowX: 'auto' }} className="hide-mobile">
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 2, height: 38 }}>
            {navLinks.map(cat => (
              <Link key={cat.name} to={cat.path} style={{
                padding: '5px 12px', borderRadius: 8, textDecoration: 'none',
                fontSize: 12, fontWeight: cat.active ? 600 : 500, whiteSpace: 'nowrap',
                color: cat.active ? '#fff' : '#64748b',
                background: cat.active ? '#2563eb' : 'transparent',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (!cat.active) e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = cat.active ? '#fff' : '#0f172a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = cat.active ? '#2563eb' : 'transparent'; e.currentTarget.style.color = cat.active ? '#fff' : '#64748b'; }}>
                {cat.name}
              </Link>
            ))}
            <Link to="/search?tag=Sale" style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 600, color: '#e11d48', whiteSpace: 'nowrap' }}>
              🔥 Sale
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {navLinks.map(cat => (
              <Link key={cat.name} to={cat.path} style={{
                padding: '8px 12px', borderRadius: 9, textDecoration: 'none',
                fontSize: 12, fontWeight: 600, textAlign: 'center',
                color: cat.active ? '#fff' : '#475569',
                background: cat.active ? '#2563eb' : '#f1f5f9',
              }}>
                {cat.name}
              </Link>
            ))}
          </div>
          <Link to="/compare" style={{ padding: '8px 12px', borderRadius: 9, textDecoration: 'none', fontSize: 12, fontWeight: 600, textAlign: 'center', background: '#eff6ff', color: '#2563eb' }}>
            ⚖️ Compare Devices ({compareList.length})
          </Link>
          {!isAuthenticated ? (
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <Link to="/login" style={{ flex: 1, padding: '9px', borderRadius: 9, textDecoration: 'none', fontSize: 12, fontWeight: 600, textAlign: 'center', background: '#f1f5f9', color: '#0f172a' }}>Sign In</Link>
              <Link to="/signup" style={{ flex: 1, padding: '9px', borderRadius: 9, textDecoration: 'none', fontSize: 12, fontWeight: 700, textAlign: 'center', background: '#2563eb', color: '#fff' }}>Join Free</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 9, background: '#f8fafc' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{user?.name}</span>
              <button onClick={() => { logout(); navigate('/'); }} style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Sign Out</button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </header>
  );
}

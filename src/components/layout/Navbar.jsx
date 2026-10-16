import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown, ArrowRight, GitCompare } from 'lucide-react';
import { useCart }     from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth }     from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';

export default function Navbar() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen,   setMobileMenuOpen]   = useState(false);
  const [searchQuery,      setSearchQuery]       = useState('');
  const [searchFocused,    setSearchFocused]     = useState(false);
  const dropdownRef = useRef(null);
  const searchRef   = useRef(null);

  const { itemCount }                       = useCart();
  const { compareList, wishlist, products } = useProducts();
  const { user, logout, isAuthenticated }   = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { isMobile } = useResponsive();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setUserDropdownOpen(false);
      if (searchRef.current   && !searchRef.current.contains(e.target))   setSearchFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchFocused(false);
  }, [location.pathname, location.search]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const liveResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(p => p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .slice(0, 5);
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
      setMobileMenuOpen(false);
    }
  };

  const currentCat = new URLSearchParams(location.search).get('category') || '';
  const currentTag = new URLSearchParams(location.search).get('tag')      || '';

  const navCategories = [
    { name: 'New releases', path: '/search?tag=New',            active: currentTag === 'New'       },
    { name: 'Phones',       path: '/search?category=Phones',    active: currentCat === 'Phones'    },
    { name: 'Laptops',      path: '/search?category=Laptops',   active: currentCat === 'Laptops'   },
    { name: 'Tablets',      path: '/search?category=Tablets',   active: currentCat === 'Tablets'   },
    { name: 'Audio',        path: '/search?category=Audio',     active: currentCat === 'Audio'     },
    { name: 'Gaming',       path: '/search?category=Gaming',    active: currentCat === 'Gaming'    },
    { name: 'Wearables',    path: '/search?category=Wearables', active: currentCat === 'Wearables' },
    { name: 'Deals',        path: '/search?tag=Sale',           active: currentTag === 'Sale'      },
  ];

  return (
    <>
      {/* ─────────────────── NAVBAR STYLES ─────────────────── */}
      <style>{`
        .nav-desktop { display: flex; }
        .nav-mobile  { display: none; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
          .nav-subnav  { display: none !important; }
        }
      `}</style>

      <header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%' }}>

        {/* ── Top bar ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #dde4ee' }}>
          <div style={{
            maxWidth: 1440, margin: '0 auto',
            padding: isMobile ? '0 16px' : '0 64px',
            height: isMobile ? 60 : 72,
            display: 'flex', alignItems: 'center',
            gap: isMobile ? 10 : 28,
          }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#101828', letterSpacing: '-0.5px' }}>
                VOLT<span style={{ color: '#2563eb' }}>•</span>
              </span>
            </Link>

            {/* Search bar */}
            <div ref={searchRef} style={{ flex: 1, position: 'relative', minWidth: 0 }}>
              <form onSubmit={handleSearch}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: searchFocused ? '#fff' : '#f4f7fb',
                  border: `1px solid ${searchFocused ? '#2563eb' : '#f4f7fb'}`,
                  borderRadius: 10, padding: '0 12px',
                  height: isMobile ? 38 : 42,
                  boxShadow: searchFocused ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none',
                  transition: 'all 0.15s',
                }}>
                  <Search size={16} color={searchFocused ? '#2563eb' : '#98a2b3'} style={{ flexShrink: 0 }} />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    placeholder={isMobile ? 'Search…' : 'Search devices, brands and specs'}
                    style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#101828', fontFamily: 'inherit', minWidth: 0 }}
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#98a2b3', display: 'flex', padding: 2 }}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </form>

              {/* Live search dropdown */}
              {searchFocused && searchQuery.trim().length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6,
                  background: '#fff', borderRadius: 12, border: '1px solid #dde4ee',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 999,
                }}>
                  {liveResults.length > 0 ? liveResults.map(p => {
                    const pid = p._id || p.id;
                    return (
                      <Link key={pid} to={`/product/${pid}`}
                        onClick={() => { setSearchFocused(false); setSearchQuery(''); setMobileMenuOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', textDecoration: 'none', borderBottom: '1px solid #f4f7fb' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9fbff'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <img src={p.image} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 7, border: '1px solid #dde4ee', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: '#101828', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                          <p style={{ fontSize: 11, color: '#667085', margin: 0 }}>{p.brand} · {p.category}</p>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#101828', flexShrink: 0 }}>${p.price?.toLocaleString()}</span>
                      </Link>
                    );
                  }) : (
                    <div style={{ padding: '16px 14px', textAlign: 'center', color: '#667085', fontSize: 13 }}>
                      No results — press Enter to search
                    </div>
                  )}
                  <button onClick={handleSearch}
                    style={{ width: '100%', padding: '10px', background: '#f9fbff', border: 'none', borderTop: '1px solid #f4f7fb', color: '#2563eb', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
                    See all results for "{searchQuery}" <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* ── DESKTOP right nav ── */}
            <nav className="nav-desktop" style={{ alignItems: 'center', gap: 24, flexShrink: 0 }}>
              <Link to="/compare" style={{ textDecoration: 'none', fontSize: 13, fontWeight: 600, color: compareList.length > 0 ? '#2563eb' : '#101828', display: 'flex', alignItems: 'center', gap: 5 }}>
                <GitCompare size={15} />
                Compare{compareList.length > 0 && ` (${compareList.length})`}
              </Link>
              <Link to="/search?wishlist=true" style={{ textDecoration: 'none', fontSize: 13, fontWeight: 600, color: wishlist.length > 0 ? '#2563eb' : '#101828', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Heart size={15} fill={wishlist.length > 0 ? '#2563eb' : 'none'} />
                Wishlist{wishlist.length > 0 && ` (${wishlist.length})`}
              </Link>
              <Link to="/cart" style={{ textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#101828', display: 'flex', alignItems: 'center', gap: 5 }}>
                <ShoppingCart size={15} />
                Cart{itemCount > 0 ? ` (${itemCount})` : ''}
              </Link>

              {isAuthenticated ? (
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button onClick={() => setUserDropdownOpen(v => !v)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#101828', fontFamily: 'inherit' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <ChevronDown size={13} color="#667085" />
                  </button>
                  {userDropdownOpen && (
                    <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 220, background: '#fff', borderRadius: 14, border: '1px solid #dde4ee', boxShadow: '0 12px 40px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 999 }}>
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f4f7fb', background: '#fafbfd' }}>
                        <p style={{ fontSize: 10, color: '#98a2b3', margin: '0 0 2px' }}>Signed in as</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#101828', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                        <p style={{ fontSize: 11, color: '#667085', margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                      </div>
                      {[
                        user?.role === 'admin' ? { label: '⚡ Admin Dashboard', to: '/admin', color: '#2563eb' } : null,
                        { label: `🛒 My Cart (${itemCount})`, to: '/cart' },
                        { label: `⚖️ Compare (${compareList.length})`, to: '/compare' },
                      ].filter(Boolean).map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setUserDropdownOpen(false)}
                          style={{ display: 'block', padding: '9px 16px', textDecoration: 'none', fontSize: 12, color: item.color || '#101828', fontWeight: 500 }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f9fbff'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          {item.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid #f4f7fb' }} />
                      <button onClick={() => { logout(); setUserDropdownOpen(false); navigate('/'); }}
                        style={{ width: '100%', textAlign: 'left', padding: '9px 16px', background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#d92d20', cursor: 'pointer', fontFamily: 'inherit' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#feeceb'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" style={{ textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#101828' }}>
                  Account
                </Link>
              )}
            </nav>

            {/* ── MOBILE right: cart badge + hamburger ── */}
            <div className="nav-mobile" style={{ alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {/* Cart with badge */}
              <Link to="/cart" style={{
                textDecoration: 'none', color: '#101828', position: 'relative',
                width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6,
                    background: '#2563eb', color: '#fff',
                    borderRadius: '50%', width: 16, height: 16,
                    fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                  }}>{itemCount > 9 ? '9+' : itemCount}</span>
                )}
              </Link>

              {/* Wishlist with badge */}
              <Link to="/search?wishlist=true" style={{
                textDecoration: 'none', color: wishlist.length > 0 ? '#2563eb' : '#101828', position: 'relative',
                width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Heart size={22} fill={wishlist.length > 0 ? '#2563eb' : 'none'} />
                {wishlist.length > 0 && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6,
                    background: '#2563eb', color: '#fff',
                    borderRadius: '50%', width: 16, height: 16,
                    fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{wishlist.length > 9 ? '9+' : wishlist.length}</span>
                )}
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#101828', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* ── Category sub-nav (desktop only) ── */}
          <div className="nav-subnav" style={{ borderTop: '1px solid #dde4ee' }}>
            <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 64px', height: 44, display: 'flex', alignItems: 'center', gap: 30, overflowX: 'auto' }}>
              {navCategories.map(cat => (
                <Link key={cat.name} to={cat.path} style={{
                  textDecoration: 'none', fontSize: 13, fontWeight: cat.active ? 600 : 400,
                  color: cat.active ? '#101828' : '#667085', whiteSpace: 'nowrap',
                  borderBottom: cat.active ? '2px solid #101828' : '2px solid transparent',
                  paddingBottom: 2, transition: 'color 0.15s',
                  flexShrink: 0,
                }}
                  onMouseEnter={e => { if (!cat.active) e.currentTarget.style.color = '#101828'; }}
                  onMouseLeave={e => { if (!cat.active) e.currentTarget.style.color = '#667085'; }}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── MOBILE FULL-SCREEN MENU ── */}
        {mobileMenuOpen && (
          <div style={{
            position: 'fixed', inset: 0,
            zIndex: 9999, background: '#fff',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }}>
            {/* Drawer header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px', height: 60, borderBottom: '1px solid #dde4ee',
              flexShrink: 0,
            }}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#101828', letterSpacing: '-0.5px' }}>
                  VOLT<span style={{ color: '#2563eb' }}>•</span>
                </span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#101828', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={22} />
              </button>
            </div>

            {/* Drawer search */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f4f7fb' }}>
              <form onSubmit={handleSearch}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f4f7fb', borderRadius: 10, padding: '0 12px', height: 42 }}>
                  <Search size={16} color="#98a2b3" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search devices, brands and specs…"
                    style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: '#101828', fontFamily: 'inherit' }}
                  />
                </div>
              </form>
            </div>

            {/* Drawer body */}
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Categories grid */}
              <p style={{ fontSize: 11, fontWeight: 700, color: '#98a2b3', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Shop by category</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {navCategories.map(cat => (
                  <Link key={cat.name} to={cat.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '12px', borderRadius: 10, textDecoration: 'none',
                      fontSize: 13, fontWeight: 600, textAlign: 'center',
                      color: cat.active ? '#fff' : '#101828',
                      background: cat.active ? '#2563eb' : '#f4f7fb',
                      border: cat.active ? 'none' : '1px solid #dde4ee',
                      minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#f4f7fb' }} />

              {/* Quick links */}
              <p style={{ fontSize: 11, fontWeight: 700, color: '#98a2b3', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Quick links</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, textDecoration: 'none', background: '#f4f7fb', color: '#101828', fontSize: 14, fontWeight: 500 }}>
                  <span>🛒 Cart</span>
                  {itemCount > 0 && <span style={{ background: '#2563eb', color: '#fff', borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{itemCount}</span>}
                </Link>
                <Link to="/search?wishlist=true" onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, textDecoration: 'none', background: '#f4f7fb', color: '#101828', fontSize: 14, fontWeight: 500 }}>
                  <span>♥ Wishlist</span>
                  {wishlist.length > 0 && <span style={{ background: '#2563eb', color: '#fff', borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{wishlist.length}</span>}
                </Link>
                <Link to="/compare" onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, textDecoration: 'none', background: '#f4f7fb', color: '#101828', fontSize: 14, fontWeight: 500 }}>
                  <span>⚖️ Compare</span>
                  {compareList.length > 0 && <span style={{ background: '#2563eb', color: '#fff', borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{compareList.length}</span>}
                </Link>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#f4f7fb' }} />

              {/* Auth */}
              {!isAuthenticated ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                    style={{ flex: 1, height: 48, borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600, textAlign: 'center', background: '#f4f7fb', color: '#101828', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #dde4ee' }}>
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}
                    style={{ flex: 1, height: 48, borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 700, textAlign: 'center', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Join Free
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ padding: '12px 14px', background: '#f4f7fb', borderRadius: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#101828', margin: 0 }}>{user?.name}</p>
                    <p style={{ fontSize: 11, color: '#667085', margin: '2px 0 0' }}>{user?.email}</p>
                  </div>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
                      style={{ height: 48, borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600, background: '#e8f0ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ⚡ Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}
                    style={{ height: 48, borderRadius: 10, fontSize: 14, fontWeight: 600, background: '#feeceb', color: '#d92d20', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown, ArrowRight, GitCompare } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';

export default function Navbar() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);
  const [searchQuery, setSearchQuery]           = useState('');
  const [searchFocused, setSearchFocused]       = useState(false);
  const dropdownRef = useRef(null);
  const searchRef   = useRef(null);

  const { itemCount, subtotal }             = useCart();
  const { compareList, wishlist, products } = useProducts();
  const { user, logout, isAuthenticated }   = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { isMobile } = useResponsive();

  /* close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setUserDropdownOpen(false);
      if (searchRef.current   && !searchRef.current.contains(e.target))   setSearchFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* close on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchFocused(false);
  }, [location.pathname, location.search]);

  /* live search */
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
    }
  };

  const currentCat = new URLSearchParams(location.search).get('category') || '';
  const currentTag = new URLSearchParams(location.search).get('tag')      || '';

  const categories = [
    { name: 'New releases', path: '/search?tag=New',            active: currentTag === 'New' },
    { name: 'Phones',       path: '/search?category=Phones',    active: currentCat === 'Phones' },
    { name: 'Laptops',      path: '/search?category=Laptops',   active: currentCat === 'Laptops' },
    { name: 'Tablets',      path: '/search?category=Tablets',   active: currentCat === 'Tablets' },
    { name: 'Audio',        path: '/search?category=Audio',     active: currentCat === 'Audio' },
    { name: 'Gaming',       path: '/search?category=Gaming',    active: currentCat === 'Gaming' },
    { name: 'Wearables',    path: '/search?category=Wearables', active: currentCat === 'Wearables' },
    { name: 'Deals',        path: '/search?tag=Sale',           active: currentTag === 'Sale' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%' }}>

      {/* ── Primary navigation ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #dde4ee' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: isMobile ? '0 16px' : '0 64px', height: isMobile ? 60 : 72, display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 28 }}>

          {/* Brand */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#101828', letterSpacing: '-0.5px', fontFamily: 'Inter, sans-serif' }}>
              VOLT<span style={{ color: '#2563eb' }}>•</span>
            </span>
          </Link>

          {/* Search bar */}
          <div ref={searchRef} style={{ flex: 1, position: 'relative', minWidth: 0 }}>
            <form onSubmit={handleSearch}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: searchFocused ? '#fff' : '#f4f7fb',
                border: `1px solid ${searchFocused ? '#2563eb' : '#f4f7fb'}`,
                borderRadius: 10, padding: '0 14px', height: isMobile ? 38 : 42,
                boxShadow: searchFocused ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none',
                transition: 'all 0.15s',
              }}>
                <Search size={18} color={searchFocused ? '#2563eb' : '#98a2b3'} style={{ flexShrink: 0 }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search devices, brands and specs"
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: '#101828', fontFamily: 'inherit' }}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#98a2b3', display: 'flex', alignItems: 'center', padding: 2 }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </form>

            {/* Live results dropdown */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6,
                background: '#fff', borderRadius: 12, border: '1px solid #dde4ee',
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 999,
              }}>
                {liveResults.length > 0 ? liveResults.map(p => {
                  const pid = p._id || p.id;
                  return (
                    <Link key={pid} to={`/product/${pid}`} onClick={() => { setSearchFocused(false); setSearchQuery(''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', textDecoration: 'none', borderBottom: '1px solid #f4f7fb' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fbff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid #dde4ee', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#101828', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                        <p style={{ fontSize: 11, color: '#667085', margin: 0 }}>{p.brand} · {p.category}</p>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#101828', flexShrink: 0 }}>${p.price?.toLocaleString()}</span>
                    </Link>
                  );
                }) : (
                  <div style={{ padding: '20px 14px', textAlign: 'center', color: '#667085', fontSize: 13 }}>
                    No results — press Enter to search
                  </div>
                )}
                <button onClick={handleSearch}
                  style={{ width: '100%', padding: '10px', background: '#f9fbff', border: 'none', borderTop: '1px solid #f4f7fb', color: '#2563eb', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
                  See all results for "{searchQuery}"
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Right nav items — desktop only */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }} className="hide-mobile">

            {/* Compare */}
            <Link to="/compare" style={{
              textDecoration: 'none', fontSize: 13, fontWeight: 600, color: compareList.length > 0 ? '#2563eb' : '#101828',
              display: 'flex', alignItems: 'center', gap: 5, position: 'relative',
            }}>
              <GitCompare size={15} />
              Compare{compareList.length > 0 && ` (${compareList.length})`}
            </Link>

            {/* Wishlist */}
            <Link to="/search?wishlist=true" style={{
              textDecoration: 'none', fontSize: 13, fontWeight: 600,
              color: wishlist.length > 0 ? '#2563eb' : '#101828',
              display: 'flex', alignItems: 'center', gap: 5, position: 'relative',
            }}>
              <Heart size={15} fill={wishlist.length > 0 ? '#2563eb' : 'none'} />
              Wishlist{wishlist.length > 0 && ` (${wishlist.length})`}
            </Link>

            {/* Cart */}
            <Link to="/cart" style={{
              textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#101828',
              display: 'flex', alignItems: 'center', gap: 5, position: 'relative',
            }}>
              <ShoppingCart size={15} />
              Cart{itemCount > 0 ? `  ${itemCount}` : ''}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button onClick={() => setUserDropdownOpen(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#101828', fontFamily: 'inherit' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                      { label: `🛒 My Cart (${itemCount})`,     to: '/cart' },
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
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" style={{ textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#101828' }}>
                  Account
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile: cart icon + hamburger */}
          <div className="show-mobile" style={{ display: 'none', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Link to="/cart" style={{
              textDecoration: 'none', color: '#101828', display: 'flex', alignItems: 'center',
              justifyContent: 'center', minHeight: 44, minWidth: 44, position: 'relative',
            }}>
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 4, background: '#2563eb', color: '#fff',
                  borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{itemCount}</span>
              )}
            </Link>
            <button onClick={() => setMobileMenuOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#101828', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44 }}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Category sub-nav ── */}
        <div style={{ borderTop: '1px solid #dde4ee' }} className="hide-mobile">
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 64px', height: 44, display: 'flex', alignItems: 'center', gap: 30 }}>
            {categories.map(cat => (
              <Link key={cat.name} to={cat.path} style={{
                textDecoration: 'none', fontSize: 13, fontWeight: cat.active ? 600 : 400,
                color: cat.active ? '#101828' : '#667085', whiteSpace: 'nowrap',
                borderBottom: cat.active ? '2px solid #101828' : '2px solid transparent',
                paddingBottom: 2, transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (!cat.active) { e.currentTarget.style.color = '#101828'; } }}
                onMouseLeave={e => { if (!cat.active) { e.currentTarget.style.color = '#667085'; } }}>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
          zIndex: 9999, background: '#fff', overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Header row inside drawer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 60, borderBottom: '1px solid #dde4ee', flexShrink: 0 }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#101828', letterSpacing: '-0.5px', fontFamily: 'Inter, sans-serif' }}>
                VOLT<span style={{ color: '#2563eb' }}>•</span>
              </span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#101828', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44 }}>
              <X size={22} />
            </button>
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {categories.map(cat => (
                <Link key={cat.name} to={cat.path} style={{
                  padding: '8px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 600,
                  textAlign: 'center', color: cat.active ? '#fff' : '#667085',
                  background: cat.active ? '#2563eb' : '#f4f7fb',
                  minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {cat.name}
                </Link>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <Link to="/cart" style={{ flex: 1, padding: '9px', borderRadius: 9, textDecoration: 'none', fontSize: 12, fontWeight: 600, textAlign: 'center', background: '#f4f7fb', color: '#101828', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Cart {itemCount > 0 ? `(${itemCount})` : ''}
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link to="/login"  style={{ flex: 1, padding: '9px', borderRadius: 9, textDecoration: 'none', fontSize: 12, fontWeight: 600, textAlign: 'center', background: '#f4f7fb', color: '#101828', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sign In</Link>
                  <Link to="/signup" style={{ flex: 1, padding: '9px', borderRadius: 9, textDecoration: 'none', fontSize: 12, fontWeight: 700, textAlign: 'center', background: '#2563eb', color: '#fff', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Join Free</Link>
                </>
              ) : (
                <button onClick={() => { logout(); navigate('/'); }} style={{ flex: 1, padding: '9px', borderRadius: 9, fontSize: 12, fontWeight: 600, background: '#feeceb', color: '#d92d20', border: 'none', cursor: 'pointer', fontFamily: 'inherit', minHeight: 44 }}>Sign Out</button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

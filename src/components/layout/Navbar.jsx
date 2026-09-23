import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const { itemCount } = useCart();
  const { compareList } = useProducts();
  const { user, logout, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchQuery('');
    }
  };

  const navCategories = [
    { name: 'New releases', path: '/search?category=New' },
    { name: 'Phones',       path: '/search?category=Phones' },
    { name: 'Laptops',      path: '/search?category=Laptops' },
    { name: 'Tablets',      path: '/search?category=Tablets' },

  ];

  const currentPath = location.pathname + location.search;

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">

      {/* ── Primary Navigation ── */}
      <div className="bg-white border-b border-[#dde4ee]">
        <div
          className="flex items-center h-[72px] px-16 gap-7"
          style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}
        >
          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <span className="text-[22px] font-extrabold text-[#101828] tracking-tight leading-none">
              VOLT•
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 min-w-0">
            <div className="bg-[#f4f7fb] rounded-[10px] h-[42px] flex items-center gap-2 px-[14px]">
              {/* Search icon */}
              <svg
                width="18" height="18" viewBox="0 0 18 18" fill="none"
                className="shrink-0 text-[#98a2b3] pointer-events-none"
              >
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search devices, brands and specs"
                className="bg-transparent flex-1 min-w-0 text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none border-none"
              />
            </div>
          </form>

          {/* Right items */}
          <nav className="flex items-center gap-7 shrink-0">
            <Link
              to="/search"
              className="text-[13px] font-semibold text-[#101828] hover:text-[#2563eb] transition-colors whitespace-nowrap"
            >
              Categories
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen((v) => !v)}
                  className="text-[13px] font-semibold text-[#101828] hover:text-[#2563eb] transition-colors whitespace-nowrap"
                >
                  {user?.name?.split(' ')[0] ?? 'Account'}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-[12px] shadow-[0_8px_32px_rgba(16,24,40,0.12)] border border-[#dde4ee] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#dde4ee]">
                      <p className="text-[11px] text-[#667085]">Signed in as</p>
                      <p className="text-[13px] font-semibold text-[#101828] truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#e8f0ff] text-[#2563eb]">
                        {user?.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </div>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 text-[13px] text-[#101828] hover:bg-[#f4f7fb] transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2.5 text-[13px] text-[#d92d20] hover:bg-[#fff0ee] transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-[13px] font-semibold text-[#101828] hover:text-[#2563eb] transition-colors whitespace-nowrap"
                >
                  Account
                </Link>
                <Link
                  to="/signup"
                  className="text-[13px] font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] px-3 py-1.5 rounded-[8px] transition-colors whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Wishlist / Compare */}
            <Link
              to="/compare"
              className="relative text-[13px] font-semibold text-[#101828] hover:text-[#2563eb] transition-colors whitespace-nowrap"
            >
              Wishlist
              {compareList.length > 0 && (
                <span className="absolute -top-2.5 -right-3.5 min-w-[18px] h-[18px] bg-[#2563eb] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-[13px] font-semibold text-[#101828] hover:text-[#2563eb] transition-colors whitespace-nowrap"
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2.5 -right-3.5 min-w-[18px] h-[18px] bg-[#2563eb] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden p-1.5 rounded-[8px] text-[#667085] hover:text-[#101828] hover:bg-[#f4f7fb] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* ── Category Navigation ── */}
      <div className="bg-white border-b border-[#dde4ee]">
        <div
          className="hidden lg:flex items-center h-[44px] px-16 gap-[30px] overflow-x-auto"
          style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}
        >
          {navCategories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className={`text-[13px] whitespace-nowrap shrink-0 transition-colors ${
                currentPath === cat.path
                  ? 'text-[#101828] font-semibold border-b-2 border-[#2563eb] pb-0.5'
                  : 'text-[#667085] hover:text-[#101828]'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#dde4ee] px-6 py-5 space-y-5">
          {/* Mobile Search */}
          <form onSubmit={handleSearch}>
            <div className="bg-[#f4f7fb] rounded-[10px] h-[42px] flex items-center gap-2 px-4">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-[#98a2b3] shrink-0">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search devices..."
                className="bg-transparent flex-1 text-[14px] placeholder-[#98a2b3] outline-none"
              />
            </div>
          </form>

          {/* Mobile Category Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className="text-[13px] text-[#667085] hover:text-[#101828] px-3 py-2 rounded-[8px] hover:bg-[#f4f7fb] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth */}
          {!isAuthenticated && (
            <div className="flex gap-3 pt-2 border-t border-[#f4f7fb]">
              <Link to="/login" className="flex-1 h-[40px] flex items-center justify-center rounded-[8px] border border-[#dde4ee] text-[13px] text-[#101828] font-semibold">
                Sign In
              </Link>
              <Link to="/signup" className="flex-1 h-[40px] flex items-center justify-center rounded-[8px] bg-[#2563eb] text-white text-[13px] font-semibold hover:bg-[#1d4ed8] transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

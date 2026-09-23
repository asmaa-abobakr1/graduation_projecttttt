import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Scale, 
  User, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { itemCount } = useCart();
  const { compareList } = useProducts();
  const { user, logout, isAuthenticated } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Shop All', path: '/search' },
    { name: 'Laptops', path: '/search?category=Laptops' },
    { name: 'Phones', path: '/search?category=Phones' },
    { name: 'Tablets', path: '/search?category=Tablets' },
    { name: 'Accessories', path: '/search?category=Accessories' },
    { name: 'Compare', path: '/compare' },
  ];

  const isActive = (path) => {
    if (path === '/search' && location.pathname === '/search' && !location.search) return true;
    return location.pathname + location.search === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>Free express delivery on orders over $500 • Use code <strong className="text-white">VOLT10</strong> for 10% off</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group shrink-0">
            <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              VOLT<span className="text-blue-600">.</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-slate-400 uppercase ml-1.5 px-1.5 py-0.5 bg-slate-100 rounded">
              Tech
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search laptops, smartphones, chipsets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/90 text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2 text-sm rounded-full border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Compare trigger */}
            <Link
              to="/compare"
              className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Compare Devices"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-scale-in shadow-sm">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart trigger */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-scale-in shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Auth / Profile Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm font-medium text-slate-700"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="hidden sm:inline-block max-w-[100px] truncate text-slate-900 font-semibold">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-scale-in">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                        </span>
                      </div>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-blue-600" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-1.5 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-slide-up">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-900 pl-10 pr-4 py-2.5 text-sm rounded-lg border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium px-3 py-2 rounded-lg ${
                  isActive(link.path)
                    ? 'text-blue-600 bg-blue-50 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Fast Shipping Worldwide</span>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-blue-600 font-semibold hover:underline">
              Admin Portal →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

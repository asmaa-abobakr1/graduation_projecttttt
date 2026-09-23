import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  Boxes, 
  Layers, 
  ArrowLeft, 
  LogOut, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
  ];

  const isCurrentActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-slate-950 text-slate-300 border-r border-slate-800 w-64 select-none">
      
      {/* Top Header */}
      <div>
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-1.5 group">
            <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
              VOLT<span className="text-blue-500">.</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-6 space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Management
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight className="w-4 h-4 text-blue-200" />}
              </Link>
            );
          })}
        </div>

        {/* Back to store portal */}
        <div className="px-3 pt-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Storefront
          </p>
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors border border-dashed border-slate-800"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Customer View</span>
          </Link>
        </div>
      </div>

      {/* Admin Profile & Logout Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Maya Chen'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@volt.com'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-900/50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Admin</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
          <div className="relative z-10 w-64 h-full animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

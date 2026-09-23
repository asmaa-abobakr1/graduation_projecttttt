import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', exact: true },
    { name: 'Analytics & reports', path: '/admin/analytics' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Inventory', path: '/admin/inventory' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Customers', path: '/admin/customers' },
    { name: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const handleLogout = () => { logout(); navigate('/login'); };

  const sidebarContent = (
    <div className="bg-[#0b1220] flex flex-col gap-2 items-start h-full w-[232px] px-[18px] py-6 select-none overflow-y-auto">
      <span className="text-[22px] font-extrabold text-white tracking-tight mb-0">VOLT• ADMIN</span>
      <span className="text-[11px] text-[#98a2b3] uppercase tracking-widest mb-2">COMMERCE WORKSPACE</span>

      {menuItems.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={`w-full h-[42px] flex items-center px-3 rounded-[10px] text-[13px] transition-colors ${
              active
                ? 'bg-[#2563eb] text-white font-normal'
                : 'text-[#b7c1d1] hover:bg-[#1a2540] hover:text-white font-medium'
            }`}
          >
            {item.name}
          </Link>
        );
      })}

      <div className="mt-auto w-full pt-4 border-t border-[#1e2d45]">
        <Link to="/" className="w-full h-[42px] flex items-center px-3 rounded-[10px] text-[13px] text-[#b7c1d1] hover:bg-[#1a2540] hover:text-white transition-colors mb-2">
          ← Customer View
        </Link>
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white font-bold flex items-center justify-center text-sm shrink-0">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[12px] font-semibold text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-[11px] text-[#98a2b3] truncate">{user?.email || 'admin@volt.com'}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full h-[38px] flex items-center justify-center px-3 rounded-[10px] text-[12px] text-[#d92d20] hover:bg-[#2a1515] transition-colors mt-1">
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={onClose} />
          <div className="relative z-10 h-full animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

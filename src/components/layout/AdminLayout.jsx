import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, Bell, Search, ExternalLink, ShieldAlert } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useProducts } from '../../context/ProductContext';

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { products } = useProducts();

  const lowStockCount = products.filter((p) => p.stock < 10).length;

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Dashboard Overview';
    if (location.pathname.startsWith('/admin/analytics')) return 'Performance Analytics';
    if (location.pathname.startsWith('/admin/products')) return 'Product Management (CRUD)';
    if (location.pathname.startsWith('/admin/inventory')) return 'Inventory & Stock Tracking';
    if (location.pathname.startsWith('/admin/categories')) return 'Category Control';
    return 'Admin Portal';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950/40">
        
        {/* Top Navbar */}
        <header className="h-18 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">{getPageTitle()}</h1>
              <p className="hidden sm:block text-xs text-slate-400">Live mock store management environment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lowStockCount > 0 && (
              <Link
                to="/admin/inventory"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                title={`${lowStockCount} items have low stock`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>{lowStockCount} Low Stock</span>
              </Link>
            )}

            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <span>View Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

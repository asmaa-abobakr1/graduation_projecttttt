import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Bell } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

const PAGE_TITLES = {
  '/admin':            { title: 'Admin Main Dashboard',      sub: 'Live commerce overview' },
  '/admin/analytics':  { title: 'Analytics & Reports',       sub: 'Sales, traffic and trends' },
  '/admin/products':   { title: 'Product Management',        sub: 'Add, edit and manage your catalog' },
  '/admin/inventory':  { title: 'Inventory Control',         sub: 'Track and adjust stock levels' },
  '/admin/categories': { title: 'Category Management',       sub: 'Organise your product taxonomy' },
  '/admin/orders':     { title: 'Orders',                    sub: 'View and manage customer orders' },
  '/admin/customers':  { title: 'Customers',                 sub: 'Registered accounts and activity' },
  '/admin/settings':   { title: 'Settings',                  sub: 'Profile and store configuration' },
};

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] || { title: 'Admin', sub: '' };
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7fb' }}>

      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>

        {/* Top bar */}
        <div style={{ background: '#fff', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', borderBottom: '1px solid #dde4ee', flexShrink: 0 }}>
          {/* Left: hamburger (mobile) + page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#667085', padding: 4 }}
              className="mobile-hamburger"
              aria-label="Open menu"
            >
              ☰
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#101828', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '150px' : 'none' }}>{page.title}</p>
              <p style={{ fontSize: 12, color: '#667085', margin: 0 }}>{today} · {page.sub}</p>
            </div>
          </div>

          {/* Right: bell + user */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#667085', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = '#f4f7fb'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <Bell size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#101828' }}>{!isMobile && (user?.name || 'Admin')}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-hamburger { display: flex !important; }
          .desktop-sidebar  { display: none !important; }
        }
      `}</style>
    </div>
  );
}

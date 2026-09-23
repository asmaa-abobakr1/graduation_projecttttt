import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: '#f4f7fb' }}>
      {/* Dark Sidebar */}
      <AdminSidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-[#0b1220] text-white rounded-lg"
          aria-label="Open menu"
        >
          ☰
        </button>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "#F4F7FB" }}>
      <AdminSidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 p-2 text-white rounded-xl"
          style={{ background: "#2563eb", boxShadow: "0 2px 8px rgba(37,99,235,0.35)" }}
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

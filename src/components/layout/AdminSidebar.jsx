import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "Dashboard",          path: "/admin",            exact: true,  icon: "◈" },
    { name: "Analytics",          path: "/admin/analytics",                icon: "◉" },
    { name: "Products",           path: "/admin/products",                 icon: "▦" },
    { name: "Inventory",          path: "/admin/inventory",                icon: "▤" },
    { name: "Categories",         path: "/admin/categories",               icon: "◫" },
    { name: "Orders",             path: "/admin/orders",                   icon: "◳" },
    { name: "Customers",          path: "/admin/customers",                icon: "◎" },
    { name: "Settings",           path: "/admin/settings",                 icon: "◬" },
  ];

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const handleLogout = () => { logout(); navigate("/login"); };

  const sidebarContent = (
    <div style={{
      background: "#ffffff",
      borderRight: "1px solid #E8EDF5",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      height: "100%",
      width: 220,
      padding: "20px 12px",
      userSelect: "none",
      overflowY: "auto",
      boxShadow: "2px 0 8px rgba(15, 23, 42, 0.04)",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 8px 16px", borderBottom: "1px solid #F1F5F9", marginBottom: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", display: "block" }}>
          VOLT<span style={{ color: "#2563eb" }}>.</span>
        </span>
        <span style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
          Admin workspace
        </span>
      </div>

      {menuItems.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={onClose}
            style={{
              width: "100%",
              height: 38,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 10px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              textDecoration: "none",
              color: active ? "#2563eb" : "#64748b",
              background: active ? "#EFF6FF" : "transparent",
              transition: "all 0.12s",
              letterSpacing: "-0.1px",
            }}
            onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "#F8FAFD"; e.currentTarget.style.color = "#0f172a"; } }}
            onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; } }}
          >
            <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
            {item.name}
            {active && (
              <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />
            )}
          </Link>
        );
      })}

      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
        <Link
          to="/"
          style={{ width: "100%", height: 36, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", borderRadius: 10, fontSize: 12, color: "#64748b", textDecoration: "none", marginBottom: 4 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFD"; e.currentTarget.style.color = "#0f172a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
        >
          ← Customer View
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: "#F8FAFD", marginBottom: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#4f46e5)", color: "#fff", fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {user?.name ? user.name.charAt(0) : "A"}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{user?.name || "Admin"}</p>
            <p style={{ fontSize: 10, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{user?.email || "admin@volt.com"}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{ width: "100%", height: 36, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 10px", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "#dc2626", background: "none", border: "none", cursor: "pointer", transition: "background 0.12s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
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
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="relative z-10 h-full animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

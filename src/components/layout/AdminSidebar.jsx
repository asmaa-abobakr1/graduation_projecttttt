import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MENU = [
  { name: 'Dashboard',          path: '/admin',              exact: true },
  { name: 'Analytics & reports', path: '/admin/analytics' },
  { name: 'Products',           path: '/admin/products' },
  { name: 'Inventory',          path: '/admin/inventory' },
  { name: 'Categories',         path: '/admin/categories' },
  { name: 'Orders',             path: '/admin/orders' },
  { name: 'Customers',          path: '/admin/customers' },
  { name: 'Settings',           path: '/admin/settings' },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  const handleLogout = () => { logout(); navigate('/login'); };

  const sidebar = (
    <div style={{
      background: '#0b1220', width: 232, minHeight: '100vh',
      display: 'flex', flexDirection: 'column', gap: 8,
      padding: '24px 18px', overflowY: 'auto', flexShrink: 0,
    }}>
      {/* Brand */}
      <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 0px', letterSpacing: '-0.5px' }}>
        VOLT<span style={{ color: '#2563eb' }}>•</span> ADMIN
      </p>
      <p style={{ fontSize: 11, color: '#98a2b3', margin: '0 0 12px', letterSpacing: '0.08em', textTransform: 'none' }}>
        COMMERCE WORKSPACE
      </p>

      {/* Nav items */}
      {MENU.map(item => {
        const active = isActive(item);
        return (
          <Link key={item.path} to={item.path} onClick={onClose}
            style={{
              height: 42, display: 'flex', alignItems: 'center', paddingLeft: 12, borderRadius: 10,
              textDecoration: 'none', fontSize: 13, fontWeight: active ? 400 : 500,
              color: active ? '#fff' : '#b7c1d1',
              background: active ? '#2563eb' : 'transparent',
              transition: 'background 0.15s, color 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#b7c1d1'; } }}
          >
            {item.name}
          </Link>
        );
      })}

      {/* Spacer + bottom links */}
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Link to="/" style={{ height: 38, display: 'flex', alignItems: 'center', paddingLeft: 12, borderRadius: 10, textDecoration: 'none', fontSize: 12, color: '#667085', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#667085'}>
          ← Customer store
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Admin'}</p>
            <p style={{ fontSize: 10, color: '#667085', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          </div>
        </div>

        <button onClick={handleLogout}
          style={{ height: 38, display: 'flex', alignItems: 'center', paddingLeft: 12, borderRadius: 10, background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: '#d92d20', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(217,45,32,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside style={{ display: 'none' }} className="lg-show-sidebar">
        {sidebar}
      </aside>
      {/* Desktop: always visible */}
      <aside style={{ flexShrink: 0, height: '100vh', position: 'sticky', top: 0 }} className="desktop-sidebar">
        {sidebar}
      </aside>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
          <div style={{ position: 'relative', zIndex: 10, animation: 'slideIn 0.3s ease-out' }}>
            {sidebar}
          </div>
        </div>
      )}
    </>
  );
}

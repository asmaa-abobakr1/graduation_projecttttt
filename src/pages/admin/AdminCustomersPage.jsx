import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const MOCK_CUSTOMERS = [
  { id: 'C-001', name: 'Nina Park',    email: 'nina@example.com',  joined: 'Jan 12, 2026', orders: 8,  spent: 4290,  status: 'Active' },
  { id: 'C-002', name: 'Omar Ruiz',    email: 'omar@example.com',  joined: 'Feb 3, 2026',  orders: 5,  spent: 7830,  status: 'Active' },
  { id: 'C-003', name: 'Maya Chen',    email: 'maya@example.com',  joined: 'Mar 19, 2026', orders: 12, spent: 2150,  status: 'Active' },
  { id: 'C-004', name: 'Alex Turner',  email: 'alex@example.com',  joined: 'Apr 7, 2026',  orders: 2,  spent: 1599,  status: 'Active' },
  { id: 'C-005', name: 'Sara Ali',     email: 'sara@example.com',  joined: 'May 22, 2026', orders: 6,  spent: 3210,  status: 'Inactive' },
  { id: 'C-006', name: 'James Wu',     email: 'james@example.com', joined: 'Jun 14, 2026', orders: 3,  spent: 949,   status: 'Active' },
  { id: 'C-007', name: 'Priya Sharma', email: 'priya@example.com', joined: 'Jul 1, 2026',  orders: 9,  spent: 12400, status: 'Active' },
  { id: 'C-008', name: 'Liam Scott',   email: 'liam@example.com',  joined: 'Aug 30, 2026', orders: 1,  spent: 999,   status: 'Active' },
];

export default function AdminCustomersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const filtered = MOCK_CUSTOMERS.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    if (filter !== 'All') return matchSearch && c.status === filter;
    return matchSearch;
  });

  const totalRevenue = MOCK_CUSTOMERS.reduce((a, c) => a + c.spent, 0);

  const metrics = [
    { label: 'Total customers',  value: String(MOCK_CUSTOMERS.length) },
    { label: 'Active',           value: String(MOCK_CUSTOMERS.filter(c => c.status === 'Active').length),   positive: true,  change: 'Currently active' },
    { label: 'Inactive',         value: String(MOCK_CUSTOMERS.filter(c => c.status === 'Inactive').length), positive: false, change: 'Re-engage needed' },
    { label: 'Total revenue',    value: `$${totalRevenue.toLocaleString()}`,                                positive: true,  change: 'All-time' },
    { label: 'Avg order value',  value: `$${Math.round(totalRevenue / MOCK_CUSTOMERS.reduce((a,c)=>a+c.orders,0))}`, positive: true },
  ];

  return (
    <div className="adm-page">
      {/* Top Bar */}
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Customer Management</p>
          <p className="adm-topbar-sub">{today} · Customer overview</p>
        </div>
        <div className="adm-topbar-right">
          <div className="adm-avatar">{user?.name ? user.name.charAt(0) : 'A'}</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#101828' }}>{user?.name || 'Admin'}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="adm-metrics">
        {metrics.map((m) => (
          <div key={m.label} className="adm-metric-card">
            <p className="adm-metric-label">{m.label}</p>
            <p className="adm-metric-value">{m.value}</p>
            {m.change && <p className={m.positive ? 'adm-metric-change-pos' : 'adm-metric-change-neg'}>{m.change}</p>}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="adm-controls">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" style={{ color: '#98a2b3', flexShrink: 0 }}>
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email..." />
        </div>
        {['All', 'Active', 'Inactive'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`adm-btn-secondary${filter === f ? ' active' : ''}`}>
            {f}
          </button>
        ))}
        <button className="adm-btn-primary">Export CSV</button>
      </div>

      {/* Customers Table */}
      <div className="adm-table-wrap">
        <div className="adm-table-header">
          {['ID', 'Customer', 'Joined', 'Orders', 'Total spent', 'Status', 'Actions'].map((h) => (
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>

        {filtered.map((c) => (
          <div key={c.id} className="adm-table-row">
            <p className="adm-table-td" style={{ color: '#667085', fontSize: 11 }}>{c.id}</p>
            <div className="adm-table-td" style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#101828', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
              <p style={{ fontSize: 10, color: '#98a2b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</p>
            </div>
            <p className="adm-table-td" style={{ color: '#667085', fontSize: 11 }}>{c.joined}</p>
            <p className="adm-table-td">{c.orders}</p>
            <p className="adm-table-td" style={{ fontWeight: 600 }}>${c.spent.toLocaleString()}</p>
            <div className="adm-table-td">
              <span className={`adm-badge ${c.status === 'Active' ? 'adm-badge-green' : 'adm-badge-gray'}`}>{c.status}</span>
            </div>
            <div className="adm-table-td" style={{ display: 'flex', gap: 10 }}>
              <button style={{ fontSize: 11, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
              <button style={{ fontSize: 11, color: '#667085', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="adm-empty"><p>No customers match the current filter</p></div>
        )}
      </div>
    </div>
  );
}

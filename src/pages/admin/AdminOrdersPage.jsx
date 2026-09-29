import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const MOCK_ORDERS = [
  { id: '#V-90482', customer: 'Nina Park',    email: 'nina@example.com',  date: 'Sep 28, 2026', status: 'Shipped',    total: 1299, items: 2 },
  { id: '#V-90481', customer: 'Omar Ruiz',    email: 'omar@example.com',  date: 'Sep 28, 2026', status: 'Processing', total: 2499, items: 1 },
  { id: '#V-90480', customer: 'Maya Chen',    email: 'maya@example.com',  date: 'Sep 27, 2026', status: 'Completed',  total: 349,  items: 3 },
  { id: '#V-90479', customer: 'Alex Turner',  email: 'alex@example.com',  date: 'Sep 27, 2026', status: 'Completed',  total: 799,  items: 1 },
  { id: '#V-90478', customer: 'Sara Ali',     email: 'sara@example.com',  date: 'Sep 26, 2026', status: 'Returns',    total: 1899, items: 2 },
  { id: '#V-90477', customer: 'James Wu',     email: 'james@example.com', date: 'Sep 26, 2026', status: 'Shipped',    total: 549,  items: 1 },
  { id: '#V-90476', customer: 'Priya Sharma', email: 'priya@example.com', date: 'Sep 25, 2026', status: 'Completed',  total: 3299, items: 2 },
  { id: '#V-90475', customer: 'Liam Scott',   email: 'liam@example.com',  date: 'Sep 25, 2026', status: 'Processing', total: 999,  items: 1 },
];

const STATUS_MAP = {
  Processing: 'adm-badge-yellow',
  Shipped:    'adm-badge-blue',
  Completed:  'adm-badge-green',
  Returns:    'adm-badge-red',
};

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    if (filter !== 'All') return matchSearch && o.status === filter;
    return matchSearch;
  });

  const metrics = [
    { label: 'Total orders',   value: String(MOCK_ORDERS.length) },
    { label: 'Processing',     value: String(MOCK_ORDERS.filter(o => o.status === 'Processing').length),  positive: false, change: 'Awaiting fulfillment' },
    { label: 'Shipped',        value: String(MOCK_ORDERS.filter(o => o.status === 'Shipped').length),     positive: true,  change: 'In transit' },
    { label: 'Completed',      value: String(MOCK_ORDERS.filter(o => o.status === 'Completed').length),   positive: true,  change: 'Successfully delivered' },
    { label: 'Returns',        value: String(MOCK_ORDERS.filter(o => o.status === 'Returns').length),     positive: false, change: 'Needs resolution' },
  ];

  return (
    <div className="adm-page">
      {/* Top Bar */}
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Orders Management</p>
          <p className="adm-topbar-sub">{today} · Order fulfillment</p>
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
            placeholder="Search by order ID or customer name..." />
        </div>
        {['All', 'Processing', 'Shipped', 'Completed', 'Returns'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`adm-btn-secondary${filter === f ? ' active' : ''}`}>
            {f}
          </button>
        ))}
        <button className="adm-btn-primary">Export CSV</button>
      </div>

      {/* Orders Table */}
      <div className="adm-table-wrap">
        <div className="adm-table-header">
          {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Actions'].map((h) => (
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>

        {filtered.map((o) => (
          <div key={o.id} className="adm-table-row">
            <p className="adm-table-td" style={{ fontWeight: 600, color: '#2563eb' }}>{o.id}</p>
            <div className="adm-table-td" style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#101828', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.customer}</p>
              <p style={{ fontSize: 10, color: '#98a2b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.email}</p>
            </div>
            <p className="adm-table-td" style={{ color: '#667085', fontSize: 11 }}>{o.date}</p>
            <p className="adm-table-td" style={{ color: '#667085' }}>{o.items} item{o.items !== 1 ? 's' : ''}</p>
            <p className="adm-table-td" style={{ fontWeight: 600 }}>${o.total.toLocaleString()}</p>
            <div className="adm-table-td">
              <span className={`adm-badge ${STATUS_MAP[o.status] || 'adm-badge-gray'}`}>{o.status}</span>
            </div>
            <div className="adm-table-td" style={{ display: 'flex', gap: 10 }}>
              <button style={{ fontSize: 11, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
              <button style={{ fontSize: 11, color: '#667085', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="adm-empty"><p>No orders match the current filter</p></div>
        )}
      </div>
    </div>
  );
}

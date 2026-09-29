import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminInventoryPage() {
  const { products, updateProduct } = useProducts();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const totalUnits      = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount   = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const restockNeeded   = lowStockCount + outOfStockCount;

  const metrics = [
    { label: 'Total stock',     value: `${totalUnits.toLocaleString()} units` },
    { label: 'Low stock',       value: String(lowStockCount),   change: `${lowStockCount} below 10`,      positive: lowStockCount === 0 },
    { label: 'In stock',        value: String(products.filter(p => p.stock >= 10).length), positive: true },
    { label: 'Out of stock',    value: String(outOfStockCount), change: 'Needs restock',                  positive: outOfStockCount === 0 },
    { label: 'Restock needed',  value: String(restockNeeded),   change: 'Total attention needed',         positive: restockNeeded === 0 },
  ];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Low') return matchSearch && p.stock > 0 && p.stock < 10;
    if (filter === 'Out') return matchSearch && p.stock === 0;
    return matchSearch;
  });

  return (
    <div className="adm-page">

      {/* Top Bar */}
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Inventory Control</p>
          <p className="adm-topbar-sub">{today} · Stock management</p>
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
            {m.change && (
              <p className={m.positive ? 'adm-metric-change-pos' : 'adm-metric-change-neg'}>{m.change}</p>
            )}
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
            placeholder="Search inventory by product name or brand..." />
        </div>
        {[
          { label: 'All items', key: 'All' },
          { label: 'Low stock', key: 'Low' },
          { label: 'Out of stock', key: 'Out' },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`adm-btn-secondary${filter === f.key ? ' active' : ''}`}>
            {f.label}
          </button>
        ))}
        <button className="adm-btn-primary">Export CSV</button>
      </div>

      {/* Inventory Table */}
      <div className="adm-table-wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #dde4ee' }}>
          <p style={{ fontSize: 11, color: '#667085' }}>{filtered.length} of {products.length} items</p>
          <p style={{ fontSize: 10, color: '#98a2b3' }}>Scroll right for all columns on small screens</p>
        </div>

        <div className="adm-table-header">
          {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Status', 'Threshold', 'Warehouse', 'Actions'].map((h) => (
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>

        {filtered.map((p) => {
          const stockStatus = p.stock === 0 ? 'out' : p.stock < 10 ? 'low' : 'ok';
          return (
            <div key={p.id} className="adm-table-row">
              <div className="adm-table-td" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <img src={p.image} alt="" style={{ width: 24, height: 24, borderRadius: 5, objectFit: 'cover', flexShrink: 0, border: '1px solid #dde4ee' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              </div>
              <p className="adm-table-td" style={{ color: '#667085' }}>{p.brand}</p>
              <p className="adm-table-td" style={{ color: '#667085' }}>{p.category}</p>
              <p className="adm-table-td">${p.price?.toLocaleString()}</p>
              <p className="adm-table-td" style={{ fontWeight: 600, color: stockStatus === 'out' ? '#d92d20' : stockStatus === 'low' ? '#d97706' : '#078a55' }}>
                {p.stock} units
              </p>
              <div className="adm-table-td">
                <span className={`adm-badge ${
                  stockStatus === 'out' ? 'adm-badge-red' : stockStatus === 'low' ? 'adm-badge-yellow' : 'adm-badge-green'
                }`}>
                  {stockStatus === 'out' ? 'Out of stock' : stockStatus === 'low' ? 'Low stock' : 'In stock'}
                </span>
              </div>
              <p className="adm-table-td" style={{ color: '#667085' }}>10 units</p>
              <p className="adm-table-td" style={{ color: '#667085' }}>WH-Main</p>
              <div className="adm-table-td">
                <button onClick={() => {
                  const val = prompt('New stock quantity:', String(p.stock));
                  if (val !== null && !isNaN(parseInt(val))) updateProduct(p.id, { stock: parseInt(val) });
                }} style={{ fontSize: 11, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>Adjust</button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="adm-empty"><p>No inventory items match the current filter</p></div>
        )}
      </div>

    </div>
  );
}

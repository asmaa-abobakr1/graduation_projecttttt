import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { categories as initCategories } from '../../data/categories';

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [search, setSearch]         = useState('');
  const [cats, setCats]             = useState(initCategories || [
    { id: 1, name: 'Phones',      slug: 'phones',      products: 6, status: 'Active' },
    { id: 2, name: 'Laptops',     slug: 'laptops',     products: 5, status: 'Active' },
    { id: 3, name: 'Audio',       slug: 'audio',       products: 4, status: 'Active' },
    { id: 4, name: 'Tablets',     slug: 'tablets',     products: 3, status: 'Active' },
    { id: 5, name: 'Gaming',      slug: 'gaming',      products: 2, status: 'Active' },
    { id: 6, name: 'Wearables',   slug: 'wearables',   products: 3, status: 'Active' },
    { id: 7, name: 'Accessories', slug: 'accessories', products: 8, status: 'Active' },
  ]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm]             = useState({ name: '', description: '', slug: '', image: '', visibility: 'Active' });
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const filtered = cats.filter((c) =>
    (c.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name) return;
    setCats([...cats, { id: Date.now(), name: form.name, slug: form.slug || form.name.toLowerCase(), products: 0, status: form.visibility }]);
    setForm({ name: '', description: '', slug: '', image: '', visibility: 'Active' });
    setShowDrawer(false);
  };

  const metrics = [
    { label: 'Total categories',   value: String(cats.length) },
    { label: 'Active categories',  value: String(cats.filter(c => c.status === 'Active').length) },
    { label: 'Avg products / cat', value: String(Math.round(cats.reduce((a, c) => a + (c.products || 0), 0) / cats.length)) },
    { label: 'Empty categories',   value: String(cats.filter(c => (c.products || 0) === 0).length), change: 'Need products', positive: false },
  ];

  return (
    <div className="adm-page">

      {/* Top Bar */}
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Category Management</p>
          <p className="adm-topbar-sub">{today}</p>
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
            placeholder="Search categories by name..." />
        </div>
        <button onClick={() => setShowDrawer(!showDrawer)} className="adm-btn-primary">
          + Add category
        </button>
      </div>

      {/* Workspace: List + Drawer */}
      <div className="adm-two-col" style={{ alignItems: 'flex-start' }}>
        {/* Category Table */}
        <div className="adm-two-col-main" style={{ minWidth: 0 }}>
          <div className="adm-table-wrap">
            <div className="adm-table-header">
              {['Category name', 'Slug', 'Products', 'Status', 'Actions'].map((h) => (
                <p key={h} className="adm-table-th">{h}</p>
              ))}
            </div>

            {filtered.map((cat) => (
              <div key={cat.id} className="adm-table-row">
                <p className="adm-table-td" style={{ fontWeight: 500 }}>{cat.name}</p>
                <p className="adm-table-td" style={{ color: '#667085' }}>{cat.slug || cat.name?.toLowerCase()}</p>
                <p className="adm-table-td">{cat.products || 0} products</p>
                <div className="adm-table-td">
                  <span className={`adm-badge ${cat.status === 'Active' ? 'adm-badge-green' : 'adm-badge-gray'}`}>
                    {cat.status || 'Active'}
                  </span>
                </div>
                <div className="adm-table-td" style={{ display: 'flex', gap: 10 }}>
                  <button style={{ fontSize: 11, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => setCats(cats.filter(c => c.id !== cat.id))}
                    style={{ fontSize: 11, color: '#d92d20', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="adm-empty"><p>No categories found</p></div>
            )}
          </div>
        </div>

        {/* Add Category Drawer */}
        {showDrawer && (
          <div className="adm-two-col-side">
            <div className="adm-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p className="adm-card-title">Add category</p>
                <button onClick={() => setShowDrawer(false)}
                  className="adm-badge adm-badge-gray" style={{ cursor: 'pointer' }}>Cancel</button>
              </div>

              <div className="adm-field">
                <label className="adm-label">Category name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Smart Speakers" className="adm-input" />
              </div>

              <div className="adm-field">
                <label className="adm-label">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short category description..." rows={3} className="adm-textarea" />
              </div>

              <div className="adm-field">
                <label className="adm-label">URL slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. smart-speakers" className="adm-input" />
                <p style={{ fontSize: 10, color: '#667085' }}>Auto-generated if left empty.</p>
              </div>

              <div className="adm-field">
                <label className="adm-label">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..." className="adm-input" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, color: '#667085' }}>Visibility</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Active', 'Hidden'].map((v) => (
                    <button key={v} onClick={() => setForm({ ...form, visibility: v })}
                      className={`adm-badge ${form.visibility === v ? 'adm-badge-blue' : 'adm-badge-gray'}`}
                      style={{ cursor: 'pointer', padding: '4px 10px' }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowDrawer(false)} className="adm-btn-secondary">Cancel</button>
                <button onClick={handleAdd} className="adm-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Save category
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

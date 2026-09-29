import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user } = useAuth();
  const [search, setSearch]           = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [mode, setMode]               = useState('list');
  const [form, setForm]               = useState({ name: '', brand: '', price: '', category: '', stock: '', description: '' });
  const [status, setStatus]           = useState('Draft');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({ name: '', brand: '', price: '', category: '', stock: '', description: '' });
    setEditingProduct(null);
    setMode('add');
  };

  const openEdit = (p) => {
    setForm({ name: p.name, brand: p.brand || '', price: String(p.price), category: p.category, stock: String(p.stock), description: p.description || '' });
    setEditingProduct(p);
    setMode('add');
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 };
    if (editingProduct) { updateProduct(editingProduct.id, data); }
    else { addProduct(data); }
    setMode('list');
  };

  const handleDelete = (id) => {
    if (confirm('Delete this product?')) deleteProduct(id);
  };

  return (
    <div className="adm-page">

      {/* Top Bar */}
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">
            {mode === 'add' ? (editingProduct ? 'Edit Product' : 'Add New Product') : 'Product Management'}
          </p>
          <p className="adm-topbar-sub">{today}</p>
        </div>
        <div className="adm-topbar-right">
          <div className="adm-avatar">{user?.name ? user.name.charAt(0) : 'A'}</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#101828' }}>{user?.name || 'Admin'}</p>
        </div>
      </div>

      {mode === 'add' ? (
        /* ── Product Editor ── */
        <div className="adm-two-col">
          {/* Main Fields */}
          <div className="adm-two-col-main">
            <div className="adm-card">
              {/* Mode toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="adm-badge adm-badge-blue" style={{ cursor: 'pointer' }}>Single product</span>
                  <span className="adm-badge adm-badge-gray" style={{ cursor: 'pointer' }}>Bulk import</span>
                </div>
                <p style={{ fontSize: 11, color: '#667085' }}>Auto-saved</p>
              </div>

              {/* Product Information */}
              <div className="adm-card" style={{ gap: '0.75rem' }}>
                <p className="adm-card-title">Product information</p>
                <div className="adm-field">
                  <label className="adm-label">Product name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Aether Phone Pro" className="adm-input" />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="adm-label">Brand</label>
                    <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      placeholder="e.g. Aether" className="adm-input" />
                  </div>
                  <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="adm-label">Category</label>
                    <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g. Phones" className="adm-input" />
                  </div>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Product description..." rows={3} className="adm-textarea" />
                  <p style={{ fontSize: 10, color: '#667085' }}>Used in search and product page.</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="adm-card" style={{ gap: '0.75rem' }}>
                <p className="adm-card-title">Pricing and inventory</p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="adm-field" style={{ flex: 1, minWidth: 100 }}>
                    <label className="adm-label">Price</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0.00" className="adm-input" />
                  </div>
                  <div className="adm-field" style={{ flex: 1, minWidth: 100 }}>
                    <label className="adm-label">Compare at price</label>
                    <input type="number" placeholder="0.00" className="adm-input" />
                  </div>
                  <div className="adm-field" style={{ flex: 1, minWidth: 80 }}>
                    <label className="adm-label">SKU</label>
                    <input placeholder="AUTO" className="adm-input" />
                  </div>
                </div>
              </div>

              {/* Tech Specs */}
              <div className="adm-card" style={{ gap: '0.75rem' }}>
                <p className="adm-card-title">Technical specifications</p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="adm-label">Processor</label>
                    <input placeholder="e.g. A20 Pro chip" className="adm-input" />
                  </div>
                  <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="adm-label">Display size</label>
                    <input placeholder="e.g. 6.7-inch" className="adm-input" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="adm-label">Stock</label>
                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      placeholder="0" className="adm-input" />
                  </div>
                  <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="adm-label">Weight</label>
                    <input placeholder="e.g. 227g" className="adm-input" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Settings Panel */}
          <div className="adm-two-col-side">
            {/* Status */}
            <div className="adm-card">
              <p className="adm-card-title">Status</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Draft', 'Published'].map((s) => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`adm-badge ${status === s ? 'adm-badge-blue' : 'adm-badge-gray'}`}
                    style={{ cursor: 'pointer', padding: '4px 12px', fontSize: 11 }}>
                    {s}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 10, color: '#667085' }}>Published products appear in the storefront immediately.</p>
            </div>

            {/* Product Media */}
            <div className="adm-card">
              <p className="adm-card-title">Product media</p>
              <div style={{ background: '#f4f7fb', borderRadius: 12, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12, color: '#98a2b3' }}>Primary image</span>
              </div>
              <div style={{ background: '#f4f7fb', borderRadius: 10, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: 12, color: '#667085' }}>Drag images or click to upload</p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setMode('list')} className="adm-btn-secondary">Cancel</button>
              <button onClick={handleSave} className="adm-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {editingProduct ? 'Save changes' : 'Publish product'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Product List ── */
        <>
          <div className="adm-controls">
            <div className="adm-search">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" style={{ color: '#98a2b3', flexShrink: 0 }}>
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name or brand..." />
            </div>
            <button onClick={openAdd} className="adm-btn-primary">+ Add product</button>
          </div>

          <div className="adm-table-wrap">
            <div className="adm-table-header">
              {['Product name', 'Brand', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                <p key={h} className="adm-table-th">{h}</p>
              ))}
            </div>

            {filtered.map((p) => (
              <div key={p.id} className="adm-table-row">
                <div className="adm-table-td" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={p.image} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0, border: '1px solid #dde4ee' }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                </div>
                <p className="adm-table-td" style={{ color: '#667085' }}>{p.brand}</p>
                <p className="adm-table-td" style={{ color: '#667085' }}>{p.category}</p>
                <p className="adm-table-td" style={{ fontWeight: 600 }}>${p.price?.toLocaleString()}</p>
                <p className="adm-table-td" style={{ fontWeight: 600, color: p.stock < 10 ? '#d92d20' : '#078a55' }}>
                  {p.stock} units
                </p>
                <div className="adm-table-td" style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => openEdit(p)} style={{ fontSize: 11, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ fontSize: 11, color: '#d92d20', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="adm-empty"><p>No products found</p></div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

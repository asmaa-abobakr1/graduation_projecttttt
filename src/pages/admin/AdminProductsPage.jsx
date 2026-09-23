import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [mode, setMode] = useState('list'); // 'list' | 'add'
  const [form, setForm] = useState({ name: '', brand: '', price: '', category: '', stock: '', description: '' });
  const [status, setStatus] = useState('Draft');
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
    <div className="flex flex-col gap-6 items-start p-8 w-full">

      {/* Top Bar */}
      <div className="bg-white flex items-center justify-between h-[72px] px-8 rounded-[16px] w-full border border-[#dde4ee]">
        <div className="flex flex-col gap-[3px]">
          <p className="text-[20px] font-bold text-[#101828]">
            {mode === 'add' ? (editingProduct ? 'Edit Product' : 'Add New Product') : 'Product Management'}
          </p>
          <p className="text-[12px] text-[#667085]">{today}</p>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="w-[34px] h-[34px] rounded-full bg-[#2563eb] text-white font-bold flex items-center justify-center text-sm">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <p className="text-[13px] font-semibold text-[#101828]">{user?.name || 'Admin'}</p>
        </div>
      </div>

      {mode === 'add' ? (
        /* ── Product Editor ── */
        <div className="flex gap-5 items-start w-full">
          {/* Main Fields */}
          <div className="bg-white border border-[#dde4ee] flex flex-col gap-5 items-start p-5 rounded-[16px] flex-1 min-w-0">
            {/* Mode Controls */}
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2">
                <span className="bg-[#e8f0ff] text-[#2563eb] text-[11px] px-[9px] py-[5px] rounded-full cursor-pointer">Single product</span>
                <span className="bg-[#eef3f9] text-[#667085] text-[11px] px-[9px] py-[5px] rounded-full cursor-pointer">Bulk import</span>
              </div>
              <p className="text-[11px] text-[#667085]">Auto-saved</p>
            </div>

            {/* Product Information */}
            <div className="flex flex-col gap-4 w-full border border-[#dde4ee] rounded-[16px] p-5">
              <p className="text-[17px] font-semibold text-[#101828]">Product information</p>
              <div className="flex flex-col gap-[7px]">
                <label className="text-[12px] text-[#101828]">Product name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Aether Phone Pro"
                  className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-[7px] flex-1">
                  <label className="text-[12px] text-[#101828]">Brand</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="e.g. Aether"
                    className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                </div>
                <div className="flex flex-col gap-[7px] flex-1">
                  <label className="text-[12px] text-[#101828]">Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Phones"
                    className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                </div>
              </div>
              <div className="flex flex-col gap-[7px]">
                <label className="text-[12px] text-[#101828]">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description..."
                  rows={4}
                  className="border border-[#dde4ee] rounded-[10px] px-[13px] py-3 text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white resize-none" />
                <p className="text-[11px] text-[#667085]">Describe the product clearly. Used in search and product page.</p>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="flex flex-col gap-4 w-full border border-[#dde4ee] rounded-[16px] p-5">
              <p className="text-[17px] font-semibold text-[#101828]">Pricing and inventory</p>
              <div className="flex gap-4">
                <div className="flex flex-col gap-[7px] flex-1">
                  <label className="text-[12px] text-[#101828]">Price</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                </div>
                <div className="flex flex-col gap-[7px] flex-1">
                  <label className="text-[12px] text-[#101828]">Compare at price</label>
                  <input type="number" placeholder="0.00"
                    className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                </div>
                <div className="flex flex-col gap-[7px] flex-1">
                  <label className="text-[12px] text-[#101828]">SKU</label>
                  <input placeholder="AUTO"
                    className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                </div>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="flex flex-col gap-4 w-full border border-[#dde4ee] rounded-[16px] p-5">
              <p className="text-[17px] font-semibold text-[#101828]">Technical specifications</p>
              <div className="flex gap-4">
                <div className="flex flex-col gap-[7px] flex-1">
                  <label className="text-[12px] text-[#101828]">Processor</label>
                  <input placeholder="e.g. A20 Pro chip"
                    className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                </div>
                <div className="flex flex-col gap-[7px] flex-1">
                  <label className="text-[12px] text-[#101828]">Display size</label>
                  <input placeholder="e.g. 6.7-inch"
                    className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-[7px] flex-1">
                  <label className="text-[12px] text-[#101828]">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                    className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                </div>
                <div className="flex flex-col gap-[7px] flex-1">
                  <label className="text-[12px] text-[#101828]">Weight</label>
                  <input placeholder="e.g. 227g"
                    className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Settings Panel */}
          <div className="flex flex-col gap-4 items-start w-[360px] shrink-0">
            {/* Publish Status */}
            <div className="bg-white border border-[#dde4ee] flex flex-col gap-4 items-start p-5 rounded-[16px] w-full">
              <p className="text-[17px] font-semibold text-[#101828]">Status</p>
              <div className="flex gap-2">
                {['Draft', 'Published'].map((s) => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`text-[11px] px-[9px] py-[5px] rounded-full transition-all ${
                      status === s ? 'bg-[#e8f0ff] text-[#2563eb]' : 'bg-[#eef3f9] text-[#667085]'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#667085]">Published products appear in the storefront immediately.</p>
            </div>

            {/* Product Media */}
            <div className="bg-white border border-[#dde4ee] flex flex-col gap-4 items-start p-5 rounded-[16px] w-full">
              <p className="text-[17px] font-semibold text-[#101828]">Product media</p>
              <div className="bg-[#f4f7fb] w-full rounded-[16px] overflow-hidden" style={{ height: '190px' }}>
                <div className="w-full h-full flex items-center justify-center text-[#98a2b3] text-[13px]">
                  Primary image
                </div>
              </div>
              <div className="bg-[#f4f7fb] w-full rounded-[10px] flex items-center justify-center" style={{ height: '80px' }}>
                <p className="text-[12px] text-[#667085]">Drag images or click to upload</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-center w-full">
              <button onClick={() => setMode('list')}
                className="h-[44px] px-[18px] bg-white border border-[#dde4ee] text-[#101828] text-[14px] rounded-[10px] hover:bg-[#f4f7fb] transition-colors">
                Cancel
              </button>
              <button onClick={handleSave}
                className="flex-1 h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors">
                {editingProduct ? 'Save changes' : 'Publish product'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Product List ── */
        <>
          {/* Controls */}
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 bg-white border border-[#dde4ee] rounded-[10px] h-[42px] flex items-center px-4 gap-2">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-[#98a2b3]">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name or brand..."
                className="bg-transparent flex-1 text-[13px] text-[#101828] placeholder-[#98a2b3] outline-none" />
            </div>
            <button onClick={openAdd}
              className="h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] px-[18px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors whitespace-nowrap">
              + Add product
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#dde4ee] flex flex-col items-start rounded-[16px] w-full overflow-hidden">
            {/* Header */}
            <div className="bg-[#eef3f9] border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[38px] px-5">
              {['Product name', 'Brand', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                <p key={h} className="flex-1 text-[11px] font-bold text-[#667085] uppercase">{h}</p>
              ))}
            </div>

            {filtered.map((p) => (
              <div key={p.id} className="border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[52px] px-5 hover:bg-[#fafbfc] transition-colors">
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <img src={p.image} alt="" className="w-8 h-8 rounded-[6px] object-cover shrink-0 border border-[#dde4ee]" />
                  <p className="text-[12px] text-[#101828] truncate">{p.name}</p>
                </div>
                <p className="flex-1 text-[12px] text-[#667085] truncate">{p.brand}</p>
                <p className="flex-1 text-[12px] text-[#667085] truncate">{p.category}</p>
                <p className="flex-1 text-[12px] text-[#101828] font-semibold">${p.price?.toLocaleString()}</p>
                <p className={`flex-1 text-[12px] font-semibold ${p.stock < 10 ? 'text-[#d92d20]' : 'text-[#078a55]'}`}>
                  {p.stock} units
                </p>
                <div className="flex-1 flex gap-2">
                  <button onClick={() => openEdit(p)}
                    className="text-[11px] text-[#2563eb] hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)}
                    className="text-[11px] text-[#d92d20] hover:underline">Delete</button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="flex items-center justify-center w-full py-12">
                <p className="text-[13px] text-[#667085]">No products found</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

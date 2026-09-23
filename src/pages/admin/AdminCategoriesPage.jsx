import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { categories as initCategories } from '../../data/categories';

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [cats, setCats] = useState(initCategories || [
    { id: 1, name: 'Phones', slug: 'phones', products: 6, status: 'Active' },
    { id: 2, name: 'Laptops', slug: 'laptops', products: 5, status: 'Active' },
    { id: 3, name: 'Audio', slug: 'audio', products: 4, status: 'Active' },
    { id: 4, name: 'Tablets', slug: 'tablets', products: 3, status: 'Active' },
    { id: 5, name: 'Gaming', slug: 'gaming', products: 2, status: 'Active' },
    { id: 6, name: 'Wearables', slug: 'wearables', products: 3, status: 'Active' },
    { id: 7, name: 'Accessories', slug: 'accessories', products: 8, status: 'Active' },
  ]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', slug: '', image: '', visibility: 'Active' });
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
    { label: 'Total categories', value: String(cats.length) },
    { label: 'Active categories', value: String(cats.filter(c => c.status === 'Active').length) },
    { label: 'Avg products/cat', value: String(Math.round(cats.reduce((a, c) => a + (c.products || 0), 0) / cats.length)) },
    { label: 'Empty categories', value: String(cats.filter(c => (c.products || 0) === 0).length), change: 'Need products', positive: false },
  ];

  return (
    <div className="flex flex-col gap-6 items-start p-8 w-full">

      {/* Top Bar */}
      <div className="bg-white flex items-center justify-between h-[72px] px-8 rounded-[16px] w-full border border-[#dde4ee]">
        <div className="flex flex-col gap-[3px]">
          <p className="text-[20px] font-bold text-[#101828]">Category Management</p>
          <p className="text-[12px] text-[#667085]">{today}</p>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="w-[34px] h-[34px] rounded-full bg-[#2563eb] text-white font-bold flex items-center justify-center text-sm">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <p className="text-[13px] font-semibold text-[#101828]">{user?.name || 'Admin'}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex gap-4 items-start w-full">
        {metrics.map((m) => (
          <div key={m.label}
            className="bg-white border border-[#dde4ee] flex-1 flex flex-col gap-[10px] items-start p-[18px] rounded-[16px] shadow-[0px_8px_24px_0px_rgba(16,24,40,0.07)] min-w-0">
            <p className="text-[12px] text-[#667085]">{m.label}</p>
            <p className="text-[26px] text-[#101828]">{m.value}</p>
            {m.change && <p className={`text-[11px] ${m.positive ? 'text-[#078a55]' : 'text-[#d92d20]'}`}>{m.change}</p>}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 bg-white border border-[#dde4ee] rounded-[10px] h-[42px] flex items-center px-4 gap-2">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-[#98a2b3]">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name..."
            className="bg-transparent flex-1 text-[13px] text-[#101828] placeholder-[#98a2b3] outline-none" />
        </div>
        <button onClick={() => setShowDrawer(!showDrawer)}
          className="h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] px-[18px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors whitespace-nowrap">
          + Add category
        </button>
      </div>

      {/* Workspace: List + Drawer */}
      <div className="flex gap-5 items-start w-full">
        {/* Category Table */}
        <div className="bg-white border border-[#dde4ee] flex flex-col items-start rounded-[16px] overflow-hidden" style={{ flex: showDrawer ? '0 0 auto' : '1', width: showDrawer ? '744px' : '100%' }}>
          {/* Header */}
          <div className="bg-[#eef3f9] border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[38px] px-5">
            {['Category name', 'Slug', 'Products', 'Status', 'Actions'].map((h) => (
              <p key={h} className="flex-1 text-[11px] font-bold text-[#667085] uppercase">{h}</p>
            ))}
          </div>

          {filtered.map((cat) => (
            <div key={cat.id} className="border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[52px] px-5 hover:bg-[#fafbfc] transition-colors">
              <p className="flex-1 text-[12px] text-[#101828] font-medium">{cat.name}</p>
              <p className="flex-1 text-[12px] text-[#667085]">{cat.slug || cat.name?.toLowerCase()}</p>
              <p className="flex-1 text-[12px] text-[#101828]">{cat.products || 0} products</p>
              <div className="flex-1">
                <span className={`text-[11px] px-[9px] py-[5px] rounded-full ${
                  cat.status === 'Active' ? 'bg-[#e8f8f1] text-[#078a55]' : 'bg-[#eef3f9] text-[#667085]'
                }`}>
                  {cat.status || 'Active'}
                </span>
              </div>
              <div className="flex-1 flex gap-2">
                <button className="text-[11px] text-[#2563eb] hover:underline">Edit</button>
                <button onClick={() => setCats(cats.filter(c => c.id !== cat.id))}
                  className="text-[11px] text-[#d92d20] hover:underline">Delete</button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex items-center justify-center w-full py-12">
              <p className="text-[13px] text-[#667085]">No categories found</p>
            </div>
          )}
        </div>

        {/* Add Category Drawer */}
        {showDrawer && (
          <div className="bg-white border border-[#dde4ee] flex flex-col gap-5 items-start p-5 rounded-[16px] w-[380px] shrink-0">
            <div className="flex items-center justify-between w-full">
              <p className="text-[19px] font-semibold text-[#101828]">Add category</p>
              <button onClick={() => setShowDrawer(false)}
                className="bg-[#eef3f9] text-[#667085] text-[11px] px-[9px] py-[5px] rounded-full hover:bg-[#dde4ee] transition-colors">
                Cancel
              </button>
            </div>

            <div className="flex flex-col gap-[7px] w-full">
              <label className="text-[12px] text-[#101828]">Category name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Smart Speakers"
                className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
            </div>

            <div className="flex flex-col gap-[7px] w-full">
              <label className="text-[12px] text-[#101828]">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short category description..."
                rows={4}
                className="border border-[#dde4ee] rounded-[10px] px-[13px] py-3 text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white resize-none" />
            </div>

            <div className="flex flex-col gap-[7px] w-full">
              <label className="text-[12px] text-[#101828]">URL slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. smart-speakers"
                className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
              <p className="text-[11px] text-[#667085]">Used in the storefront URL. Auto-generated if left empty.</p>
            </div>

            <div className="flex flex-col gap-[7px] w-full">
              <label className="text-[12px] text-[#101828]">Image URL</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
            </div>

            <div className="flex items-center justify-between w-full">
              <p className="text-[12px] text-[#667085]">Visibility</p>
              <div className="flex gap-2">
                {['Active', 'Hidden'].map((v) => (
                  <button key={v} onClick={() => setForm({ ...form, visibility: v })}
                    className={`text-[11px] px-[9px] py-[5px] rounded-full transition-all ${
                      form.visibility === v ? 'bg-[#e8f0ff] text-[#2563eb]' : 'bg-[#eef3f9] text-[#667085]'
                    }`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 items-center w-full">
              <button onClick={() => setShowDrawer(false)}
                className="h-[44px] px-[18px] bg-white border border-[#dde4ee] text-[#101828] text-[14px] rounded-[10px] hover:bg-[#f4f7fb] transition-colors">
                Cancel
              </button>
              <button onClick={handleAdd}
                className="flex-1 h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors">
                Save category
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

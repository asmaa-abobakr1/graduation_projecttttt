import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import { categoriesAPI } from "../../services/api";

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [cats, setCats] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", slug: "", image: "", visibility: "Active" });
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  useEffect(() => {
    categoriesAPI.getAll()
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setCats(res.data);
        }
      })
      .catch((err) => console.warn("Categories API notice:", err.message));
  }, []);

  const filtered = cats.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingCat(null);
    setForm({ name: "", description: "", slug: "", image: "", visibility: "Active" });
    setShowDrawer(true);
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setForm({
      name: cat.name || "",
      description: cat.description || "",
      slug: cat.slug || cat.name?.toLowerCase() || "",
      image: cat.image || "",
      visibility: cat.status || "Active",
    });
    setShowDrawer(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    try {
      if (editingCat) {
        const catId = editingCat._id || editingCat.id;
        const res = await categoriesAPI.update(catId, {
          name: form.name,
          description: form.description,
          slug: form.slug || form.name.toLowerCase(),
          image: form.image,
          status: form.visibility,
        });
        setCats((prev) =>
          prev.map((c) => ((c._id || c.id) === catId ? (res.data || { ...c, ...form, status: form.visibility }) : c))
        );
      } else {
        const res = await categoriesAPI.create({
          name: form.name,
          description: form.description,
          slug: form.slug || form.name.toLowerCase(),
          image: form.image,
          status: form.visibility,
        });
        setCats((prev) => [res.data || { id: Date.now(), ...form, products: 0, status: form.visibility }, ...prev]);
      }
    } catch (err) {
      console.warn("Categories API save error, using local fallback:", err.message);
      if (editingCat) {
        const catId = editingCat._id || editingCat.id;
        setCats((prev) =>
          prev.map((c) =>
            (c._id || c.id) === catId
              ? { ...c, name: form.name, description: form.description, slug: form.slug || form.name.toLowerCase(), image: form.image, status: form.visibility }
              : c
          )
        );
      } else {
        setCats((prev) => [
          ...prev,
          {
            id: Date.now(),
            name: form.name,
            slug: form.slug || form.name.toLowerCase(),
            products: 0,
            status: form.visibility,
            description: form.description,
            image: form.image,
          },
        ]);
      }
    }
    setForm({ name: "", description: "", slug: "", image: "", visibility: "Active" });
    setEditingCat(null);
    setShowDrawer(false);
  };

  const handleDelete = async (cat) => {
    const catId = cat._id || cat.id;
    if (window.confirm(`Delete category "${cat.name}"?`)) {
      try {
        await categoriesAPI.delete(catId);
      } catch (err) {
        console.warn("Categories API delete error:", err.message);
      }
      setCats((prev) => prev.filter((c) => (c._id || c.id) !== catId));
    }
  };

  const totalProducts = cats.reduce((a, c) => a + (c.products || 0), 0);
  const avgProducts = cats.length > 0 ? Math.round(totalProducts / cats.length) : 0;

  const metrics = [
    { label: "Total categories", value: String(cats.length) },
    { label: "Active categories", value: String(cats.filter((c) => c.status === "Active").length) },
    { label: "Avg products / cat", value: String(avgProducts) },
    { label: "Empty categories", value: String(cats.filter((c) => (c.products || 0) === 0).length), change: "Need products", positive: false },
  ];

  return (
    <div className="adm-page">
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Category Management</p>
          <p className="adm-topbar-sub">{today}</p>
        </div>
        <div className="adm-topbar-right">
          <div className="adm-avatar">{user?.name ? user.name.charAt(0) : "A"}</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{user?.name || "Admin"}</p>
        </div>
      </div>

      <div className="adm-metrics">
        {metrics.map((m) => (
          <div key={m.label} className="adm-metric-card">
            <p className="adm-metric-label">{m.label}</p>
            <p className="adm-metric-value">{m.value}</p>
            {m.change && <p className={m.positive ? "adm-metric-change-pos" : "adm-metric-change-neg"}>{m.change}</p>}
          </div>
        ))}
      </div>

      <div className="adm-controls">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" style={{ color: "#94a3b8", flexShrink: 0 }}>
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories by name..." />
        </div>
        <button onClick={openAdd} className="adm-btn-primary">+ Add category</button>
      </div>

      <div className="adm-two-col" style={{ alignItems: "flex-start" }}>
        <div className="adm-two-col-main" style={{ minWidth: 0 }}>
          <div className="adm-table-wrap">
            <div className="adm-table-header">
              {["Category name", "Slug", "Products", "Status", "Actions"].map((h) => (
                <p key={h} className="adm-table-th">{h}</p>
              ))}
            </div>

            {filtered.map((cat) => (
              <div key={cat._id || cat.id || cat.name} className="adm-table-row">
                <p className="adm-table-td" style={{ fontWeight: 600 }}>{cat.name}</p>
                <p className="adm-table-td" style={{ color: "#94a3b8" }}>{cat.slug || cat.name?.toLowerCase()}</p>
                <p className="adm-table-td">{cat.products || 0} products</p>
                <div className="adm-table-td">
                  <span className={`adm-badge ${cat.status === "Active" ? "adm-badge-green" : "adm-badge-gray"}`}>
                    {cat.status || "Active"}
                  </span>
                </div>
                <div className="adm-table-td" style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => openEdit(cat)} className="adm-action-edit">Edit</button>
                  <button onClick={() => handleDelete(cat)} className="adm-action-delete">Delete</button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="adm-empty"><p>No categories found</p></div>
            )}
          </div>
        </div>

        {showDrawer && (
          <div className="adm-two-col-side">
            <div className="adm-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p className="adm-card-title">{editingCat ? "Edit category" : "Add category"}</p>
                <button onClick={() => { setShowDrawer(false); setEditingCat(null); }}
                  className="adm-badge adm-badge-gray" style={{ cursor: "pointer" }}>
                  Close
                </button>
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
                <label className="adm-label">URL Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. smart-speakers" className="adm-input" />
                <p style={{ fontSize: 10, color: "#94a3b8" }}>Auto-generated if left empty.</p>
              </div>

              <div className="adm-field">
                <label className="adm-label">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..." className="adm-input" />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: 11, color: "#475569", fontWeight: 600 }}>Visibility</p>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Active", "Hidden"].map((v) => (
                    <button key={v} onClick={() => setForm({ ...form, visibility: v })}
                      className={`adm-badge ${form.visibility === v ? "adm-badge-blue" : "adm-badge-gray"}`}
                      style={{ cursor: "pointer", padding: "4px 12px" }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setShowDrawer(false); setEditingCat(null); }} className="adm-btn-secondary">Cancel</button>
                <button onClick={handleSave} className="adm-btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                  {editingCat ? "Save changes" : "Save category"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

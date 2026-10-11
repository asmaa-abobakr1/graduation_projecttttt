import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { exportToCSV } from "../../utils/exportUtils";

const PRESET_IMAGES = [
  { label: "Laptop", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop" },
  { label: "Phone", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop" },
  { label: "Headphones", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop" },
  { label: "Tablet", url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop" },
  { label: "Watch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop" },
];

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user } = useAuth();
  const [search, setSearch]         = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [mode, setMode]             = useState("list");
  const [form, setForm]             = useState({ name: "", brand: "", price: "", category: "Phones", stock: "", description: "", image: "" });
  const [status, setStatus]         = useState("Published");
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({
      name: "",
      brand: "",
      price: "",
      category: "Phones",
      stock: "15",
      description: "",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
    });
    setEditingProduct(null);
    setStatus("Published");
    setMode("add");
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      brand: p.brand || "",
      price: String(p.price),
      category: p.category || "Phones",
      stock: String(p.stock),
      description: p.description || "",
      image: p.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
    });
    setStatus(p.status || "Published");
    setEditingProduct(p);
    setMode("add");
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      alert("Please provide at least a product name and price.");
      return;
    }
    const data = {
      ...form,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      image: form.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
      status,
    };
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setMode("list");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const handleExportCSV = () => {
    exportToCSV("products_catalog", filtered, [
      { key: "id", label: "Product ID" },
      { key: "name", label: "Product Name" },
      { key: "brand", label: "Brand" },
      { key: "category", label: "Category" },
      { key: "price", label: "Price ($)" },
      { key: "stock", label: "Stock Units" },
      { key: "rating", label: "Rating" },
    ]);
  };

  return (
    <div className="adm-page">
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">
            {mode === "add" ? (editingProduct ? "Edit Product" : "Add New Product") : "Product Catalog Management"}
          </p>
          <p className="adm-topbar-sub">{today} · {products.length} active devices</p>
        </div>
        <div className="adm-topbar-right">
          <div className="adm-avatar">{user?.name ? user.name.charAt(0) : "A"}</div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{user?.name || "Admin"}</p>
        </div>
      </div>

      {mode === "add" ? (
        <div className="adm-two-col">
          {/* Main Fields */}
          <div className="adm-two-col-main">
            <div className="adm-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <span className="adm-badge adm-badge-blue">Product Specs</span>
                  <span className="adm-badge adm-badge-gray">Storefront sync active</span>
                </div>
                <p style={{ fontSize: 11, color: "#94a3b8" }}>ID: {editingProduct ? editingProduct.id : "Auto"}</p>
              </div>

              <div className="adm-card" style={{ gap: "0.875rem" }}>
                <p className="adm-card-title">Product information</p>
                <div className="adm-field">
                  <label className="adm-label">Product name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. MacBook Pro 16 M3 Max"
                    className="adm-input"
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="adm-label">Brand</label>
                    <input
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      placeholder="e.g. Apple, Samsung, Sony"
                      className="adm-input"
                    />
                  </div>
                  <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="adm-label">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="adm-input"
                      style={{ cursor: "pointer" }}
                    >
                      {["Phones", "Laptops", "Audio", "Tablets", "Gaming", "Wearables"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Enter device highlights, build quality, screen specs, battery life..."
                    rows={3}
                    className="adm-textarea"
                  />
                </div>
              </div>

              <div className="adm-card" style={{ gap: "0.875rem" }}>
                <p className="adm-card-title">Pricing and inventory</p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <div className="adm-field" style={{ flex: 1, minWidth: 120 }}>
                    <label className="adm-label">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0.00"
                      className="adm-input"
                      required
                    />
                  </div>
                  <div className="adm-field" style={{ flex: 1, minWidth: 120 }}>
                    <label className="adm-label">Stock Units</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      placeholder="10"
                      className="adm-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Settings Panel */}
          <div className="adm-two-col-side">
            <div className="adm-card">
              <p className="adm-card-title">Visibility & Status</p>
              <div style={{ display: "flex", gap: 6 }}>
                {["Draft", "Published"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`adm-badge ${status === s ? "adm-badge-blue" : "adm-badge-gray"}`}
                    style={{ cursor: "pointer", padding: "6px 14px", fontSize: 11 }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#94a3b8" }}>
                {status === "Published" ? "Active in public customer store" : "Saved as draft only"}
              </p>
            </div>

            <div className="adm-card">
              <p className="adm-card-title">Product Image</p>
              <div style={{
                background: "#F8FAFD", borderRadius: 12, height: 160,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1.5px solid #E8EDF5", overflow: "hidden", position: "relative"
              }}>
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop";
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>No image specified</span>
                )}
              </div>

              <div className="adm-field">
                <label className="adm-label">Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="adm-input"
                />
              </div>

              <div>
                <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>Quick presets:</p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setForm({ ...form, image: preset.url })}
                      className="adm-badge adm-badge-gray"
                      style={{ cursor: "pointer", fontSize: 10 }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => setMode("list")} className="adm-btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="adm-btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                {editingProduct ? "Save changes" : "Publish product"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="adm-controls">
            <div className="adm-search">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" style={{ color: "#94a3b8", flexShrink: 0 }}>
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name, brand or category..."
              />
            </div>
            <button onClick={handleExportCSV} className="adm-btn-secondary">
              Export CSV
            </button>
            <button onClick={openAdd} className="adm-btn-primary">
              + Add product
            </button>
          </div>

          <div className="adm-table-wrap">
            <div className="adm-table-header">
              {["Product name", "Brand", "Category", "Price", "Stock", "Actions"].map((h) => (
                <p key={h} className="adm-table-th">{h}</p>
              ))}
            </div>

            {filtered.map((p) => (
              <div key={p.id} className="adm-table-row">
                <div className="adm-table-td" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img
                    src={p.image}
                    alt=""
                    style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", flexShrink: 0, border: "1px solid #E8EDF5" }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop";
                    }}
                  />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                    {p.name}
                  </span>
                </div>
                <p className="adm-table-td" style={{ color: "#94a3b8" }}>{p.brand}</p>
                <p className="adm-table-td" style={{ color: "#94a3b8" }}>{p.category}</p>
                <p className="adm-table-td" style={{ fontWeight: 700 }}>${p.price?.toLocaleString()}</p>
                <p className="adm-table-td" style={{ fontWeight: 600, color: p.stock < 10 ? "#dc2626" : "#059669" }}>
                  {p.stock} units
                </p>
                <div className="adm-table-td" style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => openEdit(p)} className="adm-action-edit">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="adm-action-delete">Delete</button>
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

import { useState, useRef, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import { exportToCSV } from "../../utils/exportUtils";
import { uploadAPI, categoriesAPI } from "../../services/api";

const FALLBACK_CATEGORIES = ["Phones","Laptops","Audio","Tablets","Gaming","Wearables","Accessories"];
const STATUSES   = ["Published","Draft","Archived"];
const PRESET_IMAGES = [
  { label:"Laptop",  url:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop" },
  { label:"Phone",   url:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop" },
  { label:"Audio",   url:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop" },
  { label:"Tablet",  url:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop" },
  { label:"Watch",   url:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop" },
];

const EMPTY_FORM = { name:"", brand:"", price:"", originalPrice:"", category:"", stock:"10", sku:"", description:"", image:"", status:"Published" };

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search,     setSearch]    = useState("");
  const [catFilter,  setCat]       = useState("All");
  const [mode,       setMode]      = useState("list"); // "list" | "form"
  const [editing,    setEditing]   = useState(null);
  const [form,       setForm]      = useState(EMPTY_FORM);
  const [saving,     setSaving]    = useState(false);
  const [uploading,  setUploading] = useState(false);
  const [uploadErr,  setUploadErr] = useState("");
  const fileInputRef = useRef(null);

  // ── Load categories from server (so newly added categories appear) ──────────
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    categoriesAPI.getAll()
      .then(res => {
        if (res?.data?.length) {
          // Merge server categories with fallback to avoid empty list on error
          const names = res.data.map(c => c.name);
          setCategories(names);
          // Update default form category to first available
          setForm(prev => ({ ...prev, category: prev.category || names[0] }));
        }
      })
      .catch(() => {}); // keep fallback on network error
  }, []);

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
    const matchC = catFilter === "All" || p.category === catFilter;
    return matchQ && matchC;
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, category: categories[0] || "", sku: "SKU-" + Date.now().toString().slice(-6) });
    setMode("form");
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name:          p.name || "",
      brand:         p.brand || "",
      price:         String(p.price || ""),
      originalPrice: String(p.originalPrice || ""),
      category:      p.category || "Phones",
      stock:         String(p.stock ?? 0),
      sku:           p.sku || "",
      description:   p.description || "",
      image:         p.image || "",
      status:        p.status || "Published",
    });
    setMode("form");
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) { alert("Name and price are required."); return; }
    setSaving(true);
    const data = {
      ...form,
      price:         parseFloat(form.price)         || 0,
      originalPrice: parseFloat(form.originalPrice) || null,
      stock:         parseInt(form.stock)            || 0,
      image: form.image || PRESET_IMAGES[0].url,
    };
    try {
      if (editing) {
        await updateProduct(editing._id || editing.id, data);
      } else {
        await addProduct(data);
      }
      setMode("list");
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    await deleteProduct(p._id || p.id);
  };

  const handleExport = () => {
    exportToCSV("products_catalog", filtered, [
      { key:"name", label:"Name" }, { key:"brand", label:"Brand" },
      { key:"category", label:"Category" }, { key:"price", label:"Price" },
      { key:"stock", label:"Stock" }, { key:"status", label:"Status" },
    ]);
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  // ── File upload to Cloudinary via backend ────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type client-side
    if (!["image/jpeg","image/png","image/webp","image/jpg"].includes(file.type)) {
      setUploadErr("Only JPEG, PNG and WebP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadErr("File must be under 5 MB.");
      return;
    }

    setUploading(true);
    setUploadErr("");
    try {
      const res = await uploadAPI.uploadProductImage(file);
      setForm(prev => ({ ...prev, image: res.url }));
    } catch (err) {
      setUploadErr(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // reset input so re-selecting same file still fires onChange
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Form view ─────────────────────────────────────────────────────────────────
  if (mode === "form") {
    return (
      <div className="adm-page">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#101828", margin:0 }}>{editing ? "Edit product" : "Add new product"}</h2>
            <p style={{ fontSize:13, color:"#667085", margin:"4px 0 0" }}>{editing ? `Editing: ${editing.name}` : "Fill in the product details below"}</p>
          </div>
          <button onClick={() => setMode("list")} className="adm-btn-secondary">← Back to list</button>
        </div>

        <div className="adm-two-col">
          {/* Main fields */}
          <div className="adm-two-col-main">
            <div className="adm-card">
              <p className="adm-card-title">Product information</p>
              <div className="adm-field">
                <label className="adm-label">Product name *</label>
                <input value={form.name} onChange={f("name")} placeholder="e.g. MacBook Pro 16" className="adm-input" />
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <div className="adm-field" style={{ flex:1 }}>
                  <label className="adm-label">Brand</label>
                  <input value={form.brand} onChange={f("brand")} placeholder="e.g. Apple" className="adm-input" />
                </div>
                <div className="adm-field" style={{ flex:1 }}>
                  <label className="adm-label">Category</label>
                  <select value={form.category} onChange={f("category")} className="adm-input" style={{ cursor:"pointer" }}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="adm-field">
                <label className="adm-label">Description</label>
                <textarea value={form.description} onChange={f("description")} rows={3} placeholder="Describe the product…" className="adm-textarea" />
              </div>
            </div>

            <div className="adm-card">
              <p className="adm-card-title">Pricing & inventory</p>
              <div style={{ display:"flex", gap:12 }}>
                <div className="adm-field" style={{ flex:1 }}>
                  <label className="adm-label">Price ($) *</label>
                  <input type="number" value={form.price} onChange={f("price")} placeholder="0.00" min="0" step="0.01" className="adm-input" />
                </div>
                <div className="adm-field" style={{ flex:1 }}>
                  <label className="adm-label">Original price ($)</label>
                  <input type="number" value={form.originalPrice} onChange={f("originalPrice")} placeholder="0.00" min="0" step="0.01" className="adm-input" />
                </div>
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <div className="adm-field" style={{ flex:1 }}>
                  <label className="adm-label">Stock units</label>
                  <input type="number" value={form.stock} onChange={f("stock")} placeholder="0" min="0" className="adm-input" />
                </div>
                <div className="adm-field" style={{ flex:1 }}>
                  <label className="adm-label">SKU</label>
                  <input value={form.sku} onChange={f("sku")} placeholder="SKU-XXXXX" className="adm-input" />
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="adm-two-col-side">
            <div className="adm-card">
              <p className="adm-card-title">Status</p>
              <div style={{ display:"flex", gap:8 }}>
                {STATUSES.map(s => (
                  <button key={s} type="button" onClick={() => setForm(p => ({...p, status:s}))}
                    className={`adm-badge ${form.status===s ? "adm-badge-blue":"adm-badge-gray"}`}
                    style={{ cursor:"pointer", padding:"6px 14px" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="adm-card">
              <p className="adm-card-title">Product image</p>

              {/* Preview */}
              <div style={{
                height: 180, borderRadius: 12, overflow: "hidden",
                background: "#f4f7fb", border: "2px dashed #dde4ee",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", cursor: "pointer",
              }}
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                {form.image ? (
                  <>
                    <img src={form.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}
                      onError={e => { e.currentTarget.style.display = "none"; }} />
                    {/* Replace overlay on hover */}
                    <div style={{
                      position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
                      display: "flex", flexDirection:"column", alignItems: "center", justifyContent: "center",
                      opacity: 0, transition: "opacity 0.2s", gap: 6,
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                      <span style={{ fontSize: 22 }}>🖼️</span>
                      <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>Click to replace</span>
                    </div>
                  </>
                ) : uploading ? (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                    <div style={{ width:36, height:36, border:"3px solid #dde4ee", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                    <span style={{ fontSize:13, color:"#667085" }}>Uploading…</span>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, color:"#98a2b3" }}>
                    <span style={{ fontSize:32 }}>📁</span>
                    <span style={{ fontSize:13, fontWeight:600, color:"#2563eb" }}>Click to upload image</span>
                    <span style={{ fontSize:11 }}>JPEG, PNG or WebP · max 5 MB</span>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display:"none" }}
                onChange={handleFileChange}
              />

              {/* Upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="adm-btn-secondary"
                style={{ width:"100%", justifyContent:"center", gap:8 }}
              >
                <span>📤</span>
                {uploading ? "Uploading…" : form.image ? "Replace image" : "Upload image file"}
              </button>

              {/* Error */}
              {uploadErr && (
                <p style={{ fontSize:12, color:"#d92d20", margin:0, padding:"8px 12px", background:"#feeceb", borderRadius:8 }}>
                  ⚠ {uploadErr}
                </p>
              )}

              {/* Divider */}
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ flex:1, height:1, background:"#f0f0f0" }} />
                <span style={{ fontSize:11, color:"#98a2b3", flexShrink:0 }}>or paste URL</span>
                <div style={{ flex:1, height:1, background:"#f0f0f0" }} />
              </div>

              {/* URL input */}
              <div className="adm-field">
                <input
                  value={form.image}
                  onChange={f("image")}
                  placeholder="https://example.com/image.jpg"
                  className="adm-input"
                />
              </div>

              {/* Quick presets */}
              <div>
                <p style={{ fontSize:11, color:"#98a2b3", marginBottom:6 }}>Quick presets:</p>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {PRESET_IMAGES.map(p => (
                    <button key={p.label} type="button"
                      onClick={() => setForm(prev => ({ ...prev, image: p.url }))}
                      className="adm-badge adm-badge-gray" style={{ cursor:"pointer" }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button type="button" onClick={() => setMode("list")} className="adm-btn-secondary">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving} className="adm-btn-primary" style={{ flex:1, justifyContent:"center" }}>
                {saving ? "Saving…" : editing ? "Save changes" : "Publish product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="adm-page">

      <div className="adm-metrics">
        {[
          { label:"Total products",  value: products.length },
          { label:"Published",       value: products.filter(p=>p.status==="Published").length },
          { label:"Draft",           value: products.filter(p=>p.status==="Draft").length },
          { label:"Low stock (<10)", value: products.filter(p=>p.stock < 10 && p.stock > 0).length },
          { label:"Out of stock",    value: products.filter(p=>p.stock===0).length },
        ].map(m => (
          <div key={m.label} className="adm-metric-card">
            <p className="adm-metric-label">{m.label}</p>
            <p className="adm-metric-value">{m.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="adm-controls">
        <div className="adm-search">
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#98a2b3" strokeWidth="1.5"/><path d="M13 13L16 16" stroke="#98a2b3" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, brand or category…" />
        </div>
        <select value={catFilter} onChange={e=>setCat(e.target.value)}
          style={{ height:40, padding:"0 12px", border:"1px solid #dde4ee", borderRadius:10, fontSize:13, fontFamily:"inherit", color:"#101828", background:"#fff", cursor:"pointer", outline:"none" }}>
          <option>All</option>
          {categories.map(c=><option key={c}>{c}</option>)}
        </select>
        <button onClick={handleExport} className="adm-btn-secondary">Export CSV</button>
        <button onClick={openAdd} className="adm-btn-primary">+ Add product</button>
      </div>

      <div className="adm-table-wrap">
        <div className="adm-table-header">
          {["Product","Brand","Category","Price","Stock","Status","Actions"].map(h=>(
            <p key={h} className="adm-table-th">{h}</p>
          ))}
        </div>

        {filtered.map(p => {
          const pid = p._id || p.id;
          const stockBadge = p.stock === 0 ? "adm-badge adm-badge-red" : p.stock < 10 ? "adm-badge adm-badge-amber" : "adm-badge adm-badge-green";
          const statusBadge = p.status === "Published" ? "adm-badge adm-badge-green" : p.status === "Draft" ? "adm-badge adm-badge-gray" : "adm-badge adm-badge-amber";
          return (
            <div key={pid} className="adm-table-row">
              <div className="adm-table-td" style={{ display:"flex", alignItems:"center", gap:10, overflow:"hidden" }}>
                <img src={p.image} alt="" style={{ width:34, height:34, borderRadius:8, objectFit:"cover", border:"1px solid #dde4ee", flexShrink:0 }}
                  onError={e=>{e.currentTarget.src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop";}} />
                <span style={{ fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</span>
              </div>
              <p className="adm-table-td" style={{ color:"#667085" }}>{p.brand}</p>
              <p className="adm-table-td" style={{ color:"#667085" }}>{p.category}</p>
              <p className="adm-table-td" style={{ fontWeight:700 }}>${p.price?.toLocaleString()}</p>
              <div className="adm-table-td">
                <span className={stockBadge}>{p.stock} units</span>
              </div>
              <div className="adm-table-td">
                <span className={statusBadge}>{p.status}</span>
              </div>
              <div className="adm-table-td" style={{ display:"flex", gap:6 }}>
                <button onClick={() => openEdit(p)} className="adm-action-edit">Edit</button>
                <button onClick={() => handleDelete(p)} className="adm-action-delete">Delete</button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && <div className="adm-empty"><p>No products found.</p></div>}
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useAuth }     from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { exportToJSON } from "../../utils/exportUtils";
import { uploadAPI, usersAPI } from "../../services/api";

// ─── Design-system helpers ────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} role="switch" aria-checked={checked}
      style={{ width:36, height:20, borderRadius:999, border:"none", cursor:"pointer",
               position:"relative", flexShrink:0, transition:"background 0.2s",
               background: checked ? "#2563eb" : "#dde4ee" }}>
      <span style={{ position:"absolute", top:3, left: checked ? 18 : 3, width:14, height:14,
                     borderRadius:"50%", background:"#fff", transition:"left 0.2s",
                     boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }} />
    </button>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="adm-field">
      <label className="adm-label">{label}</label>
      {children}
      {hint && <p style={{ fontSize:11, color:"#98a2b3", margin:0 }}>{hint}</p>}
    </div>
  );
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULTS = {
  general:   { storeName:"VOLT Commerce", currency:"USD", timezone:"UTC+3", language:"English" },
  shipping:  { freeThreshold:"500", standardDays:"5", expressDays:"2", expressFee:"14.99" },
  notifs:    { orderEmail:true, lowStockEmail:true, returnEmail:false, newsletterEmail:true },
};

export default function AdminSettingsPage() {
  const { user, updateProfile } = useAuth();
  const { products } = useProducts();

  const [general,   setGeneral]   = useState(DEFAULTS.general);
  const [shipping,  setShipping]  = useState(DEFAULTS.shipping);
  const [notifs,    setNotifs]    = useState(DEFAULTS.notifs);
  const [profile,   setProfile]   = useState({ name: user?.name||"", email: user?.email||"" });

  const [heroImg,   setHeroImg]   = useState("");
  const [heroUrl,   setHeroUrl]   = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const fileRef = useRef(null);

  const [saved,    setSaved]    = useState(false);
  const [saving,   setSaving]   = useState(false);

  // ── Load settings from server on mount ─────────────────────────────────────
  useEffect(() => {
    usersAPI.getSettings()
      .then((res) => {
        const s = res.settings || {};
        if (s.general)   setGeneral({ ...DEFAULTS.general,  ...s.general  });
        if (s.shipping)  setShipping({ ...DEFAULTS.shipping, ...s.shipping });
        if (s.notifs)    setNotifs({ ...DEFAULTS.notifs,   ...s.notifs   });
        if (s.heroImage) { setHeroImg(s.heroImage); setHeroUrl(s.heroImage); }
      })
      .catch(() => { /* use defaults silently */ });
  }, []); // eslint-disable-line

  // ── Save all settings to server ────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      await usersAPI.saveSettings({ general, shipping, notifs, heroImage: heroUrl.trim() || null });
      if (profile.name !== user?.name) await updateProfile({ name: profile.name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Upload hero image ───────────────────────────────────────────────────────
  const handleHeroFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg","image/png","image/webp","image/jpg"].includes(file.type)) {
      setUploadErr("Only JPEG, PNG and WebP images are allowed."); return;
    }
    if (file.size > 5 * 1024 * 1024) { setUploadErr("File must be under 5 MB."); return; }
    setUploading(true); setUploadErr("");
    try {
      const res = await uploadAPI.uploadProductImage(file);
      setHeroImg(res.url); setHeroUrl(res.url);
    } catch (err) {
      setUploadErr(err.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleRemoveHero = () => { setHeroImg(""); setHeroUrl(""); };

  const handleBackup = () => {
    exportToJSON("volt_store_backup", { backupDate: new Date().toISOString(), general, shipping, notifs, productsCount: products.length });
  };

  const handleReset = () => {
    if (!window.confirm("Reset all settings to defaults? This cannot be undone.")) return;
    usersAPI.saveSettings({}).catch(() => {});
    setGeneral(DEFAULTS.general); setShipping(DEFAULTS.shipping);
    setNotifs(DEFAULTS.notifs);   setHeroImg(""); setHeroUrl("");
    window.location.reload();
  };

  const g  = (k) => (e) => setGeneral(p  => ({ ...p, [k]: e.target.value }));
  const sh = (k) => (e) => setShipping(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="adm-page">
      <div className="adm-two-col" style={{ alignItems:"flex-start" }}>

        {/* ── LEFT ── */}
        <div className="adm-two-col-main">

          {/* Admin profile */}
          <div className="adm-card">
            <p className="adm-card-title">Admin profile</p>
            <div style={{ display:"flex", gap:12 }}>
              <div style={{ flex:1 }}>
                <Field label="Display name">
                  <input value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} className="adm-input" />
                </Field>
              </div>
              <div style={{ flex:1 }}>
                <Field label="Email (read-only)">
                  <input value={profile.email} readOnly className="adm-input" style={{ background:"#f4f7fb", cursor:"default" }} />
                </Field>
              </div>
            </div>
          </div>

          {/* ── Hero image ── */}
          <div className="adm-card">
            <div>
              <p className="adm-card-title">Storefront — Hero image</p>
              <p className="adm-card-sub">This image appears in the large banner at the top of the home page.</p>
            </div>

            {/* Preview */}
            <div onClick={() => !uploading && fileRef.current?.click()} style={{
              height:220, borderRadius:14, overflow:"hidden",
              background:"linear-gradient(135deg,#dde4ee,#c8d8f0)",
              border:"2px dashed #dde4ee", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", position:"relative",
            }}>
              {heroImg ? (
                <>
                  <img src={heroImg} alt="Hero" style={{ width:"100%", height:"100%", objectFit:"cover" }}
                    onError={e => { e.currentTarget.style.display = "none"; }} />
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex",
                                flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8,
                                opacity:0, transition:"opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                    <span style={{ fontSize:28 }}>🖼️</span>
                    <span style={{ fontSize:13, color:"#fff", fontWeight:600 }}>Click to replace</span>
                  </div>
                </>
              ) : uploading ? (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
                  <div style={{ width:40, height:40, border:"3px solid #dde4ee", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                  <span style={{ fontSize:13, color:"#667085" }}>Uploading…</span>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, color:"#98a2b3" }}>
                  <span style={{ fontSize:40 }}>🏠</span>
                  <span style={{ fontSize:13, fontWeight:600, color:"#2563eb" }}>Click to upload hero image</span>
                  <span style={{ fontSize:11 }}>JPEG, PNG or WebP · max 5 MB</span>
                </div>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
              style={{ display:"none" }} onChange={handleHeroFileChange} />

            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="adm-btn-secondary" style={{ width:"100%", justifyContent:"center", gap:8 }}>
              📤 {uploading ? "Uploading…" : heroImg ? "Replace image" : "Upload image"}
            </button>

            {uploadErr && (
              <p style={{ fontSize:12, color:"#d92d20", margin:0, padding:"8px 12px", background:"#feeceb", borderRadius:8 }}>
                ⚠ {uploadErr}
              </p>
            )}

            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1, height:1, background:"#f0f0f0" }} />
              <span style={{ fontSize:11, color:"#98a2b3" }}>or paste URL</span>
              <div style={{ flex:1, height:1, background:"#f0f0f0" }} />
            </div>

            <Field label="Image URL">
              <input value={heroUrl} onChange={e => { setHeroUrl(e.target.value); setHeroImg(e.target.value); }}
                placeholder="https://example.com/hero.jpg" className="adm-input" />
            </Field>

            {heroImg && (
              <button type="button" onClick={handleRemoveHero}
                className="adm-btn-danger" style={{ width:"100%", justifyContent:"center" }}>
                🗑 Remove hero image
              </button>
            )}
            {heroImg && (
              <p style={{ fontSize:11, color:"#078a55", margin:0 }}>
                ✓ Image set. Click "Save all settings" to apply.
              </p>
            )}
          </div>

          {/* General */}
          <div className="adm-card">
            <p className="adm-card-title">General</p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <div style={{ flex:"1 1 160px" }}>
                <Field label="Store name">
                  <input value={general.storeName} onChange={g("storeName")} className="adm-input" />
                </Field>
              </div>
              <div style={{ flex:"1 1 100px" }}>
                <Field label="Currency">
                  <select value={general.currency} onChange={g("currency")} className="adm-input" style={{ cursor:"pointer" }}>
                    {["USD","EUR","GBP","EGP","SAR"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ flex:"1 1 120px" }}>
                <Field label="Timezone">
                  <select value={general.timezone} onChange={g("timezone")} className="adm-input" style={{ cursor:"pointer" }}>
                    {["UTC+0","UTC+2","UTC+3","UTC+5","UTC-5","UTC-8"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ flex:"1 1 120px" }}>
                <Field label="Language">
                  <select value={general.language} onChange={g("language")} className="adm-input" style={{ cursor:"pointer" }}>
                    {["English","Arabic","French","Spanish"].map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="adm-card">
            <p className="adm-card-title">Shipping</p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <div style={{ flex:"1 1 140px" }}>
                <Field label="Free threshold ($)">
                  <input type="number" value={shipping.freeThreshold} onChange={sh("freeThreshold")} className="adm-input" />
                </Field>
              </div>
              <div style={{ flex:"1 1 140px" }}>
                <Field label="Express fee ($)">
                  <input type="number" value={shipping.expressFee} onChange={sh("expressFee")} className="adm-input" />
                </Field>
              </div>
              <div style={{ flex:"1 1 140px" }}>
                <Field label="Standard (days)">
                  <input type="number" value={shipping.standardDays} onChange={sh("standardDays")} className="adm-input" />
                </Field>
              </div>
              <div style={{ flex:"1 1 140px" }}>
                <Field label="Express (days)">
                  <input type="number" value={shipping.expressDays} onChange={sh("expressDays")} className="adm-input" />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="adm-two-col-side">

          {/* Notifications */}
          <div className="adm-card">
            <p className="adm-card-title">Email notifications</p>
            {[
              { key:"orderEmail",      label:"New order placed"   },
              { key:"lowStockEmail",   label:"Low stock alert"    },
              { key:"returnEmail",     label:"Return request"     },
              { key:"newsletterEmail", label:"Newsletter signups" },
            ].map(({ key, label }) => (
              <div key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 0" }}>
                <span style={{ fontSize:13, color:"#101828" }}>{label}</span>
                <Toggle checked={notifs[key]} onChange={v => setNotifs(p => ({ ...p, [key]: v }))} />
              </div>
            ))}
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving}
            className="adm-btn-primary" style={{ width:"100%", justifyContent:"center", height:44, fontSize:14 }}>
            {saving ? "Saving…" : saved ? "✓ Saved!" : "Save all settings"}
          </button>

          {/* Danger zone */}
          <div className="adm-card" style={{ border:"1.5px solid #fca5a5" }}>
            <p className="adm-card-title" style={{ color:"#d92d20" }}>Danger zone</p>
            <p className="adm-card-sub">These actions are irreversible.</p>
            <button onClick={handleBackup} className="adm-btn-secondary" style={{ width:"100%", justifyContent:"center" }}>
              Export full backup (JSON)
            </button>
            <button onClick={handleReset} className="adm-btn-danger" style={{ width:"100%", justifyContent:"center", marginTop:4 }}>
              Reset to defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

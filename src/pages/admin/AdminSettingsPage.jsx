import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { exportToJSON, getStoredOrders, getStoredCustomers } from "../../utils/exportUtils";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { products } = useProducts();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const [general, setGeneral]   = useState(() => {
    try {
      const saved = localStorage.getItem("volt_settings_general");
      return saved ? JSON.parse(saved) : { storeName: "VOLT Commerce", currency: "USD", timezone: "UTC+3", language: "English" };
    } catch {
      return { storeName: "VOLT Commerce", currency: "USD", timezone: "UTC+3", language: "English" };
    }
  });

  const [shipping, setShipping] = useState(() => {
    try {
      const saved = localStorage.getItem("volt_settings_shipping");
      return saved ? JSON.parse(saved) : { freeThreshold: "500", standardDays: "5", expressDays: "2", expressFee: "14.99" };
    } catch {
      return { freeThreshold: "500", standardDays: "5", expressDays: "2", expressFee: "14.99" };
    }
  });

  const [notifs, setNotifs]     = useState(() => {
    try {
      const saved = localStorage.getItem("volt_settings_notifs");
      return saved ? JSON.parse(saved) : { orderEmail: true, lowStockEmail: true, returnEmail: false, newsletterEmail: true };
    } catch {
      return { orderEmail: true, lowStockEmail: true, returnEmail: false, newsletterEmail: true };
    }
  });

  const [saved, setSaved]       = useState(false);

  const handleSave = () => {
    try {
      localStorage.setItem("volt_settings_general", JSON.stringify(general));
      localStorage.setItem("volt_settings_shipping", JSON.stringify(shipping));
      localStorage.setItem("volt_settings_notifs", JSON.stringify(notifs));
    } catch (e) {
      console.error(e);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleExportBackup = () => {
    const backupData = {
      backupDate: new Date().toISOString(),
      storeInfo: general,
      shippingSettings: shipping,
      notificationSettings: notifs,
      productsCount: products.length,
      products: products,
      orders: getStoredOrders(),
      customers: getStoredCustomers(),
    };
    exportToJSON("volt_store_full_backup", backupData);
  };

  const handleClearDemoData = () => {
    if (window.confirm("Are you sure you want to reset all data back to factory defaults? Your cart, orders, and customized products will be reset.")) {
      localStorage.removeItem("volt_cart_items");
      localStorage.removeItem("volt_orders");
      localStorage.removeItem("volt_customers");
      localStorage.removeItem("volt_products");
      localStorage.removeItem("volt_settings_general");
      localStorage.removeItem("volt_settings_shipping");
      localStorage.removeItem("volt_settings_notifs");
      window.location.reload();
    }
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 38, height: 22, borderRadius: 999, border: "none", cursor: "pointer",
        background: checked ? "#2563eb" : "#E2E8F0",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
        boxShadow: checked ? "0 0 0 3px rgba(37,99,235,0.15)" : "none",
      }}
      aria-checked={checked}
      role="switch"
    >
      <span style={{
        position: "absolute", top: 4, left: checked ? 18 : 4,
        width: 14, height: 14, borderRadius: "50%", background: "#fff",
        transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }} />
    </button>
  );

  return (
    <div className="adm-page">
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Store Settings</p>
          <p className="adm-topbar-sub">{today} · Configuration</p>
        </div>
        <div className="adm-topbar-right">
          {saved && <span className="adm-toast">✓ Settings saved</span>}
          <button onClick={handleSave} className="adm-btn-primary">Save changes</button>
          <div className="adm-avatar">{user?.name ? user.name.charAt(0) : "A"}</div>
        </div>
      </div>

      <div className="adm-two-col" style={{ alignItems: "flex-start" }}>
        <div className="adm-two-col-main">

          {/* General Settings */}
          <div className="adm-card">
            <div>
              <p className="adm-card-title">General</p>
              <p className="adm-card-sub">Basic store information and locale preferences.</p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <div className="adm-field" style={{ flex: 1, minWidth: 160 }}>
                <label className="adm-label">Store name</label>
                <input value={general.storeName} onChange={(e) => setGeneral({ ...general, storeName: e.target.value })} className="adm-input" />
              </div>
              <div className="adm-field" style={{ flex: 1, minWidth: 120 }}>
                <label className="adm-label">Currency</label>
                <select value={general.currency} onChange={(e) => setGeneral({ ...general, currency: e.target.value })}
                  className="adm-input" style={{ cursor: "pointer" }}>
                  {["USD", "EUR", "GBP", "EGP", "SAR"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <div className="adm-field" style={{ flex: 1, minWidth: 160 }}>
                <label className="adm-label">Timezone</label>
                <select value={general.timezone} onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                  className="adm-input" style={{ cursor: "pointer" }}>
                  {["UTC+0", "UTC+2", "UTC+3", "UTC+5", "UTC-5", "UTC-8"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="adm-field" style={{ flex: 1, minWidth: 120 }}>
                <label className="adm-label">Language</label>
                <select value={general.language} onChange={(e) => setGeneral({ ...general, language: e.target.value })}
                  className="adm-input" style={{ cursor: "pointer" }}>
                  {["English", "Arabic", "French", "Spanish"].map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="adm-card">
            <div>
              <p className="adm-card-title">Shipping</p>
              <p className="adm-card-sub">Delivery timeframes and free shipping threshold.</p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                <label className="adm-label">Free shipping threshold ($)</label>
                <input type="number" value={shipping.freeThreshold} onChange={(e) => setShipping({ ...shipping, freeThreshold: e.target.value })} className="adm-input" />
              </div>
              <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                <label className="adm-label">Express shipping fee ($)</label>
                <input type="number" value={shipping.expressFee} onChange={(e) => setShipping({ ...shipping, expressFee: e.target.value })} className="adm-input" />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                <label className="adm-label">Standard delivery (days)</label>
                <input type="number" value={shipping.standardDays} onChange={(e) => setShipping({ ...shipping, standardDays: e.target.value })} className="adm-input" />
              </div>
              <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                <label className="adm-label">Express delivery (days)</label>
                <input type="number" value={shipping.expressDays} onChange={(e) => setShipping({ ...shipping, expressDays: e.target.value })} className="adm-input" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side */}
        <div className="adm-two-col-side">

          {/* Notifications */}
          <div className="adm-card">
            <div>
              <p className="adm-card-title">Email Notifications</p>
              <p className="adm-card-sub">Choose which events trigger email alerts.</p>
            </div>
            {[
              { key: "orderEmail",      label: "New order placed" },
              { key: "lowStockEmail",   label: "Low stock alert" },
              { key: "returnEmail",     label: "Return request" },
              { key: "newsletterEmail", label: "Newsletter signups" },
            ].map(({ key, label }) => (
              <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "6px 0" }}>
                <div>
                  <p style={{ fontSize: 13, color: "#0f172a", fontWeight: 500 }}>{label}</p>
                </div>
                <Toggle checked={notifs[key]} onChange={(val) => setNotifs({ ...notifs, [key]: val })} />
              </div>
            ))}
          </div>

          {/* Danger Zone */}
          <div className="adm-card" style={{ borderColor: "#fca5a5", borderWidth: 1.5 }}>
            <div>
              <p className="adm-card-title" style={{ color: "#dc2626" }}>Danger Zone</p>
              <p className="adm-card-sub">These actions are irreversible. Proceed with caution.</p>
            </div>
            <button
              onClick={handleClearDemoData}
              className="adm-btn-danger" style={{ width: "100%", justifyContent: "center" }}>
              Clear all demo data
            </button>
            <button
              onClick={handleExportBackup}
              className="adm-btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
              Export full backup (JSON)
            </button>
          </div>

          {/* Save Button */}
          <button onClick={handleSave} className="adm-btn-primary" style={{ width: "100%", justifyContent: "center", height: 44, fontSize: 14 }}>
            {saved ? "✓ Saved!" : "Save all settings"}
          </button>

        </div>
      </div>
    </div>
  );
}

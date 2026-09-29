import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const [general, setGeneral]   = useState({ storeName: 'VOLT Commerce', currency: 'USD', timezone: 'UTC+3', language: 'English' });
  const [shipping, setShipping] = useState({ freeThreshold: '50', standardDays: '5', expressDays: '2', expressFee: '14.99' });
  const [notifs, setNotifs]     = useState({ orderEmail: true, lowStockEmail: true, returnEmail: false, newsletterEmail: true });
  const [saved, setSaved]       = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: checked ? '#2563eb' : '#dde4ee', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 18 : 3,
        width: 14, height: 14, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );

  return (
    <div className="adm-page">
      {/* Top Bar */}
      <div className="adm-topbar">
        <div>
          <p className="adm-topbar-title">Store Settings</p>
          <p className="adm-topbar-sub">{today} · Configuration</p>
        </div>
        <div className="adm-topbar-right">
          {saved && <span className="adm-badge adm-badge-green">✓ Saved successfully</span>}
          <button onClick={handleSave} className="adm-btn-primary">Save changes</button>
          <div className="adm-avatar">{user?.name ? user.name.charAt(0) : 'A'}</div>
        </div>
      </div>

      <div className="adm-two-col" style={{ alignItems: 'flex-start' }}>
        <div className="adm-two-col-main">

          {/* General Settings */}
          <div className="adm-card">
            <p className="adm-card-title">General</p>
            <p className="adm-card-sub">Basic store information and locale preferences.</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="adm-field" style={{ flex: 1, minWidth: 160 }}>
                <label className="adm-label">Store name</label>
                <input value={general.storeName} onChange={e => setGeneral({ ...general, storeName: e.target.value })} className="adm-input" />
              </div>
              <div className="adm-field" style={{ flex: 1, minWidth: 120 }}>
                <label className="adm-label">Currency</label>
                <select value={general.currency} onChange={e => setGeneral({ ...general, currency: e.target.value })}
                  className="adm-input" style={{ cursor: 'pointer' }}>
                  {['USD', 'EUR', 'GBP', 'EGP', 'SAR'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="adm-field" style={{ flex: 1, minWidth: 160 }}>
                <label className="adm-label">Timezone</label>
                <select value={general.timezone} onChange={e => setGeneral({ ...general, timezone: e.target.value })}
                  className="adm-input" style={{ cursor: 'pointer' }}>
                  {['UTC+0', 'UTC+2', 'UTC+3', 'UTC+5', 'UTC-5', 'UTC-8'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="adm-field" style={{ flex: 1, minWidth: 120 }}>
                <label className="adm-label">Language</label>
                <select value={general.language} onChange={e => setGeneral({ ...general, language: e.target.value })}
                  className="adm-input" style={{ cursor: 'pointer' }}>
                  {['English', 'Arabic', 'French', 'Spanish'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="adm-card">
            <p className="adm-card-title">Shipping</p>
            <p className="adm-card-sub">Delivery timeframes and free shipping threshold.</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                <label className="adm-label">Free shipping threshold ($)</label>
                <input type="number" value={shipping.freeThreshold} onChange={e => setShipping({ ...shipping, freeThreshold: e.target.value })} className="adm-input" />
              </div>
              <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                <label className="adm-label">Express shipping fee ($)</label>
                <input type="number" value={shipping.expressFee} onChange={e => setShipping({ ...shipping, expressFee: e.target.value })} className="adm-input" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                <label className="adm-label">Standard delivery (days)</label>
                <input type="number" value={shipping.standardDays} onChange={e => setShipping({ ...shipping, standardDays: e.target.value })} className="adm-input" />
              </div>
              <div className="adm-field" style={{ flex: 1, minWidth: 140 }}>
                <label className="adm-label">Express delivery (days)</label>
                <input type="number" value={shipping.expressDays} onChange={e => setShipping({ ...shipping, expressDays: e.target.value })} className="adm-input" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side */}
        <div className="adm-two-col-side">

          {/* Notifications */}
          <div className="adm-card">
            <p className="adm-card-title">Email Notifications</p>
            <p className="adm-card-sub">Choose which events trigger email alerts.</p>
            {[
              { key: 'orderEmail',      label: 'New order placed' },
              { key: 'lowStockEmail',   label: 'Low stock alert' },
              { key: 'returnEmail',     label: 'Return request' },
              { key: 'newsletterEmail', label: 'Newsletter signups' },
            ].map(({ key, label }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <p style={{ fontSize: 12, color: '#101828' }}>{label}</p>
                <Toggle checked={notifs[key]} onChange={(val) => setNotifs({ ...notifs, [key]: val })} />
              </div>
            ))}
          </div>

          {/* Danger Zone */}
          <div className="adm-card" style={{ borderColor: '#feeceb' }}>
            <p className="adm-card-title" style={{ color: '#d92d20' }}>Danger Zone</p>
            <p className="adm-card-sub">These actions are irreversible. Proceed with caution.</p>
            <button
              onClick={() => alert('This would clear all demo data. Not implemented in this demo.')}
              style={{ height: 38, background: '#feeceb', border: '1px solid #fca5a5', color: '#d92d20', fontSize: 12, fontWeight: 600, padding: '0 14px', borderRadius: 10, cursor: 'pointer', width: '100%' }}>
              Clear all demo data
            </button>
            <button
              onClick={() => alert('Export would download a full JSON backup.')}
              style={{ height: 38, background: '#fff', border: '1px solid #dde4ee', color: '#101828', fontSize: 12, padding: '0 14px', borderRadius: 10, cursor: 'pointer', width: '100%' }}>
              Export full backup (JSON)
            </button>
          </div>

          {/* Save Button */}
          <button onClick={handleSave} className="adm-btn-primary" style={{ width: '100%', justifyContent: 'center', height: 42, fontSize: 14 }}>
            {saved ? '✓ Saved!' : 'Save all settings'}
          </button>

        </div>
      </div>
    </div>
  );
}

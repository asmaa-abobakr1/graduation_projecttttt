import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, ShoppingCart, Plus, Star, X, ArrowRight, Search, Check } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

const SPEC_KEYS = ['Processor', 'RAM', 'Storage', 'Display', 'Battery', 'Graphics', 'OS', 'Weight', 'Camera', 'Connectivity'];

export default function ComparisonPage() {
  const { products, compareList, toggleCompare, clearCompare, loading } = useProducts();
  const { addToCart } = useCart();
  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [modalSearch, setModalSearch]       = useState('');
  const [addedFeedback, setAddedFeedback]   = useState(null);

  const compareProducts = products.filter(p =>
    compareList.some(id => String(id) === String(p._id) || String(id) === String(p.id))
  );
  const availableToAdd  = products.filter(p =>
    !compareList.some(id => String(id) === String(p._id) || String(id) === String(p.id))
  );

  const filteredAvailable = availableToAdd.filter(p =>
    p.name?.toLowerCase().includes(modalSearch.toLowerCase()) ||
    p.brand?.toLowerCase().includes(modalSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(modalSearch.toLowerCase())
  );

  // ── helper: n empty slot placeholders ──
  const emptySlots = 4 - compareProducts.length;

  // ── column widths ──
  const labelW = 160;
  const colW   = 200;
  const totalW = labelW + colW * 4;

  const handleAddToCompare = (pid) => {
    toggleCompare(pid);
    setAddedFeedback(pid);
    setTimeout(() => {
      setIsModalOpen(false);
      setModalSearch('');
      setAddedFeedback(null);
    }, 400);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: 60 }}>

      {/* Page header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              <GitCompare size={14} /> Hardware Benchmark &amp; Compare
            </div>
            <h1 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
              Compare Specifications Side-by-Side
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
              Select up to 4 devices — specs, price, and features compared instantly.
            </p>
          </div>

          {compareProducts.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => setHighlightDiffs(v => !v)}
                style={{
                  padding: '8px 14px', borderRadius: 10, border: `1px solid ${highlightDiffs ? '#fde68a' : '#e2e8f0'}`,
                  background: highlightDiffs ? '#fffbeb' : '#fff', color: highlightDiffs ? '#92400e' : '#475569',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {highlightDiffs ? '✓ Highlighting Differences' : 'Highlight Differences'}
              </button>
              <button
                onClick={clearCompare}
                style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid #fecaca', background: '#fff', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px' }}>

        {loading && compareProducts.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
            <div style={{ width: 40, height: 40, border: '4px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: 16, color: '#64748b', fontSize: 14 }}>Loading devices comparison...</p>
          </div>
        ) : compareProducts.length === 0 ? (
          /* ── Empty state ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', maxWidth: 500, margin: '0 auto', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#2563eb', boxShadow: '0 8px 24px rgba(37,99,235,0.15)' }}>
              <GitCompare size={36} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>No Devices Selected</h3>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 340 }}>
              Browse the catalog and click the <strong>compare icon</strong> (⚖️) on any product card to add it here. You can compare up to <strong>4 devices</strong> side-by-side.
            </p>
            <Link to="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 12, background: '#2563eb', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 12px rgba(37,99,235,0.3)', transition: 'transform 0.15s' }}>
              Explore Products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          /* ── Comparison table ── */
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
            <div style={{ minWidth: totalW }}>

              {/* Product header row */}
              <div style={{ display: 'grid', gridTemplateColumns: `${labelW}px repeat(4, ${colW}px)`, borderBottom: '2px solid #e2e8f0' }}>

                {/* Label cell */}
                <div style={{ padding: '20px 16px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {compareProducts.length}/4 Selected
                  </span>
                  {compareProducts.length < 4 && (
                    <button onClick={() => setIsModalOpen(true)}
                      style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 9, background: '#2563eb', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: 'fit-content' }}>
                      <Plus size={13} /> Add Device
                    </button>
                  )}
                </div>

                {/* Product columns */}
                {compareProducts.map(p => {
                  const pid = p._id || p.id;
                  return (
                    <div key={pid} style={{ padding: '16px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                      <button onClick={() => toggleCompare(pid)}
                        style={{ position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#94a3b8'; }}>
                        <X size={13} />
                      </button>

                      <div style={{ width: 100, height: 100, background: '#f8fafc', borderRadius: 14, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, border: '1px solid #f1f5f9' }}>
                        <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>

                      <span style={{ fontSize: 9, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.brand}</span>
                      <Link to={`/product/${pid}`} style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', textDecoration: 'none', lineHeight: 1.3, margin: '4px 0 6px', display: 'block' }}>
                        {p.name}
                      </Link>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>${p.price?.toLocaleString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#f59e0b', marginBottom: 12 }}>
                        <Star size={12} fill="#f59e0b" /> <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{p.rating}</span>
                        <span style={{ fontSize: 10, color: '#94a3b8' }}>({p.reviews})</span>
                      </div>
                      <button onClick={() => addToCart(p, 1)}
                        style={{ width: '100%', padding: '8px', borderRadius: 10, background: '#0f172a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
                        onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}>
                        <ShoppingCart size={13} /> Add to Cart
                      </button>
                    </div>
                  );
                })}

                {/* Empty slot placeholders */}
                {[...Array(emptySlots)].map((_, i) => (
                  <div key={i} style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, background: '#fafafa', gap: 10 }}>
                    <button onClick={() => setIsModalOpen(true)}
                      style={{ width: 56, height: 56, borderRadius: 16, background: '#fff', border: '2px dashed #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = '#fff'; }}>
                      <Plus size={24} />
                    </button>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>Add Device</span>
                  </div>
                ))}
              </div>

              {/* Spec rows */}
              {SPEC_KEYS.map((key, idx) => {
                const values     = compareProducts.map(p => p.specs?.[key] || '—');
                const isDifferent = new Set(values).size > 1;
                const rowBg      = highlightDiffs && isDifferent ? '#fffbeb' : idx % 2 === 0 ? '#fff' : '#fafafa';

                return (
                  <div key={key} style={{ display: 'grid', gridTemplateColumns: `${labelW}px repeat(4, ${colW}px)`, borderBottom: '1px solid #f1f5f9', background: rowBg }}>
                    <div style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#475569', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', background: '#f8fafc' }}>
                      {key}
                    </div>
                    {compareProducts.map(p => {
                      const pid = p._id || p.id;
                      return (
                        <div key={pid} style={{ padding: '12px 14px', fontSize: 12, borderRight: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', fontWeight: highlightDiffs && isDifferent ? 700 : 400, color: highlightDiffs && isDifferent ? '#92400e' : '#0f172a' }}>
                          {p.specs?.[key] || <span style={{ color: '#cbd5e1' }}>—</span>}
                        </div>
                      );
                    })}
                    {[...Array(emptySlots)].map((_, i) => (
                      <div key={i} style={{ padding: '12px 14px', color: '#e2e8f0', fontSize: 12, borderRight: '1px solid #f1f5f9' }}>—</div>
                    ))}
                  </div>
                );
              })}

              {/* Pros / Cons rows */}
              {['pros', 'cons'].map((field, idx) => {
                const label = field === 'pros' ? '✅ Pros' : '❌ Cons';
                const rowBg = idx % 2 === 0 ? '#fff' : '#fafafa';
                return (
                  <div key={field} style={{ display: 'grid', gridTemplateColumns: `${labelW}px repeat(4, ${colW}px)`, borderBottom: '1px solid #f1f5f9', background: rowBg }}>
                    <div style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#475569', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', background: '#f8fafc' }}>
                      {label}
                    </div>
                    {compareProducts.map(p => {
                      const pid = p._id || p.id;
                      const items = p[field] || [];
                      return (
                        <div key={pid} style={{ padding: '10px 14px', fontSize: 11, borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {items.length > 0
                            ? items.map((item, i) => (
                              <span key={i} style={{ color: field === 'pros' ? '#059669' : '#ef4444' }}>• {item}</span>
                            ))
                            : <span style={{ color: '#cbd5e1' }}>—</span>
                          }
                        </div>
                      );
                    })}
                    {[...Array(emptySlots)].map((_, i) => (
                      <div key={i} style={{ padding: '12px 14px', color: '#e2e8f0', fontSize: 12, borderRight: '1px solid #f1f5f9' }}>—</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Add Device Modal ── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) { setIsModalOpen(false); setModalSearch(''); } }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0' }}>

            {/* Modal header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>Add Device to Compare</h3>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{compareProducts.length}/4 slots used · {filteredAvailable.length} available</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setModalSearch(''); }}
                style={{ width: 30, height: 30, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <X size={16} />
              </button>
            </div>

            {/* Search bar */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by name, brand or category..."
                  value={modalSearch}
                  onChange={e => setModalSearch(e.target.value)}
                  style={{ width: '100%', height: 38, paddingLeft: 34, paddingRight: 12, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Modal list */}
            <div style={{ overflowY: 'auto', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {filteredAvailable.length > 0 ? filteredAvailable.map(p => {
                const pid = p._id || p.id;
                const isAdding = addedFeedback === pid;
                return (
                  <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, border: '1px solid #f1f5f9', cursor: 'default', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f1f5f9', padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.brand}</span>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '1px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', margin: 0 }}>${p.price?.toLocaleString()} &nbsp;·&nbsp; <span style={{ color: '#94a3b8', fontWeight: 400 }}>{p.category}</span></p>
                    </div>
                    <button onClick={() => handleAddToCompare(pid)}
                      style={{ padding: '7px 14px', borderRadius: 9, background: isAdding ? '#059669' : '#2563eb', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, transition: 'background 0.2s' }}
                      onMouseEnter={e => { if (!isAdding) e.currentTarget.style.background = '#1d4ed8'; }}
                      onMouseLeave={e => { if (!isAdding) e.currentTarget.style.background = '#2563eb'; }}>
                      {isAdding ? <><Check size={12} /> Added</> : '+ Add'}
                    </button>
                  </div>
                );
              }) : (
                <p style={{ textAlign: 'center', padding: '32px 16px', fontSize: 13, color: '#64748b' }}>
                  {modalSearch ? `No results for "${modalSearch}"` : 'All devices are already in comparison.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

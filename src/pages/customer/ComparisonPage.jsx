import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, ShoppingCart, Plus, Star, X, ArrowRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

const SPEC_KEYS = ['Processor', 'RAM', 'Storage', 'Display', 'Battery', 'Graphics', 'OS', 'Weight', 'Camera', 'Connectivity'];

export default function ComparisonPage() {
  const { products, compareList, toggleCompare, clearCompare } = useProducts();
  const { addToCart } = useCart();
  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [isModalOpen, setIsModalOpen]       = useState(false);

  const compareProducts = products.filter(p => compareList.includes(p.id));
  const availableToAdd  = products.filter(p => !compareList.includes(p.id));

  // ── helper: n empty slot placeholders ──
  const emptySlots = 4 - compareProducts.length;

  // ── column widths ──
  const labelW = 160;
  const colW   = 200;
  const totalW = labelW + colW * 4;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: 60 }}>

      {/* Page header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              <GitCompare size={14} /> Hardware Benchmark & Compare
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
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
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

        {compareProducts.length === 0 ? (
          /* ── Empty state ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: '#2563eb' }}>
              <GitCompare size={30} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>No Devices Selected</h3>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: '0 0 24px' }}>
              Browse the catalog and click the <strong>compare icon</strong> (⚖️) on any product card to add it here.
            </p>
            <Link to="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 22px', borderRadius: 12, background: '#2563eb', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
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
                {compareProducts.map(p => (
                  <div key={p.id} style={{ padding: '16px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                    <button onClick={() => toggleCompare(p.id)}
                      style={{ position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#94a3b8'; }}>
                      <X size={13} />
                    </button>

                    <div style={{ width: 100, height: 100, background: '#f8fafc', borderRadius: 14, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                      <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>

                    <span style={{ fontSize: 9, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.brand}</span>
                    <Link to={`/product/${p.id}`} style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', textDecoration: 'none', lineHeight: 1.3, margin: '4px 0 6px', display: 'block' }}>
                      {p.name}
                    </Link>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>${p.price?.toLocaleString()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#f59e0b', marginBottom: 12 }}>
                      <Star size={12} fill="#f59e0b" /> <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{p.rating}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>({p.reviews})</span>
                    </div>
                    <button onClick={() => addToCart(p, 1)}
                      style={{ width: '100%', padding: '8px', borderRadius: 10, background: '#0f172a', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}>
                      <ShoppingCart size={13} /> Add to Cart
                    </button>
                  </div>
                ))}

                {/* Empty slot placeholders */}
                {[...Array(emptySlots)].map((_, i) => (
                  <div key={i} style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, background: '#fafafa', gap: 8 }}>
                    <button onClick={() => setIsModalOpen(true)}
                      style={{ width: 48, height: 48, borderRadius: 14, background: '#fff', border: '2px dashed #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#94a3b8'; }}>
                      <Plus size={22} />
                    </button>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>Empty Slot</span>
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
                    {compareProducts.map(p => (
                      <div key={p.id} style={{ padding: '12px 14px', fontSize: 12, color: '#0f172a', borderRight: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', fontWeight: highlightDiffs && isDifferent ? 700 : 400, color: highlightDiffs && isDifferent ? '#92400e' : '#0f172a' }}>
                        {p.specs?.[key] || <span style={{ color: '#cbd5e1' }}>—</span>}
                      </div>
                    ))}
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(15,23,42,0.6)' }}
          onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0' }}>

            {/* Modal header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Add Device to Compare</h3>
              <button onClick={() => setIsModalOpen(false)}
                style={{ width: 30, height: 30, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <X size={16} />
              </button>
            </div>

            {/* Modal list */}
            <div style={{ overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {availableToAdd.length > 0 ? availableToAdd.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, border: '1px solid #f1f5f9' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f1f5f9', padding: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.brand}</span>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '1px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', margin: 0 }}>${p.price?.toLocaleString()}</p>
                  </div>
                  <button onClick={() => { toggleCompare(p.id); setIsModalOpen(false); }}
                    style={{ padding: '7px 14px', borderRadius: 9, background: '#2563eb', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                    onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}>
                    + Add
                  </button>
                </div>
              )) : (
                <p style={{ textAlign: 'center', padding: '32px 16px', fontSize: 13, color: '#64748b' }}>All devices are already in comparison.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

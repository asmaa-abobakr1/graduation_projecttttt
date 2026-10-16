import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useResponsive } from '../../hooks/useResponsive';

const SPEC_KEYS = ['Display','Processor','Camera','Battery','RAM','Storage','OS','Weight'];

function StarRating({ rating = 5 }) {
  const full = Math.round(rating);
  return <span style={{ color: '#d97706', fontSize: 12 }}>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>;
}

export default function ComparisonPage() {
  const { isMobile } = useResponsive();
  const { getCompareProducts, toggleCompare, clearCompare } = useProducts();
  const { addToCart } = useCart();
  const products = getCompareProducts();

  if (products.length < 1) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 64, background: '#fff', textAlign: 'center' }}>
        <p style={{ fontSize: 40, marginBottom: 16 }}>⚖️</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#101828', marginBottom: 8 }}>Nothing to compare yet</h2>
        <p style={{ fontSize: 14, color: '#667085', marginBottom: 24 }}>Add up to 4 products to compare them side-by-side.</p>
        <Link to="/search" className="btn-primary">Browse products</Link>
      </div>
    );
  }

  // Gather all spec keys across all products
  const allSpecKeys = [...new Set([
    ...SPEC_KEYS,
    ...products.flatMap(p => Object.keys(p.specs instanceof Map ? Object.fromEntries(p.specs) : (p.specs || {}))),
  ])];

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: isMobile ? '16px' : '32px 64px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#101828', margin: '0 0 4px' }}>Compare devices</h1>
          <p style={{ fontSize: 13, color: '#667085', margin: 0 }}>{products.length} device{products.length !== 1 ? 's' : ''} selected</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={clearCompare} style={{ height: 36, fontSize: 13 }}>Clear all</button>
          <Link to="/search" className="btn-primary" style={{ height: 36, fontSize: 13 }}>Add more</Link>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: isMobile ? 'touch' : undefined }}>
        {isMobile && products.length > 2 && (
          <p style={{ fontSize: 12, color: '#667085', marginBottom: 8, textAlign: 'center' }}>
            Scroll horizontally to compare
          </p>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>

          {/* Product headers */}
          <thead>
            <tr>
              <th style={{ width: 160, minWidth: 140, padding: '0 12px 20px', textAlign: 'left', verticalAlign: 'bottom' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Specification</span>
              </th>
              {products.map(p => {
                const pid = p._id || p.id;
                const specs = p.specs instanceof Map ? Object.fromEntries(p.specs) : (p.specs || {});
                return (
                  <th key={pid} style={{ padding: '0 16px 20px', textAlign: 'left', verticalAlign: 'top', minWidth: 200 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* Image */}
                      <div style={{ width: '100%', height: 180, borderRadius: 16, overflow: 'hidden', background: '#f4f7fb' }}>
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                      {/* Name & price */}
                      <Link to={`/product/${pid}`} style={{ textDecoration: 'none' }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#101828', margin: '0 0 2px' }}>{p.name}</p>
                      </Link>
                      <p style={{ fontSize: 11, color: '#667085', margin: 0 }}>{p.brand}</p>
                      <StarRating rating={p.rating} />
                      <p style={{ fontSize: 18, fontWeight: 600, color: '#101828', margin: 0 }}>${p.price?.toLocaleString()}</p>
                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-primary" style={{ flex: 1, height: 36, fontSize: 12 }}
                          onClick={() => addToCart(p, 1)}>
                          Add to cart
                        </button>
                        <button
                          onClick={() => toggleCompare(pid)}
                          style={{ height: 36, width: 36, borderRadius: 9, border: '1px solid #dde4ee', background: '#fff', color: '#d92d20', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Remove from comparison"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Spec rows */}
          <tbody>
            {/* Price row */}
            <tr style={{ background: '#eef3f9' }}>
              <td style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #dde4ee' }}>Price</td>
              {products.map(p => (
                <td key={p._id || p.id} style={{ padding: '10px 16px', fontSize: 13, color: '#101828', fontWeight: 600, borderBottom: '1px solid #dde4ee' }}>
                  ${p.price?.toLocaleString()}
                </td>
              ))}
            </tr>
            {/* Stock */}
            <tr>
              <td style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f4f7fb' }}>Availability</td>
              {products.map(p => (
                <td key={p._id || p.id} style={{ padding: '10px 16px', borderBottom: '1px solid #f4f7fb' }}>
                  <span className={`badge ${p.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                    {p.stock > 0 ? 'In stock' : 'Out of stock'}
                  </span>
                </td>
              ))}
            </tr>
            {/* Spec rows */}
            {allSpecKeys.map((key, i) => (
              <tr key={key} style={{ background: i % 2 === 0 ? '#fafbfd' : '#fff' }}>
                <td style={{ padding: '12px 12px', fontSize: 12, fontWeight: 600, color: '#667085', borderBottom: '1px solid #f4f7fb', whiteSpace: 'nowrap' }}>{key}</td>
                {products.map(p => {
                  const specs = p.specs instanceof Map ? Object.fromEntries(p.specs) : (p.specs || {});
                  const val = specs[key];
                  return (
                    <td key={p._id || p.id} style={{ padding: '12px 16px', fontSize: 13, color: val ? '#101828' : '#dde4ee', borderBottom: '1px solid #f4f7fb' }}>
                      {val || '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

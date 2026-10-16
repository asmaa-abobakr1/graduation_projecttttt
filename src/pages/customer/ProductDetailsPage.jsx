import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { productsAPI } from '../../services/api';
import { useResponsive } from '../../hooks/useResponsive';

function StarRating({ rating = 5, reviews = 0 }) {
  const full = Math.round(rating);
  return (
    <span style={{ fontSize: 13, color: '#d97706' }}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      {reviews > 0 && <span style={{ color: '#667085', marginLeft: 6 }}>{rating} · {reviews} reviews</span>}
    </span>
  );
}

export default function ProductDetailsPage() {
  const { id }           = useParams();
  const { getProduct, toggleWishlist, isWishlisted, toggleCompare, compareList } = useProducts();
  const { addToCart }    = useCart();
  const navigate         = useNavigate();
  const { isMobile }     = useResponsive();

  const [product, setProduct]         = useState(getProduct(id));
  const [loading, setLoading]         = useState(!product);
  const [qty, setQty]                 = useState(1);
  const [activeImg, setActiveImg]     = useState(0);
  const [addedMsg, setAddedMsg]       = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!product) {
      setLoading(true);
      productsAPI.getOne(id)
        .then(res => { setProduct(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [id]); // eslint-disable-line

  if (loading) return (
    <div style={{ padding: '80px 64px', textAlign: 'center', color: '#667085', fontSize: 14 }}>Loading product…</div>
  );

  if (!product) return (
    <div style={{ padding: '80px 64px', textAlign: 'center' }}>
      <p style={{ fontSize: 18, color: '#101828', marginBottom: 16 }}>Product not found.</p>
      <Link to="/search" className="btn-primary">Browse products</Link>
    </div>
  );

  const images = [product.image, ...(product.images || [])].filter(Boolean);
  const specs  = product.specs ? (product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs) : {};
  const specEntries = Object.entries(specs);
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAddedMsg('Added to cart!');
    setTimeout(() => setAddedMsg(''), 2500);
  };

  return (
    <div style={{ background: '#fff' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: isMobile ? '16px 12px' : '32px 64px', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: 11, color: '#667085', margin: 0 }}>
          <Link to="/search" style={{ color: '#667085', textDecoration: 'none' }}>Shop</Link>
          {product.category && <> / <Link to={`/search?category=${product.category}`} style={{ color: '#667085', textDecoration: 'none' }}>{product.category}</Link></>}
          {' / '}{product.brand} / {product.name}
        </p>

        {/* Product overview */}
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>

          {/* Gallery */}
          <div style={{ width: isMobile ? '100%' : 700, display: 'flex', gap: 14, flexShrink: 0, flexDirection: isMobile ? 'column-reverse' : 'row' }}>
            {/* Thumbnails */}
            <div style={
              isMobile
                ? { display: 'flex', flexDirection: 'row', overflowX: 'auto', gap: 8 }
                : { display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }
            }>
              {images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)}
                  style={{ width: isMobile ? 64 : 90, height: isMobile ? 64 : 90, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', flexShrink: 0, border: `2px solid ${i === activeImg ? '#2563eb' : '#dde4ee'}`, transition: 'border-color 0.15s' }}>
                  <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            {/* Main image */}
            <div style={{ flex: 1, height: isMobile ? 280 : 610, borderRadius: 24, overflow: 'hidden', background: '#f4f7fb' }}>
              <img
                src={images[activeImg] || product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* Purchase panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0, width: isMobile ? '100%' : 'auto' }}>

            <span className="badge badge-blue">
              {product.tags?.includes('New') || product.tags?.includes('New release') ? 'New release' : product.category}
            </span>

            <h1 style={{ fontSize: 38, fontWeight: 400, color: '#101828', margin: 0, lineHeight: 1.15 }}>{product.name}</h1>

            <StarRating rating={product.rating} reviews={product.reviews} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ fontSize: 30, color: '#000', margin: 0 }}>
                ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p style={{ fontSize: 13, color: '#667085', margin: 0, textDecoration: 'line-through' }}>
                  Was ${product.originalPrice?.toLocaleString()}
                </p>
              )}
              <p style={{ fontSize: 13, color: '#667085', margin: 0 }}>
                or ${(product.price / 24).toFixed(2)}/month for 24 months at 0% APR
              </p>
            </div>

            {/* Stock */}
            <span className={`badge ${inStock ? 'badge-green' : 'badge-red'}`} style={{ width: 'fit-content' }}>
              {inStock ? `In stock · Ships today` : 'Out of stock'}
            </span>

            {/* Delivery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <p style={{ fontSize: 13, color: '#000', margin: 0 }}>Free delivery by Friday</p>
              <p style={{ fontSize: 12, color: '#667085', margin: 0 }}>Pickup available today at VOLT Downtown</p>
            </div>

            {/* Qty + Add to cart */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {/* Qty control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#eef3f9', borderRadius: 999, padding: '5px 14px' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#667085', lineHeight: 1, fontFamily: 'inherit' }}>−</button>
                <span style={{ fontSize: 13, color: '#101828', minWidth: 20, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#667085', lineHeight: 1, fontFamily: 'inherit' }}>+</button>
              </div>

              {/* Add to cart */}
              <button
                className="btn-primary"
                onClick={handleAddToCart}
                disabled={!inStock}
                style={{ flex: 1, background: inStock ? '#2563eb' : '#eef3f9', color: inStock ? '#fff' : '#667085', borderColor: inStock ? '#2563eb' : '#eef3f9' }}
              >
                {addedMsg || 'Add to cart'}
              </button>
            </div>

            {/* Buy now */}
            <button className="btn-secondary" onClick={() => { addToCart(product, qty); navigate('/cart'); }} disabled={!inStock}>
              Buy now
            </button>

            <p style={{ fontSize: 11, color: '#667085', margin: 0 }}>Free returns · 2-year warranty · Secure checkout</p>

            {/* Wishlist / Compare */}
            <div style={{ display: 'flex', gap: 12, borderTop: '1px solid #f4f7fb', paddingTop: 16 }}>
              <button
                onClick={() => toggleWishlist(product._id || product.id)}
                style={{ fontSize: 12, color: isWishlisted(product._id || product.id) ? '#2563eb' : '#667085', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ♥ {isWishlisted(product._id || product.id) ? 'Wishlisted' : 'Add to wishlist'}
              </button>
              <button
                onClick={() => toggleCompare(product._id || product.id)}
                style={{ fontSize: 12, color: compareList.includes(product._id || product.id) ? '#2563eb' : '#667085', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ⚖ {compareList.includes(product._id || product.id) ? 'Added to compare' : 'Add to compare'}
              </button>
            </div>
          </div>
        </div>

        {/* Highlights / benefits */}
        {product.highlights?.length > 0 && (
          <div style={{ display: 'flex', gap: 16, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            {product.highlights.map((h, i) => (
              <div key={i} style={{ flex: 1, background: '#f4f7fb', borderRadius: 16, padding: 18 }}>
                <p style={{ fontSize: 13, color: '#000', margin: 0 }}>{h}</p>
              </div>
            ))}
          </div>
        )}

        {/* Specifications */}
        {specEntries.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <p className="section-label" style={{ margin: '0 0 6px' }}>Technical details</p>
              <h2 style={{ fontSize: 28, fontWeight: 400, color: '#101828', margin: 0 }}>Built beyond the benchmark</h2>
            </div>
            {/* Table */}
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #dde4ee', ...(isMobile ? { overflowX: 'auto' } : {}) }}>
              <div className="table-header">
                <p style={{ flex: 1, margin: 0 }}>Specification</p>
                <p style={{ flex: 1, margin: 0 }}>Details</p>
              </div>
              {specEntries.map(([key, val]) => (
                <div key={key} className="table-row">
                  <p style={{ flex: 1, margin: 0, fontWeight: 500 }}>{key}</p>
                  <p style={{ flex: 1, margin: 0, color: '#667085' }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div style={{ borderTop: '1px solid #f4f7fb', paddingTop: 32 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>About this product</p>
            <p style={{ fontSize: 14, color: '#667085', lineHeight: 1.7, margin: 0 }}>{product.description}</p>
          </div>
        )}

        {/* Pros / Cons */}
        {(product.pros?.length > 0 || product.cons?.length > 0) && (
          <div style={{ display: 'flex', gap: 24, flexDirection: isMobile ? 'column' : 'row' }}>
            {product.pros?.length > 0 && (
              <div style={{ flex: 1, background: '#e8f8f1', borderRadius: 16, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#078a55', margin: '0 0 12px' }}>Pros</p>
                {product.pros.map((p, i) => <p key={i} style={{ fontSize: 13, color: '#101828', margin: '0 0 6px' }}>✓ {p}</p>)}
              </div>
            )}
            {product.cons?.length > 0 && (
              <div style={{ flex: 1, background: '#feeceb', borderRadius: 16, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#d92d20', margin: '0 0 12px' }}>Cons</p>
                {product.cons.map((c, i) => <p key={i} style={{ fontSize: 13, color: '#101828', margin: '0 0 6px' }}>✗ {c}</p>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

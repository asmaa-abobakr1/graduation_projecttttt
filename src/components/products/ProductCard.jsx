import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check, GitCompare, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';

export default function ProductCard({ product }) {
  const [isAdded, setIsAdded]   = useState(false);
  const [hovered, setHovered]   = useState(false);
  const { addToCart }           = useCart();
  const { toggleCompare, compareList, toggleWishlist, isWishlisted } = useProducts();

  const isCompared  = compareList.includes(product.id);
  const wishlisted  = isWishlisted(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const isNew       = product.tags?.includes('New');
  const isBestSeller = product.tags?.includes('Best Seller');
  const specSnippet = product.specs?.Processor || product.specs?.Display || product.specs?.Driver || Object.values(product.specs || {})[0];

  const handleAddToCart = (e) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleToggleCompare = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isCompared && compareList.length >= 4) { alert('You can compare up to 4 devices.'); return; }
    toggleCompare(product.id);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        border: `1.5px solid ${hovered ? '#bfdbfe' : '#e2e8f0'}`,
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', background: '#f8fafc', overflow: 'hidden', aspectRatio: '4/3' }}>
        <Link to={`/product/${product.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: 12 }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', transition: 'transform 0.3s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          />
        </Link>

        {/* Badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {hasDiscount && (
            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800, background: '#ef4444', color: '#fff', textTransform: 'uppercase' }}>
              -{discountPct}%
            </span>
          )}
          {isNew && !hasDiscount && (
            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: '#2563eb', color: '#fff' }}>
              New
            </span>
          )}
          {isBestSeller && (
            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: '#f59e0b', color: '#0f172a' }}>
              Best Seller
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 6, opacity: hovered ? 1 : 0.8, transition: 'opacity 0.2s' }}>
          <button onClick={handleToggleWishlist}
            style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: wishlisted ? '#fef2f2' : 'rgba(255,255,255,0.92)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', color: wishlisted ? '#ef4444' : '#64748b', transition: 'all 0.15s' }}>
            <Heart size={14} fill={wishlisted ? '#ef4444' : 'none'} />
          </button>
          <button onClick={handleToggleCompare}
            style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isCompared ? '#2563eb' : 'rgba(255,255,255,0.92)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', color: isCompared ? '#fff' : '#64748b', transition: 'all 0.15s' }}>
            <GitCompare size={14} />
          </button>
        </div>

        {/* Low stock */}
        {product.stock > 0 && product.stock <= 8 && (
          <div style={{ position: 'absolute', bottom: 8, left: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#92400e', background: '#fef3c7', padding: '2px 7px', borderRadius: 5, border: '1px solid #fde68a' }}>
              Only {product.stock} left
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '12px 14px 14px', gap: 6 }}>
        {/* Brand & Category */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{product.brand}</span>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>{product.category}</span>
        </div>

        {/* Name */}
        <Link to={`/product/${product.id}`} style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', textDecoration: 'none', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          title={product.name}>
          {product.name}
        </Link>

        {/* Spec snippet */}
        {specSnippet && (
          <p style={{ fontSize: 11, color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{specSnippet}</p>
        )}

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11}
              fill={i < Math.floor(product.rating || 5) ? '#f59e0b' : 'none'}
              color={i < Math.ceil(product.rating || 5) ? '#f59e0b' : '#e2e8f0'}
            />
          ))}
          <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{product.rating}</span>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>({product.reviews || 0})</span>
        </div>

        {/* Price + Add to Cart */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 10, borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>${product.price?.toLocaleString()}</span>
              {hasDiscount && <span style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>${product.originalPrice?.toLocaleString()}</span>}
            </div>
            <span style={{ fontSize: 10, color: '#10b981', fontWeight: 600 }}>Free 2-day delivery</span>
          </div>

          <button onClick={handleAddToCart} disabled={product.stock === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 10, border: 'none', cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 700, flexShrink: 0, transition: 'all 0.15s',
              background: product.stock === 0 ? '#f1f5f9' : isAdded ? '#059669' : '#0f172a',
              color: product.stock === 0 ? '#94a3b8' : '#fff',
            }}>
            {isAdded ? <><Check size={13} /><span>Added!</span></> : product.stock === 0 ? 'Sold Out' : <><ShoppingCart size={13} /><span>Add</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}

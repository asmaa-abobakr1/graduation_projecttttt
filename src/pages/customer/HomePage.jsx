import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

const CATEGORIES = [
  { name: 'Smartphones', path: '/search?category=Phones' },
  { name: 'Computing',   path: '/search?category=Laptops' },
  { name: 'Audio',       path: '/search?category=Audio' },
  { name: 'Gaming',      path: '/search?category=Gaming' },
  { name: 'Smart home',  path: '/search?category=Wearables' },
  { name: 'Accessories', path: '/search?category=Accessories' },
];

const VALUE_PROPS = [
  { title: 'Free 2-Day Delivery',  desc: 'On all orders over $50.' },
  { title: '30-Day Returns',       desc: 'Hassle-free return policy.' },
  { title: '2-Year Warranty',      desc: 'On every device we sell.' },
  { title: 'Expert Support',       desc: '24/7 certified specialists.' },
];

function StarRating({ rating = 5 }) {
  return (
    <span style={{ color: '#d97706', fontSize: 12 }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  );
}

function ProductCard({ product }) {
  const pid = product._id || product.id;
  const isNew  = product.tags?.includes('New')  || product.tags?.includes('New release');
  const isSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <Link to={`/product/${pid}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minWidth: 0 }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 230, borderRadius: 16, overflow: 'hidden', background: '#f4f7fb', flexShrink: 0 }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        {(isNew || isSale) && (
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <span className="badge badge-blue">{isSale ? `${product.discountPct || 'Sale'}% off` : 'New'}</span>
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: 15, color: '#101828', margin: 0, lineHeight: 1.3 }}>{product.name}</p>
        <StarRating rating={product.rating} />
        <p style={{ fontSize: 17, color: '#101828', margin: 0, fontWeight: 400 }}>
          From ${product.price?.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { products } = useProducts();
  const navigate     = useNavigate();
  const [email, setEmail]       = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featured = products.slice(0, 4);
  const heroProduct = products[0];

  return (
    <div style={{ background: '#fff', width: '100%' }}>

      {/* ── Hero ── */}
      <section style={{ background: '#f4f7fb', display: 'flex', gap: 52, alignItems: 'stretch', padding: '52px 64px', minHeight: 570, overflow: 'hidden' }}>
        {/* Left copy */}
        <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 22, justifyContent: 'center', flexShrink: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            THE 2026 FLAGSHIP EDIT
          </p>
          <h1 style={{ fontSize: 54, fontWeight: 400, color: '#101828', lineHeight: 1.02, margin: 0 }}>
            Future-ready devices. Curated for real life.
          </h1>
          <p style={{ fontSize: 17, color: '#667085', lineHeight: 1.55, margin: 0 }}>
            Meet the latest phones, laptops and audio — expertly selected, responsibly delivered, and supported for the long run.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-primary" onClick={() => navigate('/search')}>
              Shop new releases
            </button>
            <button className="btn-secondary" onClick={() => navigate('/search')}>
              Explore buying guides
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#667085', margin: 0 }}>
            Free 2-day delivery · 30-day returns · Expert support
          </p>
        </div>

        {/* Right image */}
        <div style={{ flex: 1, borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg,#dde4ee,#c8d8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          {heroProduct?.image ? (
            <img src={heroProduct.image} alt={heroProduct.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: '#98a2b3' }}>
              <div style={{ fontSize: 48 }}>⚡</div>
              <p style={{ fontSize: 14, margin: '8px 0 0' }}>VOLT• Flagship</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Category shortcuts ── */}
      <section style={{ padding: '30px 64px', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {CATEGORIES.map(cat => (
          <Link key={cat.name} to={cat.path} style={{ textDecoration: 'none', background: '#f4f7fb', width: 190, height: 84, padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#101828', margin: 0 }}>{cat.name}</p>
            <p style={{ fontSize: 12, color: '#2563eb', margin: 0 }}>Shop collection →</p>
          </Link>
        ))}
      </section>

      {/* ── Featured products ── */}
      <section style={{ padding: '56px 64px' }}>
        {/* Section heading */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <p className="section-label" style={{ margin: 0 }}>Editor's picks</p>
            <h2 style={{ fontSize: 28, fontWeight: 400, color: '#101828', margin: 0 }}>Technology worth upgrading for</h2>
          </div>
          <Link to="/search" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>View all products →</Link>
        </div>

        {/* Product grid */}
        {featured.length > 0 ? (
          <div style={{ display: 'flex', gap: 22 }}>
            {featured.map(p => <ProductCard key={p._id || p.id} product={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#667085' }}>
            <p style={{ fontSize: 14, margin: 0 }}>Loading products…</p>
          </div>
        )}
      </section>

      {/* ── Editorial promotion ── */}
      <section style={{ padding: '48px 64px', background: '#f4f7fb', display: 'flex', gap: 40, alignItems: 'center' }}>
        {/* Image */}
        <div style={{ flex: 1, borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg,#dde4ee,#c8d8f0)', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {products[1]?.image ? (
            <img src={products[1].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 40, color: '#98a2b3' }}>📱</span>
          )}
        </div>
        {/* Copy */}
        <div style={{ width: 440, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <p className="section-label" style={{ margin: 0 }}>Expert picks</p>
          <h2 style={{ fontSize: 32, fontWeight: 400, color: '#101828', margin: 0, lineHeight: 1.2 }}>
            Chosen by our editorial team
          </h2>
          <p style={{ fontSize: 15, color: '#667085', margin: 0, lineHeight: 1.6 }}>
            Every device on our platform is tested, reviewed and curated by technology specialists. No filler — only the gear worth your money.
          </p>
          <button className="btn-primary" style={{ width: 'fit-content' }} onClick={() => navigate('/search')}>
            Browse the edit →
          </button>
        </div>
      </section>

      {/* ── Value propositions ── */}
      <section style={{ padding: '40px 64px', display: 'flex', gap: 24 }}>
        {VALUE_PROPS.map(v => (
          <div key={v.title} style={{ flex: 1, background: '#f4f7fb', borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#101828', margin: 0 }}>{v.title}</p>
            <p style={{ fontSize: 12, color: '#667085', margin: 0 }}>{v.desc}</p>
          </div>
        ))}
      </section>

      {/* ── Newsletter ── */}
      <section style={{ padding: '56px 64px', background: '#f4f7fb', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 400, color: '#101828', margin: 0 }}>Stay in the loop.</h2>
          <p style={{ fontSize: 14, color: '#667085', margin: 0, lineHeight: 1.5 }}>
            New arrivals, buying guides and exclusive offers — delivered to your inbox.
          </p>
          {subscribed ? (
            <p style={{ fontSize: 14, color: '#078a55', fontWeight: 600 }}>You're subscribed! ✓</p>
          ) : (
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
                style={{ flex: 1 }}
              />
              <button
                className="btn-primary"
                onClick={() => { if (email.includes('@')) setSubscribed(true); }}
                style={{ flexShrink: 0 }}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { usersAPI } from '../../services/api';
import { useResponsive } from '../../hooks/useResponsive';

const CATEGORIES = [
  { name: 'Smartphones', path: '/search?category=Phones'    },
  { name: 'Computing',   path: '/search?category=Laptops'   },
  { name: 'Audio',       path: '/search?category=Audio'     },
  { name: 'Gaming',      path: '/search?category=Gaming'    },
  { name: 'Smart home',  path: '/search?category=Wearables' },
  { name: 'Accessories', path: '/search?category=Accessories' },
];

const VALUE_PROPS = [
  { title: 'Free 2-Day Delivery', desc: 'On all orders over $50.'        },
  { title: '30-Day Returns',      desc: 'Hassle-free return policy.'      },
  { title: '2-Year Warranty',     desc: 'On every device we sell.'        },
  { title: 'Expert Support',      desc: '24/7 certified specialists.'     },
];

function StarRating({ rating = 5 }) {
  const full = Math.round(rating);
  return (
    <span style={{ color: '#d97706', fontSize: 12 }}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
    </span>
  );
}

function ProductCard({ product }) {
  const pid  = product._id || product.id;
  const isNew  = product.tags?.includes('New') || product.tags?.includes('New release');
  const isSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <Link to={`/product/${pid}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minWidth: 0 }}>
      <div style={{ position: 'relative', height: 230, borderRadius: 16, overflow: 'hidden', background: '#f4f7fb', flexShrink: 0 }}>
        <img src={product.image} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.currentTarget.style.display = 'none'; }} />
        {(isNew || isSale) && (
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <span className="badge badge-blue">{isSale ? `${product.discountPct || 'Sale'}% off` : 'New'}</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: 15, color: '#101828', margin: 0, lineHeight: 1.3 }}>{product.name}</p>
        <StarRating rating={product.rating} />
        <p style={{ fontSize: 17, color: '#101828', margin: 0 }}>From ${product.price?.toLocaleString()}</p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { products } = useProducts();
  const navigate     = useNavigate();
  const [email,      setEmail]      = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [heroImg,    setHeroImg]    = useState('');
  const { isMobile, isTablet } = useResponsive();

  // Load hero image from server settings (no localStorage)
  useEffect(() => {
    usersAPI.getSettings()
      .then(res => { if (res?.settings?.heroImage) setHeroImg(res.settings.heroImage); })
      .catch(() => {});
  }, []);

  const featured    = products.slice(0, 4);
  const heroProduct = products[0];

  return (
    <div style={{ background: '#fff', width: '100%' }}>

      {/* ── Hero ── */}
      <section style={{
        background: '#f4f7fb',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 24 : 52,
        alignItems: isMobile ? 'flex-start' : 'stretch',
        padding: isMobile ? '24px 16px' : isTablet ? '32px 24px' : '52px 64px',
        minHeight: isMobile ? 'auto' : 570,
        overflow: 'hidden',
      }}>
        <div style={{
          width: isMobile ? '100%' : isTablet ? '100%' : 520,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            THE 2026 FLAGSHIP EDIT
          </p>
          <h1 style={{ fontSize: isMobile ? '32px' : '54px', fontWeight: 400, color: '#101828', lineHeight: 1.02, margin: 0 }}>
            Future-ready devices. Curated for real life.
          </h1>
          <p style={{ fontSize: 17, color: '#667085', lineHeight: 1.55, margin: 0 }}>
            Meet the latest phones, laptops and audio — expertly selected, responsibly delivered, and supported for the long run.
          </p>
          {/* CTA buttons: stacked on mobile, inline on desktop */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12,
            width: isMobile ? '100%' : 'auto',
          }}>
            <button
              className="btn-primary"
              style={{ width: isMobile ? '100%' : 'auto', minHeight: 44 }}
              onClick={() => navigate('/search')}
            >
              Shop new releases
            </button>
            <button
              className="btn-secondary"
              style={{ width: isMobile ? '100%' : 'auto', minHeight: 44 }}
              onClick={() => navigate('/search')}
            >
              Explore buying guides
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#667085', margin: 0 }}>
            Free 2-day delivery · 30-day returns · Expert support
          </p>
        </div>

        {/* Hero image: on desktop/tablet shown beside copy; on mobile shown below copy */}
        {!isMobile && (
          <div style={{ flex: 1, borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg,#dde4ee,#c8d8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isTablet ? 280 : 400 }}>
            {(heroImg || heroProduct?.image) ? (
              <img src={heroImg || heroProduct.image} alt="Hero"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.currentTarget.style.display = 'none'; }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#98a2b3' }}>
                <div style={{ fontSize: 48 }}>⚡</div>
                <p style={{ fontSize: 14, margin: '8px 0 0' }}>VOLT• Flagship</p>
              </div>
            )}
          </div>
        )}

        {/* On mobile: show hero image below copy at reduced size */}
        {isMobile && (
          <div style={{ width: '100%', borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(135deg,#dde4ee,#c8d8f0)', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {(heroImg || heroProduct?.image) ? (
              <img src={heroImg || heroProduct.image} alt="Hero"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.currentTarget.style.display = 'none'; }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#98a2b3' }}>
                <div style={{ fontSize: 40 }}>⚡</div>
                <p style={{ fontSize: 13, margin: '8px 0 0' }}>VOLT• Flagship</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Category shortcuts ── */}
      <section style={{
        padding: isMobile ? '24px 16px' : isTablet ? '32px 24px' : '30px 64px',
        display: isMobile ? 'grid' : 'flex',
        gridTemplateColumns: isMobile ? '1fr 1fr' : undefined,
        gap: isMobile ? 10 : 16,
        flexWrap: !isMobile ? 'wrap' : undefined,
        justifyContent: !isMobile ? 'space-between' : undefined,
      }}>
        {CATEGORIES.map(cat => (
          <Link key={cat.name} to={cat.path} style={{
            textDecoration: 'none',
            background: '#f4f7fb',
            width: isMobile ? 'auto' : 190,
            minHeight: 84,
            padding: 16,
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            flexShrink: 0,
          }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#101828', margin: 0 }}>{cat.name}</p>
            <p style={{ fontSize: 12, color: '#2563eb', margin: 0 }}>Shop collection →</p>
          </Link>
        ))}
      </section>

      {/* ── Featured products ── */}
      <section style={{ padding: isMobile ? '24px 16px' : isTablet ? '32px 24px' : '56px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <p className="section-label" style={{ margin: 0 }}>Editor's picks</p>
            <h2 style={{ fontSize: isMobile ? 20 : 28, fontWeight: 400, color: '#101828', margin: 0 }}>Technology worth upgrading for</h2>
          </div>
          <Link to="/search" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>View all products →</Link>
        </div>
        {featured.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? '1fr 1fr 1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? 16 : 24,
          }}>
            {featured.map(p => <ProductCard key={p._id || p.id} product={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#667085' }}>
            <p style={{ fontSize: 14, margin: 0 }}>Loading products…</p>
          </div>
        )}
      </section>

      {/* ── Editorial promotion ── */}
      <section style={{
        padding: isMobile ? '24px 16px' : isTablet ? '32px 24px' : '48px 64px',
        background: '#f4f7fb',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 20 : 40,
        alignItems: isMobile ? 'flex-start' : 'center',
      }}>
        {/* Image: show above copy on mobile, beside copy on tablet/desktop */}
        <div style={{
          flex: isMobile ? undefined : 1,
          width: isMobile ? '100%' : undefined,
          borderRadius: isMobile ? 16 : 24,
          overflow: 'hidden',
          background: 'linear-gradient(135deg,#dde4ee,#c8d8f0)',
          height: isMobile ? 160 : 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {products[1]?.image
            ? <img src={products[1].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: isMobile ? 32 : 40, color: '#98a2b3' }}>📱</span>}
        </div>
        <div style={{ width: isMobile ? '100%' : isTablet ? '100%' : 440, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <p className="section-label" style={{ margin: 0 }}>Expert picks</p>
          <h2 style={{ fontSize: isMobile ? 22 : 32, fontWeight: 400, color: '#101828', margin: 0, lineHeight: 1.2 }}>
            Chosen by our editorial team
          </h2>
          <p style={{ fontSize: 15, color: '#667085', margin: 0, lineHeight: 1.6 }}>
            Every device on our platform is tested, reviewed and curated by technology specialists. No filler — only the gear worth your money.
          </p>
          <button className="btn-primary" style={{ width: 'fit-content', minHeight: 44 }} onClick={() => navigate('/search')}>
            Browse the edit →
          </button>
        </div>
      </section>

      {/* ── Value props ── */}
      <section style={{
        padding: isMobile ? '24px 16px' : isTablet ? '32px 24px' : '40px 64px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: isMobile ? 12 : 24,
      }}>
        {VALUE_PROPS.map(v => (
          <div key={v.title} style={{ background: '#f4f7fb', borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#101828', margin: 0 }}>{v.title}</p>
            <p style={{ fontSize: 12, color: '#667085', margin: 0 }}>{v.desc}</p>
          </div>
        ))}
      </section>

      {/* ── Newsletter ── */}
      <section style={{
        padding: isMobile ? '32px 16px' : isTablet ? '32px 24px' : '48px 64px',
        background: '#f4f7fb',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: isMobile ? '100%' : 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 400, color: '#101828', margin: 0 }}>Stay in the loop.</h2>
          <p style={{ fontSize: 14, color: '#667085', margin: 0, lineHeight: 1.5 }}>
            New arrivals, buying guides and exclusive offers — delivered to your inbox.
          </p>
          {subscribed ? (
            <p style={{ fontSize: 14, color: '#078a55', fontWeight: 600 }}>You're subscribed! ✓</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10, width: '100%' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
                style={{ flex: 1, width: isMobile ? '100%' : undefined, minHeight: 44 }}
              />
              <button
                className="btn-primary"
                style={{ flexShrink: 0, width: isMobile ? '100%' : 'auto', minHeight: 44 }}
                onClick={() => { if (email.includes('@')) setSubscribed(true); }}
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

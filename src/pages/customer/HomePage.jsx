import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones, Smartphone, Laptop, Tablet, Gamepad2, Watch, Star, Zap } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../../components/products/ProductCard';

export default function HomePage() {
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const displayed = useMemo(() => {
    if (activeTab === 'new')         return products.filter(p => p.tags?.includes('New') || p.id <= 4).slice(0, 8);
    if (activeTab === 'bestsellers') return products.filter(p => p.tags?.includes('Best Seller') || p.rating >= 4.7).slice(0, 8);
    if (activeTab === 'sale')        return products.filter(p => p.originalPrice || p.tags?.includes('Sale')).slice(0, 8);
    return products.slice(0, 8);
  }, [products, activeTab]);

  const categories = [
    { name: 'Smartphones', path: '/search?category=Phones',    icon: Smartphone, bg: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
    { name: 'Laptops',     path: '/search?category=Laptops',   icon: Laptop,     bg: 'linear-gradient(135deg,#334155,#0f172a)' },
    { name: 'Audio',       path: '/search?category=Audio',     icon: Headphones, bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
    { name: 'Tablets',     path: '/search?category=Tablets',   icon: Tablet,     bg: 'linear-gradient(135deg,#10b981,#0d9488)' },
    { name: 'Gaming',      path: '/search?category=Gaming',    icon: Gamepad2,   bg: 'linear-gradient(135deg,#f43f5e,#e11d48)' },
    { name: 'Wearables',   path: '/search?category=Wearables', icon: Watch,      bg: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  ];

  const guarantees = [
    { icon: Truck,      title: 'Free 2-Day Delivery', desc: 'On all orders over $50 with real-time tracking.', color: '#2563eb', bg: '#eff6ff' },
    { icon: ShieldCheck,title: '2-Year Warranty',     desc: 'Official manufacturer warranty on every device.', color: '#059669', bg: '#ecfdf5' },
    { icon: RefreshCw,  title: '30-Day Returns',      desc: 'Not happy? Return with prepaid shipping label.',  color: '#7c3aed', bg: '#f5f3ff' },
    { icon: Zap,        title: '24/7 Expert Support', desc: 'Certified specialists available via chat or call.',color: '#d97706', bg: '#fffbeb' },
  ];

  const tabs = [
    { id: 'all',         label: 'All Products' },
    { id: 'new',         label: 'New Arrivals' },
    { id: 'bestsellers', label: 'Best Sellers' },
    { id: 'sale',        label: 'Deals' },
  ];

  const brands = ['Apple', 'Samsung', 'Sony', 'Dell', 'Google', 'ASUS', 'Lenovo', 'Razer'];

  return (
    <div style={{ background: '#f8fafc', width: '100%' }}>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#0f172a 100%)', padding: '64px 20px', overflow: 'hidden', position: 'relative' }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, background: 'rgba(37,99,235,0.15)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, right: '10%', width: 300, height: 300, background: 'rgba(99,102,241,0.12)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, alignItems: 'center', position: 'relative', zIndex: 1 }}>

          {/* Left text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', color: '#93c5fd', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', width: 'fit-content', textTransform: 'uppercase' }}>
              ✦ 2026 Flagship Showcase
            </div>

            <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: '-1px', margin: 0 }}>
              Next-Gen Tech.<br />
              <span style={{ background: 'linear-gradient(90deg,#60a5fa,#a5b4fc,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Engineered for Real Life.
              </span>
            </h1>

            <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.65, maxWidth: 480, margin: 0 }}>
              Flagship laptops, smartphones, high-fidelity audio, and pro gaming rigs — curated by engineers with 2-year warranty and free express shipping.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/search" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px',
                borderRadius: 14, background: '#2563eb', color: '#fff', textDecoration: 'none',
                fontSize: 14, fontWeight: 700, boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
              }}>
                Explore Catalog <ArrowRight size={16} />
              </Link>
              <Link to="/compare" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px',
                borderRadius: 14, background: 'rgba(255,255,255,0.08)', color: '#e2e8f0',
                textDecoration: 'none', fontSize: 14, fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
                Compare Devices
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: 380 }}>
              {[['20+','Flagship Devices'],['4.9★','12k+ Reviews'],['100%','Official Warranty']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right showcase image */}
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 64px rgba(0,0,0,0.4)', position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=600&fit=crop&q=80"
              alt="Flagship device"
              style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(15,23,42,0.85),transparent)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, padding: '14px 16px', borderRadius: 14, background: 'rgba(15,23,42,0.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Featured</span>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '2px 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>MacBook Pro 16" M3 Max</p>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>36GB · 1TB SSD · Liquid Retina XDR</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>$2,499</div>
                <Link to="/product/1" style={{ fontSize: 11, color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>View Specs →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brands ── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '18px 20px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px 28px' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>Authorized Partner:</span>
          {brands.map(b => (
            <Link key={b} to={`/search?q=${b}`} style={{ fontSize: 13, fontWeight: 800, color: '#94a3b8', textDecoration: 'none', letterSpacing: '-0.3px', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
              {b}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Categories</p>
            <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Explore by Device Ecosystem</h2>
          </div>
          <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} to={cat.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 12px', borderRadius: 16, background: '#fff', border: '1px solid #e2e8f0', textDecoration: 'none', gap: 10, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  <Icon size={24} color="#fff" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Products ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 48px' }}>
        {/* Header + Tabs */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingBottom: 20, borderBottom: '1px solid #e2e8f0', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Top Picks</p>
            <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Popular & Flagship Products</h2>
          </div>
          <div style={{ display: 'flex', gap: 4, background: '#e2e8f0', borderRadius: 12, padding: 4, flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ padding: '6px 14px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s', whiteSpace: 'nowrap',
                  background: activeTab === tab.id ? '#fff' : 'transparent',
                  color: activeTab === tab.id ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === tab.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
          {displayed.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <Link to="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 28px', borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', textDecoration: 'none', fontSize: 13, fontWeight: 700, color: '#0f172a', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}>
            Browse Full Collection ({products.length} devices) <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Promo cards ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {[
            { img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=500&fit=crop', label: '🎧 Audiophile Sound', title: 'Lossless Acoustics & Studio ANC', desc: 'Sony WH-1000XM5 & AirPods Pro 2', link: '/search?category=Audio', accent: '#818cf8' },
            { img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop', label: '🎮 Uncompromised Power', title: '240Hz Mini-LED & RTX 4080', desc: 'ASUS ROG Zephyrus G14 & Razer Blade 16', link: '/search?category=Gaming', accent: '#fb7185' },
          ].map(card => (
            <div key={card.title} style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
              <img src={card.img} alt={card.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(15,23,42,0.95),transparent)' }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: card.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</span>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>{card.title}</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{card.desc}</p>
                <Link to={card.link} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, background: '#fff', color: '#0f172a', textDecoration: 'none', fontSize: 12, fontWeight: 700, width: 'fit-content', marginTop: 4, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = card.accent; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0f172a'; }}>
                  Shop Now <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Guarantees ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
          {guarantees.map(g => {
            const Icon = g.icon;
            return (
              <div key={g.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 16px', borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={g.color} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 3px' }}>{g.title}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{g.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 56px' }}>
        <div style={{ borderRadius: 20, background: 'linear-gradient(135deg,#1d4ed8,#4f46e5)', padding: 'clamp(28px,5vw,48px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ maxWidth: 440 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#bfdbfe', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Insider Access</p>
            <h3 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Get $50 off your first flagship device</h3>
            <p style={{ fontSize: 13, color: '#bfdbfe', margin: 0, lineHeight: 1.6 }}>Join 40,000+ tech enthusiasts for exclusive launches, buying guides, and VIP discount drops.</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); if (email) { setSubscribed(true); setTimeout(() => { setEmail(''); setSubscribed(false); }, 3000); }}}
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1, minWidth: 260, maxWidth: 420 }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address" required
              style={{ flex: 1, height: 44, padding: '0 16px', borderRadius: 10, border: 'none', fontSize: 13, color: '#0f172a', outline: 'none', minWidth: 180 }} />
            <button type="submit"
              style={{ height: 44, padding: '0 20px', borderRadius: 10, background: '#0f172a', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {subscribed ? '✓ Subscribed!' : 'Claim Coupon'}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}

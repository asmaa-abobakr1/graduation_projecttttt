import { Link } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';

export default function Footer() {
  const { isMobile } = useResponsive();
  return (
    <footer style={{ background: '#0b1220', width: '100%' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: isMobile ? '32px 24px' : '48px 64px' }}>

        {/* Columns */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 32 : 80,
          flexWrap: isMobile ? undefined : 'wrap',
          justifyContent: isMobile ? undefined : 'space-between',
        }}>

          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: isMobile ? '100%' : 260, width: isMobile ? '100%' : undefined }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>VOLT<span style={{ color: '#2563eb' }}>•</span></span>
            <p style={{ fontSize: 12, color: '#aeb8c8', lineHeight: 1.6, margin: 0 }}>
              Curated technology, expert guidance and dependable delivery.
            </p>
          </div>

          {/* Shop */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: isMobile ? '100%' : undefined }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Shop</span>
            {['Phones','Laptops','Audio','Gaming','Tablets','Wearables','Accessories'].map(c => (
              <Link key={c} to={`/search?category=${c}`} style={{ fontSize: 12, color: '#aeb8c8', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#aeb8c8'}>{c}</Link>
            ))}
          </div>

          {/* Support */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: isMobile ? '100%' : undefined }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Support</span>
            {['Help center','Delivery','Returns','Warranty'].map(s => (
              <span key={s} style={{ fontSize: 12, color: '#aeb8c8', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#aeb8c8'}>{s}</span>
            ))}
          </div>

          {/* Company */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: isMobile ? '100%' : undefined }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Company</span>
            {['About','Careers','Journal','Press'].map(s => (
              <span key={s} style={{ fontSize: 12, color: '#aeb8c8', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#aeb8c8'}>{s}</span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1e2a3a', margin: '32px 0' }} />

        {/* Legal */}
        <p style={{ fontSize: 11, color: '#8d99aa', margin: 0 }}>
          © {new Date().getFullYear()} VOLT Commerce · Privacy · Terms · Accessibility
        </p>
      </div>
    </footer>
  );
}

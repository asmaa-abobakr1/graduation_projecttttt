import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';

export default function LoginPage() {
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [remember,  setRemember]  = useState(false);
  const [errors,    setErrors]    = useState({});
  const [serverErr, setServerErr] = useState('');
  const [loading,   setLoading]   = useState(false);

  const { isMobile, isTablet } = useResponsive();

  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/';

  const validate = () => {
    const e = {};
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
      e.email = 'Enter a valid email address, such as name@example.com.';
    if (!password || password.length < 8)
      e.password = 'Password must be at least 8 characters.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setServerErr(''); setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(result.user?.role === 'admin' ? '/admin' : from, { replace: true });
    } else {
      setServerErr(result.error || 'Invalid email or password.');
    }
  };

  const isNarrow = isMobile || isTablet;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isNarrow ? 'column' : 'row',
      height: '100vh',
      background: '#fff',
      overflow: isNarrow ? 'auto' : 'hidden',
    }}>

      {/* ── LEFT — form ── */}
      <div style={{
        width: isNarrow ? '100%' : 560,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isNarrow ? 'flex-start' : 'center',
        padding: isNarrow ? '32px 24px' : '0 72px',
        overflowY: 'auto',
        background: '#fff',
      }}>
        {/* Centered wrapper on tablet */}
        <div style={{
          width: '100%',
          maxWidth: isTablet && !isMobile ? 480 : '100%',
          margin: isTablet && !isMobile ? '0 auto' : undefined,
        }}>
          {/* Brand */}
          <Link to="/" style={{ textDecoration: 'none', marginBottom: 40, display: 'block' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#101828', letterSpacing: '-0.5px' }}>
              VOLT<span style={{ color: '#2563eb' }}>•</span>
            </span>
          </Link>

          {/* Heading */}
          <h1 style={{
            fontSize: isMobile ? 28 : 34,
            fontWeight: 400,
            color: '#101828',
            margin: '0 0 8px',
            lineHeight: 1.15,
          }}>
            Welcome back.
          </h1>
          <p style={{ fontSize: 14, color: '#667085', margin: '0 0 36px', lineHeight: 1.5 }}>
            Sign in to manage orders, saved devices and your account.
          </p>

          {/* Server error */}
          {serverErr && (
            <div style={{ padding: '10px 14px', background: '#feeceb', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#d92d20', marginBottom: 20 }}>
              {serverErr}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontSize: 12, color: '#101828', fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                placeholder="you@example.com"
                className={`input-field${errors.email ? ' error' : ''}`}
                style={{ width: '100%', minHeight: isMobile ? 48 : 44 }}
              />
              {errors.email && <p style={{ fontSize: 11, color: '#d92d20', margin: 0 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontSize: 12, color: '#101828', fontWeight: 500 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                placeholder="••••••••"
                className={`input-field${errors.password ? ' error' : ''}`}
                style={{ width: '100%', minHeight: isMobile ? 48 : 44 }}
              />
              {errors.password && <p style={{ fontSize: 11, color: '#d92d20', margin: 0 }}>{errors.password}</p>}
            </div>

            {/* Remember me + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                onClick={() => setRemember(v => !v)}>
                <div style={{
                  width: 32, height: 18, borderRadius: 99,
                  background: remember ? '#2563eb' : '#dde4ee',
                  position: 'relative', flexShrink: 0, transition: 'background 0.2s',
                }}>
                  <div style={{
                    position: 'absolute', top: 2, left: remember ? 16 : 2,
                    width: 14, height: 14, borderRadius: 99, background: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s',
                  }} />
                </div>
                <span style={{ fontSize: 12, color: '#101828' }}>Remember Me</span>
              </div>
              <span style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer' }}>Forgot password?</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', minHeight: 44, height: 44,
                background: loading ? '#93c5fd' : '#2563eb',
                color: '#fff', border: 'none', borderRadius: 10, fontSize: 14,
                fontWeight: 600, cursor: loading ? 'default' : 'pointer',
                fontFamily: 'inherit', transition: 'background 0.15s', marginTop: 4,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Footer links */}
          <p style={{ fontSize: 13, color: '#667085', margin: '24px 0 8px' }}>
            New to VOLT?{' '}
            <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
          <p style={{ fontSize: 12, margin: 0 }}>
            <Link to="/admin" style={{ color: '#2563eb', textDecoration: 'none' }}>Continue to dashboard</Link>
            {' · '}
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Return home</Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT — fixed image (hidden on mobile/tablet) ── */}
      {!isNarrow && (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=900&fit=crop&q=85"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,18,32,0.45)' }} />
          {/* Bottom quote */}
          <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48 }}>
            <p style={{ fontSize: 22, fontWeight: 400, color: '#fff', lineHeight: 1.45, margin: 0 }}>
              One account. Every device, order and recommendation in sync.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

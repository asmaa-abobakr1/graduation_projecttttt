import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors]     = useState({});
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const validate = () => {
    const e = {};
    if (!email.trim())                                       e.email    = 'Enter a valid email address, such as name@example.com.';
    else if (!/\S+@\S+\.\S+/.test(email))                  e.email    = 'Enter a valid email address, such as name@example.com.';
    if (!password)                                          e.password = 'Password must be at least 8 characters.';
    else if (password.length < 8)                           e.password = 'Password must be at least 8 characters.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setServerErr('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(result.user?.role === 'admin' ? '/admin' : from, { replace: true });
    } else {
      setServerErr(result.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7fb' }}>

      {/* ── Left: form panel ── */}
      <div style={{ width: 650, background: '#fff', display: 'flex', flexDirection: 'column', gap: 24, padding: '88px 120px', overflowY: 'auto', flexShrink: 0 }}>

        {/* Brand */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 23, fontWeight: 800, color: '#101828' }}>VOLT<span style={{ color: '#2563eb' }}>•</span></span>
        </Link>

        {/* Welcome */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 36, fontWeight: 400, color: '#101828', lineHeight: 'normal', margin: 0 }}>Welcome back.</p>
          <p style={{ fontSize: 14, color: '#667085', lineHeight: 1.5, margin: 0 }}>
            Sign in to manage orders, saved devices and your account.
          </p>
        </div>

        {/* Server error */}
        {serverErr && (
          <div style={{ padding: '10px 14px', background: '#feeceb', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#d92d20' }}>
            {serverErr}
          </div>
        )}

        {/* Email field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}>
          <label style={{ fontSize: 12, color: '#101828' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
            placeholder="you@example.com"
            className={`input-field${errors.email ? ' error' : ''}`}
          />
          {errors.email && <p style={{ fontSize: 11, color: '#d92d20', margin: 0 }}>{errors.email}</p>}
        </div>

        {/* Password field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}>
          <label style={{ fontSize: 12, color: '#101828' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
            placeholder="••••••••"
            className={`input-field${errors.password ? ' error' : ''}`}
          />
          {errors.password && <p style={{ fontSize: 11, color: '#d92d20', margin: 0 }}>{errors.password}</p>}
        </div>

        {/* Remember me + forgot */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setRemember(v => !v)}>
            {/* Toggle */}
            <div style={{
              width: 32, height: 18, borderRadius: 99, background: remember ? '#2563eb' : '#dde4ee',
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
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', height: 44, background: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: '1px solid #2563eb', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        {/* Links */}
        <p style={{ fontSize: 13, color: '#667085', margin: 0 }}>
          New to VOLT?{' '}
          <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Create an account</Link>
        </p>
        <p style={{ fontSize: 12, margin: 0 }}>
          <Link to="/admin" style={{ color: '#2563eb', textDecoration: 'none' }}>Continue to dashboard</Link>
          {' · '}
          <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Return home</Link>
        </p>
      </div>

      {/* ── Right: visual panel ── */}
      <div style={{ flex: 1, background: '#0b1220', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 48, overflow: 'hidden' }}>
        {/* Image placeholder */}
        <div style={{ flex: 1, borderRadius: 24, background: 'linear-gradient(135deg,#1e2a3a 0%,#0d1829 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ textAlign: 'center', color: '#2a3a55' }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>⚡</div>
            <p style={{ fontSize: 13, color: '#3a4e6a', margin: 0 }}>VOLT• Electronics</p>
          </div>
        </div>
        {/* Quote */}
        <p style={{ fontSize: 20, fontWeight: 400, color: '#fff', lineHeight: 1.4, margin: 0 }}>
          One account. Every device, order and recommendation in sync.
        </p>
      </div>
    </div>
  );
}

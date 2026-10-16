import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';

// ── Defined OUTSIDE the component — no re-render, no focus loss ──────────────
function Field({ label, type = 'text', value, onChange, error, placeholder, isNarrow }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 12, color: '#101828', fontWeight: 500 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field${error ? ' error' : ''}`}
        style={{ width: '100%', minHeight: isNarrow ? 48 : 44, height: isNarrow ? 48 : undefined }}
      />
      {error && <p style={{ fontSize: 11, color: '#d92d20', margin: 0 }}>{error}</p>}
    </div>
  );
}

export default function SignUpPage() {
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [agreed,    setAgreed]    = useState(false);
  const [errors,    setErrors]    = useState({});
  const [serverErr, setServerErr] = useState('');
  const [loading,   setLoading]   = useState(false);

  const { isMobile, isTablet } = useResponsive();

  const { signup } = useAuth();
  const navigate   = useNavigate();

  const validate = () => {
    const e = {};
    if (!name.trim())                                      e.name     = 'Full name is required.';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))   e.email    = 'Enter a valid email address.';
    if (!password || password.length < 8)                  e.password = 'Password must be at least 8 characters.';
    if (password !== confirm)                              e.confirm  = 'Passwords do not match.';
    if (!agreed)                                           e.agreed   = 'You must agree to the Terms of Service.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setServerErr(''); setLoading(true);
    const result = await signup(name.trim(), email.trim(), password);
    setLoading(false);
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setServerErr(result.error || 'Could not create account. Please try again.');
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

      {/* ── LEFT — fixed image (hidden on mobile/tablet) ── */}
      {!isNarrow && (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200&h=900&fit=crop&q=85"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,18,32,0.5)' }} />
          <div style={{ position: 'absolute', top: 48, left: 48 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              VOLT<span style={{ color: '#2563eb' }}>•</span>
            </span>
          </div>
          <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48 }}>
            <h2 style={{ fontSize: 26, fontWeight: 400, color: '#fff', lineHeight: 1.4, margin: '0 0 10px' }}>
              Your next device, made easier.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.55 }}>
              Save favorites, track orders and get recommendations tuned to your setup.
            </p>
          </div>
        </div>
      )}

      {/* ── RIGHT — form ── */}
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
          <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
            Create your VOLT account
          </p>
          <h1 style={{ fontSize: 30, fontWeight: 400, color: '#101828', margin: '0 0 6px', lineHeight: 1.15 }}>
            Join the smarter way to shop tech.
          </h1>
          <p style={{ fontSize: 13, color: '#667085', margin: '0 0 4px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>

          {serverErr && (
            <div style={{ padding: '10px 14px', background: '#feeceb', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#d92d20', margin: '16px 0' }}>
              {serverErr}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 }}>

            <Field
              label="Full name"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
              error={errors.name}
              placeholder="Jordan Lee"
              isNarrow={isNarrow}
            />
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
              error={errors.email}
              placeholder="you@example.com"
              isNarrow={isNarrow}
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
              error={errors.password}
              placeholder="At least 8 characters"
              isNarrow={isNarrow}
            />
            <Field
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: '' })); }}
              error={errors.confirm}
              placeholder="Repeat your password"
              isNarrow={isNarrow}
            />

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed: '' })); }}
                style={{ marginTop: 2, width: 14, height: 14, accentColor: '#2563eb', flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: '#667085', lineHeight: 1.5 }}>
                I agree to the{' '}
                <span style={{ color: '#2563eb', cursor: 'pointer' }}>Terms of Service</span>
                {' '}and{' '}
                <span style={{ color: '#2563eb', cursor: 'pointer' }}>Privacy Policy</span>
              </span>
            </label>
            {errors.agreed && <p style={{ fontSize: 11, color: '#d92d20', margin: '-12px 0 0' }}>{errors.agreed}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', minHeight: 44, height: 44,
                background: loading ? '#93c5fd' : '#2563eb',
                color: '#fff', border: 'none', borderRadius: 10, fontSize: 14,
                fontWeight: 600, cursor: loading ? 'default' : 'pointer',
                fontFamily: 'inherit', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: '#98a2b3', marginTop: 20 }}>
            Your information is encrypted and never sold.
          </p>
          <Link to="/" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none' }}>Return home</Link>
        </div>
      </div>
    </div>
  );
}

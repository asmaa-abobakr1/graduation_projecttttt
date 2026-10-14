import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SignUpPage() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading]   = useState(false);

  const { signup } = useAuth();
  const navigate   = useNavigate();

  const validate = () => {
    const e = {};
    if (!name.trim())                    e.name     = 'Full name is required.';
    if (!email.trim())                   e.email    = 'Enter a valid email address.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email  = 'Enter a valid email address, such as name@example.com.';
    if (!password)                       e.password = 'Password must be at least 8 characters.';
    else if (password.length < 8)        e.password = 'Password must be at least 8 characters.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setServerErr('');
    setLoading(true);
    const result = await signup(name.trim(), email.trim(), password);
    setLoading(false);
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setServerErr(result.error || 'Could not create account. Please try again.');
    }
  };

  const Field = ({ label, type = 'text', value, onChange, error, placeholder }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}>
      <label style={{ fontSize: 12, color: '#101828' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field${error ? ' error' : ''}`}
      />
      {error && <p style={{ fontSize: 11, color: '#d92d20', margin: 0 }}>{error}</p>}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7fb' }}>

      {/* ── Left: form ── */}
      <div style={{ width: 650, background: '#fff', display: 'flex', flexDirection: 'column', gap: 24, padding: '88px 120px', overflowY: 'auto', flexShrink: 0 }}>

        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 23, fontWeight: 800, color: '#101828' }}>VOLT<span style={{ color: '#2563eb' }}>•</span></span>
        </Link>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 36, fontWeight: 400, color: '#101828', lineHeight: 'normal', margin: 0 }}>Create your account.</p>
          <p style={{ fontSize: 14, color: '#667085', lineHeight: 1.5, margin: 0 }}>
            Join VOLT to track orders, save devices and get personalised picks.
          </p>
        </div>

        {serverErr && (
          <div style={{ padding: '10px 14px', background: '#feeceb', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#d92d20' }}>
            {serverErr}
          </div>
        )}

        <Field label="Full name"     value={name}     onChange={e => { setName(e.target.value);     setErrors(p => ({ ...p, name: '' }));     }} error={errors.name}     placeholder="Jordan Smith" />
        <Field label="Email"         type="email" value={email}    onChange={e => { setEmail(e.target.value);    setErrors(p => ({ ...p, email: '' }));    }} error={errors.email}    placeholder="you@example.com" />
        <Field label="Password"      type="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }} error={errors.password} placeholder="At least 8 characters" />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', height: 44, background: loading ? '#93c5fd' : '#2563eb', color: '#fff', border: '1px solid #2563eb', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8'; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        <p style={{ fontSize: 13, color: '#667085', margin: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
        <p style={{ fontSize: 12, margin: 0 }}>
          <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Return home</Link>
        </p>
      </div>

      {/* ── Right: visual panel ── */}
      <div style={{ flex: 1, background: '#0b1220', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 48, overflow: 'hidden' }}>
        <div style={{ flex: 1, borderRadius: 24, background: 'linear-gradient(135deg,#1e2a3a 0%,#0d1829 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ textAlign: 'center', color: '#2a3a55' }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>⚡</div>
            <p style={{ fontSize: 13, color: '#3a4e6a', margin: 0 }}>VOLT• Electronics</p>
          </div>
        </div>
        <p style={{ fontSize: 20, fontWeight: 400, color: '#fff', lineHeight: 1.4, margin: 0 }}>
          Your next device is one tap away. Build your wishlist, track orders and compare specs — all in one place.
        </p>
      </div>
    </div>
  );
}

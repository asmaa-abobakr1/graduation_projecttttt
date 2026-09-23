import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const imgLogin = 'https://www.figma.com/api/mcp/asset/d98f746e-e626-4423-aee1-639a901aa31b.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in both email and password.'); return; }
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.success) {
        navigate(res.user.role === 'admin' ? '/admin' : (from === '/admin' ? '/' : from));
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    }, 400);
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') { setEmail('admin@volt.com'); setPassword('admin123'); }
    else { setEmail('john@email.com'); setPassword('user123'); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f4f7fb' }}>
      {/* Left — Login Form */}
      <div className="bg-white flex flex-col gap-6 items-start overflow-y-auto px-[120px] py-[88px] w-[650px] shrink-0">
        <Link to="/" className="text-[23px] font-extrabold text-[#101828]">VOLT•</Link>

        <div className="flex flex-col gap-2">
          <p className="text-[36px] font-normal text-[#101828] leading-tight">Welcome back.</p>
          <p className="text-[14px] text-[#667085] leading-relaxed">
            Sign in to manage orders, saved devices and your account.
          </p>
        </div>

        {/* Quick Demo Access */}
        <div className="w-full p-3 rounded-xl bg-[#f4f7fb] border border-[#dde4ee]">
          <p className="text-[11px] font-semibold text-[#667085] uppercase tracking-wide mb-2 text-center">Quick Demo Access</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => handleQuickLogin('admin')}
              className="py-1.5 px-2.5 rounded-lg text-[12px] font-semibold bg-[#e8f0ff] text-[#2563eb] hover:bg-[#d1e3ff] border border-[#c3d6f9] transition-colors">
              Demo Admin
            </button>
            <button type="button" onClick={() => handleQuickLogin('customer')}
              className="py-1.5 px-2.5 rounded-lg text-[12px] font-semibold bg-[#e8f8f1] text-[#078a55] hover:bg-[#d0f0e2] border border-[#b3e6cc] transition-colors">
              Demo Customer
            </button>
          </div>
        </div>

        {error && (
          <div className="w-full p-3 rounded-xl bg-[#feeceb] border border-[#fca99f] text-[#d92d20] text-[12px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[12px] text-[#101828]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] transition-colors bg-white"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[12px] text-[#101828]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] transition-colors bg-white"
              required
            />
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-[18px] bg-[#2563eb] rounded-full relative cursor-pointer">
                <div className="absolute left-[2px] top-[2px] w-[14px] h-[14px] bg-white rounded-full" />
              </div>
              <span className="text-[12px] text-[#101828]">Remember Me</span>
            </div>
            <button type="button" onClick={() => alert('Password reset: use admin123 or user123')}
              className="text-[12px] text-[#2563eb] hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-[44px] bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[14px] font-normal rounded-[10px] transition-colors disabled:opacity-60 border border-[#2563eb]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-[13px] text-[#667085]">
          New to VOLT?{' '}
          <Link to="/signup" className="text-[#2563eb] hover:underline">Create an account</Link>
        </p>
        <div className="flex gap-5 text-[12px] text-[#2563eb]">
          <Link to="/admin" className="hover:underline">Continue to dashboard</Link>
          <span className="text-[#dde4ee]">·</span>
          <Link to="/" className="hover:underline">Return home</Link>
        </div>
      </div>

      {/* Right — Visual Panel */}
      <div className="bg-[#0b1220] flex-1 flex flex-col items-start justify-between overflow-hidden p-12">
        <div className="w-full flex-1 rounded-[24px] overflow-hidden" style={{ maxHeight: '680px' }}>
          <img src={imgLogin} alt="VOLT device" className="w-full h-full object-cover rounded-[24px]" />
        </div>
        <p className="text-[20px] text-white mt-8 leading-relaxed">
          One account. Every device, order and recommendation in sync.
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const imgDevice = 'https://www.figma.com/api/mcp/asset/be02075b-720c-442c-a71e-24721f186352.png';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please provide your full name.'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Please provide a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (!agreeTerms) { setError('You must agree to the Terms of Service.'); return; }
    setLoading(true);
    setTimeout(() => {
      const res = signup(name.trim(), email.trim(), password, role);
      setLoading(false);
      if (res.success) { navigate(role === 'admin' ? '/admin' : '/'); }
      else { setError(res.error || 'Registration failed.'); }
    }, 400);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — Dark Brand Panel */}
      <div className="bg-[#0b1220] flex flex-col justify-between overflow-hidden p-14 w-[650px] shrink-0">
        <span className="text-[23px] font-extrabold text-white">VOLT•</span>

        <div className="w-full rounded-[24px] overflow-hidden" style={{ height: '520px' }}>
          <img src={imgDevice} alt="VOLT device" className="w-full h-full object-cover rounded-[24px]" />
        </div>

        <div className="flex flex-col gap-[10px]">
          <p className="text-[30px] text-white leading-tight">Your next device, made easier.</p>
          <p className="text-[14px] text-[#aeb8c8] leading-relaxed">
            Save favorites, track orders and get recommendations tuned to your setup.
          </p>
        </div>
      </div>

      {/* Right — Registration Form */}
      <div className="flex-1 flex flex-col gap-[22px] items-start overflow-y-auto px-[150px] py-[90px]">
        <p className="text-[12px] font-bold text-[#2563eb] uppercase tracking-widest">
          CREATE YOUR VOLT ACCOUNT
        </p>
        <p className="text-[34px] text-[#101828] leading-tight">
          Join the smarter way to shop tech.
        </p>
        <p className="text-[14px] text-[#667085]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2563eb] hover:underline">Sign in</Link>
        </p>

        {/* Account Type */}
        <div className="w-full">
          <label className="block text-[12px] text-[#101828] mb-2">Account Type</label>
          <div className="flex gap-2 p-1 bg-[#f4f7fb] rounded-xl border border-[#dde4ee]">
            <button type="button" onClick={() => setRole('customer')}
              className={`flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'customer' ? 'bg-[#2563eb] text-white shadow-sm' : 'text-[#667085] hover:text-[#101828]'
              }`}>
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
            <button type="button" onClick={() => setRole('admin')}
              className={`flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'admin' ? 'bg-[#2563eb] text-white shadow-sm' : 'text-[#667085] hover:text-[#101828]'
              }`}>
              <Shield className="w-3.5 h-3.5" />
              <span>Store Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="w-full p-3 rounded-xl bg-[#feeceb] border border-[#fca99f] text-[#d92d20] text-[12px] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="flex flex-col gap-[22px] w-full" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[12px] text-[#101828]">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Lee"
              className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] transition-colors bg-white"
              required />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[12px] text-[#101828]">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@example.com"
              className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] transition-colors bg-white"
              required />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[12px] text-[#101828]">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] transition-colors bg-white"
              required />
            <p className="text-[11px] text-[#667085]">Use 8+ characters with a number and symbol.</p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[12px] text-[#101828]">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••"
              className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] transition-colors bg-white"
              required />
          </div>

          {/* Terms */}
          <div className="flex items-center gap-[10px]">
            <input id="terms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-[18px] h-[18px] rounded border-[#dde4ee] accent-[#2563eb] cursor-pointer" />
            <label htmlFor="terms" className="text-[12px] text-[#667085] cursor-pointer">
              I agree to the <span className="text-[#2563eb]">Terms of Service</span> and <span className="text-[#2563eb]">Privacy Policy</span>.
            </label>
          </div>

          <button type="submit" disabled={loading}
            className="h-[44px] bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[14px] font-normal rounded-[10px] transition-colors disabled:opacity-60 border border-[#2563eb]">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-[11px] text-[#667085]">🔒 Your information is encrypted and never sold.</p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from === '/admin' ? '/' : from);
        }
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    }, 400);
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@volt.com');
      setPassword('admin123');
    } else {
      setEmail('john@email.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <span className="text-3xl font-black tracking-tight text-white">
            VOLT<span className="text-blue-500">.</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Or{' '}
          <Link to="/signup" className="font-semibold text-blue-400 hover:text-blue-300">
            create a new account today
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-950/80 backdrop-blur-md py-8 px-6 sm:px-10 rounded-2xl border border-slate-800 shadow-2xl">
          
          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition-colors"
              >
                Demo Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition-colors"
              >
                Demo Customer
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset is simulated. Use admin123 or user123'); }} className="text-xs text-blue-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400">
                Remember this device for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-400">
              ← Return to Storefront
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

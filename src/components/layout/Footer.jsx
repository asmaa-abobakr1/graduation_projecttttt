import { Link } from 'react-router-dom';
import { 
  Zap, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Mail, 
  ArrowRight,
  Globe,
  MessageSquare,
  Share2,
  Compass
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Value Proposition Bar */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400">On all device orders over $500</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">2-Year Official Warranty</h4>
                <p className="text-xs text-slate-400">Certified genuine electronic devices</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Cash on Delivery</h4>
                <p className="text-xs text-slate-400">Inspect upon arrival before payment</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
              <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">24/7 Tech Specialists</h4>
                <p className="text-xs text-slate-400">Expert guidance on every spec</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block text-2xl font-black tracking-tight text-white">
              VOLT<span className="text-blue-500">.</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Precision-engineered electronics and next-generation personal devices. Curated for performance, battery endurance, and seamless productivity.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#globe" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors" title="Global Store">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#message" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors" title="Support Chat">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#share" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-colors" title="Community">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#explore" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-colors" title="Tech Radar">
                <Compass className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Categories</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/search?category=Laptops" className="hover:text-white transition-colors">Performance Laptops</Link>
              </li>
              <li>
                <Link to="/search?category=Phones" className="hover:text-white transition-colors">Flagship Smartphones</Link>
              </li>
              <li>
                <Link to="/search?category=Tablets" className="hover:text-white transition-colors">Creative Tablets</Link>
              </li>
              <li>
                <Link to="/search?category=Accessories" className="hover:text-white transition-colors">Audio & Accessories</Link>
              </li>
              <li>
                <Link to="/compare" className="text-blue-400 hover:text-blue-300 font-medium">Device Comparison Matrix</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Navigation & Portals</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/search" className="hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Account Login</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">Register Account</Link>
              </li>
              <li>
                <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                  <span>Admin Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Tech Briefing</h5>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get notified of device drops, hardware benchmarks, and exclusive member discounts.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to VOLT tech updates!'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter email..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} VOLT Inc. All rights reserved. Built with React & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

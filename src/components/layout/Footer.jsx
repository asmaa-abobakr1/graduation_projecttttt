import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0b1220] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Footer Columns */}
        <div className="flex flex-wrap gap-8 justify-between">
          {/* Brand Summary */}
          <div className="flex flex-col gap-2.5 items-start min-w-[200px] max-w-[280px]">
            <span className="text-[20px] font-extrabold text-white tracking-tight">VOLT•</span>
            <p className="text-[12px] text-[#aeb8c8] leading-relaxed">
              Curated technology, expert guidance and dependable delivery.
            </p>
          </div>

          {/* Shop Links */}
          <div className="flex flex-col gap-2 items-start text-[12px]">
            <span className="font-bold text-white mb-1">Shop</span>
            <Link to="/search?category=Phones"    className="text-[#aeb8c8] hover:text-white transition-colors">Phones</Link>
            <Link to="/search?category=Laptops"   className="text-[#aeb8c8] hover:text-white transition-colors">Laptops</Link>
            <Link to="/search?category=Audio"     className="text-[#aeb8c8] hover:text-white transition-colors">Audio</Link>
            <Link to="/search?category=Gaming"    className="text-[#aeb8c8] hover:text-white transition-colors">Gaming</Link>
            <Link to="/search?category=Tablets"   className="text-[#aeb8c8] hover:text-white transition-colors">Tablets</Link>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-2 items-start text-[12px]">
            <span className="font-bold text-white mb-1">Support</span>
            <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Help center</span>
            <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Delivery</span>
            <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Returns</span>
            <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Warranty</span>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-2 items-start text-[12px]">
            <span className="font-bold text-white mb-1">Company</span>
            <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">About</span>
            <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Careers</span>
            <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Journal</span>
            <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Press</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-[#2a3349] my-7" />

        {/* Legal */}
        <p className="text-[11px] text-[#8d99aa]">
          © {new Date().getFullYear()} VOLT Commerce · Privacy · Terms · Accessibility
        </p>
      </div>
    </footer>
  );
}

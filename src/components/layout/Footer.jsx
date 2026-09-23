import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0b1220] flex flex-col gap-9 items-start px-16 py-12 w-full">
      {/* Footer Columns */}
      <div className="flex items-start justify-between w-full">
        {/* Brand Summary */}
        <div className="flex flex-col gap-3 items-start w-[300px]">
          <span className="text-[24px] font-extrabold text-white tracking-tight">VOLT•</span>
          <p className="text-[13px] text-[#aeb8c8] leading-relaxed">
            Curated technology, expert guidance and dependable delivery.
          </p>
        </div>

        {/* Shop Links */}
        <div className="flex flex-col gap-[10px] items-start text-[12px]">
          <span className="font-bold text-white">Shop</span>
          <Link to="/search?category=Phones" className="text-[#aeb8c8] hover:text-white transition-colors">Phones</Link>
          <Link to="/search?category=Laptops" className="text-[#aeb8c8] hover:text-white transition-colors">Laptops</Link>
          <Link to="/search?category=Audio" className="text-[#aeb8c8] hover:text-white transition-colors">Audio</Link>
        </div>

        {/* Support Links */}
        <div className="flex flex-col gap-[10px] items-start text-[12px]">
          <span className="font-bold text-white">Support</span>
          <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Help center</span>
          <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Delivery</span>
          <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Returns</span>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-[10px] items-start text-[12px]">
          <span className="font-bold text-white">Company</span>
          <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">About</span>
          <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Careers</span>
          <span className="text-[#aeb8c8] hover:text-white transition-colors cursor-pointer">Journal</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-[#2a3349]" />

      {/* Legal */}
      <p className="text-[11px] text-[#8d99aa]">
        © {new Date().getFullYear()} VOLT Commerce · Privacy · Terms · Accessibility
      </p>
    </footer>
  );
}

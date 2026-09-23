import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../../components/products/ProductCard';

const imgEditorial = 'https://www.figma.com/api/mcp/asset/2ebd961a-78f9-4c3c-8c46-c435d922215f.png';
const imgLifestyle = 'https://www.figma.com/api/mcp/asset/8caf97be-1a2e-410d-84cd-e7a3214552a1.png';

export default function HomePage() {
  const { products } = useProducts();
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const featuredProducts = products.slice(0, 4);

  const categoryShortcuts = [
    { name: 'Smartphones', path: '/search?category=Phones' },
    { name: 'Computing', path: '/search?category=Laptops' },
    { name: 'Audio', path: '/search?category=Audio' },
    { name: 'Gaming', path: '/search?category=Gaming' },
    { name: 'Smart home', path: '/search?category=Wearables' },
    { name: 'Accessories', path: '/search?category=Accessories' },
  ];

  return (
    <div className="flex flex-col items-start w-full bg-white">

      {/* ── Hero ── */}
      <section className="bg-[#f4f7fb] flex gap-[52px] items-start w-full px-16 pt-[52px] pb-[52px]" style={{ minHeight: '570px' }}>
        <div className="flex flex-col gap-[22px] items-start justify-center w-[520px] shrink-0 py-4">
          <p className="text-[12px] font-bold text-[#2563eb] tracking-widest uppercase">
            THE 2026 FLAGSHIP EDIT
          </p>
          <h1 className="text-[54px] text-[#101828] leading-[1.02] font-normal">
            Future-ready devices. Curated for real life.
          </h1>
          <p className="text-[17px] text-[#667085] leading-[1.55]">
            Meet the latest phones, laptops and audio—expertly selected, responsibly delivered, and supported for the long run.
          </p>
          <div className="flex gap-3 items-start">
            <Link to="/search"
              className="h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] px-[18px] rounded-[10px] flex items-center justify-center hover:bg-[#1d4ed8] transition-colors">
              Shop new releases
            </Link>
            <Link to="/compare"
              className="h-[44px] bg-white border border-[#dde4ee] text-[#101828] text-[14px] px-[18px] rounded-[10px] flex items-center justify-center hover:bg-[#f4f7fb] transition-colors">
              Explore buying guides
            </Link>
          </div>
          <p className="text-[12px] text-[#667085]">
            Free 2-day delivery · 30-day returns · Expert support
          </p>
        </div>

        <div className="flex-1 min-w-0 rounded-[24px] overflow-hidden" style={{ height: '466px' }}>
          <img src={imgEditorial} alt="Featured devices" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* ── Category Shortcuts ── */}
      <section className="flex items-start justify-between w-full px-16 py-[30px]">
        {categoryShortcuts.map((cat) => (
          <Link key={cat.name} to={cat.path}
            className="bg-[#f4f7fb] flex flex-col gap-2 items-start p-4 rounded-[16px] w-[190px] hover:bg-[#e8f0ff] transition-colors">
            <span className="text-[14px] font-bold text-[#101828]">{cat.name}</span>
            <span className="text-[12px] text-[#2563eb]">Shop collection →</span>
          </Link>
        ))}
      </section>

      {/* ── Featured Products ── */}
      <section className="flex flex-col gap-7 items-start w-full px-16 py-14">
        <div className="flex items-end justify-between w-full">
          <div className="flex flex-col gap-[5px]">
            <p className="text-[11px] font-bold text-[#2563eb] uppercase tracking-widest">Editor's picks</p>
            <p className="text-[28px] text-[#101828]">Technology worth upgrading for</p>
          </div>
          <Link to="/search" className="text-[13px] text-[#2563eb] hover:underline">
            View all products →
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-[22px] w-full">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center w-full mt-4">
          <Link to="/search"
            className="h-[44px] bg-white border border-[#dde4ee] text-[#101828] text-[14px] px-8 rounded-[10px] flex items-center justify-center hover:bg-[#f4f7fb] transition-colors">
            View All {products.length} Electronic Devices
          </Link>
        </div>
      </section>

      {/* ── Editorial Promotion ── */}
      <section className="bg-[#f4f7fb] flex gap-6 items-start w-full px-16 py-14">
        <div className="rounded-[24px] overflow-hidden shrink-0" style={{ width: '760px', height: '390px' }}>
          <img src={imgLifestyle} alt="Creator essentials" className="w-full h-full object-cover" />
        </div>
        <div className="bg-[#0b1220] flex-1 flex flex-col gap-[18px] items-start justify-center min-w-0 p-12 rounded-[24px]" style={{ minHeight: '390px' }}>
          <p className="text-[12px] text-[#8fb4ff] uppercase tracking-widest">CREATOR ESSENTIALS</p>
          <p className="text-[34px] text-white leading-tight">
            Tools that keep up with your best ideas.
          </p>
          <p className="text-[15px] text-[#b9c4d6] leading-relaxed">
            High-performance setups for focused work, fluid creation and every place inspiration finds you.
          </p>
          <Link to="/search"
            className="h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] px-[18px] rounded-[10px] flex items-center justify-center hover:bg-[#1d4ed8] transition-colors">
            Build your setup
          </Link>
        </div>
      </section>

      {/* ── Value Propositions ── */}
      <section className="flex gap-6 items-start w-full px-16 py-11">
        {[
          { title: 'Fast, tracked delivery', desc: 'Free on orders over $50' },
          { title: '30-day returns', desc: 'Simple, no-stress returns' },
          { title: 'Expert device support', desc: 'Real people, seven days a week' },
          { title: 'Secure checkout', desc: 'Protected payments and privacy' },
        ].map((vp) => (
          <div key={vp.title} className="flex-1 flex flex-col gap-[7px] items-start">
            <p className="text-[15px] font-bold text-[#101828]">{vp.title}</p>
            <p className="text-[12px] text-[#667085]">{vp.desc}</p>
          </div>
        ))}
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-[#e8f0ff] flex items-center justify-between w-full px-16 py-12">
        <div className="flex flex-col gap-[7px]">
          <p className="text-[25px] text-[#101828]">Good tech news, thoughtfully edited.</p>
          <p className="text-[13px] text-[#667085]">Launches, guides and member-only pricing. No noise.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); setNewsletterEmail(''); }}
          className="flex gap-[10px] items-center">
          <div className="bg-white rounded-[10px] h-[44px] flex items-center px-[14px] w-[330px]">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Email address"
              className="bg-transparent flex-1 text-[13px] text-[#101828] placeholder-[#98a2b3] outline-none"
              required
            />
          </div>
          <button type="submit"
            className="h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] px-[18px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </section>

    </div>
  );
}

import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

export default function ComparisonPage() {
  const { products, compareList, toggleCompare } = useProducts();
  const { addToCart } = useCart();

  const compareProducts = products.filter(p => compareList.includes(p.id));

  const specKeys = compareProducts.length > 0
    ? [...new Set(compareProducts.flatMap(p => Object.keys(p.specs || {})))]
    : ['Processor', 'Display', 'RAM', 'Storage', 'Battery', 'Camera', 'OS'];

  return (
    <div className="bg-white flex flex-col items-start w-full">
      {/* Page Heading */}
      <div className="flex flex-col gap-[21px] items-start px-16 pt-[42px] pb-8 border-b border-[#dde4ee] w-full">
        <p className="text-[11px] font-bold text-[#2563eb] uppercase tracking-widest">Smart device comparison</p>
        <p className="text-[36px] text-[#101828] leading-tight">Compare devices side-by-side</p>
        <p className="text-[14px] text-[#667085]">
          Select up to 3 products to compare specifications, pricing and features.
        </p>
      </div>

      <div className="flex flex-col gap-6 items-start px-16 py-9 w-full">

        {compareProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-20 gap-6">
            <p className="text-[64px]">⚖️</p>
            <p className="text-[24px] text-[#101828]">No products to compare</p>
            <p className="text-[14px] text-[#667085]">Browse products and click the compare button to add them here.</p>
            <Link to="/search"
              className="h-[44px] bg-[#2563eb] text-white text-[14px] px-[18px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            {/* Product Headers Row */}
            <div className="flex items-start gap-0 w-full border border-[#dde4ee] rounded-[16px] overflow-hidden">
              {/* Label Column */}
              <div className="w-[210px] shrink-0 bg-[#f4f7fb] border-r border-[#dde4ee]" style={{ minHeight: '100px' }} />

              {/* Product Columns */}
              {compareProducts.map((p) => (
                <div key={p.id} className="flex-1 flex flex-col gap-4 items-start p-4 border-r border-[#dde4ee] last:border-r-0 min-w-0">
                  <div className="w-full rounded-[16px] overflow-hidden bg-[#f4f7fb]" style={{ height: '190px' }}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[17px] font-semibold text-[#101828] truncate w-full">{p.name}</p>
                  <p className="text-[18px] text-[#101828]">${p.price?.toLocaleString()}</p>
                  <p className="text-[12px] text-[#d97706]">
                    {'★'.repeat(Math.round(p.rating || 4))} {p.rating}
                  </p>
                  <span className={`text-[11px] px-[9px] py-[5px] rounded-full ${
                    p.stock > 0 ? 'bg-[#e8f8f1] text-[#078a55]' : 'bg-[#feeceb] text-[#d92d20]'
                  }`}>
                    {p.stock > 0 ? 'In stock' : 'Out of stock'}
                  </span>
                  <p className="text-[13px] text-[#667085] line-clamp-2">{p.description}</p>
                  <div className="flex gap-2 w-full">
                    <button onClick={() => addToCart(p, 1)}
                      className="flex-1 h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors">
                      Add to cart
                    </button>
                    <button onClick={() => toggleCompare(p.id)}
                      className="h-[44px] px-[18px] bg-white border border-[#dde4ee] text-[#101828] text-[14px] rounded-[10px] hover:bg-[#f4f7fb] transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty Slots */}
              {[...Array(3 - compareProducts.length)].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-center p-4 border-r border-[#dde4ee] last:border-r-0 min-w-0 min-h-[437px]">
                  <Link to="/search"
                    className="flex flex-col items-center gap-2 text-[#98a2b3] hover:text-[#2563eb] transition-colors">
                    <span className="text-[32px]">+</span>
                    <span className="text-[13px]">Add product</span>
                  </Link>
                </div>
              ))}
            </div>

            {/* Spec Matrix */}
            <div className="flex flex-col items-start w-full border border-[#dde4ee] rounded-[16px] overflow-hidden">
              {/* Table Header */}
              <div className="bg-[#eef3f9] flex items-center w-full min-h-[38px]">
                <div className="w-[210px] shrink-0 px-3">
                  <p className="text-[11px] font-bold text-[#667085] uppercase">Specification</p>
                </div>
                {compareProducts.map((p) => (
                  <div key={p.id} className="flex-1 px-3 min-w-0">
                    <p className="text-[11px] font-bold text-[#667085] uppercase truncate">{p.name}</p>
                  </div>
                ))}
                {[...Array(3 - compareProducts.length)].map((_, i) => (
                  <div key={i} className="flex-1 px-3 min-w-0" />
                ))}
              </div>

              {specKeys.map((key) => (
                <div key={key} className="border-b border-[#dde4ee] flex items-center w-full min-h-[52px]">
                  <div className="w-[210px] shrink-0 px-3">
                    <p className="text-[12px] text-[#101828]">{key}</p>
                  </div>
                  {compareProducts.map((p) => (
                    <div key={p.id} className="flex-1 px-3 min-w-0">
                      <p className="text-[12px] text-[#667085] truncate">{p.specs?.[key] || '—'}</p>
                    </div>
                  ))}
                  {[...Array(3 - compareProducts.length)].map((_, i) => (
                    <div key={i} className="flex-1 px-3 min-w-0">
                      <p className="text-[12px] text-[#98a2b3]">—</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Guidance Banner */}
            <div className="bg-[#f4f7fb] border border-[#dde4ee] flex items-center justify-between w-full p-6 rounded-[16px]">
              <div>
                <p className="text-[16px] font-semibold text-[#101828]">Need help deciding?</p>
                <p className="text-[12px] text-[#667085] mt-1">
                  Our product experts can guide you to the right device for your needs.
                </p>
              </div>
              <Link to="/search"
                className="h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] px-[18px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors whitespace-nowrap">
                Browse all products
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

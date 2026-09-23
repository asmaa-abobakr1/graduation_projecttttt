import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/products/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, products, toggleCompare, compareList } = useProducts();
  const { addToCart } = useCart();

  const product = getProduct(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-16 py-20 text-center">
        <h2 className="text-[24px] font-bold text-[#101828]">Product not found</h2>
        <p className="text-[#667085] mt-2 mb-6">The requested device does not exist or has been removed.</p>
        <Link to="/search" className="inline-flex items-center gap-2 px-5 h-[44px] bg-[#2563eb] text-white rounded-[10px] text-[14px]">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const isCompared = compareList.includes(product.id);
  const gallery = product.images?.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleToggleCompare = () => {
    if (!isCompared && compareList.length >= 3) {
      alert('You can compare up to 3 devices simultaneously.'); return;
    }
    toggleCompare(product.id);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const colors = ['Natural', 'Black', 'Blue', 'White'];
  const storages = ['256 GB', '512 GB', '1 TB'];

  return (
    <div className="bg-white flex flex-col items-start w-full">

      {/* Product Detail Content */}
      <div className="flex flex-col gap-12 items-start px-16 py-8 w-full">

        {/* Breadcrumb */}
        <p className="text-[11px] text-[#667085]">
          <Link to="/" className="hover:text-[#2563eb]">Home</Link>
          {' / '}
          <Link to={`/search?category=${product.category}`} className="hover:text-[#2563eb]">{product.category}</Link>
          {' / '}
          <span className="text-[#101828]">{product.name}</span>
        </p>

        {/* Product Overview */}
        <div className="flex gap-12 items-start w-full">
          {/* Gallery */}
          <div className="flex gap-[14px] items-start w-[700px] shrink-0">
            {/* Thumbnails */}
            <div className="flex flex-col gap-[10px] items-start w-[90px] shrink-0">
              {gallery.slice(0, 4).map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`w-[90px] h-[90px] rounded-[10px] overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-[#2563eb]' : 'border-[#dde4ee] hover:border-[#b0bcd4]'
                  }`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 rounded-[24px] overflow-hidden" style={{ height: '610px' }}>
              <img src={gallery[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Purchase Panel */}
          <div className="flex-1 flex flex-col gap-[18px] items-start min-w-0">
            {/* Badge */}
            <span className="bg-[#e8f0ff] text-[#2563eb] text-[11px] px-[9px] py-[5px] rounded-full">
              {product.tags?.includes('New') ? 'New release' : product.brand}
            </span>

            <h1 className="text-[38px] text-[#101828] leading-tight font-normal">{product.name}</h1>

            <p className="text-[13px] text-[#d97706]">
              {'★'.repeat(Math.round(product.rating || 5))} {product.rating || '4.9'} · {product.reviews || 248} reviews
            </p>

            <p className="text-[30px] text-[#101828] font-normal">${product.price?.toLocaleString()}.00</p>

            <p className="text-[13px] text-[#667085]">
              or ${(product.price / 24).toFixed(2)}/month for 24 months at 0% APR
            </p>

            {/* Color Options */}
            <div className="flex flex-col gap-[10px]">
              <p className="text-[12px] font-bold text-[#101828]">Finish · {colors[selectedColor]}</p>
              <div className="flex gap-2">
                {colors.map((c, i) => (
                  <button key={c} onClick={() => setSelectedColor(i)}
                    className={`text-[11px] px-[9px] py-[5px] rounded-full transition-all ${
                      selectedColor === i
                        ? 'bg-[#e8f0ff] text-[#2563eb]'
                        : 'bg-[#eef3f9] text-[#667085] hover:bg-[#e2e8f0]'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>

              <p className="text-[12px] font-bold text-[#101828]">Storage</p>
              <div className="flex gap-2">
                {storages.map((s, i) => (
                  <button key={s} onClick={() => setSelectedStorage(i)}
                    className={`text-[11px] px-[9px] py-[5px] rounded-full transition-all ${
                      selectedStorage === i
                        ? 'bg-[#e8f0ff] text-[#2563eb]'
                        : 'bg-[#eef3f9] text-[#667085] hover:bg-[#e2e8f0]'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <span className={`text-[11px] px-[9px] py-[5px] rounded-full ${
              product.stock > 0 ? 'bg-[#e8f8f1] text-[#078a55]' : 'bg-[#feeceb] text-[#d92d20]'
            }`}>
              {product.stock > 0 ? `In stock · Ships today` : 'Out of stock'}
            </span>

            {/* Delivery */}
            <div className="flex flex-col gap-[5px]">
              <p className="text-[13px] text-[#101828]">Free delivery by Friday</p>
              <p className="text-[12px] text-[#667085]">Pickup available today at VOLT Downtown</p>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex gap-[10px] items-center">
              <div className="bg-[#eef3f9] flex items-center gap-2 px-[9px] py-[5px] rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#667085] hover:text-[#101828] font-bold w-5 text-center">−</button>
                <span className="text-[11px] text-[#667085] min-w-[20px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="text-[#667085] hover:text-[#101828] font-bold w-5 text-center">+</button>
              </div>

              <button onClick={handleAddToCart}
                className={`h-[44px] px-[18px] rounded-[10px] text-[14px] text-white border transition-all ${
                  addedAnimation
                    ? 'bg-[#078a55] border-[#078a55]'
                    : 'bg-[#2563eb] border-[#2563eb] hover:bg-[#1d4ed8]'
                }`}>
                {addedAnimation ? '✓ Added to cart!' : 'Add to cart'}
              </button>
            </div>

            <button onClick={() => navigate('/cart')}
              className="h-[44px] px-[18px] rounded-[10px] text-[14px] text-[#101828] bg-white border border-[#dde4ee] hover:bg-[#f4f7fb] transition-all">
              Buy now
            </button>

            <p className="text-[11px] text-[#667085]">Free returns · 2-year warranty · Secure checkout</p>
          </div>
        </div>

        {/* Benefits Bar */}
        <div className="flex gap-4 items-start w-full">
          {['Pro camera system', 'High performance', 'Long battery', 'Premium build'].map((b) => (
            <div key={b} className="bg-[#f4f7fb] flex-1 flex items-center p-[18px] rounded-[16px] min-w-0">
              <p className="text-[13px] text-[#101828]">{b}</p>
            </div>
          ))}
        </div>

        {/* Specifications */}
        <div className="flex flex-col gap-[18px] items-start w-full">
          <div className="flex items-end justify-between w-full">
            <div className="flex flex-col gap-[5px]">
              <p className="text-[11px] font-bold text-[#2563eb] uppercase tracking-widest">Technical details</p>
              <p className="text-[28px] text-[#101828]">Built beyond the benchmark</p>
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-[#eef3f9] border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[38px] px-3">
            <p className="flex-1 text-[11px] font-bold text-[#667085] uppercase">Specification</p>
            <p className="flex-1 text-[11px] font-bold text-[#667085] uppercase">Details</p>
          </div>

          {Object.entries(product.specs || {
            Display: '6.7-inch OLED · 120Hz',
            Processor: 'Flagship chip · 8-core',
            Camera: '48MP main · Ultra-wide',
            Battery: 'Up to 29h · Fast charge',
            Connectivity: '5G · Wi-Fi 7 · Bluetooth 5',
          }).map(([key, val]) => (
            <div key={key} className="bg-white border-b border-[#dde4ee] flex gap-3 items-center w-full min-h-[52px] px-3">
              <p className="flex-1 text-[12px] text-[#101828]">{key}</p>
              <p className="flex-1 text-[12px] text-[#101828]">{val}</p>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="flex gap-7 items-start w-full">
          <div className="flex flex-col gap-[10px] items-start w-[280px] shrink-0">
            <p className="text-[54px] text-[#101828] leading-none">{product.rating || '4.9'}</p>
            <p className="text-[18px] text-[#d97706]">★★★★★</p>
            <p className="text-[12px] text-[#667085]">Based on {product.reviews || 248} verified reviews</p>
            <button className="h-[44px] px-[18px] rounded-[10px] text-[14px] text-[#101828] bg-white border border-[#dde4ee] hover:bg-[#f4f7fb] transition-all">
              Write a review
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="bg-[#f4f7fb] flex flex-col gap-2 p-[18px] rounded-[16px]">
              <p className="text-[12px] text-[#d97706]">★★★★★</p>
              <p className="text-[15px] font-bold text-[#101828]">A serious camera upgrade</p>
              <p className="text-[13px] text-[#667085] leading-relaxed">The low-light detail is excellent, and the battery comfortably lasts my longest travel days.</p>
              <p className="text-[11px] text-[#101828]">Verified buyer</p>
            </div>
            <div className="bg-[#f4f7fb] flex flex-col gap-2 p-[18px] rounded-[16px]">
              <p className="text-[12px] text-[#d97706]">★★★★★</p>
              <p className="text-[15px] font-bold text-[#101828]">Premium in every detail</p>
              <p className="text-[13px] text-[#667085] leading-relaxed">Fast, balanced and surprisingly light. Setup from my previous phone took minutes.</p>
              <p className="text-[11px] text-[#101828]">Verified buyer</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <>
            <div className="flex items-end justify-between w-full">
              <p className="text-[28px] text-[#101828]">Related products</p>
              <Link to="/search" className="text-[13px] text-[#2563eb] hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-4 gap-5 w-full">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

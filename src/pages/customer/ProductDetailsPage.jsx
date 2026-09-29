import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Check, 
  Heart, 
  GitCompare, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ArrowLeft,
  Share2,
  Box,
  Cpu,
  Zap,
  Info
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/products/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, products, toggleCompare, compareList, toggleWishlist, isWishlisted } = useProducts();
  const { addToCart } = useCart();

  const product = getProduct(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'features' | 'reviews'

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Device Not Found</h2>
        <p className="text-slate-500 mt-2 mb-6 text-sm">The electronic device you are looking for does not exist or has been removed from the catalog.</p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isCompared = compareList.includes(product.id);
  const wishlisted = isWishlisted(product.id);
  const gallery = product.images?.length > 0 ? product.images : [product.image];

  // Storage and color options with price calculation
  const storages = [
    { label: '256 GB', extra: 0 },
    { label: '512 GB', extra: 150 },
    { label: '1 TB', extra: 350 },
  ];

  const colors = [
    { name: 'Space Gray / Dark', class: 'bg-slate-800' },
    { name: 'Silver / Platinum', class: 'bg-slate-300' },
    { name: 'Midnight Blue', class: 'bg-blue-900' },
    { name: 'Natural Titanium', class: 'bg-stone-400' },
  ];

  const currentPrice = product.price + (storages[selectedStorage]?.extra || 0);

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        price: currentPrice,
        selectedStorage: storages[selectedStorage]?.label,
        selectedColor: colors[selectedColor]?.name,
      },
      quantity
    );
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleToggleCompare = () => {
    if (!isCompared && compareList.length >= 4) {
      alert('You can compare up to 4 devices simultaneously.');
      return;
    }
    toggleCompare(product.id);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-slate-50/50 pb-20">
      
      {/* ── Breadcrumb & Navigation Bar ── */}
      <div className="w-full bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600 transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
          </nav>

          <Link
            to="/search"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>
      </div>

      {/* ── Main Product Detail Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ── Left: Image Gallery (cols 7) ── */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails row/column */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden p-2 bg-white border-2 transition-all shrink-0 ${
                    selectedImage === idx
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-100'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="flex-1 bg-white rounded-3xl border border-slate-200/90 p-8 flex items-center justify-center relative shadow-sm min-h-[360px] sm:min-h-[500px]">
              <img
                src={gallery[selectedImage] || product.image}
                alt={product.name}
                className="max-h-[440px] w-full object-contain hover:scale-105 transition-transform duration-500"
              />

              {/* Badges on main image */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                  {product.brand}
                </span>
                {product.tags?.includes('Best Seller') && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                    Best Seller
                  </span>
                )}
              </div>

              {/* Floating Wishlist & Compare Buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-full border shadow-sm transition-colors ${
                    wishlisted
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleToggleCompare}
                  className={`p-2.5 rounded-full border shadow-sm transition-colors ${
                    isCompared
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-blue-600'
                  }`}
                  title="Compare"
                >
                  <GitCompare className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

          {/* ── Right: Buy Box & Configuration (cols 5) ── */}
          <div className="lg:col-span-5 flex flex-col gap-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">
                  {product.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">SKU: {product.sku || `VLT-${product.id}`}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviews || 0} customer reviews)</span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    ${currentPrice.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${(product.originalPrice + (storages[selectedStorage]?.extra || 0)).toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  or ${(currentPrice / 12).toFixed(2)}/mo for 12 mos with 0% APR financing
                </span>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Color Finish Selection */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide block mb-2.5">
                Finish: <span className="text-blue-600 font-semibold">{colors[selectedColor].name}</span>
              </label>
              <div className="flex gap-3">
                {colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(i)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${c.class} ${
                      selectedColor === i
                        ? 'ring-4 ring-blue-500 ring-offset-2 scale-110 shadow-md'
                        : 'hover:scale-105 opacity-85'
                    }`}
                    title={c.name}
                  >
                    {selectedColor === i && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage / Configuration Selector */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide block mb-2.5">
                Storage Capacity
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {storages.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedStorage(i)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                      selectedStorage === i
                        ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs block">{s.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {s.extra === 0 ? 'Included' : `+$${s.extra}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="flex gap-3 pt-2">
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 h-12 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-200 text-base font-bold flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-200 text-base font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 h-12 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-98'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Shopping Cart
                  </>
                )}
              </button>
            </div>

            {/* Value Guarantees list */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" /> Free 2-Day Express Shipping & In-store pickup
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2-Year Official Manufacturer Warranty
              </span>
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-indigo-600" /> 30-Day Hassle-Free Returns & Replacements
              </span>
            </div>

          </div>

        </div>

        {/* ── Product Specifications & Details Tabs ── */}
        <div className="mt-16 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          
          {/* Tabs header */}
          <div className="flex items-center gap-4 border-b border-slate-200 pb-4 overflow-x-auto">
            {[
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'features', label: 'Key Highlights & Pros/Cons' },
              { id: 'reviews', label: `Reviews (${product.reviews || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-bold pb-2 transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Specs */}
          {activeTab === 'specs' && (
            <div className="pt-8">
              <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-3xl">
                {product.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specs && Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">{key}</span>
                    <span className="text-xs font-bold text-slate-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Features & Pros/Cons */}
          {activeTab === 'features' && (
            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pros */}
              <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" /> Device Strengths
                </h4>
                <ul className="space-y-2">
                  {(product.pros || ['Cutting-edge performance', 'Stunning design', 'Long battery life']).map((pro, i) => (
                    <li key={i} className="text-xs text-emerald-900 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100">
                <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600" /> Considerations
                </h4>
                <ul className="space-y-2">
                  {(product.cons || ['High demand', 'Requires compatible accessories']).map((con, i) => (
                    <li key={i} className="text-xs text-amber-900 flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="pt-8 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-900">{product.rating}</span>
                  <span className="text-xs text-slate-500 ml-2">out of 5.0 rating</span>
                  <div className="flex text-amber-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-500">{product.reviews || 120} verified customer reviews</span>
              </div>

              {/* Sample Review */}
              <div className="p-5 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">David M. — Verified Buyer</span>
                  <span className="text-[11px] text-slate-400">2 weeks ago</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "Exceeded all my expectations! Incredible build quality, blisteringly fast performance and the battery easily lasts throughout a heavy day of work."
                </p>
              </div>
            </div>
          )}

        </div>

        {/* ── Related Products Carousel ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-black text-slate-900 mb-6">
              Related Devices in {product.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

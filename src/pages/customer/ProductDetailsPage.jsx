import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Scale, 
  Star, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ArrowLeft,
  ChevronRight,
  Cpu,
  Battery,
  HardDrive,
  Monitor,
  CheckCircle2,
  XCircle,
  Share2
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' or 'reviews'

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
        <p className="text-slate-500 mt-2 mb-6">The requested electronic device does not exist or has been removed.</p>
        <Link to="/search" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const isCompared = compareList.includes(product.id);
  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleToggleCompare = () => {
    if (!isCompared && compareList.length >= 3) {
      alert('You can compare up to 3 devices simultaneously.');
      return;
    }
    toggleCompare(product.id);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to={`/search?category=${product.category}`} className="hover:text-blue-600 transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl bg-white border border-slate-200 overflow-hidden pt-[70%] sm:pt-[65%] shadow-sm">
            <img
              src={gallery[selectedImage] || product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
            />
            {product.originalPrice && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Save ${Math.round(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-blue-600 shadow-md scale-102'
                      : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-slate-900 ml-1.5">{product.rating}</span>
                <span className="text-slate-400 ml-1">({product.reviews} reviews)</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>In Stock ({product.stock} available)</span>
              </div>
            </div>

            {/* Price */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-slate-400 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Highlights List */}
            {product.highlights && (
              <div className="pt-3 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-100/80 px-3 py-2 rounded-lg">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Action Box */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            
            {/* Quantity Stepper */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold text-slate-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-98'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Added {quantity} to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart • ${(product.price * quantity).toLocaleString()}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleToggleCompare}
                className={`px-4 py-3.5 rounded-xl font-semibold text-sm border flex items-center justify-center gap-2 transition-all ${
                  isCompared
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
                title="Add to comparison table"
              >
                <Scale className="w-4 h-4" />
                <span className="hidden sm:inline">{isCompared ? 'In Compare' : 'Compare'}</span>
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex flex-col items-center gap-1 p-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Fast Dispatch</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                <span>14-Day Returns</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Tabs Section: Detailed Specs & Reviews */}
      <div className="pt-8">
        <div className="border-b border-slate-200 flex gap-8">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-sm font-bold tracking-tight border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold tracking-tight border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer Reviews ({product.reviews})
          </button>
        </div>

        <div className="py-8">
          {activeTab === 'specs' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Specs Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900">
                  Hardware Breakdown
                </div>
                <div className="divide-y divide-slate-100">
                  {Object.entries(product.specs || {}).map(([key, val]) => (
                    <div key={key} className="px-6 py-3.5 flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium text-slate-500">{key}</span>
                      <span className="font-semibold text-slate-900 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="space-y-6">
                <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-6 space-y-3">
                  <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Advantages</span>
                  </h4>
                  <ul className="space-y-2">
                    {product.pros?.map((pro, i) => (
                      <li key={i} className="text-xs sm:text-sm text-emerald-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-6 space-y-3">
                  <h4 className="font-bold text-sm text-amber-900 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-amber-600" />
                    <span>Things to Consider</span>
                  </h4>
                  <ul className="space-y-2">
                    {product.cons?.map((con, i) => (
                      <li key={i} className="text-xs sm:text-sm text-amber-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Marcus Wright</span>
                  <span className="text-slate-400">Verified Buyer • 2 days ago</span>
                </div>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  Phenomenal hardware. Build quality is exceptional and battery longevity exceeded expectations right out of the packaging.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Elena Rostova</span>
                  <span className="text-slate-400">Verified Buyer • 1 week ago</span>
                </div>
                <div className="flex items-center text-amber-400">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <Star className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <p className="text-sm text-slate-600">
                  Fast delivery and smooth checkout with Cash on Delivery. Everything matched the online specs matrix accurately.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6">More in {product.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

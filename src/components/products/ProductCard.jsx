import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Scale, Check, Star, Zap, Cpu } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import Badge from '../ui/Badge';

export default function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleCompare, compareList } = useProducts();

  const isCompared = compareList.includes(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCompared && compareList.length >= 3) {
      alert('You can compare up to 3 devices simultaneously. Remove one to add this.');
      return;
    }
    toggleCompare(product.id);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Badges & Action Buttons */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-wrap gap-1.5 pointer-events-auto">
          {product.tags?.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs ${
                tag === 'New'
                  ? 'bg-blue-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {tag}
            </span>
          ))}
          {discountPercent && (
            <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Compare Button */}
        <button
          onClick={handleToggleCompare}
          className={`pointer-events-auto p-2 rounded-xl border transition-all ${
            isCompared
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30'
              : 'bg-white/90 backdrop-blur-xs text-slate-600 hover:text-blue-600 border-slate-200/80 hover:bg-white shadow-xs'
          }`}
          title={isCompared ? 'Remove from compare' : 'Add to compare (up to 3)'}
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative pt-[70%] bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-red-600/90 text-white">
            Only {product.stock} left!
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-blue-600 uppercase tracking-wider text-[11px]">{product.brand}</span>
            <span>{product.category}</span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Key Specs Pills */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {product.specs?.Processor && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                <Cpu className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[130px]">{product.specs.Processor}</span>
              </span>
            )}
            {product.specs?.RAM && (
              <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                {product.specs.RAM}
              </span>
            )}
            {product.specs?.Storage && (
              <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                {product.specs.Storage}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-slate-800 ml-1">{product.rating}</span>
            </div>
            <span className="text-slate-400">({product.reviews})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock ({product.stock})
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md hover:shadow-blue-500/20 active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

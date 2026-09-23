import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';

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
      alert('You can compare up to 3 devices.'); return;
    }
    toggleCompare(product.id);
  };

  const isNew = product.tags?.includes('New');
  const isSale = product.tags?.includes('Sale') || product.originalPrice;

  return (
    <div className="flex flex-col gap-[14px] items-start relative group">
      {/* Product Image */}
      <Link to={`/product/${product.id}`}
        className="relative w-full rounded-[16px] overflow-hidden bg-[#f4f7fb]"
        style={{ height: '230px' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badge */}
        {(isNew || isSale) && (
          <div className="absolute top-[14px] left-[14px]">
            <span className={`text-[11px] px-[9px] py-[5px] rounded-full font-normal ${
              isNew ? 'bg-[#e8f0ff] text-[#2563eb]' : 'bg-[#feeceb] text-[#d92d20]'
            }`}>
              {isNew ? 'New' : 'Sale'}
            </span>
          </div>
        )}
        {/* Compare button */}
        <button onClick={handleToggleCompare}
          className={`absolute top-[14px] right-[14px] w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] border transition-all opacity-0 group-hover:opacity-100 ${
            isCompared
              ? 'bg-[#2563eb] text-white border-[#2563eb]'
              : 'bg-white text-[#667085] border-[#dde4ee] hover:border-[#2563eb] hover:text-[#2563eb]'
          }`}
          title="Compare">
          ⇄
        </button>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col gap-[6px] items-start w-full">
        <Link to={`/product/${product.id}`}
          className="text-[15px] text-[#101828] leading-snug w-full line-clamp-2 hover:text-[#2563eb] transition-colors">
          {product.name}
        </Link>
        <p className="text-[12px] text-[#d97706]">
          {'★'.repeat(Math.round(product.rating || 4))}{'☆'.repeat(5 - Math.round(product.rating || 4))}
          <span className="text-[#667085] ml-1">({product.reviews || 0})</span>
        </p>
        <div className="flex items-center justify-between w-full">
          <p className="text-[17px] text-[#101828] font-normal">
            ${product.price?.toLocaleString()}
            {product.originalPrice && (
              <span className="text-[13px] text-[#98a2b3] line-through ml-2">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </p>
          <button onClick={handleAddToCart}
            className={`h-[32px] px-3 rounded-[8px] text-[12px] text-white border transition-all ${
              isAdded
                ? 'bg-[#078a55] border-[#078a55]'
                : 'bg-[#2563eb] border-[#2563eb] hover:bg-[#1d4ed8]'
            }`}>
            {isAdded ? '✓' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Tag, 
  AlertCircle,
  HelpCircle,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    discount, 
    tax, 
    shipping, 
    total, 
    applyPromo, 
    promoCode, 
    promoDiscount 
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states for COD checkout
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('San Francisco');
  const [postalCode, setPostalCode] = useState('94103');
  const [notes, setNotes] = useState('Please call before doorstep delivery.');
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (!promoInput.trim()) return;

    const res = applyPromo(promoInput.trim());
    if (res.success) {
      setPromoSuccess(`Coupon applied! ${res.discount}% discount activated.`);
      setPromoInput('');
    } else {
      setPromoError(res.error || 'Invalid promotional code.');
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!fullName || !address || !city) {
      alert('Please complete the shipping address fields.');
      return;
    }

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      orderId,
      items: [...items],
      total,
      fullName,
      email,
      address: `${address}, ${city} ${postalCode}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setPlacedOrderDetails(orderData);
    setOrderComplete(true);
    clearCart();
  };

  if (orderComplete && placedOrderDetails) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-18 h-18 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed (Cash on Delivery)
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Order <strong className="text-slate-900 font-mono">#{placedOrderDetails.orderId}</strong> has been scheduled for dispatch. Payment will be collected in cash upon doorstep inspection.
          </p>
        </div>

        {/* Order Receipt Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left max-w-lg mx-auto space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="text-slate-400">Recipient:</span>
            <span className="font-semibold text-slate-900">{placedOrderDetails.fullName}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="text-slate-400">Destination:</span>
            <span className="font-semibold text-slate-900 text-right">{placedOrderDetails.address}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
            <span className="text-slate-400">Payment Due on Delivery:</span>
            <span className="font-black text-slate-900 text-base">${placedOrderDetails.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            to="/search"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-colors shadow-md"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
          >
            Home Overview
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Your shopping cart is empty</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Explore our collection of laptops, flagship phones, and gear to add items to your cart.
        </p>
        <div className="pt-2">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Discover Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Shopping Cart & Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your items, apply vouchers, and complete your order with Cash on Delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Itemized List & Checkout Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Cart Items List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">
                Itemized Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Empty Cart</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        {item.brand} • {item.category}
                      </span>
                      <Link to={`/product/${item.id}`} className="block font-bold text-slate-900 hover:text-blue-600 text-sm leading-snug">
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ${item.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-slate-900 min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="text-sm font-black text-slate-900">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Cash on Delivery (COD) Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Delivery Information (Cash on Delivery)</h3>
                <p className="text-xs text-slate-500">Provide shipping coordinates for dispatch verification</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-700">
                COD Enabled
              </span>
            </div>

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, suite, unit, street address"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Zip / Postal"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Courier Instructions
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ring doorbell twice"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </form>
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 sticky top-24">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Order Calculation
            </h3>

            {/* Promo Code Box */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Promo Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Try VOLT10 or TECH20"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 pl-8 text-xs font-mono uppercase text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && <p className="text-[11px] text-emerald-600 font-semibold">{promoSuccess}</p>}
              {promoError && <p className="text-[11px] text-red-500 font-semibold">{promoError}</p>}
              {promoDiscount > 0 && (
                <p className="text-[11px] text-blue-600 font-semibold">
                  Applied coupon: <span className="font-mono">{promoCode}</span> (-{promoDiscount}%)
                </p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Voucher Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Express Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-slate-900">Total Due (COD)</span>
                  <p className="text-[11px] text-slate-400">Pay in cash when delivery arrives</p>
                </div>
                <span className="text-2xl font-black text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              form="checkout-form"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-98"
            >
              <PackageCheck className="w-5 h-5" />
              <span>Confirm & Place Order (COD)</span>
            </button>

            {/* Trust Points */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>2-4 Business Days Express Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Risk: Inspect device prior to cash handover</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

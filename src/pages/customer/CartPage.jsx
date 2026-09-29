import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle,
  Tag,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    discount, 
    tax, 
    shipping, 
    total, 
    itemCount,
    applyPromo,
    promoCode,
    promoDiscount
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Checkout, 3: Confirmation
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '452 Innovation Blvd, Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    cardNumber: '•••• •••• •••• 4242',
    expiry: '12/28',
    cvv: '888',
    deliveryMethod: 'express', // 'standard' | 'express'
  });

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;
    const res = applyPromo(couponInput);
    if (res.success) {
      setCouponSuccess(`Code ${couponInput.toUpperCase()} applied! (${res.discount}% off)`);
      setCouponInput('');
    } else {
      setCouponError(res.error || 'Invalid promotional code');
    }
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const newOrderId = 'VLT-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(newOrderId);
    setCheckoutStep(3);
    clearCart();
  };

  // Step 3: Order Confirmed
  if (checkoutStep === 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center max-w-xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-md shadow-emerald-500/10">
          <CheckCircle className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
          Payment Successful
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Thank you for your order!
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Order <strong>#{orderId}</strong> has been placed and is being prepared for express delivery. A confirmation email has been dispatched to <strong>{formData.email || 'your email'}</strong>.
        </p>

        <div className="w-full p-6 rounded-2xl bg-white border border-slate-200 text-left mb-8 shadow-xs">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Order Details</h4>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>Delivery Address:</span>
              <span className="font-semibold text-slate-900">{formData.address}, {formData.city}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery:</span>
              <span className="font-semibold text-blue-600">Within 2 Business Days</span>
            </div>
            <div className="flex justify-between">
              <span>Carrier:</span>
              <span className="font-semibold text-slate-900">FedEx Priority Tech Express</span>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-colors"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  // Cart Empty State
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mb-6">
          You haven't added any devices to your cart yet. Explore our curated flagship lineup.
        </p>
        <Link
          to="/search"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-slate-50/50 pb-20">
      
      {/* ── Page Header & Stepper ── */}
      <div className="w-full bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {checkoutStep === 1 ? 'Shopping Cart' : 'Checkout & Express Delivery'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review your items, apply coupons, and checkout securely.
            </p>
          </div>

          {/* Stepper pills */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCheckoutStep(1)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                checkoutStep === 1 ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>1. Cart Items</span>
            </button>
            <span className="text-slate-300">→</span>
            <button
              onClick={() => setCheckoutStep(2)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                checkoutStep === 2 ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>2. Shipping & Payment</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Column: Items or Checkout Form (cols 8) ── */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {checkoutStep === 1 ? (
              /* Step 1: Cart Items List */
              <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Cart Items ({itemCount})
                  </h3>
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedStorage || ''}-${item.selectedColor || ''}`} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-slate-50 p-2 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                      </div>

                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{item.brand}</span>
                        <Link to={`/product/${item.id}`} className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors block truncate">
                          {item.name}
                        </Link>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start text-xs text-slate-400 mt-1">
                          {item.selectedStorage && <span>Storage: {item.selectedStorage}</span>}
                          {item.selectedColor && <span>• Color: {item.selectedColor}</span>}
                          <span className="text-emerald-600 font-semibold">• In Stock</span>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-2 h-10 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded text-slate-600 hover:bg-slate-200 text-sm font-bold flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded text-slate-600 hover:bg-slate-200 text-sm font-bold flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-slate-900 block">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-slate-400 hover:text-rose-600 mt-1 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Step 2: Shipping & Payment Form */
              <form onSubmit={handlePlaceOrder} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">Shipping Address</h3>
                  <p className="text-xs text-slate-500 mb-4">Where should we deliver your order?</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleFormChange}
                        required
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleFormChange}
                        required
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        required
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleFormChange}
                        required
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Postal / ZIP Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleFormChange}
                        required
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" /> Payment Information
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">All transactions are encrypted with 256-bit SSL encryption.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleFormChange}
                        required
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Expiry / CVV</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleFormChange}
                          required
                          className="w-full h-11 px-2 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none"
                        />
                        <input
                          type="password"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleFormChange}
                          required
                          className="w-full h-11 px-2 text-center rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" /> Place Order (${total.toLocaleString(undefined, { maximumFractionDigits: 2 })})
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* ── Right Column: Order Summary (cols 4) ── */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Promo Code Box */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                Promotional Code
              </span>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. VOLT10 or TECH20"
                  className="flex-1 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs uppercase font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 h-10 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponSuccess && <p className="text-xs text-emerald-600 mt-2 font-medium">{couponSuccess}</p>}
              {couponError && <p className="text-xs text-rose-600 mt-2 font-medium">{couponError}</p>}
              {promoDiscount > 0 && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between font-semibold">
                  <span>Coupon {promoCode} active</span>
                  <span>-{promoDiscount}% OFF</span>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col gap-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items):</span>
                  <span className="font-semibold text-slate-900">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({promoDiscount}%):</span>
                    <span>-${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax (8%):</span>
                  <span className="font-semibold text-slate-900">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold text-slate-900">
                    {shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shipping}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-slate-900">Total:</span>
                <span className="text-2xl font-black text-slate-900">
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {checkoutStep === 1 && (
                <button
                  onClick={() => setCheckoutStep(2)}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all mt-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <div className="pt-2 flex flex-col gap-2 text-[11px] text-slate-400 text-center">
                <span className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 30-Day Money Back Guarantee
                </span>
                <span className="flex items-center justify-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-500" /> Free 2-Day Express Shipping over $500
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

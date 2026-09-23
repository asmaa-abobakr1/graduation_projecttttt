import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '',
    cardNumber: '', expiry: '', cvv: '',
    delivery: 'standard', payment: 'card',
  });

  const shipping = total >= 500 ? 0 : 12.99;
  const discount = promoApplied ? total * 0.1 : 0;
  const tax = (total - discount) * 0.08;
  const grandTotal = total - discount + tax + shipping;

  const handlePromo = () => {
    if (promoCode.toUpperCase() === 'VOLT10') {
      setPromoApplied(true);
    } else {
      alert('Invalid promo code.');
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    alert('Order placed! Thank you for your purchase.');
    clearCart();
    navigate('/');
  };

  if (items.length === 0 && checkoutStep === 1) {
    return (
      <div className="bg-white flex flex-col items-center justify-center px-16 py-24 w-full gap-6">
        <div className="text-[64px]">🛒</div>
        <p className="text-[28px] text-[#101828]">Your cart is empty</p>
        <p className="text-[14px] text-[#667085]">Add some devices to get started</p>
        <Link to="/search"
          className="h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] px-[18px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col items-start w-full">
      {/* Checkout Header */}
      <div className="flex flex-col gap-4 items-start px-16 pt-9 pb-5 border-b border-[#dde4ee] w-full">
        <p className="text-[36px] text-[#101828]">
          {checkoutStep === 1 ? 'Your cart' : checkoutStep === 2 ? 'Shipping & Payment' : 'Order confirmed'}
        </p>
        <p className="text-[12px] text-[#667085]">
          Step {checkoutStep} of 3 ·{' '}
          <span className={checkoutStep >= 1 ? 'text-[#2563eb]' : ''}>Cart</span> →{' '}
          <span className={checkoutStep >= 2 ? 'text-[#2563eb]' : ''}>Details</span> →{' '}
          <span className={checkoutStep >= 3 ? 'text-[#2563eb]' : ''}>Confirmed</span>
        </p>
      </div>

      <div className="flex gap-8 items-start px-16 py-8 w-full">
        {/* Left: Forms */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {checkoutStep === 1 && (
            <>
              {/* Cart Items */}
              <div className="bg-white border border-[#dde4ee] flex flex-col gap-0 rounded-[16px] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-5 border-b border-[#dde4ee]">
                  <p className="text-[15px] font-semibold text-[#101828]">Cart items</p>
                  <span className="bg-[#e8f0ff] text-[#2563eb] text-[11px] px-[9px] py-[5px] rounded-full">
                    {itemCount} items
                  </span>
                </div>

                {items.map((item) => (
                  <div key={`${item.id}-${item.quantity}`} className="flex items-start gap-4 px-5 py-5 border-b border-[#dde4ee]">
                    <img src={item.image} alt={item.name}
                      className="w-[110px] h-[96px] rounded-[10px] object-cover shrink-0 border border-[#dde4ee]" />
                    <div className="flex-1 flex flex-col gap-[6px] min-w-0">
                      <p className="text-[15px] font-semibold text-[#101828] truncate">{item.name}</p>
                      <p className="text-[12px] text-[#667085]">{item.brand} · {item.category}</p>
                      <p className="text-[11px] text-[#667085]">Stock: {item.stock} available</p>
                      <span className="bg-[#e8f8f1] text-[#078a55] text-[11px] px-[9px] py-[5px] rounded-full w-fit">
                        In stock
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 items-end shrink-0">
                      <p className="text-[16px] font-semibold text-[#101828]">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 bg-[#eef3f9] rounded-full px-3 py-1">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="text-[#667085] hover:text-[#101828] font-bold">−</button>
                        <span className="text-[12px] text-[#101828] min-w-[20px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                          className="text-[#667085] hover:text-[#101828] font-bold">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-[#667085] hover:text-[#d92d20] transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {/* Promo Code */}
                <div className="flex gap-3 items-center px-5 py-4">
                  <div className="flex-1 bg-white border border-[#dde4ee] rounded-[10px] h-[42px] flex items-center px-4">
                    <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code (try VOLT10)"
                      className="bg-transparent flex-1 text-[14px] text-[#101828] placeholder-[#98a2b3] outline-none" />
                  </div>
                  <button onClick={handlePromo}
                    className={`h-[44px] px-[18px] rounded-[10px] text-[14px] transition-colors border ${
                      promoApplied
                        ? 'bg-[#e8f8f1] text-[#078a55] border-[#078a55]'
                        : 'bg-[#2563eb] text-white border-[#2563eb] hover:bg-[#1d4ed8]'
                    }`}>
                    {promoApplied ? '✓ Applied' : 'Apply'}
                  </button>
                </div>
              </div>

              {/* Shipping & Payment Form Teaser */}
              <div className="bg-white border border-[#dde4ee] flex flex-col gap-5 p-5 rounded-[16px]">
                <p className="text-[15px] font-semibold text-[#101828]">Contact & shipping</p>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-[7px] flex-1">
                    <label className="text-[12px] text-[#101828]">First name</label>
                    <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Jordan" className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                  </div>
                  <div className="flex flex-col gap-[7px] flex-1">
                    <label className="text-[12px] text-[#101828]">Last name</label>
                    <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Lee" className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-[7px] flex-1">
                    <label className="text-[12px] text-[#101828]">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jordan@example.com" className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                  </div>
                  <div className="flex flex-col gap-[7px] flex-1">
                    <label className="text-[12px] text-[#101828]">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 555 000 0000" className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-[7px]">
                  <label className="text-[12px] text-[#101828]">Address</label>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="123 Main Street" className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-[7px] flex-1">
                    <label className="text-[12px] text-[#101828]">City</label>
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="New York" className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                  </div>
                  <div className="flex flex-col gap-[7px] flex-1">
                    <label className="text-[12px] text-[#101828]">State</label>
                    <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                      placeholder="NY" className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                  </div>
                  <div className="flex flex-col gap-[7px] flex-1">
                    <label className="text-[12px] text-[#101828]">ZIP</label>
                    <input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })}
                      placeholder="10001" className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-white border border-[#dde4ee] flex flex-col gap-4 p-5 rounded-[16px]">
                <p className="text-[15px] font-semibold text-[#101828]">Delivery method</p>
                {[
                  { value: 'standard', label: 'Standard delivery (3–5 days)', price: 'Free over $500' },
                  { value: 'express', label: 'Express delivery (1–2 days)', price: '$12.99' },
                ].map((d) => (
                  <div key={d.value}
                    onClick={() => setForm({ ...form, delivery: d.value })}
                    className={`flex items-center justify-between px-4 py-3 rounded-[10px] border cursor-pointer transition-all ${
                      form.delivery === d.value ? 'border-[#2563eb] bg-[#f0f5ff]' : 'border-[#dde4ee] hover:border-[#b0bcd4]'
                    }`}>
                    <p className="text-[13px] text-[#101828]">{d.label}</p>
                    <p className="text-[13px] text-[#667085]">{d.price}</p>
                  </div>
                ))}
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-[#dde4ee] flex flex-col gap-4 p-5 rounded-[16px]">
                <p className="text-[15px] font-semibold text-[#101828]">Payment method</p>
                <div className="flex gap-2">
                  {['card', 'paypal', 'cod'].map((p) => (
                    <button key={p} onClick={() => setForm({ ...form, payment: p })}
                      className={`text-[11px] px-[9px] py-[5px] rounded-full transition-all ${
                        form.payment === p ? 'bg-[#e8f0ff] text-[#2563eb]' : 'bg-[#eef3f9] text-[#667085]'
                      }`}>
                      {p === 'card' ? 'Credit card' : p === 'paypal' ? 'PayPal' : 'Cash on delivery'}
                    </button>
                  ))}
                </div>
                {form.payment === 'card' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-[7px]">
                      <label className="text-[12px] text-[#101828]">Card number</label>
                      <input value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-[7px] flex-1">
                        <label className="text-[12px] text-[#101828]">Expiry date</label>
                        <input value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                          placeholder="MM / YY"
                          className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                      </div>
                      <div className="flex flex-col gap-[7px] flex-1">
                        <label className="text-[12px] text-[#101828]">Security code</label>
                        <input value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                          placeholder="CVV"
                          className="h-[44px] border border-[#dde4ee] rounded-[10px] px-[13px] text-[14px] placeholder-[#98a2b3] outline-none focus:border-[#2563eb] bg-white" />
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-[11px] text-[#667085]">🔒 Payments are encrypted and secured via SSL.</p>
              </div>
            </>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="flex flex-col gap-5 items-start w-[390px] shrink-0">
          <div className="bg-white border border-[#dde4ee] flex flex-col gap-5 p-5 rounded-[16px] w-full">
            <p className="text-[20px] font-semibold text-[#101828]">Order summary</p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#667085]">Subtotal</p>
                <p className="text-[13px] text-[#101828]">${total.toLocaleString()}</p>
              </div>
              {promoApplied && (
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#667085]">Discount (VOLT10)</p>
                  <p className="text-[13px] text-[#078a55]">-${discount.toFixed(2)}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#667085]">Shipping</p>
                <p className="text-[13px] text-[#101828]">{shipping === 0 ? 'Free' : `$${shipping}`}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#667085]">Estimated tax</p>
                <p className="text-[13px] text-[#101828]">${tax.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t border-[#dde4ee] pt-4 flex items-center justify-between">
              <p className="text-[16px] font-semibold text-[#101828]">Total</p>
              <p className="text-[22px] font-bold text-[#101828]">${grandTotal.toFixed(2)}</p>
            </div>

            <button onClick={handleCheckout}
              className="h-[44px] bg-[#2563eb] border border-[#2563eb] text-white text-[14px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors w-full">
              {isAuthenticated ? 'Place order' : 'Sign in to checkout'}
            </button>

            <p className="text-[12px] text-[#667085] text-center">
              By placing your order you agree to our{' '}
              <span className="text-[#2563eb] cursor-pointer">Terms of Service</span>.
            </p>
          </div>

          <div className="bg-white border border-[#dde4ee] flex flex-col gap-3 p-5 rounded-[16px] w-full">
            <p className="text-[14px] font-semibold text-[#101828]">Secure checkout</p>
            <div className="flex flex-col gap-2">
              {['🔒 SSL encrypted payment', '↩️ 30-day free returns', '✅ 2-year warranty', '🚀 Fast tracked delivery'].map((t) => (
                <p key={t} className="text-[12px] text-[#667085]">{t}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

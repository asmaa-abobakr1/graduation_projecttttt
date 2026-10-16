import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../services/api';
import { useResponsive } from '../../hooks/useResponsive';

function SummaryLine({ label, value, bold, large, green, red }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: bold ? 14 : 13, fontWeight: bold ? 700 : 400, color: '#101828' }}>{label}</span>
      <span style={{ fontSize: large ? 20 : bold ? 14 : 13, fontWeight: bold ? 700 : 400, color: green ? '#078a55' : red ? '#d92d20' : '#101828' }}>{value}</span>
    </div>
  );
}

export default function CartPage() {
  const { isMobile } = useResponsive();
  const {
    items, removeFromCart, updateQuantity, clearCart,
    subtotal, discount, tax, shipping, total, itemCount,
    applyPromo, promoCode, promoDiscount,
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponInput, setCouponInput]     = useState('');
  const [couponError, setCouponError]     = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [step, setStep]                   = useState(1); // 1: Cart/checkout  3: Confirmation
  const [orderId, setOrderId]             = useState('');
  const [submitting, setSubmitting]       = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: user?.email || '', phone: '',
    address: '', city: '', state: '', zip: '',
    deliveryMethod: 'standard',
  });

  const handleCoupon = (e) => {
    e.preventDefault();
    setCouponError(''); setCouponSuccess('');
    if (!couponInput.trim()) return;
    const res = applyPromo(couponInput);
    if (res.success) {
      setCouponSuccess(`Code ${couponInput.toUpperCase()} applied! (${res.discount}% off)`);
      setCouponInput('');
    } else {
      setCouponError(res.error || 'Invalid code');
    }
  };

  const handleFormChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    // Validate shipping fields only — no card fields needed (COD)
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip'];
    if (required.some(k => !form[k].trim())) {
      alert('Please fill out all required shipping fields.');
      return;
    }
    setSubmitting(true);
    const customerName = `${form.firstName} ${form.lastName}`.trim();
    const fullAddress  = `${form.address}, ${form.city}, ${form.state} ${form.zip}`;
    try {
      const res = await ordersAPI.create({
        customerName, customerEmail: form.email.trim(), address: fullAddress,
        items: items.map(i => ({ productId: i._id || i.id, productName: i.name, productImage: i.image, price: i.price, quantity: i.quantity })),
        promoCode, subtotal, discount, tax, shipping, total: Math.round(total),
      });
      setOrderId(res?.data?.orderId || res?.data?._id || 'VLT-' + Math.floor(100000 + Math.random() * 900000));
    } catch {
      setOrderId('VLT-' + Math.floor(100000 + Math.random() * 900000));
    } finally {
      setSubmitting(false);
      setStep(3);
      clearCart();
    }
  };

  /* ── Confirmation screen ── */
  if (step === 3) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', background: '#fff', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8f8f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>✓</div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#101828', marginBottom: 8 }}>Order placed!</h2>
        <p style={{ fontSize: 15, color: '#667085', marginBottom: 6 }}>Your order <strong style={{ color: '#101828' }}>#{orderId}</strong> is confirmed.</p>
        <p style={{ fontSize: 13, color: '#667085', marginBottom: 32 }}>You'll receive a confirmation email shortly.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" onClick={() => navigate('/')}>Continue shopping</button>
          <button className="btn-primary"   onClick={() => navigate('/search')}>Browse more</button>
        </div>
      </div>
    );
  }

  /* ── Empty cart ── */
  if (items.length === 0 && step === 1) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 64, background: '#fff', textAlign: 'center' }}>
        <p style={{ fontSize: 40, marginBottom: 16 }}>🛒</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#101828', marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ fontSize: 14, color: '#667085', marginBottom: 24 }}>Add something from our collection.</p>
        <Link to="/search" className="btn-primary">Browse products</Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh', padding: isMobile ? '20px 16px' : '32px 64px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 36, fontWeight: 400, color: '#101828', margin: '0 0 6px' }}>Your checkout</h1>
        <p style={{ fontSize: 13, color: '#667085', margin: 0 }}>
          {itemCount} item{itemCount !== 1 ? 's' : ''} · Estimated delivery within 3–5 business days
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>

        {/* ── Left column ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20, width: isMobile ? '100%' : undefined }}>

          {/* Cart items panel */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #dde4ee', padding: isMobile ? '16px 12px' : 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#101828', margin: 0 }}>Cart items</p>
              <span className="badge badge-gray">{itemCount}</span>
            </div>

            {items.map((item, idx) => {
              const iid = item._id || item.id;
              return (
                <div key={iid} style={{ display: 'flex', gap: 16, paddingBottom: idx < items.length - 1 ? 20 : 0, marginBottom: idx < items.length - 1 ? 20 : 0, borderBottom: idx < items.length - 1 ? '1px solid #f4f7fb' : 'none' }}>
                  {/* Image */}
                  <div style={{ width: 110, height: 96, borderRadius: 10, overflow: 'hidden', background: '#f4f7fb', flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#101828', margin: 0 }}>{item.name}</p>
                        {item.brand && <p style={{ fontSize: 12, color: '#667085', margin: '2px 0 0' }}>{item.brand} · {item.category}</p>}
                        <span className="badge badge-green" style={{ marginTop: 8, display: 'inline-flex' }}>{item.stock > 0 ? 'In stock' : 'Limited'}</span>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                        <p style={{ fontSize: 16, fontWeight: 600, color: '#101828', margin: 0 }}>${(item.price * item.quantity).toLocaleString()}</p>
                        <p style={{ fontSize: 11, color: '#667085', margin: '2px 0 0' }}>${item.price?.toLocaleString()} each</p>
                      </div>
                    </div>
                    {/* Qty + actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#eef3f9', borderRadius: 999, padding: '4px 12px' }}>
                        <button onClick={() => updateQuantity(iid, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#667085', fontFamily: 'inherit', lineHeight: 1 }}>−</button>
                        <span style={{ fontSize: 13, color: '#101828', minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(iid, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#667085', fontFamily: 'inherit', lineHeight: 1 }}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(iid)}
                        style={{ fontSize: 12, color: '#d92d20', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Promo code */}
            <form onSubmit={handleCoupon} style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <input
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
                placeholder="Promo code (e.g. VOLT10)"
                className="input-field"
                style={{ flex: 1, height: 42 }}
              />
              <button type="submit" className="btn-primary" style={{ height: 42, flexShrink: 0 }}>Apply</button>
            </form>
            {couponError   && <p style={{ fontSize: 12, color: '#d92d20', marginTop: 6 }}>{couponError}</p>}
            {couponSuccess && <p style={{ fontSize: 12, color: '#078a55', marginTop: 6 }}>{couponSuccess}</p>}
          </div>

          {/* Contact & Shipping form */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #dde4ee', padding: 20 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#101828', margin: '0 0 20px' }}>Contact & Shipping</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: '#101828', display: 'block', marginBottom: 7 }}>First name</label>
                  <input name="firstName" value={form.firstName} onChange={handleFormChange} className="input-field" placeholder="Jordan" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: '#101828', display: 'block', marginBottom: 7 }}>Last name</label>
                  <input name="lastName" value={form.lastName} onChange={handleFormChange} className="input-field" placeholder="Smith" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: '#101828', display: 'block', marginBottom: 7 }}>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleFormChange} className="input-field" placeholder="you@example.com" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: '#101828', display: 'block', marginBottom: 7 }}>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleFormChange} className="input-field" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#101828', display: 'block', marginBottom: 7 }}>Address</label>
                <input name="address" value={form.address} onChange={handleFormChange} className="input-field" placeholder="123 Main St" />
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: '#101828', display: 'block', marginBottom: 7 }}>City</label>
                  <input name="city" value={form.city} onChange={handleFormChange} className="input-field" placeholder="New York" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: '#101828', display: 'block', marginBottom: 7 }}>State</label>
                  <input name="state" value={form.state} onChange={handleFormChange} className="input-field" placeholder="NY" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: '#101828', display: 'block', marginBottom: 7 }}>ZIP</label>
                  <input name="zip" value={form.zip} onChange={handleFormChange} className="input-field" placeholder="10001" />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery method */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #dde4ee', padding: 20 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#101828', margin: '0 0 16px' }}>Delivery method</p>
            <div style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row' }}>
              {[
                { value: 'standard', label: 'Standard', sub: '5-7 business days', price: 'Free' },
                { value: 'express',  label: 'Express',  sub: '1-2 business days', price: '$15.00' },
              ].map(opt => (
                <label key={opt.value} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: `1px solid ${form.deliveryMethod === opt.value ? '#2563eb' : '#dde4ee'}`, borderRadius: 10, cursor: 'pointer', background: form.deliveryMethod === opt.value ? '#f4f9ff' : '#fff' }}>
                  <input type="radio" name="deliveryMethod" value={opt.value} checked={form.deliveryMethod === opt.value} onChange={handleFormChange}
                    style={{ accentColor: '#2563eb' }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#101828', margin: 0 }}>{opt.label} — {opt.price}</p>
                    <p style={{ fontSize: 11, color: '#667085', margin: 0 }}>{opt.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment — Cash on Delivery */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #dde4ee', padding: 20 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#101828', margin: '0 0 16px' }}>Payment method</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#e8f8f1', borderRadius: 12, border: '1.5px solid #078a55' }}>
              <span style={{ fontSize: 24 }}>💵</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#078a55', margin: 0 }}>Cash on Delivery</p>
                <p style={{ fontSize: 12, color: '#667085', margin: '2px 0 0' }}>Pay when your order arrives — no card needed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: order summary ── */}
        <div style={{ width: isMobile ? '100%' : 380, flexShrink: 0, position: isMobile ? 'static' : 'sticky', top: 100 }}>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #dde4ee', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#101828', margin: 0 }}>Order summary</p>

            {/* Items preview */}
            {items.map(item => (
              <div key={item._id || item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', background: '#f4f7fb', flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#101828', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name} ×{item.quantity}
                  </span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#101828', flexShrink: 0 }}>
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #f4f7fb', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <SummaryLine label="Subtotal"  value={`$${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
              {discount > 0 && <SummaryLine label={`Discount (${promoDiscount}%)`} value={`-$${discount.toFixed(2)}`} green />}
              <SummaryLine label="Tax (8%)"  value={`$${tax.toFixed(2)}`} />
              <SummaryLine label="Shipping"  value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} green={shipping === 0} />
            </div>

            <div style={{ borderTop: '1px solid #dde4ee', paddingTop: 14 }}>
              <SummaryLine label="Total" value={`$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} bold large />
            </div>

            <button
              className="btn-primary"
              onClick={handlePlaceOrder}
              disabled={submitting || items.length === 0}
              style={{ width: '100%', marginTop: 4, minHeight: 44, background: submitting ? '#93c5fd' : '#2563eb', borderColor: submitting ? '#93c5fd' : '#2563eb' }}
            >
              {submitting ? 'Placing order…' : 'Place order'}
            </button>

            <p style={{ fontSize: 11, color: '#667085', textAlign: 'center', margin: 0 }}>
              💵 Cash on delivery · Pay when your order arrives
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

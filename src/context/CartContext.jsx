import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { usersAPI } from '../services/api';

const CartContext = createContext(null);

// Helper: is the user logged in (token present)?
const isLoggedIn = () => !!localStorage.getItem('volt_token');

// Debounce helper — sync cart to server 1s after last change
function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]); // eslint-disable-line
}

export function CartProvider({ children }) {
  const [items,        setItems]        = useState([]);
  const [promoCode,    setPromoCode]    = useState('');
  const [promoDiscount,setPromoDiscount]= useState(0);
  const [syncing,      setSyncing]      = useState(false);
  const initialLoadDone = useRef(false);

  // ── Load cart from server on mount (if authenticated) ──────────────────────
  useEffect(() => {
    if (isLoggedIn()) {
      usersAPI.getCart()
        .then((res) => {
          if (res?.cart) {
            // Normalize populated cart items from server
            const normalized = res.cart
              .filter(ci => ci.product) // skip items with null product
              .map(ci => ({
                ...ci.product,
                _id:      ci.product._id,
                id:       ci.product._id,
                quantity: ci.quantity,
                price:    ci.price || ci.product.price,
              }));
            setItems(normalized);
          }
        })
        .catch(() => {}) // server not available — stay empty
        .finally(() => { initialLoadDone.current = true; });
    } else {
      initialLoadDone.current = true;
    }
  }, []); // eslint-disable-line

  // ── Sync items to server whenever they change (debounced) ──────────────────
  const syncToServer = useCallback(async (currentItems) => {
    if (!isLoggedIn() || !initialLoadDone.current) return;
    setSyncing(true);
    try {
      await usersAPI.syncCart(
        currentItems.map(i => ({
          productId: i._id || i.id,
          quantity:  i.quantity,
          price:     i.price,
        }))
      );
    } catch { /* silently ignore — cart is still correct in memory */ }
    finally { setSyncing(false); }
  }, []);

  const debouncedSync = useDebounce(syncToServer, 800);

  // ── Reset cart on logout ────────────────────────────────────────────────────
  useEffect(() => {
    const handleLogout = () => {
      setItems([]);
      setPromoCode('');
      setPromoDiscount(0);
      initialLoadDone.current = false;
    };
    window.addEventListener('volt:logout', handleLogout);
    // Re-load from server after login
    const handleLogin = () => {
      initialLoadDone.current = false;
      usersAPI.getCart()
        .then((res) => {
          if (res?.cart) {
            const normalized = res.cart
              .filter(ci => ci.product)
              .map(ci => ({
                ...ci.product,
                _id:      ci.product._id,
                id:       ci.product._id,
                quantity: ci.quantity,
                price:    ci.price || ci.product.price,
              }));
            setItems(normalized);
          }
          initialLoadDone.current = true;
        })
        .catch(() => { initialLoadDone.current = true; });
    };
    window.addEventListener('volt:login', handleLogin);
    return () => {
      window.removeEventListener('volt:logout', handleLogout);
      window.removeEventListener('volt:login',  handleLogin);
    };
  }, []);

  // ── Cart actions ────────────────────────────────────────────────────────────
  const addToCart = useCallback((product, quantity = 1) => {
    const id = product._id || product.id;
    setItems(prev => {
      const existing = prev.find(i => (i._id || i.id) === id);
      const next = existing
        ? prev.map(i => (i._id || i.id) === id ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { ...product, _id: id, id, quantity }];
      debouncedSync(next);
      return next;
    });
  }, [debouncedSync]);

  const removeFromCart = useCallback((productId) => {
    setItems(prev => {
      const next = prev.filter(i => (i._id || i.id) !== productId);
      debouncedSync(next);
      return next;
    });
  }, [debouncedSync]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => {
      const next = prev.map(i => (i._id || i.id) === productId ? { ...i, quantity } : i);
      debouncedSync(next);
      return next;
    });
  }, [removeFromCart, debouncedSync]);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode('');
    setPromoDiscount(0);
    if (isLoggedIn()) {
      usersAPI.clearCart().catch(() => {});
    }
  }, []);

  const applyPromo = useCallback((code) => {
    const PROMOS = { VOLT10: 10, TECH20: 20, FIRST15: 15, VIP25: 25 };
    const upper  = code.trim().toUpperCase();
    if (PROMOS[upper]) {
      setPromoCode(upper);
      setPromoDiscount(PROMOS[upper]);
      return { success: true, discount: PROMOS[upper] };
    }
    return { success: false, error: 'Invalid discount code. Try VOLT10 or TECH20' };
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────────
  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount  = (subtotal * promoDiscount) / 100;
  const tax       = (subtotal - discount) * 0.08;
  const shipping  = subtotal > 500 || subtotal === 0 ? 0 : 15;
  const total     = subtotal - discount + tax + shipping;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, applyPromo,
      promoCode, promoDiscount, subtotal, discount, tax, shipping, total, itemCount, syncing,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

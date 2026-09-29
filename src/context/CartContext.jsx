import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('volt_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('volt_cart_items', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = useCallback((product, quantity = 1, selectedOptions = {}) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity, ...selectedOptions }
            : item
        );
      }
      return [...prev, { ...product, quantity, ...selectedOptions }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode('');
    setPromoDiscount(0);
  }, []);

  const applyPromo = useCallback((code) => {
    const promos = {
      VOLT10: 10,
      TECH20: 20,
      FIRST15: 15,
      VIP25: 25,
    };
    const upper = code.trim().toUpperCase();
    if (promos[upper]) {
      setPromoCode(upper);
      setPromoDiscount(promos[upper]);
      return { success: true, discount: promos[upper] };
    }
    return { success: false, error: 'Invalid discount code. Try VOLT10 or TECH20' };
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (subtotal * promoDiscount) / 100;
  const tax = (subtotal - discount) * 0.08;
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 15;
  const total = subtotal - discount + tax + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromo,
        promoCode,
        promoDiscount,
        subtotal,
        discount,
        tax,
        shipping,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
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
    };
    if (promos[code.toUpperCase()]) {
      setPromoCode(code.toUpperCase());
      setPromoDiscount(promos[code.toUpperCase()]);
      return { success: true, discount: promos[code.toUpperCase()] };
    }
    return { success: false, error: 'Invalid promo code' };
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (subtotal * promoDiscount) / 100;
  const tax = (subtotal - discount) * 0.08;
  const shipping = subtotal > 500 ? 0 : 14.99;
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

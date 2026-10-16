import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { productsAPI, usersAPI } from '../services/api';

const ProductContext = createContext(null);

const isLoggedIn = () => !!localStorage.getItem('volt_token');

export function ProductProvider({ children }) {
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [pagination, setPagination] = useState({});

  // ── Compare — in-memory only (no localStorage, no server) ──────────────────
  const [compareList, setCompareList] = useState([]);

  // ── Wishlist — server-side for authenticated users ──────────────────────────
  // Stored as array of product ID strings for easy includes() checks
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from server on mount if logged in
  useEffect(() => {
    if (isLoggedIn()) {
      usersAPI.getWishlist()
        .then((res) => {
          if (res?.wishlist) {
            // wishlist items are populated product objects
            setWishlist(res.wishlist.map(p => String(p._id || p)));
          }
        })
        .catch(() => {});
    }
  }, []); // eslint-disable-line

  // ── Logout: clear wishlist & compare ───────────────────────────────────────
  useEffect(() => {
    const handleLogout = () => {
      setWishlist([]);
      setCompareList([]);
    };
    // Re-fetch wishlist from server after login
    const handleLogin = () => {
      usersAPI.getWishlist()
        .then((res) => {
          if (res?.wishlist) setWishlist(res.wishlist.map(p => String(p._id || p)));
        })
        .catch(() => {});
    };
    window.addEventListener('volt:logout', handleLogout);
    window.addEventListener('volt:login',  handleLogin);
    return () => {
      window.removeEventListener('volt:logout', handleLogout);
      window.removeEventListener('volt:login',  handleLogin);
    };
  }, []);

  // ── Fetch products from backend ─────────────────────────────────────────────
  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsAPI.getAll({ status: 'Published', limit: 100, ...params });
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Admin CRUD ──────────────────────────────────────────────────────────────
  const addProduct = useCallback(async (productData) => {
    try {
      const res = await productsAPI.create(productData);
      setProducts(prev => [res.data, ...prev]);
      return { success: true, product: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    try {
      const res = await productsAPI.update(id, updates);
      setProducts(prev => prev.map(p => (p._id === id || p._id === res.data._id ? res.data : p)));
      return { success: true, product: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      await productsAPI.delete(id);
      setProducts(prev    => prev.filter(p => p._id !== id));
      setCompareList(prev => prev.filter(pid => pid !== id));
      setWishlist(prev    => prev.filter(pid => pid !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // ── Compare (in-memory, no persistence) ────────────────────────────────────
  const toggleCompare = useCallback((productId) => {
    setCompareList(prev => {
      if (prev.includes(productId)) return prev.filter(id => id !== productId);
      if (prev.length >= 4) return prev; // max 4
      return [...prev, productId];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  // ── Wishlist (server-side) ──────────────────────────────────────────────────
  const toggleWishlist = useCallback((productId) => {
    const pid = String(productId);

    // Update state immediately — no waiting for server
    setWishlist(prev => {
      const next = prev.includes(pid)
        ? prev.filter(id => id !== pid)
        : [...prev, pid];

      // Fire-and-forget sync to server (don't read the response back into state)
      if (isLoggedIn()) {
        usersAPI.toggleWishlist(pid).catch(() => {
          // On error: silently revert by toggling back
          setWishlist(curr =>
            curr.includes(pid) ? curr.filter(id => id !== pid) : [...curr, pid]
          );
        });
      }

      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (productId) => wishlist.includes(String(productId)),
    [wishlist]
  );

  // ── Lookups ─────────────────────────────────────────────────────────────────
  const getProduct = useCallback(
    (id) => products.find(p =>
      (p._id && String(p._id) === String(id)) ||
      (p.id  && String(p.id)  === String(id))
    ),
    [products]
  );

  const getCompareProducts = useCallback(
    () => products.filter(p => compareList.includes(p._id) || compareList.includes(p.id)),
    [products, compareList]
  );

  const getWishlistProducts = useCallback(
    () => products.filter(p => wishlist.includes(String(p._id)) || wishlist.includes(String(p.id))),
    [products, wishlist]
  );

  return (
    <ProductContext.Provider value={{
      products, loading, error, pagination, fetchProducts,
      addProduct, updateProduct, deleteProduct,
      compareList, toggleCompare, clearCompare,
      wishlist, toggleWishlist, isWishlisted,
      getProduct, getCompareProducts, getWishlistProducts,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
};

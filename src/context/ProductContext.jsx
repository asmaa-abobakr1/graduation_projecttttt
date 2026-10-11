import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { productsAPI } from '../services/api';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [pagination, setPagination] = useState({});

  // ── Compare & Wishlist stay in localStorage (client-side UX) ───────────────
  const [compareList, setCompareList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('volt_compare') || '[]'); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('volt_wishlist') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('volt_compare', JSON.stringify(compareList)); } catch {}
  }, [compareList]);

  useEffect(() => {
    try { localStorage.setItem('volt_wishlist', JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);

  // ── Fetch all products from backend ────────────────────────────────────────
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

  // Load on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── CRUD (Admin) ────────────────────────────────────────────────────────────
  const addProduct = useCallback(async (productData) => {
    try {
      const res = await productsAPI.create(productData);
      setProducts((prev) => [res.data, ...prev]);
      return { success: true, product: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    try {
      const res = await productsAPI.update(id, updates);
      setProducts((prev) =>
        prev.map((p) => (p._id === id || p._id === res.data._id ? res.data : p))
      );
      return { success: true, product: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      await productsAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setCompareList((prev) => prev.filter((pid) => pid !== id));
      setWishlist((prev) => prev.filter((pid) => pid !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // ── Compare ─────────────────────────────────────────────────────────────────
  const toggleCompare = useCallback((productId) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= 4) return prev;
      return [...prev, productId];
    });
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  // ── Wishlist ────────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback(
    (productId) => wishlist.includes(productId),
    [wishlist]
  );

  // ── Lookups ─────────────────────────────────────────────────────────────────
  // Products now use _id (MongoDB ObjectId string)
  const getProduct = useCallback(
    (id) => products.find((p) => (p._id && (p._id === id || String(p._id) === String(id))) || (p.id && (p.id === id || String(p.id) === String(id)))),
    [products]
  );

  const getCompareProducts = useCallback(
    () => products.filter((p) => compareList.includes(p._id) || compareList.includes(p.id)),
    [products, compareList]
  );

  const getWishlistProducts = useCallback(
    () => products.filter((p) => wishlist.includes(p._id) || wishlist.includes(p.id)),
    [products, wishlist]
  );

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      pagination,
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleCompare,
      clearCompare,
      compareList,
      wishlist,
      toggleWishlist,
      isWishlisted,
      getProduct,
      getCompareProducts,
      getWishlistProducts,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};

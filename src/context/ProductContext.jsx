import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('volt_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('volt_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('volt_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('volt_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('volt_compare', JSON.stringify(compareList));
    } catch {}
  }, [compareList]);

  useEffect(() => {
    try {
      localStorage.setItem('volt_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      rating: 5.0,
      reviews: 1,
      tags: product.tags || ['New'],
      images: product.images?.length ? product.images : [product.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop'],
      highlights: product.highlights || ['Premium Build', 'Fast Performance'],
      pros: product.pros || ['Great design'],
      cons: product.cons || ['High demand'],
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, [products]);

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === Number(id) ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== Number(id)));
    setCompareList((prev) => prev.filter((pid) => pid !== Number(id)));
    setWishlist((prev) => prev.filter((pid) => pid !== Number(id)));
  }, []);

  const toggleCompare = useCallback((productId) => {
    const numId = Number(productId);
    setCompareList((prev) => {
      if (prev.includes(numId)) {
        return prev.filter((id) => id !== numId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, numId];
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const toggleWishlist = useCallback((productId) => {
    const numId = Number(productId);
    setWishlist((prev) => {
      if (prev.includes(numId)) {
        return prev.filter((id) => id !== numId);
      }
      return [...prev, numId];
    });
  }, []);

  const isWishlisted = useCallback(
    (productId) => wishlist.includes(Number(productId)),
    [wishlist]
  );

  const getProduct = useCallback(
    (id) => products.find((p) => p.id === Number(id)),
    [products]
  );

  const getCompareProducts = useCallback(
    () => products.filter((p) => compareList.includes(p.id)),
    [products, compareList]
  );

  const getWishlistProducts = useCallback(
    () => products.filter((p) => wishlist.includes(p.id)),
    [products, wishlist]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};

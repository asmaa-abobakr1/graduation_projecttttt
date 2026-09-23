import { createContext, useContext, useState, useCallback } from 'react';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [compareList, setCompareList] = useState([]);

  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      rating: 0,
      reviews: 0,
      tags: product.tags || [],
      images: product.images || [product.image],
      highlights: product.highlights || [],
      pros: product.pros || [],
      cons: product.cons || [],
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, [products]);

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCompareList((prev) => prev.filter((pid) => pid !== id));
  }, []);

  const toggleCompare = useCallback((productId) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, productId];
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const getProduct = useCallback(
    (id) => products.find((p) => p.id === Number(id)),
    [products]
  );

  const getCompareProducts = useCallback(
    () => products.filter((p) => compareList.includes(p.id)),
    [products, compareList]
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
        getProduct,
        getCompareProducts,
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

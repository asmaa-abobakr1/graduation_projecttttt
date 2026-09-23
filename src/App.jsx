import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ProductDetailsPage from './pages/customer/ProductDetailsPage';
import ComparisonPage from './pages/customer/ComparisonPage';
import SearchPage from './pages/customer/SearchPage';
import CartPage from './pages/customer/CartPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Customer Storefront Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/compare" element={<ComparisonPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

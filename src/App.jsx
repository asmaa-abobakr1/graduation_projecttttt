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
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

import { useAuth } from './context/AuthContext';
import { Link } from 'react-router-dom';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

// Protected Route Guard for Admin Only
function AdminProtectedRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: 'Admin privileges required. Please sign in as an Administrator.' }}
        replace
      />
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px', background: '#F8FAFC' }}>
        <div style={{ width: 68, height: 68, borderRadius: 20, background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 16, boxShadow: '0 8px 24px rgba(220,38,38,0.12)' }}>
          🔒
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginBottom: 8, letterSpacing: '-0.5px' }}>Access Denied</h2>
        <p style={{ fontSize: 14, color: '#64748B', maxWidth: 460, marginBottom: 24, lineHeight: 1.6 }}>
          The administration portal is restricted to authorized store staff. You are signed in as a Customer (<strong>{user?.email}</strong>).
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/" style={{ padding: '10px 22px', borderRadius: 12, background: '#fff', border: '1px solid #E2E8F0', color: '#0F172A', fontWeight: 600, textDecoration: 'none', fontSize: 13, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            Return to Store
          </Link>
          <Link to="/login" style={{ padding: '10px 22px', borderRadius: 12, background: '#2563EB', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 13, boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
            Switch to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return children;
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

            {/* Admin Dashboard Routes (Protected) */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}


/**
 * Volt API Service
 * Central place for all HTTP calls to the backend.
 * Base URL comes from Vite env: VITE_API_URL
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Helper: get stored JWT ───────────────────────────────────────────────────
const getToken = () => localStorage.getItem('volt_token');

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name, email, password, role) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),

  getMe: () => request('/auth/me'),

  updateMe: (updates) =>
    request('/auth/me', { method: 'PUT', body: JSON.stringify(updates) }),

  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null))
    ).toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },

  getOne: (id) => request(`/products/${id}`),

  getBrands: () => request('/products/brands'),

  create: (product) =>
    request('/products', { method: 'POST', body: JSON.stringify(product) }),

  update: (id, updates) =>
    request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

  delete: (id) =>
    request(`/products/${id}`, { method: 'DELETE' }),

  updateStock: (id, stock) =>
    request(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock }) }),
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoriesAPI = {
  getAll: () => request('/categories'),

  create: (data) =>
    request('/categories', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id) =>
    request(`/categories/${id}`, { method: 'DELETE' }),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const ordersAPI = {
  // Place a new order (no auth required)
  place: (orderData) =>
    request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  create: (orderData) =>
    request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),

  // Admin: all orders
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/orders${qs ? `?${qs}` : ''}`);
  },

  // My orders (authenticated user)
  getMy: () => request('/orders/my'),

  getOne: (id) => request(`/orders/${id}`),

  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// ─── Users (Admin) ────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/users${qs ? `?${qs}` : ''}`);
  },
  getOne:   (id)       => request(`/users/${id}`),
  update:   (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete:   (id)       => request(`/users/${id}`, { method: 'DELETE' }),

  // Wishlist (server-side)
  getWishlist:    ()          => request('/users/me/wishlist'),
  toggleWishlist: (productId) => request(`/users/me/wishlist/${productId}`, { method: 'PUT' }),

  // Cart (server-side)
  getCart:   ()      => request('/users/me/cart'),
  syncCart:  (items) => request('/users/me/cart', { method: 'PUT', body: JSON.stringify({ items }) }),
  clearCart: ()      => request('/users/me/cart', { method: 'DELETE' }),

  // Settings (admin, server-side)
  getSettings:  ()       => request('/users/me/settings'),
  saveSettings: (data)   => request('/users/me/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Analytics (Admin) ────────────────────────────────────────────────────────
export const analyticsAPI = {
  getDashboard: () => request('/analytics/dashboard'),
  getMonthlySales: (year) => request(`/analytics/monthly-sales${year ? `?year=${year}` : ''}`),
  getCategoryBreakdown: () => request('/analytics/category-breakdown'),
  getTopProducts: () => request('/analytics/top-products'),
};

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadAPI = {
  uploadProductImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getToken();
    const res = await fetch(`${BASE_URL}/upload/product`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  uploadMultipleImages: async (files) => {
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('images', f));
    const token = getToken();
    const res = await fetch(`${BASE_URL}/upload/product/multiple`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const token = getToken();
    const res = await fetch(`${BASE_URL}/upload/avatar`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

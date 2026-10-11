import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('volt_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  // ── Persist user & token ────────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      localStorage.setItem('volt_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('volt_user');
      localStorage.removeItem('volt_token');
    }
  }, [user]);

  // ── On mount: verify stored token is still valid ────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('volt_token');
    if (token && !user) {
      authAPI.getMe()
        .then(({ user: me }) => setUser(me))
        .catch(() => {
          localStorage.removeItem('volt_token');
          localStorage.removeItem('volt_user');
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem('volt_token', res.token);
      setUser(res.user);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Signup ──────────────────────────────────────────────────────────────────
  const signup = useCallback(async (name, email, password, role = 'customer') => {
    setLoading(true);
    try {
      const res = await authAPI.register(name, email, password, role);
      localStorage.setItem('volt_token', res.token);
      setUser(res.user);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('volt_user');
    localStorage.removeItem('volt_token');
  }, []);

  // ── Update profile ──────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    try {
      const res = await authAPI.updateMe(updates);
      setUser(res.user);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      updateProfile,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

import { createContext, useContext, useState, useEffect } from 'react';
import { users as mockUsers } from '../data/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('volt_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('volt_registered_users');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('volt_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('volt_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('volt_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email, password) => {
    const found = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      return { success: true, user: safeUser };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name, email, password, role = 'customer') => {
    const exists = registeredUsers.find((u) => u.email === email);
    if (exists) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      id: registeredUsers.length + 1,
      name,
      email,
      password,
      role,
      avatar: null,
    };
    setRegisteredUsers((prev) => [...prev, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('volt_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

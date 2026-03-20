import React, { createContext, useState, useEffect, useCallback } from 'react';
import authApi from '@/apis/auth/index.js';

export const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('golf_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('golf_auth_token') || null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const persistAuth = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('golf_auth_token', authToken);
    localStorage.setItem('golf_user', JSON.stringify(userData));
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('golf_auth_token');
    localStorage.removeItem('golf_user');
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('golf_auth_token');
      if (storedToken) {
        try {
          setLoading(true);
          const res = await authApi.getMe();
          setUser(res.data.data);
          localStorage.setItem('golf_user', JSON.stringify(res.data.data));
        } catch {
          clearAuth();
        } finally {
          setLoading(false);
        }
      }
      setInitialized(true);
    };
    initAuth();
  }, [clearAuth]);

  const value = {
    user,
    token,
    loading,
    initialized,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    persistAuth,
    clearAuth,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

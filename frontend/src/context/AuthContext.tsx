import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL, getAuthToken, setAuthToken, removeAuthToken, getApiHeaders } from '../config/api';

interface User {
  id: number;
  email: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and validate it
    const token = getAuthToken();
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: getApiHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          removeAuthToken();
        }
      } else {
        removeAuthToken();
      }
    } catch (error) {
      console.error('Token validation error:', error);
      removeAuthToken();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User, token: string) => {
    setUser(userData);
    setAuthToken(token);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/users/logout`, {
        method: 'POST',
        headers: getApiHeaders()
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      removeAuthToken();
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
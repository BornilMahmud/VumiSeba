import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  loading: boolean;
  login: (credentials: any) => Promise<{ success: boolean; message_bn?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message_bn?: string }>;
  switchDemoPersona: (persona: string, role?: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('bhumisathi_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    const res = await api.getProfile();
    if (res.success && res.user) {
      setUser(res.user);
    } else {
      setUser(null);
      localStorage.removeItem('bhumisathi_token');
      setToken(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshProfile();
  }, [token]);

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    if (res.success && res.token) {
      localStorage.setItem('bhumisathi_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true };
    }
    return { success: false, message_bn: res.message_bn };
  };

  const register = async (userData: any) => {
    const res = await api.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('bhumisathi_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true };
    }
    return { success: false, message_bn: res.message_bn };
  };

  const switchDemoPersona = async (persona: string, role?: string) => {
    setIsLoading(true);
    const res = await api.demoLogin(persona, role);
    if (res.success && res.token) {
      localStorage.setItem('bhumisathi_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('bhumisathi_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loading: isLoading,
        login,
        register,
        switchDemoPersona,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

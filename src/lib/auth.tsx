"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'Free' | 'Contributor' | 'Admin';
}

interface AuthContextType {
  user: User | null;
  login: (provider: 'google' | 'github') => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = localStorage.getItem('intellifix-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (provider: 'google' | 'github') => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        name: provider === 'google' ? 'Google User' : 'GitHub User',
        email: provider === 'google' ? 'googleuser@example.com' : 'githubuser@example.com',
        avatarUrl: `https://placehold.co/40x40.png?text=${provider.charAt(0).toUpperCase()}`,
        role: 'Free',
      };
      localStorage.setItem('intellifix-user', JSON.stringify(mockUser));
      setUser(mockUser);
      setLoading(false);
      router.push('/dashboard');
    }, 500);
  };

  const logout = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.removeItem('intellifix-user');
      setUser(null);
      setLoading(false);
      router.push('/login');
    }, 500);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

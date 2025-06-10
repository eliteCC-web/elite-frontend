// contexts/AuthContext.tsx - CORREGIDO
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/auth.service';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isAuthenticated: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const isAuth = AuthService.isAuthenticated();
      if (isAuth) {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        console.log('Usuario cargado desde localStorage:', currentUser);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      AuthService.logout();
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = () => {
    checkAuth();
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login({ email, password });
      setUser(response.user);
      console.log('Usuario logueado:', response.user);
      
      // Redirigir según el rol
      if (hasUserRole(response.user, 'ADMIN') || hasUserRole(response.user, 'COLABORADOR')) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    router.push('/');
  };

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    const hasRoleResult = user.roles.some(r => r.name === role);
    console.log(`Checking role ${role}:`, hasRoleResult, 'User roles:', user.roles.map(r => r.name));
    return hasRoleResult;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => 
      role.permissions?.some(p => p.name === permission)
    );
  };

  const hasUserRole = (user: User, role: string): boolean => {
    return user.roles?.some(r => r.name === role) || false;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    hasPermission,
    isAuthenticated: !!user,
    refreshUser
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
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
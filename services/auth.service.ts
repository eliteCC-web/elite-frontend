// services/auth.service.ts - ACTUALIZADO para mejor manejo de errores
import apiClient from './api-client';

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  phone: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

const AuthService = {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('Login successful, data saved:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error in service:', error);
      // Limpiar cualquier dato residual
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      console.log('Current user from localStorage:', user);
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.logout();
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const isAuth = !!(token && user);
    console.log('Is authenticated:', isAuth);
    return isAuth;
  },

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    return user.roles.some((r) => r.name === role);
  }
};

export default AuthService;
import apiClient from './api-client';
import { RegisterData, RegisterResponse, LoginData, LoginResponse, User } from '@/interfaces/auth.interface';

const AuthService = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    console.log(data)
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  async createBulkUsers(users: RegisterData[]): Promise<{ created: number; errors: any[] }> {
    const response = await apiClient.post('/auth/bulk-create', { users });
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    return user.roles.some((r) => r.name === role);
  },

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.roles) return false;
    return user.roles.some((r) => roles.includes(r.name));
  }
};

export default AuthService;
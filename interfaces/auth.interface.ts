export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    roleIds?: number[];
  }
  
  export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    name?: string;
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
  
  export interface RegisterResponse {
    user: User;
    message: string;
  }
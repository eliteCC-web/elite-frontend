// services/role.service.ts
import apiClient from './api-client';

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
}

const RoleService = {
  async getAllRoles(): Promise<Role[]> {
    try {
      const response = await apiClient.get<Role[]>('/roles');
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [
        { id: 1, name: 'ADMIN', description: 'Administrator' },
        { id: 2, name: 'COLABORADOR', description: 'Employee' },
        { id: 3, name: 'CLIENTE_INTERNO', description: 'Internal Customer' },
        { id: 4, name: 'CLIENTE_EXTERNO', description: 'External Customer' },
        { id: 5, name: 'USER', description: 'Regular User' }
      ];
    }
  },

  async getAllPermissions(): Promise<Permission[]> {
    try {
      const response = await apiClient.get<Permission[]>('/permissions');
      return response.data;
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return [];
    }
  }
};

export default RoleService;
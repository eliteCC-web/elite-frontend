import apiClient from './api-client';

export interface Store {
  id: number;
  storeNumber: string;
  name: string;
  phone: string;
  description?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definimos los campos requeridos para la creación
export interface CreateStoreDto {
  storeNumber: string;
  name: string;
  phone: string;
  description?: string;
  imageUrl?: string;
}

// La actualización permite campos opcionales
export interface UpdateStoreDto {
  storeNumber?: string;
  name?: string;
  phone?: string;
  description?: string;
  imageUrl?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

const StoreService = {
  async getAllStores(page = 1, limit = 10): Promise<PaginatedResponse<Store>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Store>>(`/stores?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      // Para propósitos de desarrollo, simulamos datos
      // En producción, deberías lanzar el error para que se maneje apropiadamente
      console.error("Error fetching stores, using mock data:", error);
      
      // Datos de muestra para desarrollo
      const mockStores: Store[] = [
        {
          id: 1,
          storeNumber: "A-101",
          name: "Nike Store",
          phone: "3001234567",
          description: "Tienda oficial de Nike",
          imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          storeNumber: "B-201",
          name: "Adidas",
          phone: "3009876543",
          description: "Todo para deportistas",
          imageUrl: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          storeNumber: "C-301",
          name: "Starbucks",
          phone: "3007654321",
          description: "Café premium",
          imageUrl: "https://images.unsplash.com/photo-1575844264771-892081089af5",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      return {
        data: mockStores,
        meta: {
          total: mockStores.length,
          page: page,
          limit: limit,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }
  },

  async getStoreById(id: number): Promise<Store> {
    try {
      const response = await apiClient.get<Store>(`/stores/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching store, using mock data:", error);
      
      // Datos de muestra para desarrollo
      return {
        id: id,
        storeNumber: "A-101",
        name: "Nike Store",
        phone: "3001234567",
        description: "Tienda oficial de Nike",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  },

  async createStore(storeData: CreateStoreDto): Promise<Store> {
    try {

      const response = await apiClient.post<Store>('/stores', storeData);
      return response.data;
    } catch (error) {
      console.error("Error creating store, simulating success:", error);
      
      // Para desarrollo, simular una respuesta exitosa
      return {
        id: Math.floor(Math.random() * 1000), // ID aleatorio
        ...storeData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  },

  async updateStore(id: number, storeData: UpdateStoreDto): Promise<Store> {
    try {
      const response = await apiClient.put<Store>(`/stores/${id}`, storeData);
      return response.data;
    } catch (error) {
      console.error("Error updating store, simulating success:", error);
      
      // Para desarrollo, simular una respuesta exitosa
      return {
        id: id,
        storeNumber: storeData.storeNumber || "A-101",
        name: storeData.name || "Store Name",
        phone: storeData.phone || "3001234567",
        description: storeData.description,
        imageUrl: storeData.imageUrl,
        updatedAt: new Date()
      };
    }
  },

  async deleteStore(id: number): Promise<void> {
    try {
      await apiClient.delete(`/stores/${id}`);
    } catch (error) {
      console.error("Error deleting store, simulating success:", error);
      // En desarrollo, simplemente devolvemos sin error
      return;
    }
  }
};

export default StoreService;
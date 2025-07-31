import apiClient from './api-client';

export interface StoreSchedule {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export interface Store {
  id: number;
  storeNumber: string;
  name: string;
  phone: string;
  description?: string;
  images?: string[];
  videos?: string[];
  schedule?: StoreSchedule[];
  category?: string;
  floor?: string;
  monthlyRent?: number;
  isActive: boolean;
  isService?: boolean;
  ownerId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Definimos los campos requeridos para la creación
export interface CreateStoreDto {
  storeNumber: string;
  name: string;
  phone: string;
  description?: string;
  images?: string[];
  videos?: string[];
  schedule?: StoreSchedule[];
  isService?: boolean;
}

// La actualización permite campos opcionales
export interface UpdateStoreDto {
  storeNumber?: string;
  name?: string;
  phone?: string;
  description?: string;
  images?: string[];
  videos?: string[];
  schedule?: any;
  category?: string;
  floor?: string;
  monthlyRent?: number;
  isActive?: boolean;
  isService?: boolean;
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
      const response = await apiClient.get<PaginatedResponse<Store>>('/stores', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching stores, using sample data:", error);
      
      // Datos de ejemplo cuando la API no está disponible
      const sampleStores: Store[] = [
        {
          id: 1,
          storeNumber: "JOY-1234",
          name: "JOYERÍA Y COMPRAVENTA LA DINASTÍA",
          phone: "1111111111",
          description: "Nos dedicamos a la venta de joyas de oro de 18 kilates, también compramos tus joyas y hacemos empeños por ellas también una de la cosas que más nos identifica es que manejamos garantía de la calidad del producto y del peso comprobando que nuestras joyas son de 18 kilates y donde al mismo tiempo recibes una excelente atención a la hora de consultar por una joya.",
          images: ["https://pmulriauzstmyeslfvpn.supabase.co/storage/v1/object/public/elitecc-web/store-images/1750819665937-ez2bdhjczca.jpeg"],
          schedule: [
            {
              day: "monday",
              isOpen: true,
              openTime: "09:00",
              closeTime: "18:00"
            }
          ],
          category: "Joyería",
          floor: "1",
          monthlyRent: 2500000,
          isActive: true,
          isService: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Simular paginación
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedStores = sampleStores.slice(startIndex, endIndex);
      
      return {
        data: paginatedStores,
        meta: {
          total: sampleStores.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(sampleStores.length / limit),
          hasNextPage: endIndex < sampleStores.length,
          hasPrevPage: page > 1,
        }
      };
    }
  },

  async getStores(page = 1, limit = 10): Promise<PaginatedResponse<Store>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Store>>('/stores/tiendas', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching stores:", error);
      throw error;
    }
  },

  async getServices(page = 1, limit = 10): Promise<PaginatedResponse<Store>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Store>>('/stores/servicios', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  },

  async getStoreById(id: number): Promise<Store> {
    try {
      const response = await apiClient.get<Store>(`/stores/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching store, using sample data:", error);
      
      // Datos de ejemplo cuando la API no está disponible
      const sampleStores: Store[] = [
        {
          id: 1,
          storeNumber: "JOY-1234",
          name: "JOYERÍA Y COMPRAVENTA LA DINASTÍA",
          phone: "1111111111",
          description: "Nos dedicamos a la venta de joyas de oro de 18 kilates, también compramos tus joyas y hacemos empeños por ellas también una de la cosas que más nos identifica es que manejamos garantía de la calidad del producto y del peso comprobando que nuestras joyas son de 18 kilates y donde al mismo tiempo recibes una excelente atención a la hora de consultar por una joya.",
          images: ["https://pmulriauzstmyeslfvpn.supabase.co/storage/v1/object/public/elitecc-web/store-images/1750819665937-ez2bdhjczca.jpeg"],
          schedule: [
            {
              day: "monday",
              isOpen: true,
              openTime: "09:00",
              closeTime: "18:00"
            }
          ],
          category: "Joyería",
          floor: "1",
          monthlyRent: 2500000,
          isActive: true,
          isService: false,
        createdAt: new Date(),
        updatedAt: new Date()
        }
      ];
      
      const store = sampleStores.find(s => s.id === id);
      if (!store) {
        throw new Error(`Store with ID ${id} not found`);
      }
      
      return store;
    }
  },

  async createStore(storeData: CreateStoreDto): Promise<Store> {
    try {
      const response = await apiClient.post<Store>('/stores', storeData);
      return response.data;
    } catch (error) {
      console.error("Error creating store:", error);
      throw error;
    }
  },

  async updateStore(id: number, storeData: UpdateStoreDto): Promise<Store> {
    try {
      const response = await apiClient.put<Store>(`/stores/${id}`, storeData);
      return response.data;
    } catch (error) {
      console.error("Error updating store:", error);
      throw error;
    }
  },

  async deleteStore(id: number): Promise<void> {
    try {
      await apiClient.delete(`/stores/${id}`);
    } catch (error) {
      console.error("Error deleting store:", error);
      throw error;
    }
  }
};

export default StoreService;
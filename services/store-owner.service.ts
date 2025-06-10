// services/store-owner.service.ts
import apiClient from './api-client';
import { Store, UpdateStoreDto } from './store.service';

const StoreOwnerService = {
  async getMyStore(): Promise<Store | null> {
    try {
      const response = await apiClient.get<Store>('/stores/my-store');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No tiene tienda asignada
      }
      console.error("Error fetching my store:", error);
      throw error;
    }
  },

  async updateMyStore(storeData: UpdateStoreDto): Promise<Store> {
    try {
      const response = await apiClient.put<Store>('/stores/my-store', storeData);
      return response.data;
    } catch (error) {
      console.error("Error updating my store:", error);
      throw error;
    }
  },

  async uploadStoreImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiClient.post<{imageUrl: string}>('/stores/my-store/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading store image:", error);
      throw error;
    }
  }
};

export default StoreOwnerService;
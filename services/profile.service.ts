// services/profile.service.ts
import apiClient from './api-client';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  roles: Role[];
  createdAt: string;
  schedules?: Schedule[];
  ownedStore?: Store;
}

export interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  isHoliday: boolean;
  notes?: string;
}

export interface Store {
  id: number;
  storeNumber: string;
  name: string;
  phone: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  floor?: string;
  monthlyRent?: number;
  isActive: boolean;
}

export interface Role {
  id: number;
  name: string;
}

export interface ThreeWeeksSchedule {
  lastWeek: Schedule[];
  currentWeek: Schedule[];
  nextWeek: Schedule[];
}

const ProfileService = {
  async getUserProfile(userId: number): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  async updateProfile(userId: number, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  async getThreeWeeksSchedule(userId: number): Promise<ThreeWeeksSchedule> {
    try {
      const response = await apiClient.get<ThreeWeeksSchedule>(`/schedules/user/${userId}/three-weeks`);
      return response.data;
    } catch (error) {
      console.error("Error fetching schedule:", error);
      // Datos de muestra para desarrollo
      return {
        lastWeek: [],
        currentWeek: [
          {
            id: 1,
            date: '2025-06-09',
            startTime: '08:00',
            endTime: '17:00',
            isHoliday: false
          },
          {
            id: 2,
            date: '2025-06-10',
            startTime: '08:00',
            endTime: '17:00',
            isHoliday: false
          },
          {
            id: 3,
            date: '2025-06-11',
            startTime: '08:00',
            endTime: '17:00',
            isHoliday: false
          }
        ],
        nextWeek: []
      };
    }
  }
};

export default ProfileService;
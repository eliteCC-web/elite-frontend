// services/event.service.ts
import apiClient from './api-client';

export interface Event {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  capacity: number;
  registeredCount: number;
  imageUrl?: string;
  images?: string[];
  organizer: string;
  contactEmail?: string;
  isActive: boolean;
  isFeatured: boolean;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  registeredUsers?: any[];
}

export interface CreateEventDto {
  name: string;
  description: string;
  longDescription?: string;
  startDate: string;
  endDate: string;
  location: string;
  price?: number;
  capacity?: number;
  imageUrl?: string;
  images?: string[];
  organizer: string;
  contactEmail?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  slug?: string;
}

export interface UpdateEventDto {
  name?: string;
  description?: string;
  longDescription?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  price?: number;
  capacity?: number;
  imageUrl?: string;
  images?: string[];
  organizer?: string;
  contactEmail?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  slug?: string;
}

export interface EventFilters {
  category?: string;
  featured?: boolean;
  search?: string;
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

const EventService = {
  async getAllEvents(page = 1, limit = 10, filters?: EventFilters): Promise<PaginatedResponse<Event>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.featured !== undefined && { featured: filters.featured.toString() }),
        ...(filters?.search && { search: filters.search }),
      });

      const response = await apiClient.get<PaginatedResponse<Event>>(`/events?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching events, using mock data:", error);
      
      // Datos de muestra para desarrollo
      const mockEvents: Event[] = [
        {
          id: 1,
          name: "Fiesta Colores",
          description: "Celebra con actividades especiales para los más pequeños",
          longDescription: "El Centro Comercial Elite se complace en invitarte a celebrar la Fiesta Colores...",
          startDate: "2025-04-26T10:30:00Z",
          endDate: "2025-04-26T18:00:00Z",
          location: "Plaza Central",
          price: 20000,
          capacity: 25,
          registeredCount: 15,
          imageUrl: "/images/dia-nino-1.jpg",
          organizer: "Centro Comercial Elite",
          contactEmail: "eventos@ccelite.com",
          isActive: true,
          isFeatured: true,
          slug: "fiesta-colores"
        },
        {
          id: 2,
          name: "Festival Gastronómico",
          description: "Degusta los mejores platillos de nuestros restaurantes",
          startDate: "2025-08-15T12:00:00Z",
          endDate: "2025-08-15T21:00:00Z",
          location: "Zona de Restaurantes",
          price: 25000,
          capacity: 500,
          registeredCount: 250,
          organizer: "Asociación de Restaurantes CC Elite",
          contactEmail: "gastronomia@ccelite.com",
          isActive: true,
          isFeatured: true,
          slug: "festival-gastronomico"
        }
      ];
      
      return {
        data: mockEvents,
        meta: {
          total: mockEvents.length,
          page: page,
          limit: limit,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }
  },

  async getEventById(id: number): Promise<Event> {
    try {
      const response = await apiClient.get<Event>(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching event, using mock data:", error);
      
      return {
        id: id,
        name: "Evento de Muestra",
        description: "Descripción del evento",
        startDate: "2025-04-26T10:30:00Z",
        endDate: "2025-04-26T18:00:00Z",
        location: "Plaza Central",
        price: 20000,
        capacity: 25,
        registeredCount: 15,
        organizer: "Centro Comercial Elite",
        isActive: true,
        isFeatured: false,
        slug: "evento-muestra"
      };
    }
  },

  async getEventBySlug(slug: string): Promise<Event> {
    try {
      const response = await apiClient.get<Event>(`/events/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching event by slug:", error);
      throw error;
    }
  },

  async createEvent(eventData: CreateEventDto): Promise<Event> {
    try {
      const response = await apiClient.post<Event>('/events', eventData);
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  async updateEvent(id: number, eventData: UpdateEventDto): Promise<Event> {
    try {
      const response = await apiClient.put<Event>(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  async deleteEvent(id: number): Promise<void> {
    try {
      await apiClient.delete(`/events/${id}`);
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  async registerForEvent(eventId: number, registrationData: {
    eventId: number;
    name: string;
    phone: string;
    email?: string;
  }): Promise<Event> {
    try {
      const response = await apiClient.post<Event>('/events/register', registrationData);
      return response.data;
    } catch (error) {
      console.error("Error registering for event:", error);
      throw error;
    }
  },

  async unregisterFromEvent(eventId: number, userId: number): Promise<Event> {
    try {
      const response = await apiClient.delete<Event>(`/events/${eventId}/unregister/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error unregistering from event:", error);
      throw error;
    }
  },

  async getFeaturedEvents(): Promise<Event[]> {
    try {
      const response = await apiClient.get<Event[]>('/events/featured');
      return response.data;
    } catch (error) {
      console.error("Error fetching featured events:", error);
      return [];
    }
  },

  async getUpcomingEvents(): Promise<Event[]> {
    try {
      const response = await apiClient.get<Event[]>('/events/upcoming');
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      return [];
    }
  }
};

export default EventService;
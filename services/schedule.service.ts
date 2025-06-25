import apiClient from './api-client';

export interface Schedule {
  id: number;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
  isHoliday: boolean;
  notes?: string;
  shiftType: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FULL_DAY';
  position?: string;
  isAssigned: boolean;
  assignedBy?: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateScheduleDto {
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
  isHoliday?: boolean;
  notes?: string;
  shiftType?: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FULL_DAY';
  position?: string;
}

export interface BulkCreateScheduleDto {
  weekStartDate: string;
  schedules: CreateScheduleDto[];
}

export interface AssignRandomShiftsDto {
  weekStartDate: string;
  userIds: number[];
  shiftPattern?: 'ROTATING' | 'FIXED' | 'CUSTOM';
}

export interface ThreeWeeksSchedule {
  lastWeek: Schedule[];
  currentWeek: Schedule[];
  nextWeek: Schedule[];
}

export class ScheduleService {
  // Obtener horarios del usuario actual
  static async getMySchedule(): Promise<Schedule[]> {
    const response = await apiClient.get('/schedule/my-schedule');
    return response.data;
  }

  // Obtener horarios de 3 semanas del usuario actual
  static async getMyThreeWeeksSchedule(): Promise<ThreeWeeksSchedule> {
    const response = await apiClient.get('/schedule/my-schedule/three-weeks');
    return response.data;
  }

  // Obtener horarios de un usuario específico (admin)
  static async getUserSchedule(userId: number): Promise<Schedule[]> {
    const response = await apiClient.get(`/schedule/user/${userId}`);
    return response.data;
  }

  // Obtener todos los colaboradores
  static async getColaboradores(): Promise<any[]> {
    const response = await apiClient.get('/schedule/colaboradores');
    return response.data;
  }

  // Obtener horario semanal (admin)
  static async getWeeklySchedule(weekStart: string): Promise<Schedule[]> {
    const response = await apiClient.get(`/schedule/weekly?weekStart=${weekStart}`);
    return response.data;
  }

  // Crear un horario
  static async createSchedule(schedule: CreateScheduleDto): Promise<Schedule> {
    const response = await apiClient.post('/schedule', schedule);
    return response.data;
  }

  // Crear horarios en lote
  static async bulkCreateSchedules(bulkData: BulkCreateScheduleDto): Promise<Schedule[]> {
    const response = await apiClient.post('/schedule/bulk', bulkData);
    return response.data;
  }

  // Asignar turnos aleatorios
  static async assignRandomShifts(assignData: AssignRandomShiftsDto): Promise<Schedule[]> {
    const response = await apiClient.post('/schedule/assign-random', assignData);
    return response.data;
  }

  // Actualizar un horario
  static async updateSchedule(id: number, schedule: Partial<CreateScheduleDto>): Promise<Schedule> {
    const response = await apiClient.patch(`/schedule/${id}`, schedule);
    return response.data;
  }

  // Eliminar un horario
  static async deleteSchedule(id: number): Promise<void> {
    await apiClient.delete(`/schedule/${id}`);
  }

  // Utilidades para fechas
  static getWeekStart(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  static getWeekEnd(date: Date = new Date()): Date {
    const weekStart = this.getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return weekEnd;
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static formatTime(time: string): string {
    return time.substring(0, 5);
  }

  static getShiftTypeColor(shiftType: string): string {
    switch (shiftType) {
      case 'MORNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'AFTERNOON':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'NIGHT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FULL_DAY':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  static getShiftTypeLabel(shiftType: string): string {
    switch (shiftType) {
      case 'MORNING':
        return 'Mañana';
      case 'AFTERNOON':
        return 'Tarde';
      case 'NIGHT':
        return 'Noche';
      case 'FULL_DAY':
        return 'Día completo';
      default:
        return 'Sin definir';
    }
  }
} 
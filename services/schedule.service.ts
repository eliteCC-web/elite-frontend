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

export interface AssignShiftDto {
  userIds: number[];
  date: string;
  startTime: string;
  endTime: string;
  shiftType?: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FULL_DAY';
  position?: string;
  notes?: string;
}

export class ScheduleService {
  // Obtener todos los horarios
  static async getAllSchedules(): Promise<Schedule[]> {
    const response = await apiClient.get('/schedule');
    return response.data;
  }

  // Crear un horario
  static async createSchedule(scheduleData: CreateScheduleDto): Promise<Schedule> {
    const response = await apiClient.post('/schedule', scheduleData);
    return response.data;
  }

  // Obtener horarios de un usuario
  static async getUserSchedules(userId: number): Promise<Schedule[]> {
    const response = await apiClient.get(`/schedule/user/${userId}`);
    return response.data;
  }

  // Obtener horarios de tres semanas para un usuario
  static async getUserThreeWeeksSchedule(userId: number): Promise<{
    lastWeek: Schedule[];
    currentWeek: Schedule[];
    nextWeek: Schedule[];
  }> {
    const response = await apiClient.get(`/schedule/user/${userId}/three-weeks`);
    return response.data;
  }

  // Obtener horarios semanales
  static async getWeeklySchedule(weekStart: string): Promise<Schedule[]> {
    const response = await apiClient.get(`/schedule/weekly?weekStart=${weekStart}`);
    return response.data;
  }

  // Actualizar un horario
  static async updateSchedule(id: number, scheduleData: Partial<CreateScheduleDto>): Promise<Schedule> {
    const response = await apiClient.patch(`/schedule/${id}`, scheduleData);
    return response.data;
  }

  // Eliminar un horario
  static async deleteSchedule(id: number): Promise<void> {
    await apiClient.delete(`/schedule/${id}`);
  }

  // Obtener todos los colaboradores
  static async getColaboradores(): Promise<any[]> {
    const response = await apiClient.get('/schedule/colaboradores');
    return response.data;
  }

  // Asignar turnos aleatorios
  static async assignRandomShifts(assignData: AssignRandomShiftsDto): Promise<Schedule[]> {
    const response = await apiClient.post('/schedule/assign-random', assignData);
    return response.data;
  }

  // Asignar turno individual
  static async assignShift(assignData: AssignShiftDto): Promise<Schedule[]> {
    const response = await apiClient.post('/schedule/assign-shift', assignData);
    return response.data;
  }

  // Nuevos métodos para notificaciones
  static async sendScheduleNotification(scheduleId: number): Promise<void> {
    await apiClient.post(`/schedule/notifications/send/${scheduleId}`);
  }

  static async sendBulkNotifications(scheduleIds: number[]): Promise<void> {
    await apiClient.post('/schedule/notifications/send-bulk', { scheduleIds });
  }

  static async sendScheduleReminder(scheduleId: number): Promise<void> {
    await apiClient.post(`/schedule/notifications/reminder/${scheduleId}`);
  }

  static async getPendingNotifications(userId: number): Promise<Schedule[]> {
    const response = await apiClient.get(`/schedule/notifications/pending/${userId}`);
    return response.data;
  }

  // Utilidades
  static getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que la semana empiece en lunes
    return new Date(d.setDate(diff));
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static formatTime(time: string): string {
    return time.substring(0, 5); // Formato HH:MM
  }

  static getShiftTypeColor(shiftType: string): string {
    switch (shiftType) {
      case 'MORNING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AFTERNOON':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'NIGHT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FULL_DAY':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
} 
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, CalendarDays, TrendingUp, AlertCircle } from 'lucide-react';
import { ScheduleService } from '../../services/schedule.service';
import { useAuth } from '../../hooks/useAuth';
import WeeklyCalendar from '../../components/schedule/WeeklyCalendar';

interface ThreeWeeksSchedule {
  lastWeek: any[];
  currentWeek: any[];
  nextWeek: any[];
}

export default function MiHorarioPage() {
  const { user } = useAuth();
  const [scheduleData, setScheduleData] = useState<ThreeWeeksSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<'last' | 'current' | 'next'>('current');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ScheduleService.getUserThreeWeeksSchedule(user?.id || 0);
      setScheduleData(data);
      setCurrentWeekStart(ScheduleService.getWeekStart(new Date()));
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const getCurrentWeekSchedules = () => {
    if (!scheduleData) return [];
    return scheduleData.currentWeek;
  };

  const getWeekSchedules = (week: 'last' | 'current' | 'next') => {
    if (!scheduleData) return [];
    switch (week) {
      case 'last':
        return scheduleData.lastWeek;
      case 'current':
        return scheduleData.currentWeek;
      case 'next':
        return scheduleData.nextWeek;
      default:
        return [];
    }
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'long' });
  };

  const getDayNumber = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return today.toDateString() === date.toDateString();
  };

  const getShiftTypeIcon = (shiftType: string) => {
    switch (shiftType) {
      case 'MORNING':
        return '🌅';
      case 'AFTERNOON':
        return '🌆';
      case 'NIGHT':
        return '🌙';
      case 'FULL_DAY':
        return '☀️';
      default:
        return '⏰';
    }
  };

  const getShiftTypeLabel = (shiftType: string): string => {
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
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentWeekStart(newDate);
  };

  const handleTodayClick = () => {
    setCurrentWeekStart(ScheduleService.getWeekStart(new Date()));
  };

  const getStats = () => {
    const currentSchedules = getCurrentWeekSchedules();
    const totalShifts = currentSchedules.length;
    const totalHours = currentSchedules.reduce((total: number, schedule: any) => {
      const start = new Date(`2000-01-01T${schedule.startTime}`);
      const end = new Date(`2000-01-01T${schedule.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);

    return { totalShifts, totalHours: Math.round(totalHours) };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tu horario...</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mi Horario</h1>
                <p className="text-sm text-gray-600">Bienvenido, {user?.firstName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>{user?.firstName} {user?.lastName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Turnos esta semana</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalShifts}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Horas totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHours}h</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalShifts > 0 ? 'Activo' : 'Sin turnos'}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Calendario principal */}
        <div className="mb-8">
          <WeeklyCalendar
            schedules={getCurrentWeekSchedules()}
            weekStart={currentWeekStart}
            onWeekChange={handleWeekChange}
            onTodayClick={handleTodayClick}
            isToday={isToday}
          />
        </div>

        {/* Navegación entre semanas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Mis Turnos - Vista de 3 Semanas</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedWeek('last')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedWeek === 'last'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                ← Semana Anterior
              </button>
              <button
                onClick={() => setSelectedWeek('current')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedWeek === 'current'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                Esta Semana
              </button>
              <button
                onClick={() => setSelectedWeek('next')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedWeek === 'next'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                Próxima Semana →
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {getWeekSchedules(selectedWeek).map((schedule) => (
              <div
                key={schedule.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isToday(schedule.date)
                    ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${ScheduleService.getShiftTypeColor(schedule.shiftType)}`}>
                      <span className="text-lg">{getShiftTypeIcon(schedule.shiftType)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {getDayName(schedule.date)} {getDayNumber(schedule.date)}
                        {isToday(schedule.date) && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Hoy
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getShiftTypeLabel(schedule.shiftType)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {ScheduleService.formatTime(schedule.startTime)} - {ScheduleService.formatTime(schedule.endTime)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {schedule.position || 'Colaborador'}
                    </div>
                  </div>
                </div>
                {schedule.notes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <div className="text-sm text-blue-800">
                      <strong>Nota:</strong> {schedule.notes}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {getWeekSchedules(selectedWeek).length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay turnos asignados para esta semana</p>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Importante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-sm">🌅</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Turno Mañana</div>
                  <div className="text-sm text-gray-600">08:00 - 16:00</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-sm">🌆</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Turno Tarde</div>
                  <div className="text-sm text-gray-600">16:00 - 00:00</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm">🌙</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Turno Noche</div>
                  <div className="text-sm text-gray-600">00:00 - 08:00</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-sm">☀️</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Día Completo</div>
                  <div className="text-sm text-gray-600">08:00 - 18:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Aviso importante */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Recordatorio</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Por favor, revisa tu horario regularmente. Si tienes alguna pregunta sobre tus turnos, 
                  contacta a tu supervisor o al departamento de recursos humanos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
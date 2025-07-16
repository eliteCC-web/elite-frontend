'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, RefreshCw, ChevronLeft, ChevronRight, Bell, Users, Trash2 } from 'lucide-react';
import { ScheduleService, Schedule } from '../../../services/schedule.service';
import { User as UserType } from '../../../services/user.service';
import AssignShiftModal from '../../../components/admin/AssignShiftModal';
import ScheduleNotificationModal from '../../../components/admin/ScheduleNotificationModal';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [colaboradores, setColaboradores] = useState<UserType[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  const weekStart = ScheduleService.getWeekStart(selectedWeek);
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching data for week:', selectedWeek);
        const currentWeekStart = ScheduleService.getWeekStart(selectedWeek);
        const weekStartFormatted = ScheduleService.formatDate(currentWeekStart);
        console.log('Week start formatted:', weekStartFormatted);
        
        const [schedulesData, colaboradoresData] = await Promise.all([
          ScheduleService.getWeeklySchedule(weekStartFormatted),
          ScheduleService.getColaboradores()
        ]);
        
        console.log('Schedules data:', schedulesData);
        console.log('Colaboradores data:', colaboradoresData);
        
        // Log para diagnosticar el problema de los turnos
        console.log('Total schedules received:', schedulesData.length);
        console.log('Week start:', weekStartFormatted);
        
        setSchedules(schedulesData);
        setColaboradores(colaboradoresData);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedWeek]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setSelectedWeek(newDate);
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este turno?')) {
      return;
    }

    try {
      await ScheduleService.deleteSchedule(scheduleId);
      // Recargar los datos
      window.location.reload();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Error al eliminar el turno');
    }
  };

  const normalizeDate = (dateString: string) => {
    // Asegurar que la fecha esté en formato YYYY-MM-DD sin problemas de zona horaria
    const date = new Date(dateString + 'T00:00:00');
    return date.toISOString().split('T')[0];
  };

  const getSchedulesForDay = (date: string) => {
    const normalizedTargetDate = normalizeDate(date);
    const daySchedules = schedules.filter(s => {
      const normalizedScheduleDate = normalizeDate(s.date);
      return normalizedScheduleDate === normalizedTargetDate;
    });
    
    if (daySchedules.length > 0) {
      console.log(`Found ${daySchedules.length} schedules for ${normalizedTargetDate}`);
    }
    return daySchedules;
  };

  const getDayDate = (dayIndex: number) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + dayIndex);
    const formattedDate = ScheduleService.formatDate(date);
    console.log(`Day ${dayIndex} (${daysOfWeek[dayIndex]}): ${formattedDate}`);
    return formattedDate;
  };

  const getShiftTypeColor = (shiftType: string) => {
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

  const formatWeekRange = () => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const startFormatted = weekStart.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
    const endFormatted = weekEnd.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando horarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Gestión de Turnos</h1>
              <p className="text-gray-600 text-sm lg:text-base">Administra los horarios de los colaboradores</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <button
              onClick={() => setNotificationModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notificaciones</span>
            </button>
            <button
              onClick={() => setAssignModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Asignar Turno</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>
        </div>

        {/* Controles de semana */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Semana del {formatWeekRange()}
            </h2>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSelectedWeek(new Date())}
                className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100"
              >
                Hoy
              </button>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Total Colaboradores</p>
                  <p className="text-lg font-bold text-blue-700">{colaboradores.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-900">Turnos Asignados</p>
                  <p className="text-lg font-bold text-green-700">{schedules.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Días con Turnos</p>
                  <p className="text-lg font-bold text-purple-700">
                    {new Set(schedules.map(s => s.date)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendario Semanal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header del calendario */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 px-4 lg:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Calendario Semanal</h3>
                  <p className="text-sm text-gray-600">{formatWeekRange()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid del calendario */}
          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {daysOfWeek.map((day, index) => {
                const dateString = getDayDate(index);
                const daySchedules = getSchedulesForDay(dateString);
                const isWeekend = index === 0 || index === 6;
                const isToday = new Date().toDateString() === new Date(dateString).toDateString();

                return (
                  <div
                    key={day}
                    className={`relative p-3 lg:p-4 rounded-lg border-2 transition-all duration-200 ${
                      isWeekend
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-white border-gray-200'
                    } ${isToday ? 'ring-2 ring-red-300 shadow-md' : ''}`}
                  >
                    {/* Indicador de día actual */}
                    {isToday && (
                      <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Hoy
                      </div>
                    )}

                    {/* Header del día */}
                    <div className="text-center mb-3">
                      <div className={`text-xs font-medium mb-1 ${
                        isWeekend ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {day}
                      </div>
                      <div className={`text-lg font-bold ${
                        isWeekend ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {new Date(dateString).getDate()}
                      </div>
                    </div>

                    {/* Lista de turnos */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {daySchedules.length > 0 ? (
                        daySchedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className={`p-2 rounded-md border text-xs ${getShiftTypeColor(schedule.shiftType)} relative group`}
                          >
                            <button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="absolute top-1 right-1 p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Eliminar turno"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                            <div className="flex items-center justify-between mb-1 pr-6">
                              <span className="font-medium">
                                {schedule.user?.firstName} {schedule.user?.lastName}
                              </span>
                              <span>{getShiftTypeIcon(schedule.shiftType)}</span>
                            </div>
                            <div className="text-xs opacity-75">
                              {ScheduleService.formatTime(schedule.startTime)} - {ScheduleService.formatTime(schedule.endTime)}
                            </div>
                            {schedule.position && (
                              <div className="text-xs opacity-75 mt-1">
                                {schedule.position}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <div className={`text-gray-400 ${isWeekend ? 'text-gray-300' : ''}`}>
                            {isWeekend ? (
                              <div className="space-y-1">
                                <div className="text-lg">🏖️</div>
                                <div className="text-xs">Descanso</div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <Clock className="h-4 w-4 mx-auto text-gray-300" />
                                <div className="text-xs">Sin turnos</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contador de turnos */}
                    {daySchedules.length > 0 && (
                      <div className="mt-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {daySchedules.length} turno{daySchedules.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leyenda */}
          <div className="bg-gray-50 px-4 lg:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="font-medium text-gray-700">Leyenda:</span>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span>🌅</span>
                    <span className="text-gray-600">Mañana</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🌆</span>
                    <span className="text-gray-600">Tarde</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🌙</span>
                    <span className="text-gray-600">Noche</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>☀️</span>
                    <span className="text-gray-600">Día completo</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {schedules.length} turnos asignados en total
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <AssignShiftModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onSuccess={async () => {
          setAssignModalOpen(false);
          window.location.reload();
        }}
      />

      <ScheduleNotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        schedules={schedules}
        onSuccess={() => {
          setNotificationModalOpen(false);
        }}
      />
    </div>
  );
} 
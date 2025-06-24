'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Plus, RefreshCw, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScheduleService, Schedule, AssignRandomShiftsDto } from '../../../services/schedule.service';
import { UserService } from '../../../services/user.service';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [shiftPattern, setShiftPattern] = useState<'ROTATING' | 'FIXED' | 'CUSTOM'>('ROTATING');

  const weekStart = ScheduleService.getWeekStart(selectedWeek);
  const weekEnd = ScheduleService.getWeekEnd(selectedWeek);

  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  useEffect(() => {
    loadData();
  }, [selectedWeek]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [schedulesData, colaboradoresData] = await Promise.all([
        ScheduleService.getWeeklySchedule(ScheduleService.formatDate(weekStart)),
        ScheduleService.getColaboradores()
      ]);
      setSchedules(schedulesData);
      setColaboradores(colaboradoresData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRandomShifts = async () => {
    if (selectedUsers.length === 0) {
      alert('Selecciona al menos un colaborador');
      return;
    }

    setAssigning(true);
    try {
      const assignData: AssignRandomShiftsDto = {
        weekStartDate: ScheduleService.formatDate(weekStart),
        userIds: selectedUsers,
        shiftPattern
      };

      await ScheduleService.assignRandomShifts(assignData);
      await loadData();
      setSelectedUsers([]);
      alert('Turnos asignados exitosamente');
    } catch (error) {
      console.error('Error assigning shifts:', error);
      alert('Error al asignar turnos');
    } finally {
      setAssigning(false);
    }
  };

  const getScheduleForUserAndDay = (userId: number, date: string) => {
    return schedules.find(s => s.userId === userId && s.date === date);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setSelectedWeek(newDate);
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Turnos</h1>
                <p className="text-sm text-gray-600">Administra los horarios de los colaboradores</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => loadData()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controles de semana */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Semana del {weekStart.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
            
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

          {/* Panel de asignación automática */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-medium text-gray-900">Asignación Automática</h3>
              <Settings className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Colaboradores Seleccionados ({selectedUsers.length})
                </label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {colaboradores.map(user => (
                    <label key={user.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        {user.firstName} {user.lastName}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patrón de Turnos
                </label>
                <select
                  value={shiftPattern}
                  onChange={(e) => setShiftPattern(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="ROTATING">Rotativo</option>
                  <option value="FIXED">Fijo</option>
                  <option value="CUSTOM">Personalizado</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAssignRandomShifts}
                  disabled={assigning || selectedUsers.length === 0}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assigning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Asignando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Asignar Turnos
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de horarios */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Colaborador
                  </th>
                  {daysOfWeek.map((day, index) => {
                    const date = new Date(weekStart);
                    date.setDate(weekStart.getDate() + index);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <th key={day} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className={`${isToday ? 'bg-red-100 text-red-800' : ''} rounded-md py-1`}>
                          <div className="font-medium">{day}</div>
                          <div className="text-xs">{date.getDate()}</div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {colaboradores.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    {daysOfWeek.map((day, index) => {
                      const date = new Date(weekStart);
                      date.setDate(weekStart.getDate() + index);
                      const schedule = getScheduleForUserAndDay(user.id, ScheduleService.formatDate(date));
                      const isToday = date.toDateString() === new Date().toDateString();
                      
                      return (
                        <td key={day} className="px-3 py-4 whitespace-nowrap text-center">
                          {schedule ? (
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${ScheduleService.getShiftTypeColor(schedule.shiftType)} ${isToday ? 'ring-2 ring-red-300' : ''}`}>
                              <Clock className="h-3 w-3 mr-1" />
                              {ScheduleService.formatTime(schedule.startTime)} - {ScheduleService.formatTime(schedule.endTime)}
                            </div>
                          ) : (
                            <div className={`text-xs text-gray-400 ${isToday ? 'bg-red-50 text-red-600 rounded-md px-2 py-1' : ''}`}>
                              Sin asignar
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
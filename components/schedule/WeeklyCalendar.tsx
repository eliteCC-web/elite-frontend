'use client';

import React from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Schedule, ScheduleService } from '../../services/schedule.service';

interface WeeklyCalendarProps {
  schedules: Schedule[];
  weekStart: Date;
  onWeekChange: (direction: 'prev' | 'next') => void;
  onTodayClick: () => void;
  isToday?: (date: string) => boolean;
}

export default function WeeklyCalendar({
  schedules,
  weekStart,
  onWeekChange,
  onTodayClick,
  isToday
}: WeeklyCalendarProps) {
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const getScheduleForDay = (dayIndex: number) => {
    const targetDate = new Date(weekStart);
    targetDate.setDate(weekStart.getDate() + dayIndex);
    const dateString = ScheduleService.formatDate(targetDate);
    return schedules.find(s => s.date === dateString);
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header del calendario */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Calendario Semanal</h2>
              <p className="text-sm text-gray-600">{formatWeekRange()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onWeekChange('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={onTodayClick}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Hoy
            </button>
            <button
              onClick={() => onWeekChange('next')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-white transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid del calendario */}
      <div className="p-6">
        <div className="grid grid-cols-7 gap-4">
          {daysOfWeek.map((day, index) => {
            const schedule = getScheduleForDay(index);
            const currentDate = new Date(weekStart);
            currentDate.setDate(weekStart.getDate() + index);
            const dateString = ScheduleService.formatDate(currentDate);
            const isCurrentDay = isToday ? isToday(dateString) : false;
            const isWeekend = index === 0 || index === 6; // Domingo o Sábado

            return (
              <div
                key={day}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  schedule
                    ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm'
                    : isWeekend
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-200'
                } ${isCurrentDay ? 'ring-2 ring-red-300 shadow-md' : ''}`}
              >
                {/* Indicador de día actual */}
                {isCurrentDay && (
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
                    {currentDate.getDate()}
                  </div>
                </div>

                {/* Contenido del día */}
                {schedule ? (
                  <div className="space-y-2">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-full justify-center ${ScheduleService.getShiftTypeColor(schedule.shiftType)}`}>
                      <span className="mr-1">{getShiftTypeIcon(schedule.shiftType)}</span>
                      {ScheduleService.formatTime(schedule.startTime)} - {ScheduleService.formatTime(schedule.endTime)}
                    </div>
                    <div className="text-xs text-gray-600 text-center">
                      {ScheduleService.getShiftTypeLabel(schedule.shiftType)}
                    </div>
                    {schedule.position && (
                      <div className="text-xs text-gray-500 text-center">
                        {schedule.position}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className={`text-gray-400 ${isWeekend ? 'text-gray-300' : ''}`}>
                      {isWeekend ? (
                        <div className="space-y-1">
                          <div className="text-lg">🏖️</div>
                          <div className="text-xs">Descanso</div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Clock className="h-4 w-4 mx-auto text-gray-300" />
                          <div className="text-xs">Sin turno</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notas del turno */}
                {schedule?.notes && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                    <strong>Nota:</strong> {schedule.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium text-gray-700">Leyenda:</span>
            <div className="flex items-center gap-3">
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
            {schedules.length} turnos asignados
          </div>
        </div>
      </div>
    </div>
  );
} 
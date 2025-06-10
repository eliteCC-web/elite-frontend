// components/profile/ScheduleCalendar.tsx
'use client';

import React from 'react';
import { ThreeWeeksSchedule, Schedule } from '@/services/profile.service';
import { Calendar, Clock, Coffee, AlertCircle } from 'lucide-react';

interface ScheduleCalendarProps {
  schedule: ThreeWeeksSchedule;
}

export default function ScheduleCalendar({ schedule }: ScheduleCalendarProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  };

  const ScheduleWeek = ({ title, schedules, weekType }: { title: string; schedules: Schedule[]; weekType: 'past' | 'current' | 'future' }) => {
    const getWeekColor = () => {
      switch (weekType) {
        case 'past':
          return 'border-gray-300 bg-gray-50';
        case 'current':
          return 'border-blue-300 bg-blue-50';
        case 'future':
          return 'border-green-300 bg-green-50';
        default:
          return 'border-gray-300 bg-gray-50';
      }
    };

    return (
      <div className={`border rounded-lg p-4 ${getWeekColor()}`}>
        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Calendar size={16} />
          {title}
        </h3>
        
        {schedules.length === 0 ? (
          <div className="text-center py-4">
            <Coffee size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Sin turnos asignados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {schedules.map((shift) => (
              <div 
                key={shift.id}
                className={`bg-white rounded-md p-3 border ${shift.isHoliday ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm text-gray-800">
                    {getDayOfWeek(shift.date)} {formatDate(shift.date)}
                  </span>
                  {shift.isHoliday && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      Feriado
                    </span>
                  )}
                </div>
                
                {!shift.isHoliday && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} />
                    <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                  </div>
                )}
                
                {shift.notes && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <AlertCircle size={12} />
                    <span>{shift.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScheduleWeek 
          title="Semana Pasada" 
          schedules={schedule.lastWeek} 
          weekType="past"
        />
        <ScheduleWeek 
          title="Semana Actual" 
          schedules={schedule.currentWeek} 
          weekType="current"
        />
        <ScheduleWeek 
          title="Próxima Semana" 
          schedules={schedule.nextWeek} 
          weekType="future"
        />
      </div>
      
      {/* Resumen de horas */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">Resumen de Horas</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {schedule.currentWeek.filter(s => !s.isHoliday).length}
            </p>
            <p className="text-sm text-gray-600">Días esta semana</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {schedule.currentWeek
                .filter(s => !s.isHoliday)
                .reduce((total, shift) => {
                  const start = new Date(`2000-01-01 ${shift.startTime}`);
                  const end = new Date(`2000-01-01 ${shift.endTime}`);
                  return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                }, 0)}h
            </p>
            <p className="text-sm text-gray-600">Horas esta semana</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {schedule.nextWeek.filter(s => !s.isHoliday).length}
            </p>
            <p className="text-sm text-gray-600">Días próxima semana</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">
              {schedule.currentWeek.filter(s => s.isHoliday).length}
            </p>
            <p className="text-sm text-gray-600">Feriados</p>
          </div>
        </div>
      </div>
    </div>
  );
}

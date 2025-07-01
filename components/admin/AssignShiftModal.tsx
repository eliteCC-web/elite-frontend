'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, FileText } from 'lucide-react';
import { ScheduleService, AssignShiftDto } from '../../services/schedule.service';
import { User } from '../../services/user.service';

interface AssignShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedDate?: string;
  selectedTime?: { start: string; end: string };
}

export default function AssignShiftModal({
  isOpen,
  onClose,
  onSuccess,
  selectedDate,
  selectedTime
}: AssignShiftModalProps) {
  const [colaboradores, setColaboradores] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [date, setDate] = useState(selectedDate || '');
  const [startTime, setStartTime] = useState(selectedTime?.start || '08:00');
  const [endTime, setEndTime] = useState(selectedTime?.end || '18:00');
  const [shiftType, setShiftType] = useState<'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FULL_DAY'>('FULL_DAY');
  const [position, setPosition] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingColaboradores, setLoadingColaboradores] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadColaboradores();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    if (selectedTime) {
      setStartTime(selectedTime.start);
      setEndTime(selectedTime.end);
    }
  }, [selectedDate, selectedTime]);

  const loadColaboradores = async () => {
    setLoadingColaboradores(true);
    try {
      const data = await ScheduleService.getColaboradores();
      setColaboradores(data);
    } catch (error) {
      console.error('Error loading colaboradores:', error);
    } finally {
      setLoadingColaboradores(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUsers.length === 0) {
      alert('Selecciona al menos un colaborador');
      return;
    }

    if (!date) {
      alert('Selecciona una fecha');
      return;
    }

    if (startTime >= endTime) {
      alert('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    setLoading(true);
    try {
      const assignData: AssignShiftDto = {
        userIds: selectedUsers,
        date,
        startTime,
        endTime,
        shiftType,
        position: position || undefined,
        notes: notes || undefined
      };

      await ScheduleService.assignShift(assignData);
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error assigning shift:', error);
      alert('Error al asignar el turno');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedUsers([]);
    setDate('');
    setStartTime('08:00');
    setEndTime('18:00');
    setShiftType('FULL_DAY');
    setPosition('');
    setNotes('');
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(colaboradores.map(user => user.id));
  };

  const deselectAllUsers = () => {
    setSelectedUsers([]);
  };

  const updateShiftType = (newShiftType: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FULL_DAY') => {
    setShiftType(newShiftType);
    
    // Actualizar horarios según el tipo de turno
    switch (newShiftType) {
      case 'MORNING':
        setStartTime('08:00');
        setEndTime('16:00');
        break;
      case 'AFTERNOON':
        setStartTime('16:00');
        setEndTime('00:00');
        break;
      case 'NIGHT':
        setStartTime('00:00');
        setEndTime('08:00');
        break;
      case 'FULL_DAY':
        setStartTime('08:00');
        setEndTime('18:00');
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Asignar Turno</h2>
              <p className="text-sm text-gray-600">Selecciona colaboradores y configura el horario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Colaboradores */}
          <div>
                                      <div className="flex items-center justify-between mb-3">
               <div className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                 <Users className="h-4 w-4" />
                 Colaboradores
               </div>
               <div className="flex gap-2">
                 <button
                   type="button"
                   onClick={selectAllUsers}
                   className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                 >
                   Seleccionar todos
                 </button>
                 <button
                   type="button"
                   onClick={deselectAllUsers}
                   className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                 >
                   Deseleccionar
                 </button>
               </div>
             </div>
            
            {loadingColaboradores ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Cargando colaboradores...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {colaboradores.map((user) => (
                  <label
                    key={user.id}
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                      selectedUsers.includes(user.id)
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {user.firstName} {user.lastName}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          {/* Tipo de Turno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Turno
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'MORNING', label: 'Mañana', time: '08:00 - 16:00' },
                { value: 'AFTERNOON', label: 'Tarde', time: '16:00 - 00:00' },
                { value: 'NIGHT', label: 'Noche', time: '00:00 - 08:00' },
                { value: 'FULL_DAY', label: 'Día completo', time: '08:00 - 18:00' }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateShiftType(type.value as 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FULL_DAY')}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    shiftType === type.value
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Horarios personalizados */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de inicio
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de fin
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* Posición */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posición (opcional)
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Ej: Cajero, Vendedor, Supervisor..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Información adicional sobre el turno..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || selectedUsers.length === 0}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Asignando...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4" />
                  Asignar Turno
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
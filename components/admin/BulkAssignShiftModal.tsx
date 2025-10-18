'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, Users, Calendar, Save, Loader2, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { ScheduleService, BulkEquitativeAssignDto } from '../../services/schedule.service';
import { User as UserType } from '../../services/user.service';

interface BulkAssignShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkAssignShiftModal({ isOpen, onClose, onSuccess }: BulkAssignShiftModalProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [shiftType, setShiftType] = useState<'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FULL_DAY'>('FULL_DAY');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      // Set default dates
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
      
      // Set default end date to 7 days from now
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setEndDate(nextWeek.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const usersData = await ScheduleService.getColaboradores();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(u => u.id));
    }
    setSelectAll(!selectAll);
  };

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
    return diffDays;
  };

  const calculateShiftsPerUser = () => {
    const totalDays = calculateTotalDays();
    const totalUsers = selectedUserIds.length;
    if (totalUsers === 0) return { perUser: 0, remainder: 0 };
    
    const perUser = Math.floor(totalDays / totalUsers);
    const remainder = totalDays % totalUsers;
    return { perUser, remainder };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUserIds.length === 0) {
      alert('Por favor selecciona al menos un colaborador');
      return;
    }

    if (!startDate || !endDate) {
      alert('Por favor selecciona las fechas de inicio y fin');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    setLoading(true);
    try {
      const assignData: BulkEquitativeAssignDto = {
        userIds: selectedUserIds,
        startDate,
        endDate,
        startTime,
        endTime,
        shiftType,
        notes: notes || undefined
      };

      console.log('Sending bulk equitative assign data:', assignData);
      await ScheduleService.bulkEquitativeAssign(assignData);
      
      alert(`¡Turnos asignados exitosamente! Se crearon ${calculateTotalDays()} turnos distribuidos equitativamente entre ${selectedUserIds.length} colaboradores.`);
      onSuccess();
      resetForm();
    } catch (error) {
      console.error('Error creating bulk schedules:', error);
      alert('Error al crear los turnos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedUserIds([]);
    setSelectAll(false);
    setStartDate('');
    setEndDate('');
    setStartTime('09:00');
    setEndTime('17:00');
    setShiftType('FULL_DAY');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const { perUser, remainder } = calculateShiftsPerUser();
  const totalDays = calculateTotalDays();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Asignación Masiva de Turnos</h2>
              <p className="text-sm text-gray-600">Distribuye turnos equitativamente entre varios colaboradores</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Cómo funciona?</p>
                <p>Esta herramienta distribuye los turnos de manera equitativa y aleatoria entre los colaboradores seleccionados. Cada colaborador recibirá aproximadamente la misma cantidad de turnos, pero en días aleatorios dentro del rango especificado.</p>
              </div>
            </div>
          </div>

          {/* Rango de Fechas */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-red-600" />
              Rango de Fechas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Horario */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-red-600" />
              Horario del Turno
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de turno
                </label>
                <select
                  value={shiftType}
                  onChange={(e) => setShiftType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="MORNING">🌅 Mañana</option>
                  <option value="AFTERNOON">🌆 Tarde</option>
                  <option value="NIGHT">🌙 Noche</option>
                  <option value="FULL_DAY">☀️ Día completo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Selección de Colaboradores */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-red-600" />
                Seleccionar Colaboradores ({selectedUserIds.length} seleccionados)
              </h3>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center"
              >
                {selectAll ? (
                  <>
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Deseleccionar todos
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4 mr-1" />
                    Seleccionar todos
                  </>
                )}
              </button>
            </div>

            {usersLoading ? (
              <div className="flex items-center space-x-2 text-sm text-gray-500 justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Cargando colaboradores...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUserSelection(user.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                      selectedUserIds.includes(user.id)
                        ? 'bg-red-50 border-red-500 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {selectedUserIds.includes(user.id) ? (
                        <CheckSquare className="h-5 w-5 text-red-600" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-grow text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Agrega notas o instrucciones para estos turnos..."
            />
          </div>

          {/* Resumen */}
          {selectedUserIds.length > 0 && totalDays > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">📊 Resumen de Asignación</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-600 font-medium">Total de días</p>
                  <p className="text-2xl font-bold text-green-700">{totalDays}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-600 font-medium">Colaboradores</p>
                  <p className="text-2xl font-bold text-green-700">{selectedUserIds.length}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-gray-600 font-medium">Turnos por persona</p>
                  <p className="text-2xl font-bold text-green-700">
                    {perUser}{remainder > 0 && ` - ${perUser + 1}`}
                  </p>
                </div>
              </div>
              {remainder > 0 && (
                <p className="text-xs text-green-700 mt-3">
                  ℹ️ {remainder} colaborador{remainder > 1 ? 'es' : ''} recibirá{remainder === 1 ? '' : 'n'} un turno adicional para cubrir todos los días.
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || selectedUserIds.length === 0}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Asignando turnos...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Asignar {totalDays} Turnos
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


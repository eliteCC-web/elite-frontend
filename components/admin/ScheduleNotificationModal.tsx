import React, { useState } from 'react';
import { Bell, Mail, Clock, Send, AlertCircle } from 'lucide-react';
import { ScheduleService, Schedule } from '../../services/schedule.service';

interface ScheduleNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: Schedule[];
  onSuccess: () => void;
}

export default function ScheduleNotificationModal({ 
  isOpen, 
  onClose, 
  schedules, 
  onSuccess 
}: ScheduleNotificationModalProps) {
  const [selectedSchedules, setSelectedSchedules] = useState<number[]>([]);
  const [notificationType, setNotificationType] = useState<'notification' | 'reminder'>('notification');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendNotifications = async () => {
    if (selectedSchedules.length === 0) {
      setMessage('Selecciona al menos un turno para enviar notificaciones');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (notificationType === 'notification') {
        await ScheduleService.sendBulkNotifications(selectedSchedules);
        setMessage('Notificaciones enviadas exitosamente');
      } else {
        // Enviar recordatorios uno por uno
        for (const scheduleId of selectedSchedules) {
          await ScheduleService.sendScheduleReminder(scheduleId);
        }
        setMessage('Recordatorios enviados exitosamente');
      }

      onSuccess();
      setTimeout(() => {
        onClose();
        setSelectedSchedules([]);
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error sending notifications:', error);
      setMessage('Error al enviar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const toggleScheduleSelection = (scheduleId: number) => {
    setSelectedSchedules(prev => 
      prev.includes(scheduleId) 
        ? prev.filter(id => id !== scheduleId)
        : [...prev, scheduleId]
    );
  };

  const selectAllSchedules = () => {
    setSelectedSchedules(schedules.map(s => s.id));
  };

  const clearSelection = () => {
    setSelectedSchedules([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-red-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Notificaciones de Turnos
              </h2>
              <p className="text-sm text-gray-600">
                Envía notificaciones por email a los colaboradores
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tipo de notificación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Notificación
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="notification"
                  checked={notificationType === 'notification'}
                  onChange={(e) => setNotificationType(e.target.value as 'notification' | 'reminder')}
                  className="text-red-600 focus:ring-red-500"
                />
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Nueva Asignación</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="reminder"
                  checked={notificationType === 'reminder'}
                  onChange={(e) => setNotificationType(e.target.value as 'notification' | 'reminder')}
                  className="text-red-600 focus:ring-red-500"
                />
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Recordatorio</span>
              </label>
            </div>
          </div>

          {/* Controles de selección */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={selectAllSchedules}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Seleccionar Todos
              </button>
              <button
                onClick={clearSelection}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Limpiar Selección
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {selectedSchedules.length} de {schedules.length} turnos seleccionados
            </div>
          </div>

          {/* Lista de turnos */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-1">✓</div>
                <div className="col-span-3">Colaborador</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-2">Horario</div>
                <div className="col-span-2">Tipo</div>
                <div className="col-span-2">Email</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="px-4 py-3 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedSchedules.includes(schedule.id)}
                        onChange={() => toggleScheduleSelection(schedule.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {schedule.user?.firstName?.charAt(0)}{schedule.user?.lastName?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {schedule.user?.firstName} {schedule.user?.lastName}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-sm text-gray-900">
                      {new Date(schedule.date).toLocaleDateString('es-ES')}
                    </div>
                    <div className="col-span-2 text-sm text-gray-900">
                      {schedule.startTime} - {schedule.endTime}
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ScheduleService.getShiftTypeColor(schedule.shiftType)}`}>
                        {schedule.shiftType}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-gray-600">
                      {schedule.user?.email || 'No disponible'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje de estado */}
          {message && (
            <div className={`p-3 rounded-md ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <div className="flex items-center space-x-2">
                {message.includes('Error') ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSendNotifications}
            disabled={loading || selectedSchedules.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Notificaciones
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 
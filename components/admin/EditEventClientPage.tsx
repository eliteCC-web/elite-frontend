/* eslint-disable */
// components/admin/EditEventClientPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EventForm from '@/components/admin/EventForm';
import EventService, { Event, UpdateEventDto } from '@/services/event.service';

export default function EditEventClientPage({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await EventService.getEventById(Number(eventId));
        setEvent(eventData);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(
          err.response?.data?.message ||
            'Error al cargar el evento. Por favor, inténtelo de nuevo más tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (data: UpdateEventDto) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await EventService.updateEvent(Number(eventId), data);
      router.push('/admin/events');
    } catch (err: any) {
      console.error('Error updating event:', err);
      setError(
        err.response?.data?.message ||
          'Error al actualizar el evento. Por favor, inténtelo de nuevo más tarde.'
      );
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/events');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Cargando información del evento...</p>
      </div>
    );
  }

  if (!event && !loading) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>No se encontró el evento solicitado.</p>
        <Link href="/admin/events" className="mt-4 inline-block text-red-600 hover:underline">
          Volver a la lista de eventos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/admin/events"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Editar Evento</h1>
        </div>
        <p className="text-gray-600">Modifica la información del evento</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {event && (
          <EventForm
            initialData={event}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
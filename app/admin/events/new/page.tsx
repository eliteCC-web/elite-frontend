// app/admin/events/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EventForm from '@/components/admin/EventForm';
import EventService from '@/services/event.service';
import { CreateEventDto } from '@/services/event.service';

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateEventDto) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await EventService.createEvent(data);
      router.push('/admin/events');
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(
        err.response?.data?.message || 
        'Error al crear el evento. Por favor, inténtelo de nuevo más tarde.'
      );
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/events');
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link 
            href="/admin/events" 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Nuevo Evento</h1>
        </div>
        <p className="text-gray-600">Crea un nuevo evento o actividad</p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <EventForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
// app/admin/users/new/page.tsx - CORREGIDO
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UserForm from '@/components/admin/UserForm';
import UserService from '@/services/user.service';

export default function NewUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => { // Cambiado a 'any'
    try {
      setIsSubmitting(true);
      setError(null);
      await UserService.createUser(data);
      router.push('/admin/users');
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(
        err.response?.data?.message || 
        'Error al crear el usuario. Por favor, inténtelo de nuevo más tarde.'
      );
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/users');
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link 
            href="/admin/users" 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Nuevo Usuario</h1>
        </div>
        <p className="text-gray-600">Crea un nuevo usuario del sistema</p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <UserForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
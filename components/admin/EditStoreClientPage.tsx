/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StoreForm from '@/components/admin/StoreForm';
import StoreService, { Store, UpdateStoreDto } from '@/services/store.service';

export default function EditStoreClientPage({ storeId }: { storeId: string }) {
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const storeData = await StoreService.getStoreById(Number(storeId));
        setStore(storeData);
      } catch (err: any) {
        console.error('Error fetching store:', err);
        setError(
          err.response?.data?.message ||
            'Error al cargar el local. Por favor, inténtelo de nuevo más tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  const handleSubmit = async (data: UpdateStoreDto) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await StoreService.updateStore(Number(storeId), data);
      router.push('/admin/stores');
    } catch (err: any) {
      console.error('Error updating store:', err);
      setError(
        err.response?.data?.message ||
          'Error al actualizar el local. Por favor, inténtelo de nuevo más tarde.'
      );
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/stores');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-600">Cargando información del local...</p>
      </div>
    );
  }

  if (!store && !loading) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>No se encontró el local solicitado.</p>
        <Link href="/admin/stores" className="mt-4 inline-block text-red-600 hover:underline">
          Volver a la lista de locales
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/admin/stores"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Editar Local</h1>
        </div>
        <p className="text-gray-600">Modifica la información del local comercial</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {store && (
          <StoreForm
            initialData={store}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

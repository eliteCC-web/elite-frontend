/* eslint-disable */
// app/mi-tienda/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Store as StoreIcon, Edit, Camera, MapPin, Phone, Tag, Building, DollarSign, Calendar, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import StoreOwnerService from '@/services/store-owner.service';
import { Store } from '@/services/store.service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Link from 'next/link';

export default function MyStorePage() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!hasRole('CLIENTE_INTERNO')) {
      router.push('/unauthorized');
      return;
    }

    fetchMyStore();
  }, [isAuthenticated, hasRole]);

  const fetchMyStore = async () => {
    try {
      const storeData = await StoreOwnerService.getMyStore();
      setStore(storeData);
    } catch (err: any) {
      console.error('Error fetching my store:', err);
      setError('Error al cargar la información de tu tienda');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Cargando tu tienda..." />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar tienda</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/perfil" className="text-blue-600 hover:underline">
              Volver al perfil
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!store) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-6">
          <div className="container mx-auto px-4 max-w-4xl">
            
            {/* Header */}
            <div className="mb-6">
              <Link href="/perfil" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-3">
                <ArrowLeft size={18} className="mr-1" />
                Volver al perfil
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Mi Tienda</h1>
            </div>

            {/* Sin tienda asignada */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="bg-gray-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <StoreIcon size={32} className="text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No tienes una tienda asignada
              </h2>
              <p className="text-gray-600 mb-4">
                Contacta al administrador para que te asigne un local comercial.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/contacto"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Contactar Administrador
                </Link>
                <Link 
                  href="/tiendas"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Ver Todas las Tiendas
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <Link href="/perfil" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-2">
                <ArrowLeft size={18} className="mr-1" />
                Volver al perfil
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Mi Tienda</h1>
              <p className="text-gray-600">Gestiona la información de tu local</p>
            </div>
            <div className="flex gap-2">
              <Link 
                href="/tiendas"
                className="btn-compact bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <StoreIcon size={16} />
                Ver Todas las Tiendas
              </Link>
              <button
                onClick={() => setEditMode(!editMode)}
                className={`btn-compact rounded-lg transition-colors flex items-center gap-2 ${
                  editMode 
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Edit size={16} />
                {editMode ? 'Cancelar' : 'Editar'}
              </button>
            </div>
          </div>

          {/* Información de la tienda */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Imagen y acciones */}
            <div className="lg:col-span-1">
              <div className="card-compact bg-white">
                <div className="relative">
                  {store.imageUrl ? (
                    <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                      <img 
                        src={store.imageUrl} 
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                      {editMode && (
                        <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                          <Camera size={16} className="text-gray-600" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Building size={32} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Sin imagen</p>
                        {editMode && (
                          <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm">
                            Subir imagen
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Estado del local 
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    store.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {store.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {store.isActive ? 'Local Activo' : 'Local Inactivo'}
                  </div>*/}
                </div>
                                {/* Acciones rápidas */}
                                <div className="mt-4 space-y-2">
                  {editMode && (
                    <label className="block">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const newImageUrl = await StoreOwnerService.uploadStoreImage(e.target.files[0]);
                              setStore((prev) => prev ? { ...prev, imageUrl: newImageUrl } : prev);
                            } catch (err) {
                              console.error(err);
                              alert('Error al subir la imagen');
                            }
                          }
                        }}
                        className="hidden"
                        id="store-image-upload"
                      />
                      <label htmlFor="store-image-upload" className="cursor-pointer inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                        <Camera size={14} />
                        Cambiar Imagen
                      </label>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Información editable */}
            <div className="lg:col-span-2">
              <div className="card-compact bg-white p-4 md:p-6">
                {editMode ? (
                  <StoreEditForm store={store} onSave={(updatedStore) => setStore(updatedStore)} onCancel={() => setEditMode(false)} />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Tag size={18} />
                        {store.name}
                      </h2>
                      {store.description && <p className="text-gray-600 mt-1">{store.description}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2 text-gray-700">
                        <Phone size={18} className="mt-1 text-gray-500" />
                        <div>
                          <p className="font-medium">Teléfono</p>
                          <p>{store.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-gray-700">
                        <Building size={18} className="mt-1 text-gray-500" />
                        <div>
                          <p className="font-medium">Número de Local</p>
                          <p>{store.storeNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-gray-700">
                        <Calendar size={18} className="mt-1 text-gray-500" />
                        <div>
                          <p className="font-medium">Creado</p>
                          <p>{store.createdAt ? new Date(store.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-gray-700">
                        <DollarSign size={18} className="mt-1 text-gray-500" />
                        <div>
                          <p className="font-medium">Ventas (futuro)</p>
                          <p>Próximamente</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface StoreEditFormProps {
  store: Store;
  onSave: (updatedStore: Store) => void;
  onCancel: () => void;
}

function StoreEditForm({ store, onSave, onCancel }: StoreEditFormProps) {
  const [form, setForm] = useState({
    name: store.name || '',
    phone: store.phone || '',
    description: store.description || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await StoreOwnerService.updateMyStore(form);
      onSave(updated);
      onCancel();
    } catch (err) {
      console.error(err);
      alert('Error al actualizar la tienda');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre de la tienda</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
